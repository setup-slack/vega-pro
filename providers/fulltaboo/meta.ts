import { Info, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio } = providerContext;
  const { data } = await axios.get(link, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  const $ = cheerio.load(data);
  const title = $("h1").first().text().trim() || $("title").text().trim();
  const image = $('meta[property="og:image"]').attr("content") || "";
  const synopsis = $(".entry-content p").text().trim() || $('meta[name="description"]').attr("content") || "";

  const directLinks: any[] = [];
  const iframes = $("iframe").map((i, el) => $(el).attr("src")).get();
  
  let streamCount = 1;
  for (let src of iframes) {
    if (src && src.startsWith("//")) src = "https:" + src;
    // Explicitly ignore klcams (live cam ads)
    if (src && src.includes("klcams.com")) {
        continue;
    }
    if (src) {
        directLinks.push({
            title: `Stream ${streamCount++}`,
            link: src,
            type: "movie",
        });
    }
  }

  // Fallback if no iframes found, just in case
  if (directLinks.length === 0) {
      directLinks.push({
          title: "Play",
          link: link,
          type: "movie",
      });
  }

  return {
    title,
    image,
    synopsis,
    imdbId: "",
    type: "movie",
    linkList: [
      {
        title: "Stream",
        directLinks,
      }
    ],
  };
};
