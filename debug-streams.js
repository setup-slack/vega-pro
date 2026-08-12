const ProviderTester = require('./tests/test-providers.js');
const axios = require('axios');

async function checkLink(url, headers) {
    try {
        const res = await axios.head(url, { headers, timeout: 5000 });
        console.log(`  [HEAD] ${res.status} ${res.headers['content-type']}`);
    } catch (err) {
        console.log(`  [HEAD FAILED] ${err.message}`);
    }
}

async function debugProvider(p) {
    const tester = new ProviderTester();
    tester.postsToTest = 1;
    tester.linksToTest = 1;

    try {
        console.log(`\n--- Debugging ${p} ---`);
        const result = await tester.testProvider(p);
        const streams = result.stream?.data?.streams || []; // Wait, the tester doesn't return the raw streams easily.
        // Actually I should just import the provider directly.
    } catch (e) {}
}

async function main() {
    const { providerContext } = require('./tests/provider-test-context.js');
    
    for (const p of ['milfnut', 'pornmz', 'balbums', 'hornysimp']) {
        try {
            console.log(`\n--- ${p} ---`);
            const metaModule = require(`./dist/${p}/meta.js`);
            const postsModule = require(`./dist/${p}/posts.js`);
            const streamModule = require(`./dist/${p}/stream.js`);
            const catalogModule = require(`./dist/${p}/catalog.js`);
            
            const posts = await postsModule.getPosts({
                filter: catalogModule.catalog[0].filter,
                page: 1,
                providerValue: p,
                signal: new AbortController().signal,
                providerContext
            });
            
            if (!posts.length) { console.log('No posts'); continue; }
            
            const meta = await metaModule.getMeta({
                link: posts[0].link,
                provider: p,
                providerContext
            });
            
            if (!meta.linkList[0]?.directLinks?.length) { console.log('No direct links'); continue; }
            
            const linkToTest = meta.linkList[0].directLinks[0];
            console.log('Testing Stream for:', linkToTest.link);
            
            const streams = await streamModule.getStream({
                link: linkToTest.link,
                type: 'movie',
                signal: new AbortController().signal,
                providerContext
            });
            
            console.log('Streams found:', streams.length);
            for (const s of streams) {
                console.log(`  -> Server: ${s.server}, Type: ${s.type}`);
                console.log(`  -> Link: ${s.link}`);
                await checkLink(s.link, s.headers || {});
            }
            
        } catch (err) {
            console.log(`Error testing ${p}:`, err.message);
        }
    }
}

main();
