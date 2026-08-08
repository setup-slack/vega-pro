const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://fulltaboo.tv/theeleanorgee-free-use-sister-bd-present/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  const $ = cheerio.load(res.data);
  const scripts = [];
  $('script').each((i, el) => {
    const text = $(el).html();
    if (text && (text.includes('mp4') || text.includes('m3u8'))) {
      scripts.push(text);
    }
  });
  console.log('Scripts containing media:', scripts);
}).catch(console.error);
