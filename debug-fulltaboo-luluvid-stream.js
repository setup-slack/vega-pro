const axios = require('axios');
const cheerio = require('cheerio');
const pc = { axios, cheerio };

async function run() {
    try {
        const { getStream } = require('./dist/fulltaboo/stream.js');
        const link = "https://fulltaboo.tv/yourfavoritemommy-mama-fiona-seducing-my-daughter-1/"; // luluvid
        const streams = await getStream({ link, type: "video", signal: null, providerContext: pc });
        console.log("FULLTABOO LULUVID STREAMS:", streams);
    } catch(e) {
        console.log("ERROR:", e);
    }
}
run();
