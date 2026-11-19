import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Landing Page
  console.log('Capturing Landing Page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForTimeout?.(1000) || new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-landing-page.png') });

  // 2. Click "OPEN JOURNAL ->" or "Explore How It Works" to enter App Dashboard
  console.log('Entering App Dashboard...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && (b.textContent.includes('OPEN JOURNAL') || b.textContent.includes('Explore How It Works') || b.textContent.includes('View Garden Dashboard')));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-dashboard-overview.png') });

  // 3. Navigate to Plant Scanner
  console.log('Capturing Plant Scanner...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent?.includes('Plant Scanner') || b.textContent?.includes('Scan a Plant'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-plant-scanner.png') });

  // 4. Test Scan a Curated Specimen to generate Diagnosis Report
  console.log('Triggering Curated Specimen Scan...');
  await page.evaluate(() => {
    // Click the first curated sample specimen (Tomato Early Blight)
    const samples = Array.from(document.querySelectorAll('div.cursor-pointer'));
    const sample = samples.find(s => s.textContent?.includes('Heritage Tomato') || s.textContent?.includes('Early Blight'));
    if (sample) sample.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "RUN HYBRID AI DIAGNOSIS"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scanBtn = btns.find(b => b.textContent?.includes('RUN HYBRID AI DIAGNOSIS'));
    if (scanBtn) scanBtn.click();
  });
  console.log('Waiting for AI Diagnosis to complete...');
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-diagnosis-report.png') });

  // 5. Navigate to My Garden
  console.log('Capturing My Garden...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gardenBtn = btns.find(b => b.textContent?.includes('My Garden') || b.textContent?.includes('Botanical Collection'));
    if (gardenBtn) gardenBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-botanical-garden.png') });

  // 6. Navigate to Plant Doctor
  console.log('Capturing Plant Doctor...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const docBtn = btns.find(b => b.textContent?.includes('Plant Doctor'));
    if (docBtn) docBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-ai-plant-doctor.png') });

  // 7. Navigate to Health Journal
  console.log('Capturing Health Journal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const journalBtn = btns.find(b => b.textContent?.includes('Health Journal'));
    if (journalBtn) journalBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-health-journal.png') });

  // 8. Navigate to Plant Library
  console.log('Capturing Plant Library & Dilution Calculator...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const libBtn = btns.find(b => b.textContent?.includes('Plant Library'));
    if (libBtn) libBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-plant-library.png') });

  // 9. Navigate to Settings
  console.log('Capturing Settings & Database Architecture...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const setBtn = btns.find(b => b.textContent?.includes('Settings'));
    if (setBtn) setBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-settings-architecture.png') });

  await browser.close();
  console.log('All 9 screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
