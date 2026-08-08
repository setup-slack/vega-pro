import { Info, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  provider,
  providerContext,
}: {
  link: string;
  provider: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio } = providerContext;

  const res = await axios.get(link, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  const $ = cheerio.load(res.data);

  const title = $("meta[property='og:title']").attr("content") || $("h1").text().trim() || "Unknown Title";
  const image = $("meta[property='og:image']").attr("content") || "";
  const synopsis = $("meta[property='og:description']").attr("content") || "";

  // Extract tags and cast from script block or DOM
  const scriptContent = $("script").filter((i, el) => {
    return $(el).html()?.includes("video_url:") || false;
  }).html() || "";

  let tags: string[] = [];
  let cast: string[] = [];

  const tagsMatch = scriptContent.match(/video_tags:\s*'([^']+)'/);
  if (tagsMatch && tagsMatch[1]) {
    tags = tagsMatch[1].split(",").map((t: string) => t.trim());
  }

  const castMatch = scriptContent.match(/video_models:\s*'([^']+)'/);
  if (castMatch && castMatch[1]) {
    cast = castMatch[1].split(",").map((c: string) => c.trim());
  }

  return {
    title,
    image,
    synopsis,
    imdbId: "",
    type: "movie", // WatchPorn mostly has standalone videos
    tags,
    cast,
    linkList: [
      {
        title: "Watch",
        directLinks: [
          {
            title: "Video",
            link,
            type: "movie",
          },
        ],
      },
    ],
  };
};
