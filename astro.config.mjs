// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
    site: "https://s5blog.s5.workers.dev",
    integrations: [mdx(), sitemap(), db()],
    adapter: cloudflare({
        platformProxy: {
            enabled: true,
        },
    }),
});