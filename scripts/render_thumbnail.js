const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function render() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });

  const htmlPath = path.resolve(__dirname, 'thumbnail_card.html');
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // Wait a moment for fonts and images to render
  await new Promise(r => setTimeout(r, 1200));

  const outPng = path.resolve(__dirname, '../screenshots/thumbnail-product.png');
  const outJpg = path.resolve(__dirname, '../screenshots/thumbnail-product.jpg');
  const artPng = 'C:\\Users\\hassa\\.gemini\\antigravity\\brain\\b4afaf71-ceb1-4eeb-aa31-fa0705ea859b\\plantguard_thumbnail_product.png';
  const artJpg = 'C:\\Users\\hassa\\.gemini\\antigravity\\brain\\b4afaf71-ceb1-4eeb-aa31-fa0705ea859b\\plantguard_thumbnail_product.jpg';

  await page.screenshot({ path: outPng, type: 'png' });
  await page.screenshot({ path: outJpg, type: 'jpeg', quality: 95 });
  await page.screenshot({ path: artPng, type: 'png' });
  await page.screenshot({ path: artJpg, type: 'jpeg', quality: 95 });

  console.log('Product thumbnail rendered successfully!');
  console.log('PNG size:', (fs.statSync(outPng).size / 1024).toFixed(1), 'KB');
  console.log('JPG size:', (fs.statSync(outJpg).size / 1024).toFixed(1), 'KB');

  await browser.close();
}

render().catch(err => {
  console.error('Render error:', err);
  process.exit(1);
});
