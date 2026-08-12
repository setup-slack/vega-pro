const axios = require('axios');
const cheerio = require('cheerio');

async function run() {
    try {
        const fileId = "62416685"; // From https://dl.bunkr.cr/file/62416685
        
        console.log("Fetching meta...");
        const metaRes = await axios.post("https://dl.bunkr.cr/api/_001_v2", { id: fileId });
        const meta = metaRes.data;
        console.log("Meta:", meta);
        
        const rawUrl = new URL(meta.mediafiles + meta.path);
        const path = decodeURIComponent(rawUrl.pathname);
        
        console.log("Fetching token...");
        const signRes = await axios.get('https://glb-apisign.cdn.cr/sign?path=' + encodeURIComponent(path));
        const { token, ex } = signRes.data;
        
        rawUrl.searchParams.set('token', token);
        rawUrl.searchParams.set('ex', ex);
        
        console.log("Final MP4:", rawUrl.toString());
    } catch(e) {
        console.log("Error:", e.message, e.response?.data);
    }
}
run();
