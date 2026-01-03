/**
 * 分页工具函数和常量
 */
import { POSTS_PER_PAGE } from "../consts.ts";

/**
 * 生成分页器页码数组
 * @param page 当前页码
 * @param totalPages 总页数
 * @returns 页码数组，包含数字和 "..."
 */
export function generatePaginationPages(
  page: number,
  totalPages: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  const range = 2; // 当前页前后各2页
  const startPage = Math.max(1, page - range);
  const endPage = Math.min(totalPages, page + range);

  // 添加第1页
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  // 添加中间范围页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // 添加最后一页
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
}

/**
 * 计算总页数
 * @param totalPosts 总文章数
 * @returns 总页数
 */
export function calculateTotalPages(totalPosts: number): number {
  return Math.ceil(totalPosts / POSTS_PER_PAGE);
}

/**
 * 获取页面URL
 * @param page 页码
 * @param basePath 基础路径（可选，用于分类页面等）
 * @returns 页面URL
 */
export function getPageUrl(page: number, basePath: string): string {
  return `${basePath}/${page}`;
}
