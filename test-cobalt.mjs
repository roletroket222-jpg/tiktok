import fs from 'fs';

async function testCobalt() {
  const url = 'https://www.tiktok.com/@ddxfishaquarium/video/7623012522966240533?lang=en';
  try {
    const res = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });
    const data = await res.json();
    fs.writeFileSync('cobalt-out.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('cobalt-out.json', JSON.stringify({error: err.toString()}));
  }
}

testCobalt().catch(console.error);
