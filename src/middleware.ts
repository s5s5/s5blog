import { defineMiddleware } from "astro:middleware";

import { createDbClient } from "./db/client";

export const onRequest = defineMiddleware((context, next) => {
  // 1. 获取 Cloudflare 环境 (env)
  // Astro 会把 Cloudflare 的 env 放在 context.locals.runtime.env 中
  const runtime = context.locals.runtime;

  if (runtime?.env?.DB2) {
    // 2. 初始化 Drizzle 并挂载到 locals
    context.locals.db = createDbClient(runtime.env.DB2);
  } else if (import.meta.env.DEV) {
    // (可选) 本地开发时的处理，如果不使用 wrangler dev 代理
    // console.warn('未找到 D1 绑定，请使用 wrangler dev 启动');
  }

  return next();
});
