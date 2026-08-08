const axios = require('axios');
const cheerio = require('cheerio');

async function checkMilfnut() {
    const { data } = await axios.get('https://milfnut.com/', {
        headers: { "User-Agent": "Mozilla/5.0" }
    });
    const $ = cheerio.load(data);
    
    // Just find the first few divs that look like posts
    console.log("Looking for posts...");
    let count = 0;
    $('.item, article, .post, .video').each((i, el) => {
        if (count > 2) return;
        console.log("Found:", $(el).attr('class'));
        console.log("HTML:", $(el).html().substring(0, 200));
        count++;
    });
}
checkMilfnut();
