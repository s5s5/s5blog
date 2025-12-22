import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const comments = sqliteTable(
  "comments",
  {
    // 1. ID 字段：自增主键
    id: integer("id").primaryKey({ autoIncrement: true }),

    // 2. 关联字段
    legacyId: integer("legacy_id"),
    postSlug: text("post_slug").notNull(),
    parentId: integer("parent_id"),
    legacyParentId: integer("legacy_parent_id"),

    // 3. 作者信息
    authorName: text("author_name").notNull(),
    authorEmail: text("author_email").notNull(),
    authorWebsite: text("author_website"),
    authorIp: text("author_ip"),
    userAgent: text("user_agent"),

    // 4. 内容与状态
    content: text("content").notNull(),
    // 设置默认值为 'pending'
    status: text("status").notNull().default("pending"),

    // 5. 时间字段
    // 注意：SQLite 存储时间为字符串，这里直接对应 TEXT
    // 如果你想让数据库自动生成时间，可以使用 .default(sql`(CURRENT_TIMESTAMP)`)
    createdAt: text("created_at").notNull()
  },
  (table) => {
    return {
      // 6. 索引定义
      // 对应: CREATE INDEX idx_comments_post ON comments (post_slug, status, created_at);
      idxCommentsPost: index("idx_comments_post").on(
        table.postSlug,
        table.status,
        table.createdAt
      ),

      // 对应: CREATE INDEX idx_comments_legacy ON comments (legacy_id);
      idxCommentsLegacy: index("idx_comments_legacy").on(table.legacyId)
    };
  }
);

// 7. 导出类型，方便在 Astro 组件中使用
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
