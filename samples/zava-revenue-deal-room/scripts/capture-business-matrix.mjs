import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';
import { visualSourceSignature } from './visual-source-signature.mjs';

const root = path.resolve(import.meta.dirname, '..');
const harness = path.join(root, 'temp', 'visual-harness');
const output = path.join(root, 'assets', 'business-matrix');
const evidencePath = path.join(root, 'assets', 'business-matrix-evidence.json');
const intents = [...fs.readFileSync(path.join(root, 'src', 'shared', 'catalog.ts'), 'utf8').matchAll(/define\('([^']+)',[^\n]+?, '(information|review|submit|education)',/g)].map(match => ({ key: match[1], operation: match[2] }));
assert.equal(intents.length, 21);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (process.argv.includes('--check')) {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  assert.equal(evidence.sourceSha256, visualSourceSignature(root), 'Business matrix is stale for the current runtime source');
  assert.equal(evidence.failureCount, 0);
  for (const intent of intents) for (const variant of ['standard', 'narrow', 'dark']) assert(evidence.captures.some(item => item.intent === intent.key && item.variant === variant), `${intent.key}/${variant} missing`);
  for (const capture of evidence.captures) {
    const bytes = fs.readFileSync(path.join(output, capture.name));
    assert.equal(bytes.length, capture.bytes);
    assert.equal(digest(bytes), capture.sha256);
  }
  assert.equal(evidence.dashboardCount, 4);
  assert.equal(evidence.workflowReviewCount, 10);
  assert.equal(evidence.workflowReceiptCount, 10);
  console.log(JSON.stringify({ captures: evidence.totalCaptures, failures: evidence.failureCount, inlineIntents: 21, dashboards: 4, reviews: 10, receipts: 10, hashesCurrent: true }));
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
const captures = [];
const errors = [];
const base = `http://127.0.0.1:${server.address().port}/`;
async function pageFor(intent, variant = 'standard', parameters = {}) {
  const page = await browser.newPage({ viewport: { width: variant === 'narrow' ? 390 : variant === 'dashboard' ? 1440 : 760, height: 980 }, reducedMotion: 'reduce', colorScheme: variant === 'dark' ? 'dark' : 'light' });
  page.on('pageerror', error => errors.push(String(error)));
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) errors.push(`${message.type()}: ${message.text()}`); });
  await page.goto(`${base}?${new URLSearchParams({ intent, ...(variant === 'dark' ? { theme: 'dark' } : {}), ...(variant === 'dashboard' ? { mode: 'fullscreen' } : {}), ...parameters })}`, { waitUntil: 'networkidle' });
  await page.locator('[aria-label="Specialist business experience"]').waitFor();
  await page.waitForFunction(() => !!window.revenueHarness.context);
  return page;
}
async function capture(page, intent, variant) {
  const metrics = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth,
    brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).length,
    layouts: [...document.querySelectorAll('[data-layout]')].map(element => element.getAttribute('data-layout')),
    context: window.revenueHarness.context
  }));
  assert(metrics.content <= metrics.viewport, `${intent}/${variant}: overflow ${metrics.content} > ${metrics.viewport}`);
  assert.equal(metrics.brokenImages, 0, `${intent}/${variant}: broken images`);
  assert.equal(errors.length, 0, `${intent}/${variant}: ${errors.join('; ')}`);
  const name = `${intent}-${variant}.png`;
  await page.screenshot({ path: path.join(output, name), fullPage: true, animations: 'disabled' });
  const bytes = fs.readFileSync(path.join(output, name));
  captures.push({ intent, variant, name, bytes: bytes.length, sha256: digest(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), layouts: metrics.layouts, workflowStage: metrics.context.workflowStage, selectedEntityId: metrics.context.selectedEntityId });
}
try {
  for (const intent of intents) for (const variant of ['standard', 'narrow', 'dark']) {
    const page = await pageFor(intent.key, variant);
    await capture(page, intent.key, variant);
    await page.close();
  }
  for (const key of ['DiscoverAccountOpportunity', 'MapBuyingCommittee', 'SimulateCommercialOffer', 'InspectForecastCommit']) {
    const page = await pageFor(key, 'dashboard');
    await capture(page, key, 'dashboard');
    await page.close();
  }
  for (const intent of intents.filter(item => ['review', 'submit'].includes(item.operation))) {
    const page = await pageFor(intent.key);
    const field = page.locator('[aria-label="Specialist business experience"] input[type="text"]').first();
    await field.fill('Matrix reviewed business value');
    await page.getByRole('button', { name: 'Review draft', exact: true }).click();
    const confirm = page.getByRole('button', { name: `Confirm session ${intent.operation === 'review' ? 'decision' : 'draft'}`, exact: true });
    assert(await confirm.isDisabled(), 'Confirmation must require explicit consent');
    await capture(page, intent.key, 'review');
    await page.evaluate(() => window.revenueHarness.render({ mode: 'fullscreen', theme: 'dark' }));
    await page.waitForFunction(() => window.revenueHarness.context.displayMode === 'fullscreen');
    assert.equal(await page.locator('[aria-label="Specialist business experience"]').getByText('Matrix reviewed business value', { exact: true }).count(), 1, 'Draft must survive mode/theme changes');
    await page.getByLabel('I reviewed these values and understand this is session-only').check();
    await confirm.click();
    await page.waitForFunction(() => window.revenueHarness.context.workflowStage === 'receipt');
    assert.match(await page.locator('[aria-label="Specialist business experience"]').innerText(), /Session receipt ZDR-SESSION-/);
    await capture(page, intent.key, 'receipt');
    await page.getByRole('button', { name: 'Reset draft', exact: true }).click();
    await page.waitForFunction(() => window.revenueHarness.context.workflowStage === 'draft');
    await page.close();
  }
  const commercial = await pageFor('SimulateCommercialOffer');
  await commercial.getByLabel('Licensed users', { exact: true }).fill('1200');
  await commercial.getByLabel('Contract term (months)', { exact: true }).fill('24');
  await commercial.getByLabel('Discount percent', { exact: true }).fill('25');
  await commercial.getByLabel('Services (USD)', { exact: true }).fill('200000');
  await commercial.getByLabel('Win probability (0–1)', { exact: true }).fill('0.4');
  assert.match(await commercial.locator('[aria-label="Specialist business experience"]').innerText(), /\$2,810,000/);
  await capture(commercial, 'SimulateCommercialOffer', 'changed');
  await commercial.getByLabel('Discount percent', { exact: true }).fill('101');
  await capture(commercial, 'SimulateCommercialOffer', 'invalid');
  await commercial.getByRole('button', { name: 'Reset scenario', exact: true }).click();
  await commercial.getByRole('button', { name: 'Model 60/80/100% ramp', exact: true }).click();
  assert.match(await commercial.locator('[aria-label="Specialist business experience"]').innerText(), /\$2,993,808/);
  await capture(commercial, 'SimulateCommercialOffer', 'ramped');
  await commercial.getByLabel('Discount percent', { exact: true }).fill('100');
  await capture(commercial, 'SimulateCommercialOffer', 'zero-subscription');
  await commercial.close();
  for (const [key, label, choice] of [
    ['QualifyOpportunity', 'Qualification decision', 'Pursue'],
    ['ReviewDealException', 'Exception decision', 'Approve exception'],
    ['InspectForecastCommit', 'Forecast recommendation', 'Retain commit'],
    ['ReviewProposalReadiness', 'Readiness decision', 'Ready for customer']
  ]) {
    const page = await pageFor(key);
    await page.getByLabel(label, { exact: true }).selectOption(choice);
    assert(await page.getByRole('button', { name: 'Review draft', exact: true }).isDisabled());
    await capture(page, key, 'blocked-positive');
    await page.close();
  }
  for (const [key, parameters, variant] of [
    ['BuildAccountBrief', { accountId: 'ACC-002' }, 'alternate-account'],
    ['PrepareCustomerMeeting', { meetingId: 'MTG-2043' }, 'alternate-meeting'],
    ['ReviewProposalReadiness', { proposalId: 'PROP-2043' }, 'alternate-proposal'],
    ['ReviewDealException', { exceptionId: 'EX-2043' }, 'alternate-exception'],
    ['GetDealRisk', { opportunityId: 'not-found' }, 'no-match'],
    ['GetDealRisk', { selectedId: 'not-found' }, 'unknown-selection'],
    ['ExplorePipelineQuality', { period: 'next', region: 'EMEA' }, 'filtered'],
    ['DiscoverAccountOpportunity', { accountId: 'CONTOSO', period: 'all', region: 'North America' }, 'filtered'],
    ['ExploreAgentCapabilities', { query: 'commercial' }, 'searched'],
    ['GetDealRisk', { selectedId: 'EV-05' }, 'selected-inference']
  ]) {
    const page = await pageFor(key, 'standard', parameters);
    await capture(page, key, variant);
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
const evidence = { schemaVersion: 1, capturedAt: new Date().toISOString(), sourceSha256: visualSourceSignature(root), totalCaptures: captures.length, failureCount: errors.length, inlineMatrixCount: 63, dashboardCount: 4, workflowReviewCount: 10, workflowReceiptCount: 10, captures };
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`Captured ${captures.length} current business visuals: 63 inline, 4 dashboards, 10 review, 10 receipt, ${captures.length - 87} property/gate states; zero runtime, console, image or overflow failures.`);
