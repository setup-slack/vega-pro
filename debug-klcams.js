const axios = require('axios');
const fs = require('fs');
async function run() {
    try {
        const url = 'https://klcams.com/e/pxzewkxr79yl/Harley_Sin_-_Bully_Ruins_Christian_MILF_vol_2';
        const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });
        fs.writeFileSync('klcams.html', res.data);
        console.log("Wrote klcams.html");
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
