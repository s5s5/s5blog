/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from './db/schema';

// 引入 Wrangler 生成的 Env 类型
type RuntimeEnv = import("./worker-configuration").Env;
type CloudflareRuntime = import("@astrojs/cloudflare").Runtime<RuntimeEnv>;

// 【关键修改】因为文件有 import，必须用 declare global 包裹
declare global {
  namespace App {
    interface Locals extends CloudflareRuntime {
      db: DrizzleD1Database<typeof schema>;
    }
  }
}