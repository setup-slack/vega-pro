import { Post, ProviderContext } from "../types";

export const getPosts = async ({
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
}): Promise<Post[]> => {
  const { axios, cheerio } = providerContext;
  
  // Base URL is https://pornmz.net/
  // Filters could be "", "/pmzvideo/c/brazzers", etc.
  // Paging usually looks like: https://pornmz.net/page/2 or https://pornmz.net/pmzvideo/c/brazzers/page/2
  let url = `https://pornmz.net${filter}`;
  if (page > 1) {
    if (url.endsWith('/')) {
      url += `page/${page}/`;
    } else {
      url += `/page/${page}/`;
    }
  } else if (!url.endsWith('/')) {
      url += '/';
  }

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $(".thumb-block").each((i, el) => {
    const a = $(el).find("a").first();
    const link = a.attr("href");
    const title = a.attr("title") || $(el).find(".title").text().trim();
    const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

    if (link && title && image) {
      posts.push({
        title,
        link,
        image,
        provider: "pornmz",
      });
    }
  });

  return posts;
};

export const getSearchPosts = async ({
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
}): Promise<Post[]> => {
  const { axios, cheerio } = providerContext;
  
  // Search URL: https://pornmz.net/page/2/?s=query
  let url = `https://pornmz.net/`;
  if (page > 1) {
    url += `page/${page}/`;
  }
  url += `?s=${encodeURIComponent(searchQuery)}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(data);
  const posts: Post[] = [];

  $(".thumb-block").each((i, el) => {
    const a = $(el).find("a").first();
    const link = a.attr("href");
    const title = a.attr("title") || $(el).find(".title").text().trim();
    const image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

    if (link && title && image) {
      posts.push({
        title,
        link,
        image,
        provider: "pornmz",
      });
    }
  });

  return posts;
};
