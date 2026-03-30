import Tiktok from '@tobyg74/tiktok-api-dl';

async function test() {
  const url = 'https://www.tiktok.com/@tiktok/video/7106594312292453678';
  console.log('Testing v1...');
  let res = await Tiktok.Downloader(url, { version: 'v1' });
  console.log('v1:', res.status, res.message || res);

  console.log('\nTesting v2...');
  res = await Tiktok.Downloader(url, { version: 'v2' });
  console.log('v2:', res.status, res.message || res);

  console.log('\nTesting v3...');
  res = await Tiktok.Downloader(url, { version: 'v3' });
  console.log('v3:', res.status, res.message || res);
}

test().catch(console.error);
