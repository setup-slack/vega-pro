const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
        const res = await axios.get("https://klcams.com/assets/index-DocunfmE.js", {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        fs.writeFileSync("klcams.js", res.data);
        console.log("Written klcams.js, size:", res.data.length);
        
        // Find URLs
        const urls = res.data.match(/https?:\/\/[^\s"'`]+/g) || [];
        const uniqueUrls = [...new Set(urls)];
        console.log("URLs found in JS:", uniqueUrls.slice(0, 30));
        
        // Find endpoint paths
        const paths = res.data.match(/["']\/api\/[^"']+["']/g) || [];
        const uniquePaths = [...new Set(paths)];
        console.log("API paths found in JS:", uniquePaths);
        
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
