const cheerio = require('cheerio');
const fs = require('fs');
const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

console.log("== Categories ==");
$('ul.sub-menu a, .menu a, .cat-item a, a[rel="category tag"]').each((i, el) => {
  console.log($(el).text().trim(), $(el).attr('href'));
});

console.log("\n== Tags ==");
$('.tagcloud a, a[rel="tag"]').each((i, el) => {
  console.log($(el).text().trim(), $(el).attr('href'));
});

console.log("\n== Posts ==");
$('article, .post, .item, .video').slice(0, 3).each((i, el) => {
  console.log('Title:', $(el).find('h1, h2, h3, .title').first().text().trim());
  console.log('Link:', $(el).find('a').first().attr('href'));
  console.log('Image:', $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src'));
});

console.log("\n== Post using standard selectors ==");
$('a').each((i, el) => {
  const href = $(el).attr('href') || '';
  if (href.includes('/video/')) {
    console.log("Video URL:", href);
  }
});
