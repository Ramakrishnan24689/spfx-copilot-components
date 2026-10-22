import * as React from 'react';
import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { IIntentDefinition, IProcurementProperties, ProcurementIntentKey, ProcurementLens } from './catalog';
import { getIntent, OPERATIONAL_LENSES } from './catalog';
import { DEFAULT_WEIGHTS, EVENTS, money } from './domain';
import { SupplierLandscape, ValueRiver } from './ProcurementCharts';
import { ProcurementInlineExperience, type IProcurementSnapshot } from './ProcurementInlineExperiences';
import { contracts, getReceipts, leakageOpportunities, purchaseQueue, resetProcurementSession, subscribeReceipts, supplierRecords } from './operations';

export type IModelContextSnapshot = IProcurementSnapshot;
interface IProps {
  readonly definition: IIntentDefinition;
  readonly properties: IProcurementProperties;
  readonly currentUserName: string;
  readonly displayMode?: string;
  readonly onRequestFullscreen?: () => Promise<void>;
  readonly onUpdateModelContext?: (snapshot: IModelContextSnapshot) => Promise<void>;
  readonly onSendFollowUp?: (message: string) => Promise<boolean>;
}
type OpenTask = (intent: ProcurementIntentKey, properties?: IProcurementProperties) => void;
const labels: Record<ProcurementLens, string> = {
  'my-requests': 'My Requests', sourcing: 'Sourcing Workbench', 'supplier-360': 'Supplier 360',
  'spend-command': 'Spend Command', education: 'Capabilities'
};
const useStyles = makeStyles({
  root: { minWidth: 0, color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground2, fontFamily: tokens.fontFamilyBase, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  fullscreen: { display: 'grid', gridTemplateColumns: '190px minmax(0,1fr)', '@media(max-width:760px)': { gridTemplateColumns: '1fr' } },
  nav: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px', padding: '16px', backgroundColor: tokens.colorNeutralBackground1, '@media(max-width:760px)': { flexDirection: 'row', flexWrap: 'wrap' } },
  hidden: { display: 'none' },
  main: { minWidth: 0, padding: '18px', '@media(max-width:520px)': { padding: '12px' } },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
  hero: { padding: '16px', marginTop: '12px', marginBottom: '16px', backgroundColor: tokens.colorBrandBackground2, borderLeft: `4px solid ${tokens.colorBrandStroke1}`, borderRadius: tokens.borderRadiusMedium },
  title: { margin: '4px 0', fontSize: tokens.fontSizeBase600, lineHeight: tokens.lineHeightBase600 },
  muted: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
  panel: { padding: '16px', marginBottom: '16px', minWidth: 0, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: '12px' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' },
  error: { padding: '12px', borderLeft: `3px solid ${tokens.colorPaletteRedBorderActive}` },
  field: { display: 'grid', gap: '6px', marginBottom: '12px' },
  input: { minHeight: '34px', boxSizing: 'border-box', minWidth: 0, width: '100%', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium }
});

function RequestsDashboard({ open }: { open: OpenTask }): React.ReactElement {
  const s = useStyles();
  const receipts = React.useSyncExternalStore(subscribeReceipts, getReceipts, getReceipts);
  return <section className={s.panel} aria-label="My Requests dashboard"><h2>Outcomes in motion</h2><p>Review source demand and its exact budget commitment. Session decisions remain visible.</p><div className={s.grid}>{purchaseQueue.map(request => <article className={s.panel} key={request.id}><h3>{request.id}</h3><p>{request.category} · {request.quantity} units</p><strong>{money(request.budget)}</strong><p>{receipts.some(receipt => receipt.recordId === request.id) ? 'Processed in this session' : 'Awaiting budget-owner judgment'}</p><Button onClick={() => open('ReviewPurchaseRequest', { requestId: request.id })}>Review {request.id}</Button></article>)}</div><Button onClick={() => open('CreatePurchaseIntent')}>Create a purchase intent</Button></section>;
}
function SourcingDashboard({ open }: { open: OpenTask }): React.ReactElement {
  const s = useStyles();
  const [risk, setRisk] = React.useState(20);
  const [selected, setSelected] = React.useState(supplierRecords[0].bidId);
  const supplier = supplierRecords.find(item => item.bidId === selected);
  return <section className={s.panel} aria-label="Sourcing Workbench dashboard"><h2>Total-value field · {EVENTS[0].id}</h2><p>Change risk weighting, inspect supplier evidence, and keep analysis separate from award authority.</p><label className={s.field}>Workbench risk weight: {risk}%<input aria-label="Workbench risk weight" type="range" min={5} max={45} value={risk} onChange={event => setRisk(Number(event.target.value))} /></label><SupplierLandscape weights={{ ...DEFAULT_WEIGHTS, risk, price: 48 - risk }} onSelect={setSelected} /><p>Selected evidence: {supplier?.supplier} · {supplier?.confidence}% confidence · {supplier?.lead}-day lead.</p><div className={s.actions}><Button onClick={() => open('CompareSupplierBids', { eventId: EVENTS[0].id, riskWeight: risk, supplierId: supplier?.id })}>Compare event bids</Button><Button onClick={() => open('ReviewSupplierAward', { eventId: EVENTS[0].id, splitPercent: 65 })}>Review split award</Button><Button onClick={() => open('BuildSourcingEvent')}>Draft a sourcing event</Button></div></section>;
}
function SupplierDashboard({ open }: { open: OpenTask }): React.ReactElement {
  const s = useStyles();
  const [selected, setSelected] = React.useState(supplierRecords[0].id);
  const supplier = supplierRecords.find(item => item.id === selected);
  const related = contracts.filter(contract => contract.supplierId === selected);
  return <section className={s.panel} aria-label="Supplier 360 dashboard"><h2>Obligations meet dependency</h2><label className={s.field}>Relationship supplier<select className={s.input} value={selected} onChange={event => setSelected(event.target.value)}>{supplierRecords.map(item => <option value={item.id} key={item.id}>{item.supplier}</option>)}</select></label><div className={s.grid}><article><h3>Continuity evidence</h3><p>{supplier?.supplier} · risk {supplier?.risk}/100 · {supplier?.region}</p><p>Lead {supplier?.lead} days; accepted quality {supplier?.quality}%.</p><Button onClick={() => open('TrackSupplierRisk', { supplierId: selected })}>Model supplier exposure</Button></article><article><h3>Contract notice and ownership</h3>{related.map(contract => <p key={contract.id}>{contract.id}: {contract.noticeDays}-day notice, {money(contract.annualValue)} annual baseline.</p>)}{related.length === 0 && <p>No curated renewal contract for this supplier.</p>}<Button disabled={related.length === 0} onClick={() => open('ReviewContractRenewal', { supplierId: selected, contractId: related[0]?.id })}>Review contract renewal</Button></article></div></section>;
}
function SpendDashboard({ open }: { open: OpenTask }): React.ReactElement {
  const s = useStyles();
  const [category, setCategory] = React.useState('All categories');
  const records = leakageOpportunities.filter(item => category === 'All categories' || item.category === category);
  const stages = ['identified', 'negotiated', 'contracted', 'realized'] as const;
  const values = stages.map(stage => ({ stage, value: records.reduce((sum, item) => sum + item[stage], 0) }));
  return <section className={s.panel} aria-label="Spend Command dashboard"><h2>Trace spend into verified value</h2><label className={s.field}>Spend category<select className={s.input} value={category} onChange={event => setCategory(event.target.value)}>{['All categories', ...leakageOpportunities.map(item => item.category)].map(item => <option key={item}>{item}</option>)}</select></label><ValueRiver stages={values} /><div className={s.grid}>{records.map(record => <article key={record.id}><h3>{record.label}</h3><p>{money(record.identified)} identified; {money(record.realized)} realized.</p><p>{money(record.disputed)} disputed and excluded.</p><Button onClick={() => open('TrackLeakageRecovery', { opportunityId: record.id })}>Review recovery {record.id}</Button></article>)}</div><div className={s.actions}><Button onClick={() => open('DetectSpendLeakage', { category })}>Find addressable leakage</Button><Button onClick={() => open('ExploreSpendPerformance', { category })}>Inspect realized value</Button></div></section>;
}

function Invocation(props: IProps): React.ReactElement {
  const s = useStyles();
  const full = props.displayMode === 'fullscreen';
  const [lens, setLens] = React.useState(props.definition.lens);
  const [active, setActive] = React.useState(props.definition.key);
  const [workingProperties, setWorkingProperties] = React.useState(props.properties);
  const [reset, setReset] = React.useState(0);
  const [error, setError] = React.useState('');
  const [pending, setPending] = React.useState<{ intent: ProcurementIntentKey; properties: IProcurementProperties }>();
  const initialDraft = React.useRef<string>();
  const dirty = React.useRef(false);
  const task = React.useRef<HTMLElement>(null);
  const focusTask = React.useRef(false);
  const live = React.useRef(true);
  React.useEffect(() => { live.current = true; return () => { live.current = false; }; }, []);
  const publish = React.useCallback((snapshot: IProcurementSnapshot): void => {
    if (initialDraft.current === undefined) initialDraft.current = snapshot.summary;
    dirty.current = snapshot.stage === 'review' || (snapshot.stage === 'draft' && snapshot.summary !== initialDraft.current);
    props.onUpdateModelContext?.({ ...snapshot, invokedIntent: props.definition.key, workspace: lens }).catch(reason => {
      if (live.current) setError(`Copilot context could not be updated: ${String(reason)}`);
    });
  }, [props.onUpdateModelContext, props.definition.key, lens]);
  const applyOpen: OpenTask = (intent, properties = {}) => {
    initialDraft.current = undefined;
    dirty.current = false;
    focusTask.current = true;
    setActive(intent);
    setWorkingProperties(properties);
    setLens(getIntent(intent).lens);
  };
  const open: OpenTask = (intent, properties = {}) => {
    if (dirty.current) setPending({ intent, properties });
    else applyOpen(intent, properties);
  };
  const definition = getIntent(active);
  const key = JSON.stringify([active, Object.keys(workingProperties).sort().map(name => [name, workingProperties[name as keyof IProcurementProperties]]), reset]);
  React.useEffect(() => {
    if (focusTask.current) { task.current?.focus(); focusTask.current = false; }
  }, [active, key]);
  return <div key={reset} className={mergeClasses(s.root, full ? s.fullscreen : undefined)} data-layout={full ? `${lens}-command` : `${active}-inline`}>
    <nav className={mergeClasses(s.nav, !full ? s.hidden : undefined)} aria-label="Procurement workspaces" hidden={!full}>{OPERATIONAL_LENSES.map(item => <Button key={item} appearance={lens === item ? 'primary' : 'subtle'} onClick={() => setLens(item)}>{labels[item]}</Button>)}<Button onClick={() => open('ExploreAgentCapabilities')}>Browse scenarios</Button></nav>
    <main className={s.main}>
      <div className={s.top}><strong>Zava Procurement</strong><span>{props.currentUserName}</span>{!full && props.onRequestFullscreen && <Button onClick={() => { props.onRequestFullscreen?.().catch(reason => { if (live.current) setError(`Full screen was not available: ${String(reason)}`); }); }}>Expand procurement workspace</Button>}</div>
      <header className={s.hero}><span className={s.muted}>{definition.role} · {labels[full ? lens : definition.lens]}</span><h1 className={s.title}>{full ? labels[lens] : definition.title}</h1><p>{definition.question}</p></header>
      {error && <p className={s.error} role="alert">{error}</p>}
      {full && <div>{lens === 'my-requests' ? <RequestsDashboard open={open} /> : lens === 'sourcing' ? <SourcingDashboard open={open} /> : lens === 'supplier-360' ? <SupplierDashboard open={open} /> : lens === 'spend-command' ? <SpendDashboard open={open} /> : null}</div>}
      <section ref={task} tabIndex={-1} className={s.panel} aria-label="Current procurement task">{full && <h2>Continue: {definition.title}</h2>}<ProcurementInlineExperience key={key} definition={definition} properties={workingProperties} onContext={publish} onSendFollowUp={props.onSendFollowUp} /></section>
      <div className={s.actions}><Button onClick={() => { resetProcurementSession(); applyOpen(props.definition.key, props.properties); setReset(value => value + 1); }}>Reset demo session</Button></div><p className={s.muted}>Deterministic offline evidence. Confirmations affect this browser session only.</p>
      <Dialog open={Boolean(pending)} onOpenChange={(_, data) => { if (!data.open) setPending(undefined); }}>
        <DialogSurface><DialogBody><DialogTitle>Discard unconfirmed draft?</DialogTitle><DialogContent>Your current edits have not been confirmed. Keep the draft, or explicitly discard it before opening another task.</DialogContent><DialogActions><Button onClick={() => setPending(undefined)}>Keep current draft</Button><Button appearance="primary" onClick={() => { if (pending) applyOpen(pending.intent, pending.properties); setPending(undefined); }}>Discard draft and open task</Button></DialogActions></DialogBody></DialogSurface>
      </Dialog>
    </main>
  </div>;
}
export default function ProcurementApp(props: IProps): React.ReactElement {
  const signature = JSON.stringify([props.definition.key, Object.keys(props.properties).sort().map(name => [name, props.properties[name as keyof IProcurementProperties]])]);
  return <Invocation key={signature} {...props} />;
}
