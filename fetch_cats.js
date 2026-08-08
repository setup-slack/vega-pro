const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://fulltaboo.tv/categories-3/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  const $ = cheerio.load(res.data);
  const categories = [];
  $('.categories-list a, .category-list a, ul a').each((i, el) => {
    let href = $(el).attr('href');
    if (href && href.includes('category/')) {
      categories.push({title: $(el).text().trim(), filter: href.replace('https://fulltaboo.tv', '')});
    }
  });
  console.log(categories.slice(0, 50));
}).catch(console.error);
