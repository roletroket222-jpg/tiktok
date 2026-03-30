import fs from 'fs';
async function testTikwm() {
  const url = 'https://www.tiktok.com/@tiktok/video/7106594312292453678';
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${url}`);
    const data = await res.json();
    fs.writeFileSync('tikwm-out2.json', JSON.stringify(data, null, 2));
  } catch (err) {
    fs.writeFileSync('tikwm-out2.json', JSON.stringify({error: err.toString()}));
  }
}
testTikwm();
