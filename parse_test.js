const fs = require('fs');
const cheerio = require('cheerio');

const content = fs.readFileSync('C:\\Users\\Harshal\\.gemini\\antigravity\\brain\\88eac6be-3719-48ae-a076-ea213f912c1b\\.system_generated\\steps\\98\\content.md', 'utf-8');
const $ = cheerio.load(content);

console.log('--- Video Frame ---');
$('iframe').each((i, el) => {
    console.log('iframe:', $(el).attr('src'));
});

$('video source').each((i, el) => {
    console.log('video source:', $(el).attr('src'));
});

console.log('--- Title/Synopsis ---');
console.log('Title:', $('h1').text().trim());
console.log('Img:', $('meta[property="og:image"]').attr('content'));
