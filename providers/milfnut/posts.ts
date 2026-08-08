import { ProviderContext, Post } from "../types";

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
  let url = "https://milfnut.com/";

  if (filter && !filter.startsWith("?")) {
    url += filter;
    if (!url.endsWith("/")) url += "/";
  }

  if (page > 1) {
    if (url.includes("?")) {
      // Ignore pagination for random filter since it doesn't support it properly
      if (filter.includes("random")) {
        return [];
      }
      url += `&page=${page}`;
    } else {
      url += `page/${page}/`;
    }
  } else if (filter && filter.startsWith("?")) {
    url += filter;
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const posts: Post[] = [];

    $("article, .post, .video, .item").each((i, el) => {
      const isA = (el as any).name === "a";
      const a = isA ? $(el) : $(el).find("a").first();
      if (!a.length) return;
      
      const link = a.attr("href");
      if (!link || !link.startsWith("https://milfnut.com/")) return;
      if (link === "https://milfnut.com/") return;
      
      const title =
        a.attr("title") ||
        a.find(".entry-header span").text().trim() ||
        a.text().trim();
      let img = a.find("img").attr("data-lazy-src") || a.find("img").attr("src");
      if (!img) {
        img =
          $(el).find("img").attr("data-lazy-src") ||
          $(el).find("img").attr("src");
      }

      const relativeLink = link.replace("https://milfnut.com", "");

      if (
        relativeLink &&
        title &&
        !posts.find((p) => p.link === relativeLink)
      ) {
        posts.push({
          link: relativeLink,
          title,
          image: img || "",
          provider: "milfnut",
        });
      }
    });

    return posts;
  } catch (error) {
    return [];
  }
};
