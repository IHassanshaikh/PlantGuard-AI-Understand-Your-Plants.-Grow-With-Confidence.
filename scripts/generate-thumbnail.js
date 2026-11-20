import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const htmlTemplate = (width, height) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PlantGuard AI Thumbnail</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,wght@0,600;0,700;0,800;1,400;1,600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${width}px;
      height: ${height}px;
      background-color: #FAF9F4;
      font-family: 'DM Sans', sans-serif;
      color: #263D32;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 60px 70px;
      position: relative;
      overflow: hidden;
    }

    /* Subtle paper texture */
    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(#263D32 0.6px, transparent 0.6px);
      background-size: 24px 24px;
      opacity: 0.05;
      pointer-events: none;
    }

    /* Outer delicate botanical frame */
    .outer-border {
      position: absolute;
      inset: 20px;
      border: 1.5px solid #D3DFCE;
      border-radius: 24px;
      pointer-events: none;
    }
    .inner-border {
      position: absolute;
      inset: 26px;
      border: 1px dashed rgba(143, 168, 138, 0.4);
      border-radius: 20px;
      pointer-events: none;
    }

    .left-col {
      flex: 1;
      max-width: 580px;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .brand-crest {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-box {
      width: 56px;
      height: 56px;
      background: #355B46;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(53, 91, 70, 0.2);
    }

    .brand-meta h2 {
      font-family: 'Fraunces', serif;
      font-size: 32px;
      font-weight: 700;
      color: #263D32;
      letter-spacing: -0.5px;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-meta .ai-badge {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      background: #E7EDE3;
      color: #355B46;
      border: 1px solid rgba(143, 168, 138, 0.4);
      padding: 3px 8px;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .brand-meta p {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #796A59;
      margin-top: 5px;
    }

    .main-heading {
      font-family: 'Fraunces', serif;
      font-size: 46px;
      font-weight: 700;
      color: #263D32;
      line-height: 1.15;
      letter-spacing: -1px;
    }

    .main-heading span {
      color: #355B46;
      font-style: italic;
    }

    .tagline {
      font-size: 17px;
      color: #796A59;
      line-height: 1.5;
      max-width: 520px;
    }

    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 8px;
    }

    .badge-pill {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 7px;
      border: 1px solid #D3DFCE;
      background: #FFFFFF;
      color: #263D32;
      box-shadow: 0 2px 6px rgba(38, 61, 50, 0.04);
    }

    .badge-pill.highlight {
      background: #E7EDE3;
      border-color: #8FA88A;
      color: #355B46;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #C8795B;
    }

    /* Right Card */
    .right-col {
      width: 480px;
      z-index: 10;
      position: relative;
    }

    .specimen-card {
      background: #FFFFFF;
      border: 1.5px solid #D3DFCE;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 20px 45px -10px rgba(38, 61, 50, 0.12);
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
    }

    .card-decor-underlay {
      position: absolute;
      inset: -12px;
      border-radius: 30px;
      background: #E7EDE3;
      transform: rotate(-1.5deg);
      border: 1.5px solid #D3DFCE;
      z-index: -1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title-group span {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #796A59;
    }

    .card-title-group h3 {
      font-family: 'Fraunces', serif;
      font-size: 22px;
      font-weight: 700;
      color: #263D32;
    }

    .score-meter {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #E7EDE3;
      border: 1px solid #8FA88A;
      padding: 6px 12px;
      border-radius: 20px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      color: #355B46;
    }

    .image-container {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 4 / 3;
      border: 1.5px solid #D3DFCE;
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Pinned Hotspots */
    .pin {
      position: absolute;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(4px);
      border: 1.5px solid #355B46;
      border-radius: 10px;
      padding: 5px 10px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      color: #263D32;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    .pin.p1 { top: 18px; left: 18px; }
    .pin.p2 { bottom: 18px; right: 18px; border-color: #C8795B; }
    .pin .pin-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #355B46;
    }
    .pin.p2 .pin-dot {
      background: #C8795B;
    }

    .card-footer-box {
      background: #FAF9F4;
      border: 1px solid #D3DFCE;
      border-radius: 14px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .engine-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #355B46;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .engine-status {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      color: #796A59;
    }
  </style>
</head>
<body>
  <div class="outer-border"></div>
  <div class="inner-border"></div>

  <!-- Left Content -->
  <div class="left-col">
    <div class="brand-crest">
      <div class="logo-box">
        <svg viewBox="0 0 48 48" fill="none" style="width: 38px; height: 38px;">
          <path d="M24 7C16 7 11 15 11 24C11 32 17 39 24 41C31 39 37 32 37 24C37 15 32 7 24 7Z" fill="#FAF9F4" />
          <path d="M24 9V40" stroke="#355B46" stroke-width="2" stroke-linecap="round" />
          <path d="M24 16C20 14 16 17 15 20" stroke="#355B46" stroke-width="1.5" stroke-linecap="round" />
          <path d="M24 23C19 21 15 24 14 28" stroke="#355B46" stroke-width="1.5" stroke-linecap="round" />
          <path d="M24 16C28 14 32 17 33 20" stroke="#355B46" stroke-width="1.5" stroke-linecap="round" />
          <path d="M24 23C29 21 33 24 34 28" stroke="#355B46" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="30" cy="18" r="4.2" fill="#FAF9F4" stroke="#C8795B" stroke-width="1.8" />
          <circle cx="30" cy="18" r="1.8" fill="#C8795B" />
        </svg>
      </div>
      <div class="brand-meta">
        <h2>PlantGuard <span class="ai-badge">AI</span></h2>
        <p>Verdant Atelier · Design System: Verdant Paper</p>
      </div>
    </div>

    <h1 class="main-heading">
      Understand Your Plants.<br>
      <span>Grow With Confidence.</span>
    </h1>

    <p class="tagline">
      AI-powered botanical field journal and foliar pathology scanner. 
      Bridging client-side colorimetry with Google Gemini multimodal intelligence.
    </p>

    <div class="badges-row">
      <div class="badge-pill highlight">
        <span class="dot"></span>
        <span>ON-DEVICE + CLOUD HYBRID AI</span>
      </div>
      <div class="badge-pill">
        <span>GEMINI NANO & FLASH</span>
      </div>
      <div class="badge-pill">
        <span>LOCAL-FIRST INDEXEDDB</span>
      </div>
      <div class="badge-pill">
        <span>FOLIAR HOTSPOT VISION</span>
      </div>
    </div>
  </div>

  <!-- Right Specimen Showcase Card -->
  <div class="right-col">
    <div class="card-decor-underlay"></div>
    <div class="specimen-card">
      <div class="card-header">
        <div class="card-title-group">
          <span>Specimen #084 · Herbarium</span>
          <h3>Monstera Deliciosa</h3>
        </div>
        <div class="score-meter">
          <span>HEALTH</span>
          <span>/</span>
          <span>089</span>
        </div>
      </div>

      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1000&q=85" alt="Monstera Leaf">
        
        <div class="pin p1">
          <span class="pin-dot"></span>
          <span>ExG Chlorophyll: 94%</span>
        </div>

        <div class="pin p2">
          <span class="pin-dot"></span>
          <span>Stomatal Turgor: Optimal</span>
        </div>
      </div>

      <div class="card-footer-box">
        <div class="engine-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#355B46" stroke-width="2.2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
            <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
          </svg>
          <span>LOCAL INFERENCE · GEMINI NANO</span>
        </div>
        <span class="engine-status">LATENCY: 48MS</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function generate() {
  console.log('Generating project thumbnails...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // 1. Generate 3:2 Thumbnail (1200 x 800) - Devpost / Hackathon Standard
  console.log('Rendering 3:2 ratio thumbnail (1200x800)...');
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
  await page.setContent(htmlTemplate(1200, 800), { waitUntil: 'load', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath3x2 = path.resolve(process.cwd(), 'screenshots/thumbnail.png');
  const pubPath3x2 = path.resolve(process.cwd(), 'public/thumbnail.png');
  await page.screenshot({ path: outPath3x2 });
  fs.copyFileSync(outPath3x2, pubPath3x2);
  console.log('Saved 3:2 thumbnail to:', outPath3x2);

  // 2. Generate 16:9 Thumbnail (1280 x 720) - YouTube / OpenGraph / Twitter Card Standard
  console.log('Rendering 16:9 ratio thumbnail (1280x720)...');
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.setContent(htmlTemplate(1280, 720), { waitUntil: 'load', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath16x9 = path.resolve(process.cwd(), 'screenshots/thumbnail-16x9.png');
  const pubPath16x9 = path.resolve(process.cwd(), 'public/thumbnail-16x9.png');
  await page.screenshot({ path: outPath16x9 });
  fs.copyFileSync(outPath16x9, pubPath16x9);
  console.log('Saved 16:9 thumbnail to:', outPath16x9);

  await browser.close();
  console.log('All thumbnails generated successfully!');
}

generate().catch(err => {
  console.error('Thumbnail generation error:', err);
  process.exit(1);
});
