const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        const catalog = await axios.get("https://fulltaboo.tv/");
        const $ = cheerio.load(catalog.data);
        const links = $("article.thumb-block > a").map((i, el) => $(el).attr("href")).get().slice(0, 5);
        
        for (const link of links) {
            console.log("\nFetching:", link);
            const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" } });
            const $page = cheerio.load(res.data);
            const iframes = $page("iframe").map((i, el) => $page(el).attr("src")).get();
            console.log("Iframes:", iframes);
        }
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
