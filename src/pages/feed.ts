import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";
import { getExcerpt } from "../utils/getExcerpt.ts";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    trailingSlash: false,
    items: posts.slice(0, 20).map((post) => ({
      ...post.data,
      description: getExcerpt(post.body ?? ""),
      link: `/${post.id}`
    }))
  });
}
