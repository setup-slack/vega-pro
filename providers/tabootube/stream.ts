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
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    },
    signal,
  });

  const $ = cheerio.load(res.data);
  const scripts = $('script').text();
  
  const match = scripts.match(/video_url:\s*'([^']+)'/);
  
  const streams: Stream[] = [];
  
  if (match && match[1]) {
    streams.push({
      server: "TabooTube",
      link: match[1],
      type: match[1].includes('.m3u8') ? 'm3u8' : 'mp4',
      headers: {
        "Referer": "https://www.tabootube.xxx/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });
  } else {
    // fallback to parsing flashvars if needed, or looking for mp4s
    const mp4Match = scripts.match(/(https?:\/\/[^"']+\.mp4[^"']*)/);
    if (mp4Match && mp4Match[1] && !mp4Match[1].includes('preview')) {
       streams.push({
         server: "TabooTube",
         link: mp4Match[1],
         type: 'mp4',
         headers: {
           "Referer": "https://www.tabootube.xxx/",
           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
         },
       });
    }
  }

  return streams;
};
