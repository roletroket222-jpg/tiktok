import Tiktok from '@tobyg74/tiktok-api-dl';
import fs from 'fs';

async function testAll() {
  const url = 'https://www.tiktok.com/@mrbeast/video/7462473456816131370'; // fresh video
  const out = {};
  for (const v of ['v1', 'v2', 'v3']) {
    try {
      const start = Date.now();
      const res = await Tiktok.Downloader(url, { version: v });
      if (res.status === 'success') {
         out[v] = { success: true, keys: Object.keys(res.result || {}) };
      } else {
         out[v] = { success: false, status: res.status, msg: res.message };
      }
    } catch (err) {
      out[v] = { success: false, crash: err.message };
    }
  }
  fs.writeFileSync('test-output3.json', JSON.stringify(out, null, 2));
}

testAll().catch(console.error);
