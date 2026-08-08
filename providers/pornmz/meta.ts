import { Info, ProviderContext } from "../types";

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

  const { data } = await axios.get(link, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  const $ = cheerio.load(data);
  const title = $("h1").text().trim();
  const image = $('meta[property="og:image"]').attr("content") || "";
  
  const tags: string[] = [];
  $('.categories-list a, .tags-list a').each((i, el) => {
      const tag = $(el).text().trim();
      if (tag) tags.push(tag);
  });

  // Extract description if any
  const synopsis = $('meta[property="og:description"]').attr("content") || title;

  return {
    title,
    image,
    synopsis,
    imdbId: "",
    type: "movie",
    tags,
    linkList: [
      {
        title: "Video",
        directLinks: [
          {
            title: "Play",
            link: link, // We pass the main page link to stream.ts
            type: "movie",
          },
        ],
      },
    ],
  };
};
