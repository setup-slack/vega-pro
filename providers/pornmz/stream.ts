import { Stream, ProviderContext } from "../types";

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
  const { axios, cheerio } = providerContext;

  const { data } = await axios.get(link, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    signal,
  });

  const $ = cheerio.load(data);
  const streams: Stream[] = [];

  const iframeSrc = $("iframe").attr("src");
  if (iframeSrc && iframeSrc.includes("player-x.php?q=")) {
    const urlObj = new URL(iframeSrc.startsWith('http') ? iframeSrc : `https:${iframeSrc.startsWith('//') ? '' : '//'}${iframeSrc}`);
    const q = urlObj.searchParams.get("q");
    if (q) {
      try {
        let decodedHtml = "";
        try {
            const utf8Str = decodeURIComponent(atob(q).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            decodedHtml = decodeURIComponent(utf8Str);
        } catch(e) {
            decodedHtml = decodeURIComponent(atob(q));
        }
        const match = decodedHtml.match(/src="([^"]+\.m3u8[^"]*)"/);
        if (match && match[1]) {
          streams.push({
            server: "pornmz",
            link: match[1],
            type: "m3u8",
            headers: {
              ...(match[1].includes('twimg.com') ? {} : { "Referer": "https://pornmz.com/" }),
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
          });
        } else {
            const mp4Match = decodedHtml.match(/src="([^"]+\.mp4[^"]*)"/);
            if (mp4Match && mp4Match[1]) {
                streams.push({
                    server: "pornmz",
                    link: mp4Match[1],
                    type: "mp4",
                    headers: {
                      ...(mp4Match[1].includes('twimg.com') ? {} : { "Referer": "https://pornmz.net/" }),
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    },
                });
            } else {
                streams.push({
                    server: "Pornmz (Fallback)",
                    link: iframeSrc,
                    type: "iframe",
                    headers: {
                      "Referer": "https://pornmz.com/",
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    },
                });
            }
        }
      } catch (e) {
        console.error("Failed to decode iframe q parameter", e);
      }
    }
  }

  if (streams.length === 0 && iframeSrc) {
      streams.push({
          server: "Pornmz (Fallback)",
          link: iframeSrc,
          type: "iframe",
          headers: {
            "Referer": "https://pornmz.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
      });
  }

  return streams;
};
