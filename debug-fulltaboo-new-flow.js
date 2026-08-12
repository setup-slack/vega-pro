const axios = require('axios');
const cheerio = require('cheerio');
const pc = { axios, cheerio };

async function run() {
    try {
        const { getMeta } = require('./dist/fulltaboo/meta.js');
        const { getStream } = require('./dist/fulltaboo/stream.js');
        
        // This one has a luluvid iframe!
        const testLink = "https://fulltaboo.tv/yourfavoritemommy-mama-fiona-seducing-my-daughter-1/";
        
        console.log("2. GETTING META...");
        const meta = await getMeta({ link: testLink, providerContext: pc });
        const directLinks = meta.linkList[0].directLinks;
        console.log("META LINKS:", directLinks.length);
        
        console.log("3. GETTING STREAMS...");
        for (const dl of directLinks) {
            console.log("Testing:", dl.link);
            const streams = await getStream({ link: dl.link, type: "video", signal: null, providerContext: pc });
            console.log("STREAMS RETURNED:", streams);
        }
        
    } catch(e) {
        console.log("ERROR:", e);
    }
}
run();
