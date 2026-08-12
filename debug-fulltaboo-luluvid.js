const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    const link = "https://fulltaboo.tv/yourfavoritemommy-mama-fiona-seducing-my-daughter-1/";
    const { data } = await axios.get(link, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });
    const $ = cheerio.load(data);
    const iframes = $("iframe").map((i, el) => $(el).attr("src")).get();
    console.log("IFRAMES:", iframes);
}
run();
