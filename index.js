// This script starts a Node.js based Express server with a few basic supports:
// - HTML 5 history API
// - Gzipping
// - Static files serving
// - Port configuration from the PORT environment variable

const express = require('express');
const fallback = require('express-history-api-fallback');
const app = express();
const path = require('path');
var compression = require('compression')

const port = process.env.PORT || 3000;

app.use(compression());

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));
app.use(fallback(path.join(__dirname, '/dist/index.html')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
