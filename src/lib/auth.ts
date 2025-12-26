// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // 不配置 database 字段
  // for Cloudflare Workers or other serverless environments
  secret: process.env.BETTER_AUTH_SECRET ?? import.meta.env.BETTER_AUTH_SECRET,

  socialProviders: {
    google: {
      // clientId: import.meta.env.GOOGLE_CLIENT_ID,
      // clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET
      clientId:
        process.env.GOOGLE_CLIENT_ID ?? import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ?? import.meta.env.GOOGLE_CLIENT_SECRET
    }
  },

  // 关键：配置无状态会话
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60 // Cookie 有效期（例如7天）
    }
  }
});
