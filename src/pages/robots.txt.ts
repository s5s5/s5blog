import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Disallow: .jpg$
Disallow: .jpeg$
Disallow: .gif$
Disallow: .svg$
Disallow: .png$
Disallow: .bmp$
Disallow: .mp3$
Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
