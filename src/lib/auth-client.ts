import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  // baseURL: import.meta.env.PUBLIC_BETTER_AUTH_URL // 确保这个变量在客户端可访问
  // baseURL: process.env.PUBLIC_BETTER_AUTH_URL ?? "http://localhost:4321",
  // baseURL: "http://localhost:4321"
});
