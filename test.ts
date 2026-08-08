import axios from 'axios';
import * as cheerio from 'cheerio';
import { getPosts, getSearchPosts } from './providers/pornmz/posts';
import { getMeta } from './providers/pornmz/meta';
import { getStream } from './providers/pornmz/stream';

const providerContext = {
    axios,
    cheerio,
    commonHeaders: {},
    openWebView: async () => ({ data: '', cookies: '', cookieMap: {}, userAgent: '', url: '' })
};

async function run() {
    console.log("Testing getPosts...");
    const posts = await getPosts('', 1, 'pornmz', new AbortController().signal, providerContext as any);
    console.log("Posts:", posts.length);
    if (posts.length > 0) {
        console.log("First post:", posts[0]);

        console.log("Testing getMeta for first post...");
        const meta = await getMeta(posts[0].link, 'pornmz', providerContext as any);
        console.log("Meta:", meta);

        console.log("Testing getStream for first post...");
        const streams = await getStream(posts[0].link, 'movie', new AbortController().signal, providerContext as any);
        console.log("Streams:", streams);
    }
}

run().catch(console.error);
