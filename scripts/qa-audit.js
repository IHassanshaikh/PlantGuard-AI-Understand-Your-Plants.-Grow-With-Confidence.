import fs from 'fs';
import http from 'http';

console.log('--- STARTING PLANTGUARD AI QA AUDIT ---');

// 1. Static Asset Validation
const publicFiles = ['robots.txt', 'sitemap.xml', 'manifest.json', 'favicon.svg', 'logo.svg'];
publicFiles.forEach(file => {
  const exists = fs.existsSync('./public/' + file);
  const size = exists ? fs.statSync('./public/' + file).size : 0;
  console.log(`Public asset: ${file} -> ${exists ? 'EXISTS (' + size + ' bytes)' : 'MISSING'}`);
  if (!exists || size === 0) process.exit(1);
});

// 2. HTML Markup & AEO Schemas Validation
const indexHtml = fs.readFileSync('./index.html', 'utf8');
const checks = [
  { name: 'DOCTYPE html', check: indexHtml.includes('<!doctype html>') },
  { name: 'Title Tag', check: indexHtml.includes('<title>PlantGuard AI') },
  { name: 'Botanical Keywords Meta', check: indexHtml.includes('name="keywords"') },
  { name: 'Description Meta', check: indexHtml.includes('name="description"') },
  { name: 'Open Graph Type', check: indexHtml.includes('property="og:type"') },
  { name: 'Twitter Card', check: indexHtml.includes('name="twitter:card"') },
  { name: 'Favicon SVG link', check: indexHtml.includes('href="/favicon.svg"') },
  { name: 'PWA Manifest link', check: indexHtml.includes('href="/manifest.json"') },
  { name: 'Fraunces Font', check: indexHtml.includes('family=Fraunces') },
  { name: 'DM Sans Font', check: indexHtml.includes('family=DM+Sans') },
  { name: 'IBM Plex Mono Font', check: indexHtml.includes('family=IBM+Plex+Mono') },
  { name: 'JSON-LD WebApplication', check: indexHtml.includes('"@type": "WebApplication"') },
  { name: 'JSON-LD FAQPage', check: indexHtml.includes('"@type": "FAQPage"') },
  { name: 'JSON-LD HowTo', check: indexHtml.includes('"@type": "HowTo"') },
  { name: 'Skip Link #main-content', check: indexHtml.includes('href="#main-content"') },
];

checks.forEach(c => {
  console.log(`Index.html check: ${c.name} -> ${c.check ? 'PASSED' : 'FAILED'}`);
  if (!c.check) process.exit(1);
});

// 3. Anchor Link Targets in Landing.tsx
const landingTsx = fs.readFileSync('./src/pages/Landing.tsx', 'utf8');
const anchorTargets = ['how-it-works', 'hybrid-ai', 'categories', 'faq', 'main-content'];
anchorTargets.forEach(target => {
  const hasId = landingTsx.includes(`id="${target}"`);
  console.log(`Landing anchor target [#${target}]: -> ${hasId ? 'FOUND' : 'MISSING'}`);
  if (!hasId) process.exit(1);
});

// 4. Sample Data & Stores Verification
const sampleData = fs.readFileSync('./src/services/sampleData.ts', 'utf8');
const sampleChecks = [
  { name: 'SAMPLE_SPECIMENS', check: sampleData.includes('export const SAMPLE_SPECIMENS') },
  { name: 'PLANT_LIBRARY', check: sampleData.includes('export const PLANT_LIBRARY') },
  { name: 'INITIAL_REMINDERS', check: sampleData.includes('export const INITIAL_REMINDERS') },
  { name: 'INITIAL_COMPARISONS', check: sampleData.includes('export const INITIAL_COMPARISONS') },
  { name: 'INITIAL_JOURNAL', check: sampleData.includes('export const INITIAL_JOURNAL') },
];
sampleChecks.forEach(c => {
  console.log(`Sample Data check: ${c.name} -> ${c.check ? 'PASSED' : 'FAILED'}`);
  if (!c.check) process.exit(1);
});

// 5. Database Schema & Stores Verification
const dbFile = fs.readFileSync('./src/services/db.ts', 'utf8');
const storeChecks = ['PLANTS', 'SCANS', 'JOURNAL', 'CHATS', 'SETTINGS', 'REMINDERS', 'COMPARISONS'];
storeChecks.forEach(s => {
  const hasStore = dbFile.includes(`${s}: '${s.toLowerCase()}'`);
  console.log(`IndexedDB store check [${s}]: -> ${hasStore ? 'PASSED' : 'FAILED'}`);
  if (!hasStore) process.exit(1);
});

console.log('--- ALL CODE & ASSET INTEGRITY CHECKS COMPLETED SUCCESSFULLY ---');
