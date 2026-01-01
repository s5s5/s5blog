import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

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
  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ["p", "br", "strong", "em"],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim();
}
export function htmlToSafeText(text: string): string {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [], // 不允许任何标签
    ALLOWED_ATTR: [], // 不允许任何属性
    KEEP_CONTENT: true // 保留标签内的文字
  }).trim(); // 顺便去掉首尾空格
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
