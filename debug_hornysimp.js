const axios = require('axios');
const cheerio = require('cheerio');

async function checkHornySimp() {
    const { data } = await axios.get('https://w11.hornysimp.com.lv/cassie-lenoir-perfect-fuck-doll-juicy-ass-pov-gets-fucked-from-every-angle/', {
        headers: { "User-Agent": "Mozilla/5.0" }
    });
    const $ = cheerio.load(data);
    
    const fs = require('fs');
    fs.writeFileSync('hornysimp_dump.html', data);
    console.log("Dumped to hornysimp_dump.html");
}
checkHornySimp();
