const axios = require('axios');
const cheerio = require('cheerio');

async function testPosts() {
  const res = await axios.get('https://www.tabootube.xxx/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36' }
  });
  const $ = cheerio.load(res.data);
  const pagination = [];
  $('.pagination a').each((i, el) => {
    pagination.push($(el).attr('href'));
  });
  console.log("PAGINATION:", pagination);
}
testPosts();
