import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { visualSourceSignature } from './visual-source-signature.mjs';

const root = path.resolve(import.meta.dirname, '..');
const harness = path.join(root, 'temp', 'visual-harness');
const assets = path.join(root, 'assets');
const captures = [
  { name: 'inline-buying-committee.png', intent: 'MapBuyingCommittee', width: 760, height: 940, alt: 'Inline buying committee influence orbit with customer authority, stance, relationship strength, and evidence' },
  { name: 'inline-mutual-action-plan.png', intent: 'BuildMutualActionPlan', width: 760, height: 940, alt: 'Inline mutual action plan with buyer and seller commitments, critical path, owners, and credible close range' },
  { name: 'inline-commercial-scenario.png', intent: 'SimulateCommercialOffer', width: 760, height: 980, alt: 'Inline commercial scenario studio with editable inputs, margin guardrail, authority, forecast, and outcome contour' },
  { name: 'inline-global-opportunity-map.png', intent: 'DiscoverAccountOpportunity', width: 760, height: 980, alt: 'Inline D3 projected global opportunity map with regional value bubbles, slip risk, selection, and exact table values' },
  { name: 'inline-pipeline-quality.png', intent: 'ExplorePipelineQuality', width: 760, height: 940, alt: 'Inline D3 evidence-weighted pipeline chart with stage volume, buyer-proof quality, and intervention legend' },
  { name: 'inline-forecast-commit.png', intent: 'InspectForecastCommit', width: 760, height: 940, alt: 'Inline forecast review with verified buyer proof, contrary evidence, seller judgment, and critical close path' },
  { name: 'inline-capability-explorer.png', intent: 'ExploreAgentCapabilities', width: 760, height: 900, alt: 'Inline searchable Revenue Deal Room capability catalog with business outcomes and safe scenario previews' },
  { name: 'fullscreen-deal-room.png', intent: 'MapBuyingCommittee', mode: 'fullscreen', width: 1440, height: 980, alt: 'Full-screen Deal Room workspace coordinating Contoso relationship influence, evidence, and credible close range' },
  { name: 'fullscreen-commercial-desk.png', intent: 'SimulateCommercialOffer', mode: 'fullscreen', width: 1440, height: 980, alt: 'Full-screen Commercial Desk with Contoso scenario economics, adoption outcome, margin, authority, and close runway' },
  { name: 'fullscreen-revenue-command.png', intent: 'InspectForecastCommit', mode: 'fullscreen', width: 1440, height: 980, alt: 'Full-screen Revenue Command forecast review with evidence ledger, movement context, and critical milestones' },
  { name: 'fullscreen-my-deals-analytics.png', intent: 'DiscoverAccountOpportunity', mode: 'fullscreen', width: 1440, height: 980, alt: 'Full-screen My Deals dashboard with D3 projected opportunity map, evidence-weighted pipeline, and deal context' },
  { name: 'fullscreen-deal-room-mobile.png', intent: 'MapBuyingCommittee', mode: 'fullscreen', width: 390, height: 844, alt: 'Deal Room workspace adapted to a narrow mobile viewport with scrollable navigation and readable evidence' },
  { name: 'fullscreen-deal-room-dark.png', intent: 'MapBuyingCommittee', mode: 'fullscreen', theme: 'dark', width: 1440, height: 980, alt: 'Full-screen Deal Room in dark theme with accessible relationship orbit, evidence provenance, and status colors' }
];
const hash = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const server = http.createServer((request, response) => {
  const requested = new URL(request.url, 'http://localhost').pathname === '/' ? 'index.html' : new URL(request.url, 'http://localhost').pathname.slice(1);
  const file = path.resolve(harness, requested);
  if (!file.startsWith(harness) || !fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': path.extname(file) === '.js' ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({ headless: true });
const evidence = [];
try {
  for (const capture of captures) {
    const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height }, colorScheme: capture.theme === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    const query = new URLSearchParams({ intent: capture.intent });
    if (capture.mode) query.set('mode', capture.mode);
    if (capture.theme) query.set('theme', capture.theme);
    await page.goto(`http://127.0.0.1:${port}/?${query}`, { waitUntil: 'networkidle' });
    await page.locator('[data-layout]').first().waitFor();
    const metrics = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth, brokenImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length, layouts: [...document.querySelectorAll('[data-layout]')].map((element) => element.getAttribute('data-layout')) }));
    if (metrics.content > metrics.viewport) errors.push(`Horizontal overflow: ${metrics.content} > ${metrics.viewport}`);
    if (metrics.brokenImages) errors.push(`${metrics.brokenImages} broken image(s)`);
    if (errors.length) throw new Error(`${capture.name}: ${errors.join('; ')}`);
    const output = path.join(assets, capture.name);
    await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
    const bytes = fs.readFileSync(output);
    evidence.push({ ...capture, capturedWidth: bytes.readUInt32BE(16), capturedHeight: bytes.readUInt32BE(20), bytes: bytes.length, sha256: hash(bytes), layouts: metrics.layouts });
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
fs.writeFileSync(path.join(assets, 'gallery-evidence.json'), `${JSON.stringify({ schemaVersion: 1, capturedAt: new Date().toISOString(), sourceSha256: visualSourceSignature(root), totalCaptures: evidence.length, failureCount: 0, captures: evidence }, null, 2)}\n`);
console.log(`Captured ${evidence.length} visuals with zero runtime or overflow failures.`);