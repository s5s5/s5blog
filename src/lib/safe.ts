import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

// 配置选项
marked.use({
  breaks: true, // 允许回车换行
  // 只保留最基础的行内格式化，禁用其余所有功能
  tokenizer: {
    // 块级禁用
    code: () => undefined,
    fences: () => undefined,
    heading: () => undefined,
    hr: () => undefined,
    blockquote: () => undefined,
    list: () => undefined,
    html: () => undefined,
    def: () => undefined,
    table: () => undefined,
    lheading: () => undefined,

    // 内联禁用
    escape: () => undefined,
    tag: () => undefined,
    link: () => undefined, // 同时禁用链接和图片
    reflink: () => undefined,
    codespan: () => undefined,
    autolink: () => undefined,
    url: () => undefined
  }
});

export async function markdownToSafeHtml(rawMarkdown: string) {
  // 转换 Markdown 为 HTML
  const rawHtml = await marked.parse(rawMarkdown);

  // 严格限制允许的 HTML 标签
  // 只允许基础的格式化标签，防止用户破坏页面布局或执行脚本
  return sanitizeHtml(rawHtml, {
    allowedTags: ["p", "br", "strong", "em"],
    allowedAttributes: {}, // 不允许任何属性
    disallowedTagsMode: "discard" // 移除不允许的标签但保留内容
  }).trim();
}
export function htmlToSafeText(text: string): string {
  // 移除所有标签，只保留纯文本
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {}
  }).trim();
}

// 简单的协议白名单检查
export const safeUrl = (url: string | null) => {
  if (!url) return null;
  // 只允许 http 或 https 开头
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return null; // 或者返回 '#'
};
