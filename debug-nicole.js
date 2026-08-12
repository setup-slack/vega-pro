const axios = require('axios');
const fs = require('fs');
async function run() {
    try {
        const res = await axios.get("https://nicolehappyoutside.com/e/mbmp6sfv0zwc", { headers: { "User-Agent": "Mozilla/5.0" } });
        fs.writeFileSync("nicole.html", res.data);
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
