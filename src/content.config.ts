import { TZDate } from "@date-fns/tz";
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { TIMEZONE } from "./consts.ts";
import { weatherNames } from "./utils/weather.ts";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // 强制将不带时区的字符串解析为 Asia/Shanghai 时间
    pubDate: z.string().transform((val) => new TZDate(val, TIMEZONE)),
    updatedDate: z
      .string()
      .optional()
      .transform((val) => (val ? new TZDate(val, TIMEZONE) : undefined)),
    category: z.string(),
    weather: z.enum(weatherNames),
    location: z.string(),
    heroImage: z.string().optional()
  })
});

export const collections = { blog };
