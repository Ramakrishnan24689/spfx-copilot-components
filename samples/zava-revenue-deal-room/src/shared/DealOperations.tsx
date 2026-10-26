import * as React from 'react';
import { Badge, Button, Checkbox, Field, Input, ProgressBar, Select, Textarea, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { Add20Regular, ArrowRight20Regular, CheckmarkCircle20Regular, ShieldCheckmark20Regular } from '@fluentui/react-icons';
import { ACCOUNTS } from './domain';
import { PERSONA_MEDIA } from './media';
import { currency } from './operations';
import {
  APPROVAL_ROLES, REVIEWERS, approvalRoute, dealDraftErrors, dealEconomics, decisionErrors,
  getDealStore, newDealDraft, nextApproval, type ApprovalRole, type DealDraft, type DealEvent, type DealStore
} from './dealWorkflow';

const useStyles = makeStyles({
  root: { minWidth: 0, marginTop: tokens.spacingVerticalL },
  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalM, flexWrap: 'wrap', marginBottom: tokens.spacingVerticalL },
  title: { margin: '4px 0', fontSize: tokens.fontSizeBase600, lineHeight: tokens.lineHeightBase600, letterSpacing: '-0.4px' },
  eyebrow: { fontSize: tokens.fontSizeBase100, fontWeight: tokens.fontWeightSemibold, letterSpacing: '1.3px', color: tokens.colorBrandForeground1 },
  muted: { margin: '6px 0', color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 },
  actions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center' },
  split: { display: 'grid', alignItems: 'start', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(240px, .85fr)', gap: tokens.spacingHorizontalXL, '@media(max-width: 980px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  reviewSplit: { gridTemplateColumns: 'minmax(260px, .8fr) minmax(0, 1.2fr)', '@media(max-width: 980px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  panel: { minWidth: 0, padding: tokens.spacingVerticalXL, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusLarge, backgroundColor: tokens.colorNeutralBackground1 },
  summary: { backgroundImage: `linear-gradient(145deg, ${tokens.colorBrandBackground2}, ${tokens.colorNeutralBackground1})`, alignSelf: 'start' },
  form: { display: 'grid', gap: tokens.spacingVerticalL, marginTop: tokens.spacingVerticalXL },
  fields: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: tokens.spacingHorizontalL, '@media(max-width: 520px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalM },
  step: { display: 'flex', gap: tokens.spacingHorizontalXS, alignItems: 'center', fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground3 },
  activeStep: { color: tokens.colorBrandForeground1, fontWeight: tokens.fontWeightSemibold },
  value: { display: 'block', fontSize: tokens.fontSizeHero800, lineHeight: tokens.lineHeightHero800, fontWeight: tokens.fontWeightSemibold, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px', margin: '8px 0 20px' },
  facts: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '12px', '& dt': { color: tokens.colorNeutralForeground2 }, '& dd': { margin: 0, textAlign: 'right', fontWeight: tokens.fontWeightSemibold, overflowWrap: 'anywhere' } },
  route: { display: 'grid', gap: tokens.spacingVerticalM, marginTop: tokens.spacingVerticalL },
  person: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, minWidth: 0 },
  portrait: { width: '32px', height: '32px', objectFit: 'cover', borderRadius: tokens.borderRadiusCircular },
  routeText: { minWidth: 0, '& strong': { display: 'block' }, '& small': { color: tokens.colorNeutralForeground2 } },
  queue: { display: 'grid', gap: tokens.spacingVerticalS, marginTop: tokens.spacingVerticalL },
  queueRow: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: tokens.spacingHorizontalM, width: '100%', padding: tokens.spacingVerticalL, textAlign: 'left', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, cursor: 'pointer', '&:hover': { backgroundColor: tokens.colorNeutralBackground1Hover }, '&:focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '2px' } },
  selected: { border: `1px solid ${tokens.colorBrandStroke1}`, boxShadow: `inset 4px 0 0 ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorBrandBackground2 },
  status: { display: 'grid', gap: tokens.spacingVerticalS, justifyItems: 'end', alignContent: 'center' },
  divider: { borderTop: `1px solid ${tokens.colorNeutralStroke2}`, marginTop: tokens.spacingVerticalL, paddingTop: tokens.spacingVerticalL },
  error: { color: tokens.colorPaletteRedForeground1 },
  receipt: { padding: tokens.spacingVerticalL, border: `1px solid ${tokens.colorPaletteGreenBorder1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorPaletteGreenBackground1, color: tokens.colorNeutralForeground1, marginBottom: tokens.spacingVerticalL },
  receiptNegative: { border: `1px solid ${tokens.colorPaletteRedBorder1}`, backgroundColor: tokens.colorPaletteRedBackground1 },
  audit: { display: 'grid', gap: tokens.spacingVerticalM, padding: 0, listStyleType: 'none' },
  auditRow: { borderLeft: `2px solid ${tokens.colorBrandStroke2}`, paddingLeft: tokens.spacingHorizontalM },
  wide: { overflowWrap: 'anywhere' }
});
const statusColor = (status: string): 'success' | 'warning' | 'danger' => status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'danger';

export interface IDealOperationsProps {
  readonly mode: 'seller' | 'reviewer';
  readonly store?: DealStore;
  readonly session: ReturnType<typeof useDealOperationsSession>;
  readonly onStateChange: (state: Readonly<Record<string, unknown>>) => void;
}
export function useDealOperationsSession(): {
  view: 'queue' | 'intake'; setView: React.Dispatch<React.SetStateAction<'queue' | 'intake'>>;
  draft: DealDraft; setDraft: React.Dispatch<React.SetStateAction<DealDraft>>;
  step: number; setStep: React.Dispatch<React.SetStateAction<number>>;
  selectedId: string; setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  filter: string; setFilter: React.Dispatch<React.SetStateAction<string>>;
  role: ApprovalRole; setRole: React.Dispatch<React.SetStateAction<ApprovalRole>>;
  decision: DealEvent['decision']; setDecision: React.Dispatch<React.SetStateAction<DealEvent['decision']>>;
  rationale: string; setRationale: React.Dispatch<React.SetStateAction<string>>;
  confirmed: boolean; setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  receiptId: string; setReceiptId: React.Dispatch<React.SetStateAction<string>>;
  error: string; setError: React.Dispatch<React.SetStateAction<string>>;
  resetRequested: boolean; setResetRequested: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const [view, setView] = React.useState<'queue' | 'intake'>('queue');
  const [draft, setDraft] = React.useState(newDealDraft);
  const [step, setStep] = React.useState(0);
  const [selectedId, setSelectedId] = React.useState('ZM-1001');
  const [filter, setFilter] = React.useState('pending');
  const [role, setRole] = React.useState<ApprovalRole>('Commercial director');
  const [decision, setDecision] = React.useState<DealEvent['decision']>('approved');
  const [rationale, setRationale] = React.useState('');
  const [confirmed, setConfirmed] = React.useState(false);
  const [receiptId, setReceiptId] = React.useState('');
  const [error, setError] = React.useState('');
  const [resetRequested, setResetRequested] = React.useState(false);
  return { view, setView, draft, setDraft, step, setStep, selectedId, setSelectedId, filter, setFilter, role, setRole, decision, setDecision, rationale, setRationale, confirmed, setConfirmed, receiptId, setReceiptId, error, setError, resetRequested, setResetRequested };
}
export default function DealOperations(props: IDealOperationsProps): React.ReactElement {
  const styles = useStyles();
  const store = React.useMemo(() => props.store || getDealStore(), [props.store]);
  const snapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const { view, setView, draft, setDraft, step, setStep, selectedId, setSelectedId, filter, setFilter, role, setRole, decision, setDecision, rationale, setRationale, confirmed, setConfirmed, receiptId, setReceiptId, error, setError, resetRequested, setResetRequested } = props.session;
  const errors = dealDraftErrors(draft);
  const selected = snapshot.requests.find(request => request.id === selectedId);
  const visible = snapshot.requests.filter(request => filter === 'all' || request.status === filter);
  const economics = !errors.length ? dealEconomics(draft) : undefined;
  const account = ACCOUNTS.find(item => item.id === draft.accountId);
  const reviewErrors = selected ? decisionErrors(selected, role, decision, rationale) : ['Select a request to review.'];
  const state = JSON.stringify({
    view: `deal-${view}`, stage: view === 'intake' ? step === 3 ? 'review' : 'draft' : receiptId ? 'receipt' : 'queue',
    mode: props.mode, filter, selectedId, visibleRequests: visible.map(item => ({ id: item.id, title: item.draft.title, status: item.status, nextApprover: nextApproval(item) })),
    draft: view === 'intake' ? draft : undefined, reviewerRole: role, decision, rationale, confirmed, receiptId,
    validationErrors: view === 'intake' ? errors : reviewErrors, semantics: 'Simulated demo roles and approvals. No CRM or forecast writes.'
  });
  React.useEffect(() => { props.onStateChange(JSON.parse(state)); }, [state, props.onStateChange]);
  function update<K extends keyof DealDraft>(key: K, value: DealDraft[K]): void {
    setDraft(current => ({ ...current, [key]: value })); setConfirmed(false); setError('');
  }
  function selectRequest(id: string): void {
    setSelectedId(id); setConfirmed(false); setRationale(''); setReceiptId(''); setError('');
  }
  function submit(): void {
    try {
      const request = store.submit(draft, confirmed);
      setSelectedId(request.id); setReceiptId(request.id); setView('queue'); setFilter('all'); setConfirmed(false); setRationale('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The demo request could not be submitted.'); }
  }
  function decide(): void {
    try {
      const request = store.decide(selectedId, role, decision, rationale, confirmed);
      setReceiptId(request.id); setConfirmed(false);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The demo decision could not be recorded.'); }
  }
  function person(name: string, detail: string): React.ReactElement {
    const portrait = PERSONA_MEDIA[name];
    return <span className={styles.person}>{portrait && <img className={styles.portrait} src={portrait.src} alt={portrait.alt} />}<span className={styles.routeText}><strong>{name}</strong><small>{detail}</small></span></span>;
  }
  function summary(values: DealDraft): React.ReactElement {
    const result = dealEconomics(values);
    return <dl className={styles.facts}>
      <dt>Account / region</dt><dd>{ACCOUNTS.find(item => item.id === values.accountId)?.name} / {ACCOUNTS.find(item => item.id === values.accountId)?.region}</dd>
      <dt>Licensed users / term</dt><dd>{values.quantity} / {values.termMonths} months</dd>
      <dt>Discount / services</dt><dd>{values.discount}% / {currency(Number(values.services))}</dd>
      <dt>Seller probability</dt><dd>{(Number(values.probability) * 100).toFixed(0)}%</dd>
      <dt>Contract value (calculated)</dt><dd>{currency(result.contractValue)}</dd>
      <dt>ARR (calculated)</dt><dd>{currency(result.arr)}</dd>
      <dt>Gross margin (calculated)</dt><dd>{result.grossMargin.toFixed(1)}%</dd>
      <dt>Weighted value (calculated)</dt><dd>{currency(result.weightedForecast)}</dd>
      <dt>Requested GTM investment</dt><dd>{currency(Number(values.investment))}</dd>
      <dt>Security / sponsor attestation</dt><dd>{values.securityReady ? 'Ready' : 'Missing'} / {values.sponsorReady ? 'Ready' : 'Missing'}</dd>
    </dl>;
  }
  return <section className={styles.root} aria-label="Deal submission and approval center" data-layout={`deal-operations-${props.mode}-${view}`}>
    <div className={styles.toolbar}>
      <div><span className={styles.eyebrow}>HUMAN DECISIONS. CONNECTED EXECUTION.</span><h2 className={styles.title}>{view === 'intake' ? 'Shape your next growth deal' : props.mode === 'seller' ? 'From opportunity to approved deal' : 'Commercial approval center'}</h2><p className={styles.muted}>Submit with confidence. Review the evidence. Keep every decision traceable.</p></div>
      <div className={styles.actions}>
        <Badge appearance="tint">Demo workspace</Badge>
        {view === 'queue' ? <Button appearance="primary" icon={<Add20Regular />} onClick={() => { setView('intake'); setDraft(newDealDraft()); setStep(0); setConfirmed(false); setError(''); setReceiptId(''); }}>Submit a deal</Button> : <Button onClick={() => { setView('queue'); setConfirmed(false); }}>Back to requests</Button>}
      </div>
    </div>
    {snapshot.storageWarning && <p role="alert">{snapshot.storageWarning}</p>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {receiptId && selected && <div role="status" className={mergeClasses(styles.receipt, (selected.status === 'returned' || selected.status === 'rejected') && styles.receiptNegative)}>
      <CheckmarkCircle20Regular /> <strong>Demo receipt {selected.events.length ? `${receiptId}-A${selected.events.length}` : `${receiptId}-SUBMIT`}</strong>
      <p>{selected.draft.title} · {currency(dealEconomics(selected.draft).contractValue)} · {selected.status}. {nextApproval(selected) ? `Next: ${nextApproval(selected)} review.` : selected.status === 'returned' ? 'Next: revise the request and resubmit with the missing evidence.' : selected.status === 'rejected' ? 'Request closed in the demo. A new request requires a new review.' : 'Demo approval complete. Prepare the handoff; this is not delivery authorization.'}</p>
      <p>{selected.events.length ? `${selected.events[selected.events.length - 1].actor} · ${selected.events[selected.events.length - 1].timestamp}` : `${selected.draft.owner} · ${selected.submittedAt}`} · Session only. No quote, CRM record or forecast was changed.</p>
    </div>}
    {view === 'intake' ? <div className={styles.split}>
      <div className={styles.panel}>
        <div className={styles.steps}>{['01  Deal story', '02  Commercials', '03  Evidence & review'].map((label, index) => <span className={mergeClasses(styles.step, Math.min(step, 2) === index && styles.activeStep)} key={label} aria-current={Math.min(step, 2) === index ? 'step' : undefined}>{label}</span>)}</div>
        <ProgressBar value={(Math.min(step, 2) + 1) / 3} aria-label="Deal submission progress" />
        <div className={styles.form}>
          {step === 0 && <>
            <Field label="Account" required><Select value={draft.accountId} onChange={event => update('accountId', event.target.value)}>{ACCOUNTS.map(item => <option key={item.id} value={item.id}>{item.name} / {item.region}</option>)}</Select></Field>
            <Field label="Deal name (5-120 characters)" required><Input value={draft.title} maxLength={120} onChange={(_, data) => update('title', data.value)} /></Field>
            <Field label="Business outcome (20-1,000 characters)" required><Textarea resize="vertical" value={draft.outcome} maxLength={1000} onChange={(_, data) => update('outcome', data.value)} /></Field>
            {person(draft.owner, `Demo submitter · ${account?.region || 'Choose an account'}`)}
          </>}
          {step === 1 && <div className={styles.fields}>{([
            ['quantity', 'Licensed users', 1, 100000, 1], ['termMonths', 'Contract months', 1, 120, 1],
            ['discount', 'Discount percent', 0, 100, 0.1], ['services', 'Services (USD)', 0, 100000000, 1000],
            ['probability', 'Seller probability (0-1)', 0, 1, 0.01], ['investment', 'GTM investment requested (USD)', 1, 100000000, 1000]
          ] as const).map(([key, label, minimum, maximum, increment]) => <Field label={label} required key={key}><Input type="number" min={minimum} max={maximum} step={increment} value={draft[key]} onChange={(_, data) => update(key, data.value)} /></Field>)}</div>}
          {step === 2 && <>
            <h3>Evidence before authority</h3><p className={styles.muted}>These are explicit sample attestations, not verified external evidence. Missing evidence permits submission but blocks approval.</p>
            <Checkbox checked={draft.securityReady} onChange={(_, data) => update('securityReady', data.checked === true)} label="Security review evidence is ready (sample attestation)" />
            <Checkbox checked={draft.sponsorReady} onChange={(_, data) => update('sponsorReady', data.checked === true)} label="Economic sponsor evidence is ready (sample attestation)" />
          </>}
          {step === 3 && <><h3>Review the exact request</h3><strong>{draft.title}</strong><p className={styles.wide}>{draft.outcome}</p>{summary(draft)}<Checkbox checked={confirmed} onChange={(_, data) => setConfirmed(data.checked === true)} label="I reviewed this request and confirm a demo-only submission" /></>}
          {!!errors.length && <div role="alert" className={styles.error}>{errors.map(message => <p key={message}>{message}</p>)}</div>}
          <div className={styles.actions}>
            {step > 0 && <Button onClick={() => { setStep(step - 1); setConfirmed(false); }}>{step === 3 ? 'Edit evidence' : 'Previous step'}</Button>}
            {step < 2 && <Button appearance="primary" icon={<ArrowRight20Regular />} onClick={() => setStep(step + 1)}>Continue</Button>}
            {step === 2 && <Button appearance="primary" disabled={!!errors.length} onClick={() => { setStep(3); setConfirmed(false); }}>Review deal request</Button>}
            {step === 3 && <Button appearance="primary" disabled={!confirmed || !!errors.length} onClick={submit}>Submit demo deal</Button>}
          </div>
        </div>
      </div>
      <aside className={mergeClasses(styles.panel, styles.summary)} aria-label="Live commercial summary">
        <span className={styles.eyebrow}>SCENARIO / NOT APPLIED</span><h3>Every term has an impact.</h3>
        {economics ? <><span className={styles.muted}>Calculated contract value</span><strong className={styles.value}>{currency(economics.contractValue)}</strong><Badge color={economics.grossMargin >= 68 ? 'success' : 'danger'}>{economics.grossMargin.toFixed(1)}% gross margin / 68% guardrail</Badge><p className={styles.muted}>{currency(economics.arr)} ARR · {currency(economics.weightedForecast)} seller-weighted value</p></> : <p role="status">Resolve the visible validation errors to calculate economics.</p>}
        <p className={styles.muted}>$1,450 per licensed user/year; subscription delivery cost 22% of list; services delivery cost 62%. No phased ramp in this intake.</p>
        <h3 className={styles.divider}>Your approval path</h3>
        {economics && <div className={styles.route}>{approvalRoute(draft).map((stage, index) => <div key={stage}>{person(REVIEWERS[stage], `${index + 1}. ${stage}`)}</div>)}</div>}
        <p className={styles.muted}><ShieldCheckmark20Regular /> Independent review, explicit consent and a recorded rationale at every stage.</p>
      </aside>
    </div> : <div className={mergeClasses(styles.split, styles.reviewSplit)}>
      <section className={styles.panel} aria-label="Canonical demo request queue">
        <div className={styles.toolbar}><h3>Request inbox <Badge>{visible.length}</Badge></h3><Field label="Request status"><Select value={filter} onChange={event => setFilter(event.target.value)}>{['pending', 'approved', 'returned', 'rejected', 'all'].map(value => <option key={value} value={value}>{value === 'all' ? 'All requests' : value.charAt(0).toUpperCase() + value.slice(1)}</option>)}</Select></Field></div>
        <div className={styles.queue}>{visible.map(request => <button type="button" key={request.id} className={mergeClasses(styles.queueRow, selectedId === request.id && styles.selected)} aria-pressed={selectedId === request.id} onClick={() => selectRequest(request.id)}>
          <span><strong>{request.draft.title}</strong><p className={styles.muted}>{request.id} / {ACCOUNTS.find(item => item.id === request.draft.accountId)?.region}</p>{person(request.draft.owner, nextApproval(request) ? `Awaiting ${nextApproval(request)}` : 'Decision recorded')}</span>
          <span className={styles.status}><strong>{currency(dealEconomics(request.draft).contractValue)}</strong><Badge color={statusColor(request.status)}>{request.status}</Badge></span>
        </button>)}</div>
        {!visible.length && <p role="status">No {filter} requests. Change the filter or submit a new demo deal.</p>}
        <div className={styles.divider}><Button appearance="subtle" onClick={() => setResetRequested(!resetRequested)}>Reset demo data</Button>{resetRequested && <div><p>Remove confirmed demo submissions and decisions and restore the two sample requests?</p><Button onClick={() => { store.reset(); selectRequest('ZM-1001'); setFilter('pending'); setResetRequested(false); }}>Confirm reset of demo data</Button></div>}</div>
      </section>
      <section className={styles.panel} aria-label="Selected deal review">
        {selected ? <>
          <div className={styles.toolbar}><span className={styles.eyebrow}>{selected.id} / EVIDENCE & AUTHORITY</span><Badge color={statusColor(selected.status)}>{selected.status}</Badge></div>
          <h3>{selected.draft.title}</h3><p className={styles.muted}>{selected.draft.outcome}</p>{summary(selected.draft)}
          <div className={styles.route}>{approvalRoute(selected.draft).map(stage => <div key={stage}>{person(REVIEWERS[stage], `${stage} / ${selected.events.some(event => event.role === stage && event.decision === 'approved') ? 'approved' : nextApproval(selected) === stage ? 'awaiting review' : 'not reached'}`)}</div>)}</div>
          {selected.status === 'pending' && <div className={styles.form}>
            <div className={styles.fields}>
              <Field label="Simulated reviewer role"><Select value={role} onChange={event => { const value = APPROVAL_ROLES.find(item => item === event.target.value); if (value) setRole(value); setConfirmed(false); setReceiptId(''); }}>{APPROVAL_ROLES.map(value => <option key={value}>{value}</option>)}</Select></Field>
              <Field label="Proposed decision"><Select value={decision} onChange={event => { const value = event.target.value; if (value === 'approved' || value === 'returned' || value === 'rejected') setDecision(value); setConfirmed(false); setReceiptId(''); }}><option value="approved">Approve this stage</option><option value="returned">Return for changes</option><option value="rejected">Reject request</option></Select></Field>
            </div>
            <p className={styles.muted}>Demo role switching is not authentication or delegated authority.</p>
            <Field label="Decision rationale (15-1,000 characters)" required><Textarea value={rationale} maxLength={1000} onChange={(_, data) => { setRationale(data.value); setConfirmed(false); }} /></Field>
            {!!reviewErrors.length && <div role="alert" className={styles.error}>{reviewErrors.map(message => <p key={message}>{message}</p>)}</div>}
            <Checkbox label="I reviewed the evidence and confirm this simulated decision" checked={confirmed} onChange={(_, data) => setConfirmed(data.checked === true)} />
            <Button appearance="primary" disabled={!!reviewErrors.length || !confirmed} onClick={decide}>{decision === 'approved' ? 'Approve demo stage' : decision === 'returned' ? 'Return demo request' : 'Reject demo request'}</Button>
          </div>}
          {selected.status === 'returned' && <Button onClick={() => { setDraft({ ...selected.draft }); setView('intake'); setStep(0); setConfirmed(false); setReceiptId(''); }}>Create revised request</Button>}
          {!!selected.events.length && <div className={styles.divider}><h3>Decision trail</h3><ol className={styles.audit}>{selected.events.map(event => <li key={event.id} className={styles.auditRow}>{person(event.actor, `${event.role} / ${event.decision}`)}<p className={styles.wide}>{event.rationale}</p><small>{event.id} / {event.timestamp}</small></li>)}</ol></div>}
        </> : <p role="status">Select a request. No default evidence has been substituted.</p>}
      </section>
    </div>}
  </section>;
}
