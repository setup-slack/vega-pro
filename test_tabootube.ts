import { getPosts, getSearchPosts } from "./providers/tabootube/posts";
import { getMeta } from "./providers/tabootube/meta";
import { getStream } from "./providers/tabootube/stream";
import axios from "axios";
import * as cheerio from "cheerio";

const providerContext = {
  axios,
  cheerio,
  commonHeaders: {},
  openWebView: async () => ({} as any),
  Aes: {}
};

async function testAll() {
  console.log("Testing getPosts...");
  const posts = await getPosts({
    filter: "",
    page: 1,
    providerValue: "tabootube",
    signal: new AbortController().signal,
    providerContext
  });
  console.log("Posts length:", posts.length);
  if (posts.length > 0) {
    console.log("First post:", posts[0]);
    
    console.log("\nTesting getMeta for", posts[0].link);
    const meta = await getMeta({
      link: posts[0].link,
      provider: "tabootube",
      providerContext
    });
    console.log("Meta:", meta);
    
    console.log("\nTesting getStream for", posts[0].link);
    const streams = await getStream({
      link: posts[0].link,
      type: "movie",
      signal: new AbortController().signal,
      providerContext
    });
    console.log("Streams:", streams);
  }
}

testAll();
