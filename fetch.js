const axios = require('axios');
const fs = require('fs');
axios.get('https://fulltaboo.tv/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
}).then(res => {
  fs.writeFileSync('page.html', res.data);
  console.log('HTML saved.');
}).catch(console.error);
