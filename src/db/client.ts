import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// 这是一个辅助函数，用于将 D1 绑定转换为 Drizzle 对象
export function createDbClient(d1: D1Database) {
  return drizzle(d1, { schema });
}
