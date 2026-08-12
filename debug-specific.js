const axios = require('axios');
const cheerio = require('cheerio');

async function checkLink(url, headers) {
    try {
        const res = await axios.head(url, { headers, timeout: 5000 });
        console.log(`  [HEAD] ${res.status} ${res.headers['content-type']}`);
    } catch (err) {
        console.log(`  [HEAD FAILED] ${err.message} ${err.response?.status}`);
    }
}

async function run() {
    console.log("--- PORNMZ ---");
    const twimg = "https://video.twimg.com/amplify_video/2087515654983180288/pl/59NCGuUI8AC7VAN2.m3u8?tag=29";
    console.log("Testing without referer:");
    await checkLink(twimg, { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" });
    console.log("Testing with twitter referer:");
    await checkLink(twimg, { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Referer": "https://twitter.com/" });

    console.log("\n--- BALBUMS ---");
    const bunkrLink = "https://bunkr.cr/f/Aa49uNH2r0XpQ";
    try {
        const res1 = await axios.get(bunkrLink);
        const $1 = cheerio.load(res1.data);
        const vid1 = $1("source").attr("src");
        const dl1 = $1("a:contains('Download')").attr("href");
        console.log("bunkr.cr source:", vid1);
        console.log("bunkr.cr download link:", dl1);
        
        if (dl1) {
            const res2 = await axios.get(dl1);
            const $2 = cheerio.load(res2.data);
            const vid2 = $2("a.text-white.bg-blue-600").attr("href"); // bunkr dl page usually has a big blue download button
            console.log("dl.bunkr.cr final link:", vid2);
        }
    } catch (e) {
        console.log("Balbums error:", e.message);
    }

    console.log("\n--- HORNYSIMP ---");
    const lulu = "https://luluvids.top/e/6owdmvr04wvz";
    try {
        const res3 = await axios.get(lulu);
        const $3 = cheerio.load(res3.data);
        const scriptMatch = res3.data.match(/sources:\s*(\[.*?\])/s) || res3.data.match(/file:\s*"([^"]+)"/);
        console.log("luluvids script match:", scriptMatch ? scriptMatch[1] : null);
    } catch (e) {
        console.log("Hornysimp luluvids error:", e.message);
    }
}

run();
