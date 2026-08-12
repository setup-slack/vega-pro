const axios = require('axios');
async function run() {
    try {
        const res = await axios.get("https://fulltaboo.tv/", {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });
        console.log("Status:", res.status);
    } catch(e) {
        console.log("Error:", e.message);
        if (e.response) {
            console.log("Status:", e.response.status);
        }
    }
}
run();
