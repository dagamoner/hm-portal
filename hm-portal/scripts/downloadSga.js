const fs = require('fs');
const path = require('path');
const https = require('https');

const urls = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/GHS-pictogram-explos.svg', name: 'SGA01.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/GHS-pictogram-flamme.svg', name: 'SGA02.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/GHS-pictogram-rondflam.svg', name: 'SGA03.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/GHS-pictogram-bottle.svg', name: 'SGA04.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/GHS-pictogram-acid.svg', name: 'SGA05.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/GHS-pictogram-skull.svg', name: 'SGA06.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/GHS-pictogram-exclam.svg', name: 'SGA07.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/GHS-pictogram-silhouete.svg', name: 'SGA08.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/GHS-pictogram-pollu.svg', name: 'SGA09.svg' }
];

const dest = path.join(__dirname, '../public/sga/pictograms');
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

async function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => reject(err));
    });
  });
}

async function main() {
  for (const item of urls) {
    console.log(`Downloading ${item.name}...`);
    try {
      await download(item.url, path.join(dest, item.name));
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(e);
    }
  }
}

main();
