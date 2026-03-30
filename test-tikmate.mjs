import fs from 'fs';

async function testTikmate() {
  const url = 'https://www.tiktok.com/@ddxfishaquarium/video/7623012522966240533?lang=en';
  try {
    const res = await fetch(`https://api.tikmate.app/api/lookup?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    fs.writeFileSync('tikmate-out.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('tikmate-out.json', JSON.stringify({error: err.toString()}));
  }
}

testTikmate().catch(console.error);
