import fs from 'fs';
async function testTikwmPost() {
  const url = 'https://www.tiktok.com/@mrbeast/video/7462473456816131370';
  try {
    const params = new URLSearchParams();
    params.append('url', url);
    params.append('count', '12');
    params.append('cursor', '0');
    params.append('web', '1');
    params.append('hd', '1');
    const res = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      body: params
    });
    const data = await res.json();
    fs.writeFileSync('tikwm-post.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('tikwm-post.json', JSON.stringify({error: err.toString()}));
  }
}
testTikwmPost();
