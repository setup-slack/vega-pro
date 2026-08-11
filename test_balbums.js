const { getPosts, getSearchPosts } = require('./dist/balbums/posts.js');

const providerContext = {
    axios: require('axios'),
    cheerio: require('cheerio')
};

const controller = new AbortController();

getPosts('/?sort=latest', 1, 'balbums', controller.signal, providerContext)
    .then(res => console.log('Home posts:', JSON.stringify(res, null, 2)))
    .catch(err => console.error('Error in getPosts:', err.message));

getSearchPosts('test', 1, 'balbums', controller.signal, providerContext)
    .then(res => console.log('Search posts:', JSON.stringify(res, null, 2)))
    .catch(err => console.error('Error in getSearchPosts:', err.message));
