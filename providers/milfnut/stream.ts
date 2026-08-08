import { ProviderContext, Stream } from "../types";

export const getStream = async ({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> => {
  const streams: Stream[] = [];

  // if the link is a raw m3u8 or mp4
  if (link.endsWith(".m3u8") || link.endsWith(".mp4")) {
    streams.push({
      server: "milfnut",
      link,
      type: link.endsWith(".mp4") ? "mp4" : "hls",
      headers: {
        "Referer": "https://milfnut.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
    return streams;
  }

  // check if it's the iframe player with base64 encoded 'q='
  try {
    const url = new URL(link);
    const q = url.searchParams.get("q");
    if (q) {
      const decoded = decodeURIComponent(Buffer.from(q, "base64").toString("utf8"));
      
      // decoded will contain html like: ...<source src="https://..." type="..."/>...
      const match = decoded.match(/src="([^"]+\.(m3u8|mp4))"/i) || decoded.match(/src="([^"]+)"/i);
      
      if (match && match[1]) {
        streams.push({
          server: "milfnut",
          link: match[1],
          type: match[1].includes(".m3u8") ? "hls" : "mp4",
          headers: {
            "Referer": "https://milfnut.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        });
      }
    }
  } catch (error) {
    // ignore
  }

  return streams;
};
