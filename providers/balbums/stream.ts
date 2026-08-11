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
  
  // link is the Bunkr video page, e.g. https://bunkr.cr/f/...
  const { data } = await axios.get(link, { signal });
  const $ = cheerio.load(data);
  
  const streams: Stream[] = [];

  // Try to find the download link or video source
  let videoLink = $("a:contains('Download')").attr("href");

  if (!videoLink) {
    // try to find source tag
    videoLink = $("source").attr("src");
  }
  
  if (videoLink) {
    streams.push({
      server: "Bunkr",
      link: videoLink,
      type: "mp4",
      quality: "1080",
    });
  }

  return streams;
};
