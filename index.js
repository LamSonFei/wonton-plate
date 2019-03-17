const express = require('express');
const fallback = require('express-history-api-fallback');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(fallback(path.join(__dirname, '/dist/index.html')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
