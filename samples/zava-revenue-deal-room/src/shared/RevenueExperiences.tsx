import * as React from 'react';
import { Badge, Button, Checkbox, Input, makeStyles, tokens } from '@fluentui/react-components';
import type { IRevenueAppProps, IModelContextSnapshot } from './RevenueApp';
import { INTENTS, type RevenueIntentKey } from './catalog';
import { HERO_EVIDENCE, OPPORTUNITIES, calculateCommercialOffer, type ICommercialInput } from './domain';
import {
  analysisRows, currency, initialDraft, resolveScope, scopedEvidence, workflowCalculation,
  workflowErrors, workflowFor, type IBusinessRow
} from './operations';
import { D3CommercialContour, D3PipelineQuality, D3RevenueMap } from './visualizations/RevenueCharts';

const useStyles = makeStyles({
  root: { minWidth: 0, display: 'grid', gap: tokens.spacingVerticalM, marginTop: tokens.spacingVerticalL },
  panel: { minWidth: 0, padding: tokens.spacingVerticalL, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusLarge, backgroundImage: `linear-gradient(145deg, ${tokens.colorNeutralBackground1}, ${tokens.colorBrandBackground2})`, boxShadow: tokens.shadow8, overflowWrap: 'anywhere' },
  heading: { margin: '0 0 8px', fontSize: tokens.fontSizeBase500, lineHeight: tokens.lineHeightBase500 },
  muted: { color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: tokens.spacingHorizontalM, '@media(max-width: 520px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
  field: { display: 'flex', minWidth: 0, flexDirection: 'column', gap: tokens.spacingVerticalXS, marginBottom: tokens.spacingVerticalS },
  select: { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '8px', color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  actions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, marginTop: tokens.spacingVerticalM },
  rows: { display: 'grid', gap: tokens.spacingVerticalS, marginTop: tokens.spacingVerticalM, maxHeight: '560px', overflowY: 'auto' },
  row: { padding: tokens.spacingVerticalM, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, minWidth: 0 },
  active: { border: `2px solid ${tokens.colorBrandStroke1}`, backgroundColor: tokens.colorBrandBackground2 },
  metric: { fontSize: tokens.fontSizeBase600, fontWeight: tokens.fontWeightSemibold, margin: '8px 0' },
  detail: { margin: '8px 0', whiteSpace: 'pre-wrap' },
  error: { color: tokens.colorPaletteRedForeground1 },
  definition: { display: 'grid', gridTemplateColumns: 'minmax(100px, .6fr) minmax(0, 1fr)', gap: '8px', margin: 0, '& dd': { margin: 0 } }
});
const titles: Partial<Record<RevenueIntentKey, string>> = {
  BuildAccountBrief: 'Account change and whitespace brief', MapBuyingCommittee: 'Decision rights and relationship coverage',
  GetDealRisk: 'Ranked signature threats', PrepareCustomerMeeting: 'Meeting-specific briefing and agenda',
  TrackMeetingFollowUp: 'Evidence-backed commitment tracker', ResearchCompetitivePosition: 'Competitive evidence and proof plan',
  CoachDealStrategy: 'Explainable strategy plays'
};
const commercialDefaults: ICommercialInput = { quantity: 860, termMonths: 36, discount: 14, services: 420000, probability: 0.72 };
type CommercialNumericKey = Exclude<keyof ICommercialInput, 'ramp'>;
const commercialLabels: Readonly<Record<CommercialNumericKey, string>> = {
  quantity: 'Licensed users', termMonths: 'Contract term (months)', discount: 'Discount percent', services: 'Services (USD)', probability: 'Win probability (0–1)'
};
const commercialKeys: readonly CommercialNumericKey[] = ['quantity', 'termMonths', 'discount', 'services', 'probability'];
export function commercialErrors(input: ICommercialInput): readonly string[] {
  const bounds: Readonly<Record<CommercialNumericKey, readonly [number, number]>> = {
    quantity: [1, 100000], termMonths: [1, 120], discount: [0, 100], services: [0, 100000000], probability: [0, 1]
  };
  const errors = commercialKeys.filter(key => !Number.isFinite(input[key]) || input[key] < bounds[key][0] || input[key] > bounds[key][1] ||
    ((key === 'quantity' || key === 'termMonths') && !Number.isInteger(input[key]))).map(key => `${commercialLabels[key]} must be ${bounds[key][0]}–${bounds[key][1]}${key === 'quantity' || key === 'termMonths' ? ' (whole number)' : ''}`);
  if (input.ramp && (input.ramp.length !== Math.ceil(input.termMonths / 12) || input.ramp.some(value => !Number.isFinite(value) || value < 0 || value > 100))) errors.push('Annual licensed ramp must have one 0–100 percentage per contract year (including a partial final year)');
  return errors;
}

export default function RevenueExperiences(props: IRevenueAppProps & { readonly committeeVisual?: React.ReactNode }): React.ReactElement {
  const styles = useStyles();
  const scope = resolveScope(props.properties);
  const definition = props.definition;
  const workflow = workflowFor(definition.key, scope);
  const [draft, setDraft] = React.useState<Record<string, string>>(() => workflow ? initialDraft(workflow) : {});
  const [stage, setStage] = React.useState<'draft' | 'review' | 'receipt'>('draft');
  const [confirmed, setConfirmed] = React.useState(false);
  const [receipt, setReceipt] = React.useState('');
  const [query, setQuery] = React.useState(props.properties.query || '');
  const [selected, setSelected] = React.useState(props.properties.selectedId || '');
  const [period, setPeriod] = React.useState(props.properties.period || 'current');
  const [region, setRegion] = React.useState(props.properties.region || 'all');
  const [status, setStatus] = React.useState('all');
  const [mapRegion, setMapRegion] = React.useState('na');
  const [contextError, setContextError] = React.useState('');
  const [rampDraft, setRampDraft] = React.useState(props.properties.ramp?.join(', ') || '');
  const [commercialDraft, setCommercialDraft] = React.useState<Readonly<Record<CommercialNumericKey, string>>>(() => ({
    quantity: String(props.properties.quantity ?? commercialDefaults.quantity),
    termMonths: String(props.properties.termMonths ?? commercialDefaults.termMonths),
    discount: String(props.properties.discount ?? commercialDefaults.discount),
    services: String(props.properties.services ?? commercialDefaults.services),
    probability: String(props.properties.probability ?? commercialDefaults.probability)
  }));
  const commercial: ICommercialInput = {
    quantity: Number(commercialDraft.quantity), termMonths: Number(commercialDraft.termMonths), discount: Number(commercialDraft.discount),
    services: Number(commercialDraft.services), probability: Number(commercialDraft.probability),
    ramp: rampDraft.trim() ? rampDraft.split(',').map(value => value.trim() ? Number(value) : NaN) : undefined
  };
  const pricingErrors = [...commercialErrors(commercial), ...commercialKeys.filter(key => !commercialDraft[key].trim()).map(key => `${commercialLabels[key]} is required`)];
  const errors = workflow ? workflowErrors(definition.key, scope, workflow, draft) : [];
  const calculation = workflow && !errors.length ? workflowCalculation(definition.key, scope, draft) : '';
  const isPortfolio = definition.key === 'ExplorePipelineQuality' || definition.key === 'DiscoverAccountOpportunity';
  const opportunities = OPPORTUNITIES.filter(item => {
    const accountScope = definition.key === 'DiscoverAccountOpportunity' && item.accountId !== scope.account?.id;
    const account = resolveScope({ opportunityId: item.id }).account;
    return !accountScope && (region === 'all' || account?.region === region) &&
      (period === 'all' || (period === 'current' ? item.quarterOffset === 0 : period === 'next' && item.quarterOffset === 1));
  });
  const portfolioRows: readonly IBusinessRow[] = opportunities.map(item => ({
    id: item.id, title: `${item.name} · ${currency(item.value)}`,
    detail: `${item.stage}; ${Math.round(item.probability * 100)}% seller probability; ${currency(item.value * item.probability)} weighted. ${scopedEvidence(resolveScope({ opportunityId: item.id })).length} evidence records. Quarter offset ${item.quarterOffset}.`,
    source: 'Deterministic opportunity graph · probability is seller judgment', kind: 'source fact / judgment'
  }));
  const capabilityRows: readonly IBusinessRow[] = INTENTS.filter(item => item.operation !== 'education' && `${item.title} ${item.outcome}`.toLowerCase().includes(query.toLowerCase())).map(item => ({
    id: item.key, title: item.title, detail: `${item.outcome} Try: “${item.prompt}” ${item.excludes}`, source: 'Registered tool catalog · preview only', kind: item.operation
  }));
  const rows = definition.operation === 'education' ? capabilityRows : isPortfolio ? portfolioRows :
    analysisRows(definition.key, scope).filter(item => status === 'all' || item.title.includes(status));
  const selectedRow = rows.find(item => item.id === selected);
  const noSelection = !!selected && !selectedRow;
  const scopeErrors = definition.operation === 'education' ? [] : scope.errors;
  const availableActions = workflow ? stage === 'receipt' ? ['Reset draft'] : stage === 'review' ? ['Edit draft', 'Explicitly confirm session decision'] : ['Edit business fields', 'Review draft'] :
    definition.key === 'SimulateCommercialOffer' ? ['Change commercial inputs', 'Reset scenario'] : ['Select evidence', 'Inspect source'];
  const snapshot: IModelContextSnapshot = {
    intent: definition.key, displayMode: props.displayMode || 'inline', route: definition.route,
    selectedEntityId: scopeErrors.length ? JSON.stringify(props.properties) : selected || (definition.operation === 'education' ? 'catalog' : definition.key === 'ExplorePipelineQuality' ? `portfolio:${period}:${region}` : scope.opportunity?.id || ''),
    workflowStage: scopeErrors.length || noSelection ? 'no-match' : workflow ? stage : 'analysis',
    summary: scopeErrors.length ? scopeErrors.join('; ') : `${definition.title} · ${definition.operation === 'education' ? 'Catalog' : definition.key === 'ExplorePipelineQuality' ? `Portfolio ${period} ${region}` : scope.account?.name} · ${workflow ? stage : 'analysis'}${selectedRow ? ` · ${selectedRow.title}: ${selectedRow.detail}` : ''}${noSelection ? ` · No visible record matches ${selected}` : ''}`,
    availableActions: scopeErrors.length ? ['Invoke with a known, consistent scope'] : availableActions,
    referenceWorkspace: props.visibleWorkspaceLens && !scopeErrors.length ? {
      lens: props.visibleWorkspaceLens, selectedRegion: props.referenceRegion,
      selectedEvidence: HERO_EVIDENCE.find(item => item.id === props.referenceEvidenceId),
      semantics: 'Fixed illustrative reference metrics, not live CRM or the specialist draft/scenario.'
    } : null,
    requestedScope: props.properties, resolvedScope: scopeErrors.length || definition.operation === 'education' ? null : definition.key === 'ExplorePipelineQuality' ? { period, region } : { accountId: scope.account?.id, opportunityId: scope.opportunity?.id, meetingId: scope.meeting?.id, proposalId: scope.proposal?.id, exceptionId: scope.exception?.id },
    visibleRecords: scopeErrors.length ? [] : rows, selection: selected, period, region, status, query, mapRegion,
    draft: workflow && !scopeErrors.length ? draft : undefined, calculation: scopeErrors.length ? '' : calculation, receipt: scopeErrors.length ? '' : receipt, confirmed,
    commercial: definition.key === 'SimulateCommercialOffer' && !scopeErrors.length ? { inputs: { ...commercialDraft, ramp: rampDraft }, errors: pricingErrors, result: pricingErrors.length ? null : calculateCommercialOffer(commercial) } : undefined,
    validationErrors: scopeErrors.length ? scopeErrors : [...errors, ...(definition.key === 'SimulateCommercialOffer' ? pricingErrors : []), ...(noSelection ? [`No visible record matches ${selected}`] : [])],
    semantics: 'Offline session only. No CRM writes, approvals, customer contact or delivery authorization.'
  };
  const serialized = JSON.stringify(snapshot);
  const updateContext = props.onUpdateModelContext;
  React.useEffect(() => {
    let active = true;
    const committed: IModelContextSnapshot = JSON.parse(serialized);
    updateContext(committed).then(() => { if (active) setContextError(''); }).catch(() => { if (active) setContextError('Visible context could not be shared with Copilot. Change a field to retry.'); });
    return () => { active = false; };
  }, [serialized, updateContext]);

  function reset(): void {
    if (workflow) setDraft(initialDraft(workflow));
    setStage('draft'); setConfirmed(false); setReceipt('');
  }
  function selectionList(): React.ReactElement {
    return <div className={styles.rows}>
      {noSelection && <p role="status" className={styles.error}>No visible record matches {selected}. Clear selection or change filters; no default record was substituted. <Button onClick={() => setSelected('')}>Clear selection</Button></p>}
      {!rows.length && <p role="status">No matching source records. Missing evidence is not a positive finding.</p>}
      {rows.map(item => <article key={item.id} className={`${styles.row} ${selected === item.id ? styles.active : ''}`}>
        <Badge appearance="tint">{item.kind}</Badge>
        <h3>{item.title}</h3><p className={styles.detail}>{item.detail}</p><p className={styles.muted}>{item.id} · {item.source}</p>
        <Button aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>Inspect {item.id}</Button>
        {selected === item.id && <p role="status">Selected source detail: {item.detail} Provenance: {item.source}. No system record changed.</p>}
      </article>)}
    </div>;
  }
  return <section className={styles.root} aria-label="Specialist business experience" data-layout={`${definition.key}-business-${stage}`}>
    <div className={styles.panel}>
      <Badge appearance="tint">{definition.operation === 'education' ? 'Capability catalog' : scopeErrors.length ? 'No matching scope' : definition.key === 'ExplorePipelineQuality' ? 'Aggregate portfolio' : `${scope.account?.name} · ${scope.opportunity?.id}`}</Badge>
      {definition.operation !== 'education' && !scopeErrors.length && <p className={styles.muted}>Scope: {definition.key === 'ExplorePipelineQuality' ? `${period} quarter · ${region} regions` : `${scope.opportunity?.name}${scope.meeting ? ` · meeting ${scope.meeting.id}` : ''}${scope.proposal ? ` · proposal ${scope.proposal.id}` : ''}${scope.exception ? ` · exception ${scope.exception.id}` : ''}`}</p>}
      {scopeErrors.length ? <div role="status"><h2>No matching business scope</h2>{scopeErrors.map(error => <p key={error}>{error}</p>)}<p>Invoke again with a known record. Nothing was silently substituted or submitted.</p></div> :
        definition.key === 'SimulateCommercialOffer' ? <>
          <h2 className={styles.heading}>Protected-margin commercial laboratory</h2>
          <p className={styles.muted}>Deterministic scenario · $1,450 annual list per user. Subscription delivery cost 22% of list for every licensed contract year; services cost 62%. Annual recurring revenue is the full-run-rate amount; the annual ramp scales subscription revenue and cost, including partial years. Probability weights TCV, not ARR. Authority is a routing requirement, never approval.</p>
          <div className={styles.grid}>{commercialKeys.map(key => <label className={styles.field} key={key}>{commercialLabels[key]}<Input type="number" aria-label={commercialLabels[key]} value={commercialDraft[key]} onChange={(_, data) => setCommercialDraft({ ...commercialDraft, [key]: data.value })} /></label>)}</div>
          <label className={styles.field}>Annual licensed ramp percent (comma-separated)<Input aria-label="Annual licensed ramp percent (comma-separated)" placeholder="Blank = 100% every year; three-year example: 60, 80, 100" value={rampDraft} onChange={(_, data) => setRampDraft(data.value)} /></label>
          <Button onClick={() => { setCommercialDraft({ ...commercialDraft, termMonths: '36' }); setRampDraft('60, 80, 100'); }}>Model 60/80/100% ramp</Button>
          {pricingErrors.length ? <div role="alert">{pricingErrors.map(error => <p key={error}>{error}</p>)}</div> : (() => {
            const result = calculateCommercialOffer(commercial);
            return <><div className={styles.grid}><div><span>Contract value</span><p className={styles.metric}>{currency(result.contractValue)}</p><span>Annual recurring revenue</span><p>{currency(result.arr)}</p></div><div><span>Gross margin</span><p className={styles.metric}>{result.grossMargin.toFixed(1)}%</p><span>Weighted forecast</span><p>{currency(result.weightedForecast)}</p></div></div>
              <Badge color={result.grossMargin < 68 ? 'danger' : 'success'}>{result.grossMargin < 68 ? 'Below 68% margin floor' : 'Above 68% margin floor'}</Badge><p>Required authority: {result.authority}. No approval has been granted.</p>
              <D3CommercialContour discount={commercial.discount} margin={result.grossMargin} quantity={commercial.quantity} /></>;
          })()}
          <Button onClick={() => { setRampDraft(props.properties.ramp?.join(', ') || ''); setCommercialDraft({ quantity: String(props.properties.quantity ?? commercialDefaults.quantity), termMonths: String(props.properties.termMonths ?? commercialDefaults.termMonths), discount: String(props.properties.discount ?? commercialDefaults.discount), services: String(props.properties.services ?? commercialDefaults.services), probability: String(props.properties.probability ?? commercialDefaults.probability) }); }}>Reset scenario</Button>
        </> : workflow ? <>
          <h2 className={styles.heading}>{workflow.heading}</h2><p className={styles.muted}>{workflow.evidence}</p>
          <Badge appearance="tint">{stage === 'draft' ? '1 · Draft / evidence' : stage === 'review' ? '2 · Review actual values' : '3 · Session receipt'}</Badge>
          {stage === 'draft' ? <div className={styles.grid}>{workflow.fields.map(item => <label key={item.name} className={styles.field}>{item.label}
            {item.options ? <select className={styles.select} aria-label={item.label} value={draft[item.name]} onChange={event => setDraft({ ...draft, [item.name]: event.target.value })}>{item.options.map(option => <option key={option}>{option}</option>)}</select> :
              <Input aria-label={item.label} type={item.numeric ? 'number' : 'text'} value={draft[item.name]} onChange={(_, data) => setDraft({ ...draft, [item.name]: data.value })} />}
          </label>)}</div> : <dl className={styles.definition}>{workflow.fields.map(item => <React.Fragment key={item.name}><dt>{item.label}</dt><dd>{draft[item.name]}</dd></React.Fragment>)}</dl>}
          {calculation && <p className={styles.detail}>{calculation}</p>}
          {stage === 'draft' && errors.length > 0 && <div role="alert">{errors.map(error => <p key={error} className={styles.error}>{error}</p>)}</div>}
          {stage === 'review' && <><p>Review the scope and every value above. Confirmation records a session-only {definition.operation === 'review' ? 'recommendation' : 'draft'}; it is not an approval or external submission.</p><Checkbox label="I reviewed these values and understand this is session-only" checked={confirmed} onChange={(_, data) => setConfirmed(data.checked === true)} /></>}
          {stage === 'receipt' && <div role="status"><h3>Session receipt {receipt}</h3><p>{definition.title} · {scope.opportunity?.id}{scope.meeting ? ` · ${scope.meeting.id}` : ''}{scope.proposal ? ` · ${scope.proposal.id}` : ''}{scope.exception ? ` · ${scope.exception.id}` : ''}</p><p>Actual values above recorded in this mounted session only. No CRM writes, real approvals, customer contact or delivery authorization.</p></div>}
          <div className={styles.actions}>{stage === 'draft' ? <Button appearance="primary" disabled={errors.length > 0} onClick={() => { setStage('review'); setConfirmed(false); }}>Review draft</Button> : stage === 'review' ? <><Button onClick={() => { setStage('draft'); setConfirmed(false); }}>Edit draft</Button><Button appearance="primary" disabled={!confirmed || errors.length > 0} onClick={() => { if (confirmed && !errors.length) { setReceipt(`ZDR-SESSION-${definition.key}-${Date.now()}`); setStage('receipt'); } }}>Confirm session {definition.operation === 'review' ? 'decision' : 'draft'}</Button></> : null}<Button onClick={reset}>Reset draft</Button></div>
        </> : isPortfolio ? <>
          <h2 className={styles.heading}>{definition.key === 'ExplorePipelineQuality' ? 'Evidence-weighted portfolio intervention' : 'Account growth signal discovery'}</h2>
          <div className={styles.grid}>
            <label className={styles.field}>Quarter scope<select className={styles.select} aria-label="Quarter scope" value={period} onChange={event => setPeriod(event.target.value)}>{['current', 'next', 'all', ...(['current', 'next', 'all'].indexOf(period) < 0 ? [period] : [])].map(value => <option key={value}>{value}</option>)}</select></label>
            <label className={styles.field}>Region<select className={styles.select} aria-label="Region" value={region} onChange={event => setRegion(event.target.value)}>{['all', 'North America', 'EMEA', 'Asia Pacific', 'Latin America', ...(['all', 'North America', 'EMEA', 'Asia Pacific', 'Latin America'].indexOf(region) < 0 ? [region] : [])].map(value => <option key={value}>{value}</option>)}</select></label>
          </div>
          <p className={styles.metric}>{opportunities.length} opportunities · {currency(opportunities.reduce((sum, item) => sum + item.value, 0))}</p>
          <p>{definition.key === 'ExplorePipelineQuality' ? 'Intervene where buyer proof is missing; seller probability is not evidence confidence.' : 'Growth themes are discovery candidates, not created leads. Inspect an opportunity to validate scope, buyer need and timing.'}</p>
          {definition.key === 'ExplorePipelineQuality' ? <D3PipelineQuality opportunities={opportunities} /> : <D3RevenueMap opportunities={opportunities} selectedRegion={mapRegion} onSelectRegion={setMapRegion} />}
          {selectionList()}
        </> : definition.operation === 'education' ? <>
          <h2 className={styles.heading}>Find the right revenue action</h2><Input aria-label="Search revenue scenarios" value={query} onChange={(_, data) => { setQuery(data.value); }} />
          <p>{rows.length} matching scenarios. Preview explains outcomes and routing boundaries; it does not execute the selected tool.</p>{selectionList()}
        </> : <>
          <h2 className={styles.heading}>{titles[definition.key]}</h2>
          {definition.key === 'MapBuyingCommittee' && scope.opportunity?.id === 'ZDR-2042' && props.committeeVisual && <><p>Illustrative orbit; authoritative roles and stance are listed from the relationship graph below.</p>{props.committeeVisual}</>}
          {definition.key === 'TrackMeetingFollowUp' && <label className={styles.field}>Commitment status<select className={styles.select} aria-label="Commitment status" value={status} onChange={event => setStatus(event.target.value)}>{['all', 'complete', 'at-risk', 'blocked', 'on-track'].map(value => <option key={value}>{value}</option>)}</select></label>}
          {definition.key === 'GetDealRisk' && <p>Source facts, contrary signals, stale assumptions and deterministic inference remain separate. No inferred risk is treated as a customer commitment.</p>}
          {definition.key === 'PrepareCustomerMeeting' && !scope.meeting && <p>No meeting is recorded for this opportunity. Invoke with a known meeting ID; an agenda was not fabricated.</p>}
          {selectionList()}
        </>}
    </div>
    {contextError && <p role="alert" className={styles.error}>{contextError}</p>}
  </section>;
}
