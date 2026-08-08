const cheerio = require('cheerio');
const fs = require('fs');
const $ = cheerio.load(fs.readFileSync('milfnut.html'));
let count = 0;
$('article, .item, .post, .video').each((i, el) => {
  if (count < 3) {
    console.log($(el).html());
    console.log('---');
    count++;
  }
});
