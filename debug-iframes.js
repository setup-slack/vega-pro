const axios = require('axios');

async function checkUrl(url) {
    try {
        const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const data = res.data;
        const hasEval = data.includes('eval(function(p,a,c,k,e,d)');
        const hasReact = data.includes('id="root"');
        console.log(url, "-> Eval:", hasEval, "React:", hasReact);
    } catch(e) {
        console.log(url, "-> Error:", e.message);
    }
}

async function run() {
    await checkUrl('https://klcams.com/e/pxzewkxr79yl/Harley_Sin_-_Bully_Ruins_Christian_MILF_vol_2');
    await checkUrl('https://luluvid.com/e/qjw4w0k2weyl');
    await checkUrl('https://hentaisword.com/e/mbmp6sfv0zwc');
}
run();
