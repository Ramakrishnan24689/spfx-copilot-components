jest.mock('./visualizations/RevenueCharts', () => ({
  D3CommercialContour: () => null, D3PipelineQuality: () => null, D3RevenueMap: () => null, D3ForecastBridge: () => null
}));
jest.mock('./media', () => ({ PERSONA_MEDIA: {
  'Nestor Wilke': { src: '/portrait.jpg', alt: 'Nestor Wilke' },
  'Pradeep Gupta': { src: '/portrait.jpg', alt: 'Pradeep Gupta' },
  'Lee Gu': { src: '/portrait.jpg', alt: 'Lee Gu' },
  'Patti Fernandez': { src: '/portrait.jpg', alt: 'Patti Fernandez' },
  'Megan Bowen': { src: '/portrait.jpg', alt: 'Megan Bowen' },
  'Miriam Graham': { src: '/portrait.jpg', alt: 'Miriam Graham' },
  'Joni Sherman': { src: '/portrait.jpg', alt: 'Joni Sherman' }
} }));
import * as React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import RevenueApp, { type IModelContextSnapshot } from './RevenueApp';
import RevenueThemeProvider from './RevenueThemeProvider';
import { INTENTS, getIntent, type IRevenueProperties, type RevenueIntentKey } from './catalog';
import { initialDraft, resolveScope, workflowFor } from './operations';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const expected: Readonly<Record<RevenueIntentKey, string>> = {
  BuildAccountBrief: 'Whitespace hypothesis', QualifyOpportunity: 'Missing qualification evidence',
  MapBuyingCommittee: 'Lee Gu · Economic buyer', GetDealRisk: 'Economic buyer access missing',
  PrepareCustomerMeeting: 'Steering agenda · 30 minutes', BuildMutualActionPlan: 'Buyer accountable owner',
  ReviewMeetingCommitments: 'Proposed customer commitment', ShapeSolutionProposal: 'Requirement and proof',
  SimulateCommercialOffer: 'Subscription delivery cost 22%', ReviewDealException: 'Proposed payment days',
  InspectForecastCommit: 'Re-entry condition', ExplorePipelineQuality: 'Intervene where buyer proof',
  DiscoverAccountOpportunity: 'discovery candidates, not created leads', ResearchCompetitivePosition: 'Incumbent status · unverified',
  CoachDealStrategy: 'Counterplay · avoid premature discounting', CreateExecutiveEngagementPlan: 'Warm introduction and relationship owner',
  TrackMeetingFollowUp: 'Completion requires source evidence', BuildValueCase: 'Scenario annual benefit $714,000',
  ReviewProposalReadiness: 'Blocking gap and correction', PlanCustomerSuccessHandoff: 'First success checkpoint +30d',
  ExploreAgentCapabilities: '20 matching scenarios'
};
describe('all-intent business UX with persistent React 18 roots', () => {
  let container: HTMLDivElement;
  let root: Root;
  const publish = jest.fn<Promise<void>, [IModelContextSnapshot]>(() => Promise.resolve());
  const followUp = jest.fn<Promise<boolean>, [string]>(() => Promise.resolve(true));
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    publish.mockClear(); followUp.mockClear();
  });
  afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
  async function render(key: RevenueIntentKey, properties: IRevenueProperties = {}, displayMode = 'inline', theme = 'light'): Promise<void> {
    await act(async () => root.render(<RevenueThemeProvider theme={theme} targetDocument={document}><RevenueApp definition={getIntent(key)} properties={properties} currentUserName="Megan Bowen" displayMode={displayMode} onUpdateModelContext={publish} onSendFollowUp={followUp} /></RevenueThemeProvider>));
  }
  function button(text: string): HTMLButtonElement {
    const element = Array.from(container.querySelectorAll('button')).find(item => item.textContent === text);
    if (!element) throw new Error(`Missing button: ${text}`);
    return element;
  }
  async function click(text: string): Promise<void> { await act(async () => button(text).click()); }
  async function set(label: string, value: string): Promise<void> {
    const element = container.querySelector(`[aria-label="${label}"]`);
    if (!(element instanceof HTMLInputElement || element instanceof HTMLSelectElement)) throw new Error(`Missing input ${label}`);
    await act(async () => {
      if (element instanceof HTMLInputElement) Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(element, value);
      else element.value = value;
      element.dispatchEvent(new Event(element instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
    });
  }
  const latest = (): IModelContextSnapshot => publish.mock.calls[publish.mock.calls.length - 1][0];

  test.each(INTENTS)('$key exposes actual distinct business content and committed model context', async definition => {
    await render(definition.key);
    expect(container.textContent).toContain(expected[definition.key]);
    expect(container.textContent).not.toContain('3 verified sources');
    expect(latest().intent).toBe(definition.key);
    expect(latest().workflowStage).toBe(definition.operation === 'review' || definition.operation === 'submit' ? 'draft' : 'analysis');
  });
  test.each(INTENTS.filter(item => item.operation === 'review' || item.operation === 'submit'))('$key reviews actual edited values, explicitly confirms, receipts and resets', async definition => {
    await render(definition.key);
    const workflow = workflowFor(definition.key, resolveScope({}));
    if (!workflow) throw new Error('Missing workflow');
    const editable = workflow.fields.find(item => !item.options && !item.numeric);
    if (!editable) throw new Error('Missing business input');
    await set(editable.label, 'Reviewed business value');
    await click('Review draft');
    expect(container.textContent).toContain('Reviewed business value');
    const confirm = `Confirm session ${definition.operation === 'review' ? 'decision' : 'draft'}`;
    expect(button(confirm).disabled).toBe(true);
    expect(latest().workflowStage).toBe('review');
    await render(definition.key, {}, 'fullscreen', 'dark');
    expect(latest().workflowStage).toBe('review');
    expect(container.textContent).toContain('Reviewed business value');
    await act(async () => {
      const checkbox = container.querySelector('[aria-label="Specialist business experience"] input[type="checkbox"]');
      if (!(checkbox instanceof HTMLInputElement)) throw new Error('Missing explicit confirmation');
      checkbox.click();
    });
    expect(button(confirm).disabled).toBe(false);
    await click(confirm);
    expect(container.textContent).toContain('Session receipt ZDR-SESSION-');
    expect(container.textContent).toContain('Reviewed business value');
    expect(latest().workflowStage).toBe('receipt');
    expect(latest().draft).toEqual({ ...initialDraft(workflow), [editable.name]: 'Reviewed business value' });
    await click('Reset draft');
    expect(latest().workflowStage).toBe('draft');
    expect(latest().draft).toEqual(initialDraft(workflow));
  });
  test.each([
    ['QualifyOpportunity', 'Qualification decision', 'Pursue', 'Decline pursuit'],
    ['ReviewDealException', 'Exception decision', 'Approve exception', 'Decline exception'],
    ['InspectForecastCommit', 'Forecast recommendation', 'Retain commit', 'Remove from period'],
    ['ReviewProposalReadiness', 'Readiness decision', 'Ready for customer', 'Decline release']
  ] satisfies [RevenueIntentKey, string, string, string][])('%s blocks unauthorized positive decisions but permits decline/return', async (key, label, blocked, safe) => {
    await render(key);
    await set(label, blocked);
    expect(button('Review draft').disabled).toBe(true);
    expect(container.textContent).toContain('Missing independent buyer proof');
    await set(label, safe);
    expect(button('Review draft').disabled).toBe(false);
  });
  test('all five commercial inputs change actual calculations; validation never silently clamps', async () => {
    await render('SimulateCommercialOffer', { quantity: 100, termMonths: 12, discount: 0, services: 0, probability: 0.5 });
    expect(container.textContent).toContain('$145,000');
    expect(container.textContent).toContain('78.0%');
    await set('Contract term (months)', '36');
    expect(container.textContent).toContain('$435,000');
    await set('Licensed users', '200');
    expect(container.textContent).toContain('$870,000');
    await set('Discount percent', '20');
    expect(container.textContent).toContain('$696,000');
    expect(container.textContent).toContain('Executive committee');
    await set('Services (USD)', '100000');
    expect(container.textContent).toContain('$796,000');
    await set('Win probability (0–1)', '0.25');
    expect(container.textContent).toContain('$199,000');
    await render('SimulateCommercialOffer', { quantity: 100, termMonths: 12, discount: 0, services: 0, probability: 0.5 }, 'fullscreen', 'dark');
    expect(latest().commercial).toMatchObject({ inputs: { termMonths: '36', probability: '0.25' } });
    await set('Discount percent', '101');
    expect(container.textContent).toContain('Discount percent must be 0–100');
    expect(latest().commercial).toMatchObject({ result: null });
    await click('Reset scenario');
    expect(latest().commercial).toMatchObject({ inputs: { termMonths: '12', probability: '0.5', discount: '0' } });
  });
  test.each([
    ['BuildAccountBrief', { accountId: 'unrecognized' }],
    ['GetDealRisk', { opportunityId: 'unrecognized' }],
    ['PrepareCustomerMeeting', { meetingId: 'unrecognized' }],
    ['ReviewProposalReadiness', { proposalId: 'unrecognized' }],
    ['ReviewDealException', { exceptionId: 'unrecognized' }]
  ] satisfies [RevenueIntentKey, IRevenueProperties][])('%s publishes unknown IDs as no-match without hero UI', async (key, properties) => {
    await render(key, properties, 'fullscreen');
    expect(container.textContent).toContain('No matching business scope');
    expect(container.textContent).not.toContain('Illustrative Contoso role workspace');
    expect(latest().workflowStage).toBe('no-match');
    expect(latest().resolvedScope).toBeNull();
    expect(latest().visibleRecords).toEqual([]);
    expect(latest().selectedEntityId).toContain('unrecognized');
  });
  test('known account and related IDs resolve alternate records, and conflicting scopes stop', async () => {
    await render('BuildAccountBrief', { accountId: 'ACC-002' }, 'fullscreen');
    expect(container.textContent).toContain('Global Account 02');
    expect(container.textContent).not.toContain('Global rollout confirmed');
    await render('PrepareCustomerMeeting', { meetingId: 'MTG-2043' });
    expect(container.textContent).toContain('Global Account 02 discovery');
    expect(latest().resolvedScope).toMatchObject({ opportunityId: 'ZDR-2043' });
    await render('ReviewProposalReadiness', { proposalId: 'PROP-2043' });
    expect(container.textContent).toContain('PROP-2043');
    await render('ReviewDealException', { exceptionId: 'EX-2043' });
    expect(container.textContent).toContain('Net 90');
    await render('GetDealRisk', { accountId: 'ACC-002', opportunityId: 'ZDR-2042' });
    expect(container.textContent).toContain('Account and opportunity scopes conflict');
  });
  test('selection persists across passive renders, mode and theme; fresh property invocation resets it', async () => {
    await render('GetDealRisk', { selectedId: 'EV-03' });
    await click('Inspect EV-05');
    expect(latest().selection).toBe('EV-05');
    await render('GetDealRisk', { selectedId: 'EV-03' }, 'fullscreen', 'dark');
    expect(latest().selection).toBe('EV-05');
    expect(latest().referenceWorkspace).toMatchObject({ lens: 'deal-room', selectedEvidence: { id: 'EV-03' } });
    await act(async () => {
      const source = Array.from(container.querySelectorAll('button')).find(item => item.textContent?.indexOf('Launch date unconfirmed') === 0);
      if (!source) throw new Error('Missing reference source');
      source.click();
    });
    expect(latest().referenceWorkspace).toMatchObject({ selectedEvidence: { id: 'EV-04' } });
    await click('Revenue Command');
    expect(latest().referenceWorkspace).toMatchObject({ lens: 'revenue-command' });
    expect(latest().selection).toBe('EV-05');
    await render('GetDealRisk', { selectedId: 'unrecognized' });
    expect(container.textContent).toContain('No visible record matches unrecognized');
    expect(latest().workflowStage).toBe('no-match');
    await click('Clear selection');
    expect(latest().workflowStage).toBe('analysis');
  });
  test('filters and search change real records; filtered selections are never silently replaced', async () => {
    await render('ExplorePipelineQuality', { period: 'current', region: 'EMEA', selectedId: 'ZDR-2042' });
    const first = latest().visibleRecords;
    await set('Region', 'all');
    expect(latest().visibleRecords).not.toEqual(first);
    await set('Quarter scope', 'next');
    expect(container.textContent).toContain('No visible record matches ZDR-2042');
    expect(latest().period).toBe('next');
    await render('ExplorePipelineQuality', { period: 'invalid' });
    expect(latest().visibleRecords).toEqual([]);
    await render('DiscoverAccountOpportunity', { accountId: 'CONTOSO', period: 'all', region: 'North America' });
    expect(latest().visibleRecords).toHaveLength(2);
    await render('ExploreAgentCapabilities', { query: 'commercial' });
    expect(container.textContent).toContain('Commercial scenario');
    expect(container.textContent).not.toContain('20 matching scenarios');
    await set('Search revenue scenarios', 'no-such-scenario');
    expect(container.textContent).toContain('0 matching scenarios');
    await render('TrackMeetingFollowUp');
    await set('Commitment status', 'blocked');
    expect(latest().visibleRecords).toHaveLength(1);
    expect(container.textContent).toContain('Economic sponsor review');
  });
  test('context transport failure is visible and follow-up uses actual scope', async () => {
    publish.mockRejectedValueOnce(new Error('bridge unavailable'));
    await render('GetDealRisk', { opportunityId: 'ZDR-2043' });
    expect(container.textContent).toContain('Visible context could not be shared');
    await click('Ask Copilot about this deal');
    expect(followUp).toHaveBeenCalledWith(expect.stringContaining('Global Account 02 ZDR-2043'));
  });
  test('meeting updates require the exact supporting customer commitment', async () => {
    await render('ReviewMeetingCommitments');
    await set('Reconciliation decision', 'Accept supported commitment');
    expect(button('Review draft').disabled).toBe(false);
    await set('Proposed customer commitment', 'CFO approved funding');
    expect(button('Review draft').disabled).toBe(true);
    expect(container.textContent).toContain('no supporting transcript or email');
    await set('Reconciliation decision', 'Reject proposed update');
    expect(button('Review draft').disabled).toBe(false);
  });
  test('value sensitivity, dependency thresholds and required fields bind calculations and validation', async () => {
    await render('BuildValueCase');
    await set('Realized adoption percent', '50');
    expect(container.textContent).toContain('Scenario annual benefit $510,000');
    expect(container.textContent).toContain('12.4 months');
    await set('Annual hours saved', '0');
    expect(container.textContent).toContain('payback not reached');
    await set('Customer validation owner', '');
    expect(button('Review draft').disabled).toBe(true);
    await render('BuildMutualActionPlan');
    await set('Target signature in days', '20');
    expect(button('Review draft').disabled).toBe(true);
    await set('Target signature in days', '28');
    expect(container.textContent).toContain('dependency slack 7d');
    expect(button('Review draft').disabled).toBe(false);
  });
  test('fresh invocation resets business drafts but property order alone is passive', async () => {
    await render('BuildValueCase', { opportunityId: 'ZDR-2042', accountId: 'CONTOSO' });
    await set('Annual hours saved', '8000');
    await render('BuildValueCase', { accountId: 'CONTOSO', opportunityId: 'ZDR-2042' }, 'fullscreen', 'dark');
    expect(latest().draft).toMatchObject({ hours: '8000' });
    await render('BuildValueCase', { opportunityId: 'ZDR-2043' });
    expect(latest().draft).toMatchObject({ hours: '12000', owner: '' });
    expect(container.textContent).not.toContain('Nestor Wilke');
  });
  test('commercial empty and out-of-range values suppress results rather than showing NaN', async () => {
    await render('SimulateCommercialOffer', { termMonths: 0, probability: 72 });
    expect(latest().commercial).toMatchObject({ result: null });
    expect(container.textContent).toContain('Contract term (months) must be 1–120');
    await set('Contract term (months)', '');
    expect(container.textContent).toContain('Contract term (months) is required');
    expect(container.textContent).not.toContain('NaN');
  });
  test('unmount and fresh root discard session receipts and drafts', async () => {
    await render('ShapeSolutionProposal');
    await set('Customer outcome', 'Session-only custom outcome');
    await act(async () => root.unmount());
    root = createRoot(container);
    await render('ShapeSolutionProposal');
    expect(latest().draft).toMatchObject({ outcome: '18-country operating model' });
    expect(container.textContent).not.toContain('Session-only custom outcome');
  });
  test('annual ramp prompt arrays and edited schedules materially alter the actual offer', async () => {
    await render('SimulateCommercialOffer', { quantity: 100, termMonths: 36, services: 0, discount: 0, probability: 0.5, ramp: [60, 80, 100] });
    expect(container.textContent).toContain('$348,000');
    await set('Annual licensed ramp percent (comma-separated)', '100, 100, 100');
    expect(container.textContent).toContain('$435,000');
    await set('Annual licensed ramp percent (comma-separated)', '50, 100');
    expect(latest().commercial).toMatchObject({ result: null });
    await click('Reset scenario');
    expect(container.textContent).toContain('$348,000');
  });
});
