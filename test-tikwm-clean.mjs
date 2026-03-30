import fs from 'fs';
async function testTikwm() {
  const dirtyUrl = 'https://www.tiktok.com/@ddxfishaquarium/video/7623012522966240533?lang=en';
  // Strip query parameters
  const urlObj = new URL(dirtyUrl);
  urlObj.search = '';
  const cleanUrl = urlObj.toString();
  console.log('Clean URL:', cleanUrl);

  try {
    const params = new URLSearchParams();
    params.append('url', cleanUrl);
    params.append('hd', '1');
    
    // Testing tikwm POST
    const res = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      body: params
    });
    const data = await res.json();
    fs.writeFileSync('tikwm-clean.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('tikwm-clean.json', JSON.stringify({error: err.toString()}));
  }
}
testTikwm();
