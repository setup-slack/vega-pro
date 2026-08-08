const axios = require('axios');
axios.get('https://klcams.com/e/kbs2dfvbpi2l/TheEleanorGee_-_Free_Use_Sister_BD_Present', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  const html = res.data;
  console.log('Got iframe HTML, length:', html.length);
  require('fs').writeFileSync('iframe_dump.html', html);
  // Match for mp4 or m3u8
  const sources = html.match(/https?:\/\/[^"']+\.(mp4|m3u8)[^"']*/gi) || [];
  console.log('Sources:', sources);
}).catch(console.error);
