import * as dl from '@mrnima/tiktok-downloader';
import fs from 'fs';

async function testNima() {
  const url = 'https://www.tiktok.com/@ddxfishaquarium/video/7623012522966240533?lang=en';
  try {
    const res = await dl.default(url);
    fs.writeFileSync('nima-out.json', JSON.stringify(res, null, 2));
  } catch (err) {
    fs.writeFileSync('nima-out.json', JSON.stringify({error: err.toString()}));
  }
}

testNima().catch(console.error);
