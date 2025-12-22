import {column, defineDb, defineTable} from 'astro:db';


export const comments = defineTable({
  columns: {
    id: column.number({ primaryKey: true }), // 对应 INTEGER PRIMARY KEY AUTOINCREMENT
    legacy_id: column.number({ optional: true }), // 对应 legacy_id INTEGER
    post_slug: column.text(), // 对应 post_slug TEXT NOT NULL
    parent_id: column.number({ optional: true }), // 对应 parent_id INTEGER
    legacy_parent_id: column.number({ optional: true }), // 对应 legacy_parent_id INTEGER
    author_name: column.text(), // 对应 author_name TEXT NOT NULL
    author_email: column.text(), // 对应 author_email TEXT NOT NULL
    author_website: column.text({ optional: true }), // 对应 author_website TEXT
    author_ip: column.text({ optional: true }), // 对应 author_ip TEXT
    user_agent: column.text({ optional: true }), // 对应 user_agent TEXT
    content: column.text(), // 对应 content TEXT NOT NULL
    status: column.text({ default: 'pending' }), // 对应 status TEXT NOT NULL DEFAULT 'pending'
    created_at: column.text(), // 对应 created_at TEXT NOT NULL
  },
  indexes: [
    // 对应 idx_comments_post (post_slug, status, created_at)
    { on: ["post_slug", "status", "created_at"], name: "idx_comments_post" },
    // 对应 idx_comments_legacy (legacy_id)
    { on: ["legacy_id"], name: "idx_comments_legacy" },
  ]
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    comments,
  }
});
