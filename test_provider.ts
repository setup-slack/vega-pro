import { getPosts } from './providers/milfnut/posts';
import { getMeta } from './providers/milfnut/meta';
import { getStream } from './providers/milfnut/stream';
import axios from 'axios';
import * as cheerio from 'cheerio';

const providerContext = {
  axios,
  cheerio,
  commonHeaders: {},
  openWebView: async () => ({} as any),
  Aes: null
};

async function test() {
  console.log('--- Testing getPosts ---');
  const posts = await getPosts('', 1, providerContext);
  console.log('Posts found:', posts.length);
  if (posts.length === 0) {
    console.log('No posts found!');
    return;
  }
  console.log('First post:', posts[0]);

  console.log('\n--- Testing getMeta ---');
  const meta = await getMeta(posts[0].link, 'milfnut', providerContext);
  console.log('Meta title:', meta.title);
  console.log('Direct Links:', meta.linkList[0]?.directLinks);

  if (meta.linkList[0] && meta.linkList[0].directLinks && meta.linkList[0].directLinks.length > 0) {
    console.log('\n--- Testing getStream ---');
    const stream = await getStream(meta.linkList[0].directLinks[0].link, 'movie', new AbortController().signal, providerContext);
    console.log('Stream:', stream);
  }
}

test().catch(console.error);
