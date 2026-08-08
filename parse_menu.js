const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('C:/Users/Harshal/.gemini/antigravity/brain/88eac6be-3719-48ae-a076-ea213f912c1b/.system_generated/steps/329/content.md', 'utf8');
const $ = cheerio.load(html);
const links = new Set();
$('a').each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href');
    if (href && href.includes('/tag/') && text) {
        links.add(`${text} -> ${href}`);
    }
});
console.log(Array.from(links).join('\n'));
console.log(Array.from(links).join('\n'));
