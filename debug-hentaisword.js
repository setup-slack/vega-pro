const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
        const res = await axios.get("https://hentaisword.com/e/mbmp6sfv0zwc", { headers: { "User-Agent": "Mozilla/5.0" } });
        fs.writeFileSync("hentaisword.html", res.data);
        console.log("Wrote hentaisword.html");
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
