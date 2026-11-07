const fs = require('node:fs');
const path = require('node:path');
const source = path.join(__dirname, '../node_modules/add-to-calendar-button');
const target = path.join(__dirname, '../assets/vendor/add-to-calendar-button');
fs.mkdirSync(target, { recursive: true });
for (const file of ['dist/atcb.js', 'LICENSE.txt']) {
  fs.copyFileSync(path.join(source, file), path.join(target, path.basename(file)));
}
