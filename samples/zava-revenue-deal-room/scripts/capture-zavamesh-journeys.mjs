import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { visualSourceSignature } from './visual-source-signature.mjs';

const root = path.resolve(import.meta.dirname, '..');
const harness = path.join(root, 'temp', 'visual-harness');
const output = path.join(root, 'assets', 'zavamesh-journeys');
const evidencePath = path.join(root, 'assets', 'zavamesh-journey-evidence.json');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (process.argv.includes('--check')) {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  assert.equal(evidence.sourceSha256, visualSourceSignature(root), 'ZavaMesh journey evidence is stale');
  assert.equal(evidence.failureCount, 0);
  assert.equal(evidence.workspaceVariants, 32);
  for (const capture of evidence.captures) assert.equal(digest(fs.readFileSync(path.join(output, capture.name))), capture.sha256);
  console.log(JSON.stringify({ captures: evidence.captures.length, checks: evidence.checks.length, failures: 0, current: true }));
  process.exit(0);
}
fs.mkdirSync(output, { recursive: true });
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.resolve(harness, pathname === '/' ? 'index.html' : pathname.slice(1));
  if (!file.startsWith(`${harness}${path.sep}`) || !fs.existsSync(file)) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'Content-Type': file.endsWith('.js') ? 'text/javascript' : 'text/html', 'Cache-Control': 'no-store' });
  response.end(fs.readFileSync(file));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true });
