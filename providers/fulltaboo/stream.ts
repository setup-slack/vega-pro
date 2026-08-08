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
  const { data } = await axios.get(link, {
    signal,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  const $ = cheerio.load(data);
  const streams: Stream[] = [];

  $("iframe").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.includes("klcams.com")) {
      streams.push({
        server: "KLCams (FullTaboo)",
        link: src,
        type: "iframe",
        headers: {
          "Referer": "https://fulltaboo.tv/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
    } else if (src) {
      streams.push({
        server: "External Embed",
        link: src,
        type: "iframe",
        headers: {
          "Referer": "https://fulltaboo.tv/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
    }
  });

  return streams;
};
