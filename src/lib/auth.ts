// src/lib/auth.ts
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // 不配置 database 字段

  socialProviders: {
    google: {
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET
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
