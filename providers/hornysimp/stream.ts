import { Stream, ProviderContext } from "../types";

export const getStream = async function ({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios, cheerio } = providerContext;
  const streams: Stream[] = [];

  try {
    const { data } = await axios.get(link, {
      signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const $ = cheerio.load(data);
    
    $(".change-video").each((i, el) => {
      const src = $(el).attr("data-embed");
      const text = $(el).text().trim() || `Player ${i + 1}`;
      
      if (src && src.startsWith("http")) {
        streams.push({
          server: text,
          link: src,
          type: "iframe",
          headers: {
            "Referer": "https://w11.hornysimp.com.lv/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });
      }
    });
  } catch (err) {
    console.error("Error extracting stream for hornysimp:", err);
  }

  return streams;
};
