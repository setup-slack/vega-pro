const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

const links = new Set();
$('a').each((i, el) => {
  let href = $(el).attr('href');
  if (href && href.startsWith('https://fulltaboo.tv/')) {
    let parts = href.replace('https://fulltaboo.tv/', '').split('/');
    if (parts[0]) links.add(parts[0]);
  }
});
console.log(Array.from(links));
