import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const OUT_DIR = path.resolve(process.cwd(), 'screenshots');
const PUB_DIR = path.resolve(process.cwd(), 'public/scenes');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(PUB_DIR)) fs.mkdirSync(PUB_DIR, { recursive: true });

const SCENES = [
  {
    num: '01',
    time: '0:00 – 0:25',
    tag: 'THE HOOK & PROBLEM',
    title: 'Why Plant Care Apps Fail',
    subtitle: 'Paywalls, uncompressed cloud uploads, and generic AI dashboards that feel disconnected from nature.',
    features: ['LANDING HERO', 'MONSTERA SPECIMEN CARD', 'PROBLEM STATEMENT'],
    icon: 'leaf',
    filename: 'scene-01-the-hook.png',
  },
  {
    num: '02',
    time: '0:25 – 0:45',
    tag: 'THE SOLUTION & BRAND IDENTITY',
    title: 'A Botanical Field Journal Redesigned',
    subtitle: 'PlantGuard AI introduces the Verdant Paper design system — warm editorial aesthetics with living science underneath.',
    features: ['VERDANT PAPER', 'HERBARIUM TYPE', 'REALTIME DASHBOARD METRICS'],
    icon: 'sprout',
    filename: 'scene-02-brand-identity.png',
  },
  {
    num: '03',
    time: '0:45 – 1:30',
    tag: 'THE CORE DEMO: SCANNER & AI DIAGNOSIS',
    title: 'Hybrid Vision & Foliar Pathology',
    subtitle: 'On-device chromatic colorimetry (ExG Index) combined with Gemini Nano triage and Gemini Flash verification.',
    features: ['1-CLICK CURATED SPECIMENS', 'INTERACTIVE HOTSPOT VIEWER', 'RADIAL HEALTH GAUGE'],
    icon: 'scan',
    filename: 'scene-03-scanner-diagnosis.png',
  },
  {
    num: '04',
    time: '1:30 – 2:00',
    tag: 'HERBARIUM & AI PLANT DOCTOR',
    title: 'Conversations Anchored to Medical Dossiers',
    subtitle: 'Unlike generic chatbots, the AI Doctor evaluates each plant based on its actual diagnosis and foliar health score.',
    features: ['LIVING HERBARIUM', 'PLANT MEDICAL CHART', 'FOLLOW-UP PHOTO ATTACHMENT'],
    icon: 'stethoscope',
    filename: 'scene-04-plant-doctor.png',
  },
  {
    num: '05',
    time: '2:00 – 2:30',
    tag: 'HEALTH JOURNAL & DILUTION CALCULATOR',
    title: 'Visual Recovery & Precision Dosage',
    subtitle: 'Track lesion retreat with the Before-and-After comparator slider and mix safe foliar sprays with exact organic ratios.',
    features: ['BEFORE/AFTER SLIDER', 'ORGANIC SPRAY CALCULATOR', 'CARE SCHEDULE TASKS'],
    icon: 'calculator',
    filename: 'scene-05-journal-calculator.png',
  },
  {
    num: '06',
    time: '2:30 – 2:45',
    tag: 'ARCHITECTURE & CLOSING',
    title: '100% Local-First Privacy & Persistence',
    subtitle: 'Powered by native browser IndexedDB — zero cloud fees, zero vendor lock-in, and 1-click JSON archive portability.',
    features: ['NATIVE INDEXEDDB', 'ZERO CLOUD EGRESS', 'GROW WITH CONFIDENCE'],
    icon: 'database',
    filename: 'scene-06-architecture-closing.png',
  },
];

