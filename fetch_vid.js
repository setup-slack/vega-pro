const axios = require('axios');
const cheerio = require('cheerio');
axios.get('https://fulltaboo.tv/theeleanorgee-free-use-sister-bd-present/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  const $ = cheerio.load(res.data);
  const title = $('h1').first().text().trim() || $('title').text();
  const image = $('meta[property="og:image"]').attr('content');
  const synopsis = $('.entry-content p').text().trim() || $('meta[name="description"]').attr('content') || '';
  
  // Find iframe or video source
  const iframes = [];
  $('iframe').each((i, el) => {
    iframes.push($(el).attr('src'));
  });
  const videos = [];
  $('video source').each((i, el) => {
    videos.push($(el).attr('src'));
  });

  console.log({title, image, synopsis, iframes, videos});
}).catch(console.error);
