


import 'zone.js/node';
import express from 'express';
let ngExpressEngine;
try {
  ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;
} catch (e) {
  console.error("Cannot find module '@nguniversal/express-engine'. Please install it with 'npm install @nguniversal/express-engine'.");
  process.exit(1);
}
import bootstrap from './main.server';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_FOLDER = join(__dirname, '../browser');
const app = express();
const PORT = process.env['PORT'] || 4000;

// Serve static files
app.use(express.static(DIST_FOLDER, { maxAge: '1y' }));


// Set up Angular Express engine
app.engine('html', ngExpressEngine({ bootstrap }));
app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// All regular routes use the Angular SSR engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