const renderCardHtml = (scene) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;0,800;1,400;1,600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background-color: #FAF9F4;
      font-family: 'DM Sans', sans-serif;
      color: #263D32;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 90px 110px;
      position: relative;
      overflow: hidden;
    }

    /* Paper texture */
    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(#263D32 0.75px, transparent 0.75px);
      background-size: 28px 28px;
      opacity: 0.055;
      pointer-events: none;
    }

    /* Double botanical border */
    .outer-frame {
      position: absolute;
      inset: 28px;
      border: 2px solid #D3DFCE;
      border-radius: 32px;
      pointer-events: none;
    }
    .inner-frame {
      position: absolute;
      inset: 38px;
      border: 1.5px dashed rgba(143, 168, 138, 0.45);
      border-radius: 24px;
      pointer-events: none;
    }

    /* Header Ribbon */
    .top-ribbon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .logo-crest {
      width: 64px;
      height: 64px;
      background: #355B46;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(53, 91, 70, 0.22);
    }

    .brand-text h1 {
      font-family: 'Fraunces', serif;
      font-size: 34px;
      font-weight: 700;
      color: #263D32;
      display: flex;
      align-items: center;
      gap: 12px;
      line-height: 1;
    }

    .ai-pill {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      background: #E7EDE3;
      color: #355B46;
      border: 1px solid rgba(143, 168, 138, 0.4);
      padding: 4px 10px;
      border-radius: 20px;
    }

    .brand-text p {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #796A59;
      margin-top: 5px;
    }

    .scene-badge-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .scene-number-pill {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 15px;
      font-weight: 700;
      color: #355B46;
      background: #E7EDE3;
      border: 1.5px solid #8FA88A;
      padding: 10px 22px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .scene-number-pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #C8795B;
    }

    .timestamp-pill {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #796A59;
      background: #FFFFFF;
      border: 1px solid #D3DFCE;
      padding: 10px 18px;
      border-radius: 40px;
    }

    /* Main Center Card */
    .center-content {
      z-index: 10;
      max-width: 1400px;
      margin: auto 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .category-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #C8795B;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .scene-title {
      font-family: 'Fraunces', serif;
      font-size: 76px;
      font-weight: 700;
      color: #263D32;
      line-height: 1.12;
      letter-spacing: -1.5px;
    }

    .scene-subtitle {
      font-size: 26px;
      color: #796A59;
      line-height: 1.45;
      max-width: 1200px;
      font-weight: 400;
    }

    /* Footer Feature Tags */
    .bottom-ribbon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid #D3DFCE;
      padding-top: 32px;
      z-index: 10;
    }

    .features-list {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .feature-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      background: #FFFFFF;
      border: 1.5px solid #D3DFCE;
      color: #263D32;
      padding: 8px 18px;
      border-radius: 20px;
      box-shadow: 0 2px 6px rgba(38, 61, 50, 0.04);
    }

    .edition-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      color: #796A59;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="outer-frame"></div>
  <div class="inner-frame"></div>

  <!-- Top Ribbon -->
  <div class="top-ribbon">
    <div class="brand-group">
      <div class="logo-crest">
        <svg viewBox="0 0 48 48" fill="none" style="width: 44px; height: 44px;">
          <path d="M24 7C16 7 11 15 11 24C11 32 17 39 24 41C31 39 37 32 37 24C37 15 32 7 24 7Z" fill="#FAF9F4" />
          <path d="M24 9V40" stroke="#355B46" stroke-width="2.2" stroke-linecap="round" />
          <path d="M24 16C20 14 16 17 15 20" stroke="#355B46" stroke-width="1.6" stroke-linecap="round" />
          <path d="M24 23C19 21 15 24 14 28" stroke="#355B46" stroke-width="1.6" stroke-linecap="round" />
          <path d="M24 16C28 14 32 17 33 20" stroke="#355B46" stroke-width="1.6" stroke-linecap="round" />
          <path d="M24 23C29 21 33 24 34 28" stroke="#355B46" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="30" cy="18" r="4.6" fill="#FAF9F4" stroke="#C8795B" stroke-width="2" />
          <circle cx="30" cy="18" r="1.8" fill="#C8795B" />
        </svg>
      </div>
      <div class="brand-text">
        <h1>PlantGuard <span class="ai-pill">AI</span></h1>
        <p>Verdant Atelier · Field Demo</p>
      </div>
    </div>

    <div class="scene-badge-group">
      <div class="scene-number-pill">
        <span class="dot"></span>
        <span>SCENE ${scene.num} / 06</span>
      </div>
      <div class="timestamp-pill">
        <span>${scene.time}</span>
      </div>
    </div>
  </div>

  <!-- Center Content -->
  <div class="center-content">
    <div class="category-label">
      <span>●</span>
      <span>${scene.tag}</span>
    </div>
    <h2 class="scene-title">${scene.title}</h2>
    <p class="scene-subtitle">${scene.subtitle}</p>
  </div>

  <!-- Bottom Ribbon -->
  <div class="bottom-ribbon">
    <div class="features-list">
      ${scene.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
    </div>
    <div class="edition-tag">
      UNDERSTAND YOUR PLANTS. GROW WITH CONFIDENCE.
    </div>
  </div>
</body>
</html>
`;

async function generateAll() {
  console.log('Launching headless browser to render 6 video scene bumper cards at 1920x1080...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

  for (const scene of SCENES) {
    console.log(`Rendering Scene ${scene.num}: ${scene.title}...`);
    const html = renderCardHtml(scene);
    await page.setContent(html, { waitUntil: 'load', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    const outPath = path.join(OUT_DIR, scene.filename);
    const pubPath = path.join(PUB_DIR, scene.filename);

    await page.screenshot({ path: outPath });
    fs.copyFileSync(outPath, pubPath);
    console.log(`  -> Saved to ${outPath} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`);
  }

  await browser.close();
  console.log('All 6 video scene cards rendered successfully!');
}

generateAll().catch(err => {
  console.error('Error generating scene cards:', err);
  process.exit(1);
});
