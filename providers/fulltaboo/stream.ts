import { Stream, ProviderContext } from "../types";

function unpack(packed: string) {
  const argsMatch = packed.match(/return p\}\('(.*?)',(\d+),(\d+),'(.*?)'\.split\('\|'\)/s);
  if (!argsMatch) return null;
  
  let p = argsMatch[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  const a = parseInt(argsMatch[2]);
  let c = parseInt(argsMatch[3]);
  const k = argsMatch[4].split('|');
  
  while(c--) {
      if(k[c]) {
          const regex = new RegExp('\\b' + c.toString(a) + '\\b', 'g');
          p = p.replace(regex, k[c]);
      }
  }
  return p;
}

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

  const iframes = $("iframe").map((i, el) => $(el).attr("src")).get();
  for (const src of iframes) {
    if (src && (src.includes("luluvids.top") || src.includes("luluvid.com"))) {
      try {
        const res = await axios.get(src, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });
        const packed = res.data.match(/eval\(function\(p,a,c,k,e,d\).*?split\('\|'\)\)\)/s);
        if (packed) {
          const unpacked = unpack(packed[0]);
          if (unpacked) {
            const m3u8Match = unpacked.match(/(https?:\/\/[^"']+\.m3u8[^"']*)/i);
            if (m3u8Match) {
              streams.push({
                server: "Luluvid (FullTaboo)",
                link: m3u8Match[1],
                type: "m3u8",
                headers: { "User-Agent": "Mozilla/5.0" }
              });
            }
          }
        }
      } catch (e) {
      }
    }
    // We explicitly ignore klcams.com because it's just a live cam affiliate link without VODs, 
    // and VOE/hentaisword which use complex packers that aren't natively supported.
  }

  return streams;
};
