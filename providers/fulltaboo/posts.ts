import { Post, ProviderContext } from "../types";

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
  const { axios, cheerio } = providerContext;
  let url = "https://fulltaboo.tv";
  if (filter) {
    url += filter;
  }
  if (page > 1) {
    if (!url.endsWith("/")) url += "/";
    url += `page/${page}/`;
  } else if (!filter) {
    url += "/";
  }

  const { data } = await axios.get(url, {
    signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  
  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $("article, .post, .item, .video").each((i, el) => {
    const a = $(el).find("a").first();
    let link = a.attr("href") || "";
    let title = a.attr("title") || a.find(".entry-header span, h1, h2, h3, .title").first().text().trim();
    if (!title) {
        title = $(el).find(".entry-header span, h1, h2, h3, .title").first().text().trim();
    }
    
    let image = $(el).find("img").first().attr("src") || $(el).find("img").first().attr("data-src") || "";
    
    if (link && link.includes("fulltaboo.tv") && title) {
      posts.push({
        title,
        link,
        image,
        provider: "fulltaboo",
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
  const { axios, cheerio } = providerContext;
  let url = `https://fulltaboo.tv/`;
  if (page > 1) {
    url += `page/${page}/?s=${encodeURIComponent(searchQuery)}`;
  } else {
    url += `?s=${encodeURIComponent(searchQuery)}`;
  }

  const { data } = await axios.get(url, {
    signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  
  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $("article, .post, .item, .video").each((i, el) => {
    const a = $(el).find("a").first();
    let link = a.attr("href") || "";
    let title = a.attr("title") || a.find(".entry-header span, h1, h2, h3, .title").first().text().trim();
    if (!title) {
        title = $(el).find(".entry-header span, h1, h2, h3, .title").first().text().trim();
    }
    
    let image = $(el).find("img").first().attr("src") || $(el).find("img").first().attr("data-src") || "";
    
    if (link && link.includes("fulltaboo.tv") && title) {
      posts.push({
        title,
        link,
        image,
        provider: "fulltaboo",
      });
    }
  });

  return posts;
};
