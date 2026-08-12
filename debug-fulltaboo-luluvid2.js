const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
        const res = await axios.get("https://luluvid.com/e/qjw4w0k2weyl", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const packed = res.data.match(/eval\(function\(p,a,c,k,e,d\).*?split\('\|'\)\)\)/s);
        console.log("PACKED MATCH:", !!packed);
        
        fs.writeFileSync("luluvid.html", res.data);
    } catch(e) {
        console.log("Error", e);
    }
}
run();
