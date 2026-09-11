/* Tiny static server for this app -- it is a single self-contained HTML
   page, so no build step is needed. node serve.mjs [--port 4600] */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const argv = process.argv;
const portFlag = argv.indexOf('--port');
const port = +(portFlag !== -1 ? argv[portFlag + 1] : process.env.PORT || 4600);

createServer(async (_req, res) => {
  try {
    const data = await readFile(join(root, 'index.html'));
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, () => console.log('concept-design-system serving at http://localhost:' + port));
