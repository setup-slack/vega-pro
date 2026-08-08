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
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
  });

  const $ = cheerio.load(res.data);

  const title = $('title').text().replace('- Taboo Tube XXX', '').trim() || $('h1').text().trim();
  const image = $('.player-holder img, .video-player img, video').attr('poster') || $('meta[property="og:image"]').attr('content') || "";
  const synopsis = $('.description, .video-description').text().trim() || "No synopsis available.";
  
  const tags: string[] = [];
  $('.tags a, .categories a, .video-info a[href*="categories/"]').each((i, el) => {
    tags.push($(el).text().trim());
  });

  return {
    title,
    synopsis,
    image,
    imdbId: link,
    type: "movie",
    tags,
    linkList: [
      {
        title: "Video",
        directLinks: [
          {
            title: title,
            link: link,
            type: "movie"
          }
        ]
      }
    ]
  };
};
