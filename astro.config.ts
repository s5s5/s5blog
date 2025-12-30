import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import type { Root } from "mdast";
import remarkBreaks from "remark-breaks";
import { visit } from "unist-util-visit";
import { defineConfig } from "astro/config";
import { CDN_URL } from "./src/consts.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://s5blog.s5.workers.dev",
  // site: "http://localhost:4321",
  trailingSlash: "never",
  markdown: {
    remarkPlugins: [remarkBreaks, remarkCdnAssets],
    shikiConfig: {
      // theme: "gruvbox-dark-soft"
      theme: "catppuccin-frappe"
    }
  },
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});

function remarkCdnAssets() {
  return (tree: Root) => {
    // 处理 Markdown 图片节点
    visit(tree, "image", (node) => {
      if (node.url && node.url.startsWith("/assets/")) {
        node.url = CDN_URL + node.url;
      }
    });

    // 处理 Markdown 链接节点
    visit(tree, "link", (node) => {
      if (node.url && node.url.startsWith("/assets/")) {
        node.url = CDN_URL + node.url;
      }
    });
  };
}
