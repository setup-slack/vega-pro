import { Stream, ProviderContext } from "../types";

export const getStream = async ({
  link,
  type,
  signal,
  providerContext
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> => {
  const { axios, cheerio } = providerContext;
  
  const streams: Stream[] = [];

  try {
    const { data } = await axios.get(link, { signal });
    const $ = cheerio.load(data);
    let downloadLink = $("a:contains('Download')").attr("href");

    if (downloadLink && downloadLink.includes('dl.bunkr.')) {
      const fileIdMatch = downloadLink.match(/file\/(\d+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        
        // Get metadata
        const metaRes = await axios.post("https://dl.bunkr.cr/api/_001_v2", { id: fileId }, {
          headers: { 'Content-Type': 'application/json', 'Referer': downloadLink },
          signal
        });
        
        if (metaRes.data && metaRes.data.mediafiles && metaRes.data.path) {
          const rawUrl = new URL(metaRes.data.mediafiles + metaRes.data.path);
          const path = decodeURIComponent(rawUrl.pathname);
          
          // Get signed URL
          const signRes = await axios.get('https://glb-apisign.cdn.cr/sign?path=' + encodeURIComponent(path), { signal });
          if (signRes.data && signRes.data.token) {
            rawUrl.searchParams.set('token', signRes.data.token);
            rawUrl.searchParams.set('ex', signRes.data.ex);
            
            streams.push({
              server: "Bunkr",
              link: rawUrl.toString(),
              type: "mp4",
              quality: "1080",
            });
          }
        }
      }
    } else {
      // Fallback
      let videoLink = $("source").attr("src");
      if (videoLink) {
        streams.push({
          server: "Bunkr",
          link: videoLink,
          type: "mp4",
          quality: "1080",
        });
      }
    }
  } catch (error) {
    console.error("Balbums stream extraction error:", error);
  }

  return streams;
};
