import { AUTHOR_EMAIL } from "../consts.ts";
import { auth } from "./auth";

export async function requireAdmin(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers
  });

  if (!session || session.user.email !== AUTHOR_EMAIL) {
    return null; // 验证失败
  }

  return session.user; // 验证成功，返回用户
}
