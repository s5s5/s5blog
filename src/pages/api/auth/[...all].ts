import type { APIRoute } from "astro";
import { auth } from "../../../lib/auth"; // 调整引入路径指向你的 auth.ts

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};
