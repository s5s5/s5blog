import rss from "@astrojs/rss";

import type { APIContext } from "astro";
import { getCollection } from "astro:content";

import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => Number(b.id) - Number(a.id)
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? "https://s5s5.me",
    items: posts.map((post) => ({
      ...post.data,
      link: `/${post.id}/`
    }))
  });
}
