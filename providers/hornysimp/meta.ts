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

  const title = $("h1").first().text().trim() || $("title").text().trim();
  const image = $('meta[property="og:image"]').attr("content") || "";
  const synopsis =
    $(".entry-content p").text().trim() ||
    $('meta[name="description"]').attr("content") ||
    "";

  const directLinks: { title: string; link: string; type: "movie" }[] = [];

  $(".change-video").each((i, el) => {
    const embedUrl = $(el).attr("data-embed");
    const serverName = $(el).text().trim() || `Player ${i + 1}`;
    if (embedUrl) {
      directLinks.push({
        title: serverName,
        link: embedUrl,
        type: "movie",
      });
    }
  });

  return {
    title,
    image,
    synopsis,
    imdbId: "",
    type: "movie",
    linkList: [
      {
        title: "Video",
        directLinks,
      },
    ],
  };
};
