const fs = require('fs');
const path = require('path');
global.providerContext = require('./tests/provider-test-context').providerContext;

const { getPosts: milfGetPosts } = require('./dist/milfnut/posts');
const { getStream: milfGetStream } = require('./dist/milfnut/stream');

const { getPosts: hornyGetPosts } = require('./dist/hornysimp/posts');
const { getStream: hornyGetStream } = require('./dist/hornysimp/stream');

const { getPosts: tabooGetPosts } = require('./dist/fulltaboo/posts');
const { getStream: tabooGetStream } = require('./dist/fulltaboo/stream');

const { getPosts: watchGetPosts } = require('./dist/watchporn/posts');
const { getStream: watchGetStream } = require('./dist/watchporn/stream');

const { getPosts: tubeGetPosts } = require('./dist/tabootube/posts');
const { getStream: tubeGetStream } = require('./dist/tabootube/stream');

const { getPosts: mzGetPosts } = require('./dist/pornmz/posts');
const { getStream: mzGetStream } = require('./dist/pornmz/stream');

const providers = [
    { name: 'milfnut', getPosts: milfGetPosts, getStream: milfGetStream },
    { name: 'hornysimp', getPosts: hornyGetPosts, getStream: hornyGetStream },
    { name: 'fulltaboo', getPosts: tabooGetPosts, getStream: tabooGetStream },
    { name: 'watchporn', getPosts: watchGetPosts, getStream: watchGetStream },
    { name: 'tabootube', getPosts: tubeGetPosts, getStream: tubeGetStream },
    { name: 'pornmz', getPosts: mzGetPosts, getStream: mzGetStream },
];

async function testAll() {
    const ctx = global.providerContext;
    for (const p of providers) {
        try {
            console.log(`\n--- Testing ${p.name} ---`);
            // Support both signatures for getPosts
            const posts = p.name === 'milfnut' || p.name === 'pornmz'
                ? await p.getPosts('', 1, '', new AbortController().signal, ctx)
                : await p.getPosts({ filter: '', page: 1, providerContext: ctx, signal: new AbortController().signal, providerValue: p.name });
                
            if (!posts || posts.length === 0) {
                console.log('No posts found!');
                continue;
            }
            const firstPost = posts[0];
            
            // Support both signatures for getStream
            const streams = p.name === 'milfnut' || p.name === 'pornmz'
                ? await p.getStream(firstPost.link, 'movie', new AbortController().signal, ctx)
                : await p.getStream({ link: firstPost.link, type: 'movie', signal: new AbortController().signal, providerContext: ctx });
                
            console.log(JSON.stringify(streams, null, 2));
        } catch (e) {
            console.log(`Error testing ${p.name}:`, e.message);
        }
    }
}

testAll();
