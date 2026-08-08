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
  
  let url = `https://watchporn.to/${filter}`;
  if (page > 1) {
    if (url.endsWith("/")) {
      url += `${page}/`;
    } else {
      url += `/${page}/`;
    }
  }

  const res = await axios.get(url, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  const posts: Post[] = [];

  $("a:has(img.thumb)").each((i, el) => {
    const title = $(el).attr("title") || $(el).find("img").attr("alt") || "";
    let link = $(el).attr("href") || "";
    if (link && link.startsWith("/")) {
      link = `https://watchporn.to${link}`;
    }
    const imgEl = $(el).find("img");
    const image = imgEl.attr("data-webp") || imgEl.attr("data-original") || imgEl.attr("src") || "";

    if (title && link && image && link.includes("/video/")) {
      posts.push({
        title: title.trim(),
        link,
        image,
        provider: "watchporn",
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
  let url = `https://watchporn.to/search/${encodedQuery}/`;
  if (page > 1) {
    url += `${page}/`;
  }

  const res = await axios.get(url, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  const posts: Post[] = [];

  $("a:has(img.thumb)").each((i, el) => {
    const title = $(el).attr("title") || $(el).find("img").attr("alt") || "";
    let link = $(el).attr("href") || "";
    if (link && link.startsWith("/")) {
      link = `https://watchporn.to${link}`;
    }
    const imgEl = $(el).find("img");
    const image = imgEl.attr("data-webp") || imgEl.attr("data-original") || imgEl.attr("src") || "";

    if (title && link && image && link.includes("/video/")) {
      posts.push({
        title: title.trim(),
        link,
        image,
        provider: "watchporn",
      });
    }
  });

  return posts;
};
