import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { comments } from "../db/schema";
import { getClientIp } from "../lib/ip.ts";

export const server = {
  comment: {
    submit: defineAction({
      // accept: "form", // 如果你是通过 HTML Form 提交，取消注释这行
      input: z.object({
        s5s5_08: z.string().min(1, "Post slug is required"),
        s5s5_b9: z.string().min(1, "Content cannot be empty"),
        s5s5_g5: z.string().min(1, "Name is required"),
        s5s5_a6: z.string().email("Invalid email address"),
        s5s5_0b: z.string().url().optional(),
        s5s5_yb: z.number().optional()
      }),
      handler: async (input, context) => {
        const { request, locals } = context;
        console.log("input", input);

        // 1. 获取数据库客户端
        // 最佳实践：确保在 Middleware 中初始化 db 并挂载到 locals
        let db = locals?.db;

        if (!db) {
          throw new Error("Database client not available");
        }

        // 2. 准备数据
        const createdAt = new Date().toISOString();

        // 获取 IP 和 User Agent
        const authorIp = getClientIp(context);
        console.log("当前用户 IP:", authorIp);
        const userAgent = request.headers.get("user-agent") || null;

        // 3. 执行插入
        try {
          // Drizzle 最佳实践：使用 .returning() 直接获取插入后的数据，
          // 这样就不需要写那一堆复杂的 fallback 逻辑去查 ID 了。
          const [insertedComment] = await db
            .insert(comments)
            .values({
              postSlug: input.s5s5_08,
              parentId: input.s5s5_yb ?? null,
              authorName: input.s5s5_g5,
              authorEmail: input.s5s5_a6,
              authorWebsite: input.s5s5_0b ?? null,
              authorIp,
              userAgent,
              content: input.s5s5_b9,
              status: "public",
              createdAt,
              // 确保你的 schema 定义里包含这些字段，并且如果有 legacy 字段设为 null
              legacyId: null,
              legacyParentId: null
            })
            .returning({
              id: comments.id,
              status: comments.status
            });

          // 4. 返回结果
          return {
            success: true,
            comment: insertedComment
          };
        } catch (error) {
          console.error("Comment submission error:", error);
          // Astro Action 允许抛出 ActionError，前端可以捕获
          throw new Error("Failed to save comment.");
        }
      }
    })
  }
};
