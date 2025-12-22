# 📝 笔记：Astro + Cloudflare D1 + Drizzle 最佳实践与迁移指南

**核心目标**：在 Astro 项目中优雅地连接 Cloudflare D1 数据库，解决构建报错，并为未来迁移自建服务器做好准备。
**核心方案**：使用 **Astro Server Islands** (`server:defer`) 延迟加载数据；利用 **Drizzle ORM** 实现底层解耦。

---

## 1. 核心架构逻辑

1. **环境绑定**：通过 Cloudflare 的 `env` 获取 D1 实例。
2. **依赖注入**：利用 Astro **Middleware** 将初始化好的 Drizzle 对象注入到 `Astro.locals`。
3. **延迟渲染**：利用 **Server Islands**，让包含数据库查询的组件跳过构建阶段（Build Time），仅在用户请求时（Runtime）通过 Worker 异步加载。

---

## 2. 关键文件配置

### ⚠️ 重要前提：Binding 名称对应

**代码中的属性名必须与配置文件严格一致！**

* 如果在 `wrangler.toml` (或 `wrangler.json`) 中配置：
```toml
[[d1_databases]]
binding = "DB" # <--- 这里叫 DB
database_name = "..."

```


* 那么在代码 (`env.d.ts`, `middleware.ts`) 中就必须用 `env.DB`。
* 如果你改成了 `binding = "MY_APP_DB"`, 代码里就要相应改成 `env.MY_APP_DB`。

### 📂 1. 数据库定义 (`src/db/schema.ts`)

定义表结构，注意 SQLite 命名惯例与 TS 驼峰命名的映射。

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  // ... 其他字段
});

```

### 📂 2. 类型定义 (`src/env.d.ts`)

**关键点**：因为引入了 import，必须使用 `declare global` 才能让 Astro 识别到类型的扩展。

```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './db/schema';

type RuntimeEnv = import("./worker-configuration").Env;
type CloudflareRuntime = import("@astrojs/cloudflare").Runtime<RuntimeEnv>;

declare global {
  namespace App {
    interface Locals extends CloudflareRuntime {
      // 注入 db 属性，并带上 schema 泛型实现自动补全
      db: DrizzleD1Database<typeof schema>;
    }
  }
}

```

### 📂 3. 中间件注入 (`src/middleware.ts`)

**关键点**：统一初始化连接，注意检查 `binding` 名称。

```typescript
import { defineMiddleware } from 'astro:middleware';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';

export const onRequest = defineMiddleware((context, next) => {
  const runtime = context.locals.runtime;

  // ⚠️ 注意：这里的 .DB 必须对应 wrangler.toml 里的 binding = "DB"
  if (runtime?.env?.DB) {
    context.locals.db = drizzle(runtime.env.DB, { schema });
  }

  return next();
});

```

---

## 3. 组件实现 (Server Islands 模式)

### 🧩 步骤 A：编写“纯净”的数据组件

**文件**：`src/components/Comments.astro`
**不需要**写 try-catch，直接写查询逻辑。

```astro
---
import { comments } from '../db/schema';
const { db } = Astro.locals; // 从 locals 直接解构

// 这里会在用户访问时由 Cloudflare Worker 执行
const list = await db.query.comments.findMany();
---

<div class="comments-list">
  {list.map(c => <p>{c.content}</p>)}
</div>

```

### 🚀 步骤 B：在页面中引用

**文件**：`src/pages/index.astro`
使用 `server:defer` 指令。

```astro
---
import Comments from '../components/Comments.astro';
---

<Comments server:defer>
  <div slot="fallback">正在加载评论数据...</div>
</Comments>

```

---

## 4. 常用命令清单

* **生成类型**：`npm run wrangler types` (每次修改 binding 后必须运行)
* **本地开发**：`npm run dev`
* **部署**：`npm run deploy`

---

## 5. 未来迁移策略 (自建服务器)

如果未来决定从 Cloudflare 迁移到自建 VPS (Node.js + Docker)，由于使用了 Drizzle，迁移成本极低。

### ✅ 不需要改动的部分

* `src/db/schema.ts` (表结构定义完全通用)
* 所有组件内的 `db.select()...` 查询逻辑

### 🛠 需要调整的部分

1. **更换适配器**：`@astrojs/cloudflare` -> `@astrojs/node`
2. **更换驱动库**：`drizzle-orm/d1` -> `better-sqlite3`
3. **重写连接层**：不再从 `env` 获取，而是直接 import 本地数据库实例。

---

## 6. 避坑指南

1. **Binding 名称不一致**：
* **现象**：`runtime.env.DB` 为 undefined。
* **解决**：检查 `wrangler.toml` 中的 `binding = "XXX"` 是否与代码中的 `env.XXX` 一致。


2. **报错 `db undefined**`：
* **解决**：确保在 `server:defer` 组件之外使用 `db` 时，页面设置了 `export const prerender = false`。


3. **类型报错**：
* **解决**：每次修改 `wrangler.toml` 后，记得运行 `npm run wrangler types` 更新 `Env` 接口定义。