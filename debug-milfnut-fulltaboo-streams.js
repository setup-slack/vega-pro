const axios = require('axios');
const cheerio = require('cheerio');

// Load providerContext
const pc = {
    axios,
    cheerio
};

async function testFulltaboo() {
    try {
        const { getStream } = require('./dist/fulltaboo/stream.js');
        const link = "https://fulltaboo.tv/yourfavoritemommy-mama-fiona-seducing-my-daughter-1/"; // luluvid
        const streams = await getStream({ link, type: "video", signal: null, providerContext: pc });
        console.log("FULLTABOO LULUVID STREAMS:", streams);
    } catch(e) {
        console.log("FULLTABOO ERROR:", e);
    }
}

async function run() {
    await testFulltaboo();
}
run();
