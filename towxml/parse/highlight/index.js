const config = require('../../config'),
    hljs = require('./highlight');
// config.highlight.forEach(item => {
//     hljs.registerLanguage(item, require(`./languages/${item}`).default);
// });
hljs.registerLanguage('c-like', require('./languages/c-like').default);hljs.registerLanguage('c', require('./languages/c').default);hljs.registerLanguage('bash', require('./languages/bash').default);hljs.registerLanguage('css', require('./languages/css').default);hljs.registerLanguage('javascript', require('./languages/javascript').default);hljs.registerLanguage('json', require('./languages/json').default);

module.exports = hljs;