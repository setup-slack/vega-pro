import { Post, ProviderContext } from "../types";
import { getBaseUrl } from "../getBaseUrl";

export const getPosts = async function ({
  filter,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const baseUrl = await getBaseUrl("asmrFree");
  const { axios, cheerio, commonHeaders } = providerContext;

  // e.g. https://asmrfree.com/latest/page/2/
  const url = page > 1 ? `${baseUrl}${filter}/page/${page}/` : `${baseUrl}${filter}/`;

  const { data } = await axios.get(url, { 
    signal, 
    headers: { ...commonHeaders, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } 
  });
  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $("article, .post, .elementor-post").each((i, el) => {
    const title = $(el).find("h2, h3, .entry-title").first().text().trim();
    let link = $(el).find("a").attr("href");
    let img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || "";

    // Skip empty items or ads
    if (title && link && link.startsWith("http")) {
      posts.push({
        title,
        link,
        image: img,
        provider: providerValue,
      });
    }
  });

  return posts;
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const baseUrl = await getBaseUrl("asmrFree");
  const { axios, cheerio, commonHeaders } = providerContext;

  // e.g. https://asmrfree.com/page/2/?s=moona
  const url = page > 1 
    ? `${baseUrl}/page/${page}/?s=${encodeURIComponent(searchQuery)}`
    : `${baseUrl}/?s=${encodeURIComponent(searchQuery)}`;

  const { data } = await axios.get(url, { 
    signal, 
    headers: { ...commonHeaders, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } 
  });
  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $("article, .post, .elementor-post").each((i, el) => {
    const title = $(el).find("h2, h3, .entry-title").first().text().trim();
    let link = $(el).find("a").attr("href");
    let img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || "";

    if (title && link && link.startsWith("http")) {
      posts.push({
        title,
        link,
        image: img,
        provider: providerValue,
      });
    }
  });

  return posts;
};
