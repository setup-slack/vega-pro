import { Info, ProviderContext } from "../types";

export const getMetaData = async ({
  link,
  provider,
  providerContext
}: {
  link: string;
  provider: string;
  providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios, cheerio } = providerContext;
  
  const { data } = await axios.get(link);
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();
  const image = $("meta[property='og:image']").attr("content") || "";
  const synopsis = $("meta[property='og:description']").attr("content") || "";

  const info: Info = {
    title,
    image,
    synopsis,
    imdbId: "",
    type: "series", // series so we can show episodes as individual videos
    linkList: [],
  };

  const directLinks: any[] = [];

  // Parse scripts to extract window.albumFiles if available, or parse HTML
  // First attempt: fallback to HTML parse
  $(".theItem").each((_, el) => {
    const originalName = $(el).find(".theName").text().trim() || $(el).attr("title") || "Video";
    const fileLink = $(el).find("a").attr("href");
    const thumb = $(el).find("img.grid-images_box-img").attr("src");

    if (fileLink && $(el).find(".type-Video").length > 0) {
      // It's a video
      // URL could be relative e.g., `/f/xyz`
      let fullLink = fileLink;
      if (fullLink.startsWith("/")) {
        const urlObj = new URL(link);
        fullLink = `${urlObj.origin}${fileLink}`;
      }
      directLinks.push({
        title: originalName,
        link: fullLink,
        type: "movie",
        image: thumb,
      });
    }
  });

  if (directLinks.length > 0) {
    info.linkList.push({
      title: "Videos",
      directLinks,
    });
  }

  return info;
};
