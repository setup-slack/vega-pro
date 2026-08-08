const axios = require('axios');
const fs = require('fs');
axios.get('https://klcams.com/e/kbs2dfvbpi2l/TheEleanorGee_-_Free_Use_Sister_BD_Present', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  fs.writeFileSync('iframe.html', res.data);
  console.log('Saved iframe.html');
}).catch(console.error);
