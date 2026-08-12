const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
        const link = "https://fulltaboo.tv/harley-sin-bully-ruins-christian-milf-vol-2-1/";
        const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" } });
        fs.writeFileSync("fulltaboo.html", res.data);
        console.log("Saved fulltaboo.html");
    } catch(e) {
        console.log("Error:", e.message);
    }
}
run();
