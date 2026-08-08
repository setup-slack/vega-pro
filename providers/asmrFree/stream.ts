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
  const { axios, commonHeaders } = providerContext;
  const streams: Stream[] = [];

  try {
    const { data } = await axios.get(link, {
      signal,
      headers: {
        ...commonHeaders,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Referer": "https://asmrfree.com/",
      },
    });

    const m3u8Match = data.match(/(https?:\/\/[^\s"'<]+m3u8[^\s"'<]*)/);
    if (m3u8Match) {
      streams.push({
        server: "AutoEmbed (HLS)",
        link: m3u8Match[1],
        type: "m3u8",
      });
    }

    const mp4Match = data.match(/(https?:\/\/[^\s"'<]+\.mp4[^\s"'<]*)/);
    if (mp4Match) {
      streams.push({
        server: "AutoEmbed (MP4)",
        link: mp4Match[1],
        type: "mp4",
      });
    }

    // fallback: just return the iframe link if we didn't extract anything
    if (streams.length === 0) {
      streams.push({
        server: "Iframe",
        link: link,
        type: "iframe",
      });
    }

  } catch (err) {
    console.error("Error extracting stream:", err);
  }

  return streams;
};
