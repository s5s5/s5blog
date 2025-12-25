import type { ActionAPIContext } from "astro:actions";

export function getClientIp(context: ActionAPIContext): string {
  const { request, clientAddress } = context;
  const headers = request.headers;

  // ---------------------------------------------------------
  // 1. Cloudflare (优先级最高)
  // ---------------------------------------------------------
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  // ---------------------------------------------------------
  // 2. 腾讯云 CDN -> Nginx (生产环境)
  // ---------------------------------------------------------
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  // ---------------------------------------------------------
  // 3. Nginx 直连 (备选)
  // ---------------------------------------------------------
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  // ---------------------------------------------------------
  // 4. 本地开发 (Localhost) & Astro 原生兜底
  // ---------------------------------------------------------
  // 在本地 `npm run dev` 时，上面的 Header 都没有。
  // context.clientAddress 会自动获取本地 IP (通常是 ::1 或 127.0.0.1)
  if (clientAddress) {
    return clientAddress;
  }

  // 5. 实在拿不到 (极罕见情况)
  return "127.0.0.1";
}
