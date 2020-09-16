const sirv = require('sirv');
const polka = require('polka');
const { h } = require('preact');
const { readFileSync } = require('fs');
const render = require('preact-render-to-string');
const bundle = require('./build/ssr-build/ssr-bundle');

const App = bundle.default;
const { PORT = 3000 } = process.env;

const RGX = /<div id="app"[^>]*>.*?(?=<script)/i;
const template = readFileSync('build/index.html', 'utf8');

polka()
    .use(sirv('build'))
    .get('*', (req, res) => {
        let body = render(h(App, { url: req.url }));
        res.setHeader('Content-Type', 'text/html');
        res.end(template.replace(RGX, body));
    })
    .listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Running on localhost:${PORT}`);
    });