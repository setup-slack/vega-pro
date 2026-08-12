const axios = require('axios');
async function run() {
    const url = "https://tulipvid.net/videos/Jordinswet%20-%20Stepmom%20Needs%20Cum.%20Ty%20Helps%20Out!%20-%20Fill%20Up%20My%20Mom_converted.m3u8";
    try {
        console.log("Testing milfnut link WITH referer...");
        await axios.get(url, { headers: { "Referer": "https://milfnut.com/" } });
        console.log("SUCCESS");
    } catch(e) {
        console.log("FAILED WITH REFERER:", e.message);
    }
    try {
        console.log("Testing milfnut link WITHOUT referer...");
        await axios.get(url);
        console.log("SUCCESS");
    } catch(e) {
        console.log("FAILED WITHOUT REFERER:", e.message);
    }
}
run();
