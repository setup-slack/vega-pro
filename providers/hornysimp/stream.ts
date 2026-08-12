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
  const { axios } = providerContext;
  const streams: Stream[] = [];
  
  try {
    const res = await axios.get(link, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      signal,
    });
    
    const packed = res.data.match(/eval\(function\(p,a,c,k,e,d\).*?split\('\|'\)\)\)/s);
    if (packed) {
      const unpacked = unpack(packed[0]);
      if (unpacked) {
        const m3u8Match = unpacked.match(/(https?:\/\/[^"']+\.m3u8[^"']*)/i);
        if (m3u8Match) {
          streams.push({
            server: "Hornysimp",
            link: m3u8Match[1],
            type: "m3u8",
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
          });
          return streams;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // fallback
  streams.push({
    server: "Hornysimp",
    link: link,
    type: "iframe",
    headers: {
      "Referer": "https://w11.hornysimp.com.lv/",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  return streams;
};
