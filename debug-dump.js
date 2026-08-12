const axios = require('axios');
const fs = require('fs');

async function run() {
    try {
        const res = await axios.get("https://dl.bunkr.cr/file/62416685");
        fs.writeFileSync('bunkr.html', res.data);
    } catch(e) { console.log(e.message) }
    
    try {
        const res = await axios.get("https://luluvids.top/e/6owdmvr04wvz");
        fs.writeFileSync('lulu.html', res.data);
    } catch(e) { console.log(e.message) }
}
run();
