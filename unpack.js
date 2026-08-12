const fs = require('fs');

const html = fs.readFileSync('lulu.html', 'utf-8');
const packed = html.match(/eval\(function\(p,a,c,k,e,d\).*?split\('\|'\)\)\)/s);
if (packed) {
    const unpackerCode = packed[0].replace(/^eval/, '');
    try {
        const unpacked = eval(unpackerCode);
        console.log("Unpacked!");
        const m3u8Match = unpacked.match(/(https?:\/\/[^"']+\.m3u8[^"']*)/i);
        if (m3u8Match) {
            console.log("Found m3u8:", m3u8Match[1]);
        } else {
            console.log(unpacked.substring(0, 500));
        }
    } catch (e) {
        console.log("Eval error:", e.message);
    }
} else {
    console.log("Could not find packed script");
}
