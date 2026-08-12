const axios = require('axios');
const cheerio = require('cheerio');
const pc = { axios, cheerio };

async function run() {
    try {
        const { getPosts } = require('./dist/fulltaboo/posts.js');
        const { getMeta } = require('./dist/fulltaboo/meta.js');
        const { getStream } = require('./dist/fulltaboo/stream.js');
        
        console.log("1. GETTING POSTS...");
        const posts = await getPosts({ filter: "", page: 1, providerValue: "fulltaboo", signal: null, providerContext: pc });
        console.log("FOUND POSTS:", posts.length);
        
        const testPost = posts[0];
        console.log("TEST POST:", testPost.link);
        
        console.log("2. GETTING META...");
        const meta = await getMeta({ link: testPost.link, providerContext: pc });
        console.log("META LINK:", meta.linkList[0].directLinks[0].link);
        
        console.log("3. GETTING STREAM...");
        const streams = await getStream({ link: meta.linkList[0].directLinks[0].link, type: "video", signal: null, providerContext: pc });
        console.log("STREAMS:", streams);
        
    } catch(e) {
        console.log("ERROR:", e);
    }
}
run();
