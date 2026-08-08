const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

console.log($('.post, article, .item, .video').first().html());
