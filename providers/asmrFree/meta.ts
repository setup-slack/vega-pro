import { Info, ProviderContext, Link } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;

  const { data } = await axios.get(link, { 
    headers: { ...commonHeaders, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Referer": "https://asmrfree.com/" } 
  });
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();
  const image = $('meta[property="og:image"]').attr("content") || "";
  const synopsis = $('meta[name="description"]').attr("content") || "";
  
  const directLinks: Link["directLinks"] = [];

  $("iframe").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.startsWith("http")) {
      directLinks.push({
        title: `Server ${i + 1}`,
        link: src,
        type: "movie",
      });
    }
  });

  return {
    title,
    synopsis,
    image,
    imdbId: "", // Not applicable
    type: "movie",
    linkList: [
      {
        title: "Video Streams",
        directLinks,
      },
    ],
  };
};
