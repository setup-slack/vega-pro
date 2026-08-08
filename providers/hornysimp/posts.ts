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

  let url = `https://w11.hornysimp.com.lv/`;
  if (page > 1) {
    url += `page/${page}/`;
  }
  if (filter) {
    url += `?filter=${filter}`;
  }

  const res = await axios.get(url, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  const posts: Post[] = [];

  $("article.loop-video").each((i, el) => {
    const a = $(el).find("a");
    const img = $(el).find("img");
    const title = a.attr("title") || img.attr("alt") || "";
    const link = a.attr("href") || "";
    const image = img.attr("data-src") || img.attr("src") || "";

    if (title && link && image) {
      posts.push({
        title: title.trim(),
        link,
        image,
        provider: "hornysimp",
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

  const encodedQuery = encodeURIComponent(searchQuery).replace(/%20/g, "+");
  let url = `https://w11.hornysimp.com.lv/`;
  if (page > 1) {
    url += `page/${page}/`;
  }
  url += `?s=${encodedQuery}`;

  const res = await axios.get(url, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  const posts: Post[] = [];

  $("article.loop-video").each((i, el) => {
    const a = $(el).find("a");
    const img = $(el).find("img");
    const title = a.attr("title") || img.attr("alt") || "";
    const link = a.attr("href") || "";
    const image = img.attr("data-src") || img.attr("src") || "";

    if (title && link && image) {
      posts.push({
        title: title.trim(),
        link,
        image,
        provider: "hornysimp",
      });
    }
  });

  return posts;
};
