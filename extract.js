const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://asmrfree.com/asmr-actress/', {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}})
  .then(res => {
    const $ = cheerio.load(res.data);
    const links = new Set();
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if(href && href.startsWith('https://asmrfree.com/category/') && text) {
            links.add(`{ title: "${text}", filter: "${href.replace('https://asmrfree.com', '')}" }`);
        }
    });
    console.log(Array.from(links).join(',\n'));
  });
