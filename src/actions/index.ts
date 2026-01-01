import { eq } from "drizzle-orm";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { comments } from "../db/schema";
import { requireAdmin } from "../lib/guard.ts";
import { getClientIp } from "../utils/ip.ts";

export const server = {
  comment: {
    submit: defineAction({
      input: z.object({
        s5s5_08: z.string().min(1, "Post slug is required"),
        s5s5_b9: z.string().min(1, "Content cannot be empty"),
        s5s5_g5: z.string().min(1, "Name is required"),
        s5s5_a6: z.string().email("Invalid email address"),
        s5s5_0b: z.string().url().optional(),
        s5s5_yb: z.number().optional(),
        name: z.string().optional() // 蜜罐
      }),
      handler: async (input, context) => {
        // 蜜罐检测 (保持原样，假装成功)
        if (input.name !== undefined) {
          return { success: true };
        }

        const { request, locals } = context;
        const db = locals?.db;

        if (!db) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database client not available"
          });
        }

        const createdAt = new Date().toISOString();
        const authorIp = getClientIp(context);
        const userAgent = request.headers.get("user-agent") || null;

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
              legacyId: null,
              legacyParentId: null
            })
            .returning({
              id: comments.id,
              status: comments.status
            });

          return {
            success: true,
            comment: insertedComment
          };
        } catch (error) {
          console.error("Comment submission error:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to save comment. Please try again later."
          });
        }
      }
    }),

    updateStatus: defineAction({
      input: z.object({
        commentId: z.number().int().positive(),
        status: z.enum(["pending", "public", "spam", "deleted"])
      }),
      handler: async (input, context) => {
        // 鉴权
        const user = await requireAdmin(context.request);
        if (!user) {
          throw new ActionError({
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action."
          });
        }

        const { locals } = context;
        const db = locals?.db;

        if (!db) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database client not available"
          });
        }

        try {
          const [updatedComment] = await db
            .update(comments)
            .set({ status: input.status })
            .where(eq(comments.id, input.commentId))
            .returning({
              id: comments.id,
              status: comments.status
            });

          // 如果 ID 不存在，returning 数组为空
          if (!updatedComment) {
            throw new ActionError({
              code: "NOT_FOUND",
              message: "Comment not found"
            });
          }

          return {
            success: true,
            comment: updatedComment
          };
        } catch (error) {
          // 如果已经是我们手动抛出的 ActionError (比如上面的 NOT_FOUND)，直接往上抛
          if (error instanceof ActionError) {
            throw error;
          }

          console.error("Comment update error:", error);
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update comment status."
          });
        }
      }
    })
  }
};
