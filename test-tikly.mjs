import fs from 'fs';
async function testTikly() {
  const url = 'https://www.tiktok.com/@ddxfishaquarium/video/7623012522966240533?lang=en';
  try {
    const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    fs.writeFileSync('tikly-out.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('tikly-out.json', JSON.stringify({ error: err.toString() }));
  }
}
testTikly();