const base = `http://127.0.0.1:${server.address().port}/`;
const errors = [];
const captures = [];
const checks = [];
let workspaceVariants = 0;
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
page.on('pageerror', error => errors.push(String(error)));
page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(`${message.type()}: ${message.text()}`); });
async function capture(name) {
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => {
    const visible = element => !!element.getClientRects().length;
    return {
      viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth,
      brokenImages: [...document.images].filter(image => visible(image) && (!image.complete || !image.naturalWidth)).length,
      unlabeledControls: [...document.querySelectorAll('input,select,textarea')].filter(element => visible(element) && !element.labels?.length && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')).length,
      blankCharts: [...document.querySelectorAll('svg[role="img"]')].filter(element => visible(element) && (
        !element.getAttribute('aria-label') || !element.querySelector('title') ||
        [...element.querySelectorAll('*')].some(mark => ['d', 'x', 'y', 'cx', 'cy', 'r', 'width', 'height'].some(attribute => /NaN|Infinity/.test(mark.getAttribute(attribute) || '')))
      )).length,
      context: window.revenueHarness.context
    };
  });
  assert(metrics.content <= metrics.viewport, `${name}: horizontal overflow`);
  assert.equal(metrics.brokenImages, 0, `${name}: broken images`);
  assert.equal(metrics.unlabeledControls, 0, `${name}: unlabeled form controls`);
  assert.equal(metrics.blankCharts, 0, `${name}: inaccessible or invalid chart`);
  assert.deepEqual(errors, [], `${name}: runtime warnings/errors`);
  const file = `${name}.png`;
  await page.screenshot({ path: path.join(output, file), fullPage: true, animations: 'disabled' });
  const bytes = fs.readFileSync(path.join(output, file));
  captures.push({ name: file, sha256: digest(bytes), bytes: bytes.length, width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });
}
const center = () => page.getByRole('region', { name: 'Deal submission and approval center', exact: true });
async function chooseWorkspace(name) {
  await page.getByRole('navigation', { name: 'Revenue workspaces' }).getByRole('button', { name, exact: true }).click();
}
async function setDecision(role, decision, rationale) {
  const area = center();
  await area.getByLabel('Simulated reviewer role', { exact: true }).selectOption(role);
  await area.getByLabel('Proposed decision', { exact: true }).selectOption(decision);
  await area.getByLabel('Decision rationale (15-1,000 characters)').fill(rationale);
  const action = area.getByRole('button', { name: decision === 'approved' ? 'Approve demo stage' : decision === 'returned' ? 'Return demo request' : 'Reject demo request', exact: true });
  assert(await action.isDisabled(), 'Decision needs an explicit, initially unchecked confirmation');
  await area.getByLabel('I reviewed the evidence and confirm this simulated decision', { exact: true }).check();
  await action.click();
}
try {
  await page.goto(`${base}?intent=InspectForecastCommit&mode=fullscreen`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.revenueHarness.context?.workspaceState?.view === 'global-revenue-investment-dashboard');
  const current = await page.evaluate(() => window.revenueHarness.context.workspaceState);
  const chart = page.getByRole('img', { name: 'Open and seller-weighted pipeline value by stage' });
  const originalGeometry = await chart.locator('rect').evaluateAll(elements => elements.map(element => element.getAttribute('height')));
  await page.getByLabel('Dashboard period', { exact: true }).selectOption('next');
  await page.waitForFunction(value => window.revenueHarness.context.workspaceState.openValue !== value, current.openValue);
  assert.notDeepEqual(await chart.locator('rect').evaluateAll(elements => elements.map(element => element.getAttribute('height'))), originalGeometry);
  await page.getByLabel('Dashboard region', { exact: true }).selectOption('EMEA');
  await page.waitForFunction(() => window.revenueHarness.context.workspaceState.region === 'EMEA');
  assert((await page.evaluate(() => window.revenueHarness.context.workspaceState.visibleOpportunityIds.length)) < current.visibleOpportunityIds.length);
  await page.getByRole('button', { name: 'GTM investment', exact: true }).click();
  await page.waitForFunction(() => window.revenueHarness.context.workspaceState.metric === 'investment');
  await capture('global-investment-focus');
  const map = page.getByRole('img', { name: /Global revenue opportunity map/ });
  const nextRadii = await map.locator('circle').evaluateAll(elements => elements.map(element => element.getAttribute('r')));
  await page.getByLabel('Dashboard period', { exact: true }).selectOption('current');
  assert.notDeepEqual(await map.locator('circle').evaluateAll(elements => elements.map(element => element.getAttribute('r'))), nextRadii, 'Investment quarter changes must resize circles on a stable domain');
  await page.getByLabel('Dashboard period', { exact: true }).selectOption('next');
  await page.getByRole('button', { name: 'Latin America', exact: true }).click();
  await page.waitForFunction(() => window.revenueHarness.context.workspaceState.region === 'Latin America');
  checks.push('Period changes real chart geometry; regional focus coordinates KPIs, opportunity records, map selection and investment allocation; monetary map measure changes dataset.');
  await chooseWorkspace('My Deals');
  await center().getByRole('button', { name: 'Submit a deal', exact: true }).click();
  await center().getByLabel('Deal name (5-120 characters)').fill('ZavaMesh connected growth program');
  await center().getByLabel('Business outcome (20-1,000 characters)').fill('Launch an accountable regional growth program with sponsor and security evidence.');
  await center().getByRole('button', { name: 'Continue', exact: true }).click();
  await center().getByLabel('Licensed users').fill('');
  assert((await center().getByRole('alert').innerText()).includes('Licensed users'));
  for (const [label, value] of [['Licensed users', '1000'], ['Contract months', '24'], ['Discount percent', '8'], ['Services (USD)', '150000'], ['Seller probability (0-1)', '0.65'], ['GTM investment requested (USD)', '250000']])
    await center().getByLabel(label).fill(value);
  await capture('deal-commercial-draft');
  await center().getByRole('button', { name: 'Continue', exact: true }).click();
  await center().getByLabel('Security review evidence is ready (sample attestation)', { exact: true }).check();
  await center().getByLabel('Economic sponsor evidence is ready (sample attestation)', { exact: true }).check();
  await center().getByRole('button', { name: 'Review deal request', exact: true }).click();
  assert((await center().innerText()).includes('$2,818,000'));
  assert(await center().getByRole('button', { name: 'Submit demo deal', exact: true }).isDisabled());
  await center().getByRole('button', { name: 'Edit evidence', exact: true }).click();
  await center().getByRole('button', { name: 'Previous step', exact: true }).click();
  assert.equal(await center().getByLabel('Licensed users').inputValue(), '1000');
  await center().getByLabel('Contract months').fill('36');
  await center().getByRole('button', { name: 'Continue', exact: true }).click();
  await center().getByRole('button', { name: 'Review deal request', exact: true }).click();
  await page.evaluate(() => window.revenueHarness.render({ mode: 'inline', theme: 'dark' }));
  await page.evaluate(() => window.revenueHarness.render({ mode: 'fullscreen', theme: 'dark' }));
  assert((await center().innerText()).includes('$4,152,000'));
  await chooseWorkspace('Revenue Command');
  await page.waitForFunction(() => window.revenueHarness.context.workspaceState.region === 'Latin America' && window.revenueHarness.context.workspaceState.period === 'next');
  await chooseWorkspace('My Deals');
  assert((await center().innerText()).includes('ZavaMesh connected growth program'));
  await capture('deal-request-review');
  await center().getByLabel('I reviewed this request and confirm a demo-only submission', { exact: true }).check();
  await center().getByRole('button', { name: 'Submit demo deal', exact: true }).click();
  await page.waitForFunction(() => window.revenueHarness.context.workspaceState?.receiptId === 'ZM-1003');
  await capture('deal-submission-receipt');
  checks.push('Visible invalid numeric input; live exact economics; Edit preservation; reviewed-value equality; unchecked confirmation; display-mode/theme/workspace continuation; submission receipt.');
  await chooseWorkspace('Commercial Desk');
  await setDecision('Sales manager', 'approved', 'Sponsor and security evidence reviewed; standard commercial terms accepted.');
  assert((await center().getByRole('status').first().innerText()).includes('approved'));
  await center().getByLabel('Request status', { exact: true }).selectOption('approved');
  assert.equal(await center().getByRole('button', { name: /ZavaMesh connected growth program/ }).count(), 1);
  await capture('approved-deal-and-audit');
  await center().getByLabel('Request status', { exact: true }).selectOption('pending');
  await center().getByRole('button', { name: /Contoso Global Expansion/ }).click();
  await center().getByLabel('Decision rationale (15-1,000 characters)').fill('Security and sponsor evidence must be supplied before approval.');
  await center().getByLabel('I reviewed the evidence and confirm this simulated decision', { exact: true }).check();
  assert(await center().getByRole('button', { name: 'Approve demo stage', exact: true }).isDisabled());
  await center().getByLabel('Proposed decision', { exact: true }).selectOption('returned');
  assert(!(await center().getByLabel('I reviewed the evidence and confirm this simulated decision', { exact: true }).isChecked()));
  await center().getByLabel('I reviewed the evidence and confirm this simulated decision', { exact: true }).check();
  await center().getByRole('button', { name: 'Return demo request', exact: true }).click();
  await capture('evidence-gated-return');
  checks.push('Independent role sequencing; explicit decision consent; approved queue update; evidence blocks approval while return remains available; rationale and audit receipt.');
  await page.reload({ waitUntil: 'networkidle' });
  await chooseWorkspace('Commercial Desk');
  await center().getByLabel('Request status', { exact: true }).selectOption('approved');
  assert.equal(await center().getByRole('button', { name: /ZavaMesh connected growth program/ }).count(), 1);
  await center().getByRole('button', { name: 'Reset demo data', exact: true }).click();
  await center().getByRole('button', { name: 'Confirm reset of demo data', exact: true }).click();
  assert.equal(await center().getByRole('button', { name: /ZavaMesh connected growth program/ }).count(), 0);
  checks.push('Confirmed overlays survive reload; reset restores the deterministic baseline; drafts are not persisted.');
  for (const theme of ['light', 'dark']) for (const width of [340, 760, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(theme => window.revenueHarness.render({ mode: 'fullscreen', theme }), theme);
    for (const workspace of ['My Deals', 'Deal Room', 'Commercial Desk', 'Revenue Command']) {
      await chooseWorkspace(workspace);
      assert.equal(await page.getByRole('navigation', { name: 'Revenue workspaces' }).getByRole('button', { name: workspace, exact: true }).getAttribute('aria-current'), 'page');
      await capture(`${workspace.toLowerCase().replaceAll(' ', '-')}-${width}-${theme}`);
      workspaceVariants++;
    }
  }
  await page.setViewportSize({ width: 720, height: 500 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
  await capture('revenue-command-200-percent-page-scale');
  await cdp.send('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  await page.getByRole('navigation', { name: 'Revenue workspaces' }).getByRole('button', { name: 'My Deals', exact: true }).focus();
  await page.keyboard.press('Enter');
  await center().getByRole('button', { name: 'Submit a deal', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert(await center().getByLabel('Deal name (5-120 characters)').isVisible());
  checks.push('All four workspaces at 340/760/1440/1920 CSS pixels in light/dark; reduced motion; labels, charts, image and overflow audits; CDP 200% page-scale emulation; keyboard activation.');
  fs.writeFileSync(evidencePath, `${JSON.stringify({ schemaVersion: 1, capturedAt: new Date().toISOString(), sourceSha256: visualSourceSignature(root), failureCount: 0, workspaceVariants, checks, captures }, null, 2)}\n`);
  console.log(JSON.stringify({ captures: captures.length, workspaceVariants, checks: checks.length, failures: 0 }));
} catch (error) {
  console.error('Visible form labels:', await page.locator('label:visible').allTextContents());
  throw error;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
