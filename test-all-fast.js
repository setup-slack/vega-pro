const ProviderTester = require('./tests/test-providers.js');

async function run() {
    const tester = new ProviderTester();
    const providers = tester.getAvailableProviders();
    console.log("Providers:", providers);
    
    for (const p of providers) {
        if (p === 'asmrFree') {
            console.log(`Skipping ${p} because it hangs on Cloudflare...`);
            continue;
        }
        
        try {
            console.log(`Testing ${p}...`);
            const promise = tester.testProvider(p);
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout after 15s')), 15000));
            const result = await Promise.race([promise, timeout]);
            console.log(`${p} result: passed=${result.summary.passed}, failed=${result.summary.failed}`);
        } catch (err) {
            console.log(`${p} failed:`, err.message);
        }
    }
}

run();
