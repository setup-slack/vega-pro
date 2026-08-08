const cheerio = require('cheerio');
const fs = require('fs');
const $ = cheerio.load(fs.readFileSync('milfnut.html'));
const catalog = [{title: 'Latest', filter: ''}];
const genres = [];
$('.menu-item a').each((i, el) => {
  const title = $(el).text().trim();
  const filter = $(el).attr('href');
  if(title && filter && filter.startsWith('https://milfnut.com/')) {
    const f = filter.replace('https://milfnut.com/', '');
    if (f) {
      genres.push({title, filter: f});
    }
  }
});
console.log(JSON.stringify({catalog, genres}, null, 2));

// Test posts parsing
const posts = [];
$('.video-block').each((i, el) => {
  const a = $(el).find('a.title');
  const title = a.text().trim();
  const link = a.attr('href');
  const image = $(el).find('img').attr('src');
  if (title && link) {
    posts.push({title, link: link.replace('https://milfnut.com', ''), image, provider: 'milfnut'});
  }
});
console.log('Posts:', posts.slice(0, 3));
