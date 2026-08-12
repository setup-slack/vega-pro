const ProviderTester = require('./tests/test-providers.js');
const { providerContext } = require('./tests/provider-test-context.js');
const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        const p = 'fulltaboo';
        const postsModule = require(`./dist/${p}/posts.js`);
        const metaModule = require(`./dist/${p}/meta.js`);
        const catalogModule = require(`./dist/${p}/catalog.js`);
        
        const posts = await postsModule.getPosts({
            filter: catalogModule.catalog[0].filter,
            page: 1,
            providerValue: p,
            signal: new AbortController().signal,
            providerContext
        });
        
        if (!posts.length) { console.log("No posts"); return; }
        
        const meta = await metaModule.getMeta({ link: posts[0].link, provider: p, providerContext });
        const link = meta.linkList[0].directLinks[0].link;
        console.log("Fulltaboo link:", link);
        
        const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(res.data);
        const iframes = $("iframe").map((i, el) => $(el).attr("src")).get();
        console.log("iframes:", iframes);
        
        // Find if there's any source or video tags
        const vids = $("video, source").map((i, el) => $(el).attr("src")).get();
        console.log("Vids:", vids);
        
        const m3u8 = res.data.match(/(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/i);
        const mp4 = res.data.match(/(https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*)/i);
        console.log("m3u8 match:", m3u8 ? m3u8[1] : 'null');
        console.log("mp4 match:", mp4 ? mp4[1] : 'null');
        
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
