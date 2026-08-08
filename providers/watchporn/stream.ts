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

  const res = await axios.get(link, {
    headers: providerContext.commonHeaders || {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  
  const scriptContent = $("script").filter((i, el) => {
    return $(el).html()?.includes("video_url:") || false;
  }).html() || "";

  const streams: Stream[] = [];

  const videoUrlMatch = scriptContent.match(/video_url:\s*'([^']+)'/);
  const videoUrlTextMatch = scriptContent.match(/video_url_text:\s*'([^']+)'/);
  
  if (videoUrlMatch && videoUrlMatch[1]) {
    let quality = videoUrlTextMatch && videoUrlTextMatch[1] ? videoUrlTextMatch[1] : "720p";
    // strip 'p' for valid quality enum
    quality = quality.replace("p", "");
    if (!["360", "480", "720", "1080", "2160"].includes(quality)) {
      quality = "720";
    }
    
    streams.push({
      server: "WatchPorn",
      link: videoUrlMatch[1],
      type: "mp4",
      quality: quality as any,
      headers: {
        "Referer": "https://watchporn.to/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
  }

  const videoAltUrlMatch = scriptContent.match(/video_alt_url:\s*'([^']+)'/);
  const videoAltUrlTextMatch = scriptContent.match(/video_alt_url_text:\s*'([^']+)'/);

  if (videoAltUrlMatch && videoAltUrlMatch[1]) {
    let quality = videoAltUrlTextMatch && videoAltUrlTextMatch[1] ? videoAltUrlTextMatch[1] : "1080p";
    quality = quality.replace("p", "");
    if (!["360", "480", "720", "1080", "2160"].includes(quality)) {
      quality = "1080";
    }

    streams.push({
      server: "WatchPorn HD",
      link: videoAltUrlMatch[1],
      type: "mp4",
      quality: quality as any,
      headers: {
        "Referer": "https://watchporn.to/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
  }

  return streams;
};
