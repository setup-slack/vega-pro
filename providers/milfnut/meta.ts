import { ProviderContext, Info, Link } from "../types";

export const getMeta = async ({
  link,
  provider,
  providerContext,
}: {
  link: string;
  provider: string;
  providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios, cheerio } = providerContext;
  const url = `https://milfnut.com${link}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const $ = cheerio.load(data);

  const title = $("h1.entry-title").text().trim() || $("title").text().trim();
  const synopsis = $(".entry-content").text().trim() || title;
  const image =
    $('meta[property="og:image"]').attr("content") ||
    $(".post-thumbnail img").attr("src") ||
    "";

  const tags: string[] = [];
  $(".tag-links a").each((i, el) => {
    tags.push($(el).text().trim());
  });

  const cast: string[] = [];
  $(".models-list a, .actor-links a").each((i, el) => {
    cast.push($(el).text().trim());
  });

  const iframes: string[] = [];
  $("iframe").each((i, el) => {
    const src = $(el).attr("src") || $(el).attr("data-lazy-src");
    if (src) iframes.push(src);
  });
  $(".video-container iframe, .player iframe").each((i, el) => {
    const src = $(el).attr("src") || $(el).attr("data-lazy-src");
    if (src) iframes.push(src);
  });
  $("video source").each((i, el) => {
    const src = $(el).attr("src");
    if (src) iframes.push(src);
  });

  const uniqueIframes = [...new Set(iframes)];
  
  const directLinks: { title: string; link: string; type: "movie" }[] = [];
  
  uniqueIframes.forEach((src, idx) => {
    directLinks.push({
      title: `Stream ${idx + 1}`,
      link: src,
      type: "movie",
    });
  });

  return {
    title,
    synopsis,
    image,
    imdbId: "",
    type: "movie",
    tags,
    cast,
    linkList: [
      {
        title: "Video",
        directLinks,
      },
    ],
  };
};
