export type CommentStatus = "public" | "pending" | "spam" | "trash";

export type Comment = {
  id: number;
  parent_id: number | null;
  author_name: string;
  author_email: string;
  author_website: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
};
