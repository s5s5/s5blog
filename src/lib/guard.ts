import { auth } from "./auth";

const ALLOWED_EMAIL = "s5s5cn@gmail.com";

export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session || session.user.email !== ALLOWED_EMAIL) {
    return null; // 验证失败
  }

  return session.user; // 验证成功，返回用户
}
