import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const componentsRoot = path.join(root, 'src', 'copilotComponents');
const definitions = [
  ['BuildAccountBrief', ['accountId', 'selectedId']],
  ['QualifyOpportunity', ['opportunityId']],
  ['MapBuyingCommittee', ['opportunityId', 'selectedId']],
  ['GetDealRisk', ['opportunityId', 'selectedId']],
  ['PrepareCustomerMeeting', ['meetingId', 'opportunityId', 'selectedId']],
  ['BuildMutualActionPlan', ['opportunityId']],
  ['ReviewMeetingCommitments', ['meetingId', 'opportunityId']],
  ['ShapeSolutionProposal', ['opportunityId', 'proposalId']],
  ['SimulateCommercialOffer', ['opportunityId', 'quantity', 'termMonths', 'discount', 'services', 'probability', 'ramp']],
  ['ReviewDealException', ['exceptionId', 'opportunityId']],
  ['InspectForecastCommit', ['opportunityId']],
  ['ExplorePipelineQuality', ['period', 'region', 'selectedId']],
  ['DiscoverAccountOpportunity', ['accountId', 'period', 'region', 'selectedId']],
  ['ResearchCompetitivePosition', ['opportunityId', 'selectedId']],
  ['CoachDealStrategy', ['opportunityId', 'selectedId']],
  ['CreateExecutiveEngagementPlan', ['opportunityId']],
  ['TrackMeetingFollowUp', ['opportunityId', 'meetingId', 'selectedId']],
  ['BuildValueCase', ['opportunityId']],
  ['ReviewProposalReadiness', ['opportunityId', 'proposalId']],
  ['PlanCustomerSuccessHandoff', ['opportunityId']],
  ['ExploreAgentCapabilities', ['query']]
];
const boundaries = new Map([
  ['BuildAccountBrief', 'Use for sourced account context and whitespace. Do not use for one meeting.'],
  ['QualifyOpportunity', 'Use for opportunity qualification and stage judgment. Do not use for forecast commit.'],
  ['MapBuyingCommittee', 'Use for buyer roles, influence, stance, and access. Do not use for contact lists.'],
  ['GetDealRisk', 'Use for evidence-ranked risk on one deal. Do not use for aggregate pipeline risk.'],
  ['PrepareCustomerMeeting', 'Use for preparing one upcoming customer meeting. Do not use for meeting results.'],
  ['BuildMutualActionPlan', 'Use for buyer and seller close commitments. Do not use for internal task lists.'],
  ['ReviewMeetingCommitments', 'Use for reviewing proposed meeting updates. Do not use for meeting preparation.'],
  ['ShapeSolutionProposal', 'Use for an outcome-led solution proposal. Do not use for pricing approval.'],
  ['SimulateCommercialOffer', 'Use for commercial scenario modeling. Do not use to approve exceptions.'],
  ['ReviewDealException', 'Use for a governed commercial exception decision. Do not use for scenario modeling.'],
  ['InspectForecastCommit', 'Use for manager forecast-category decisions. Do not use for seller qualification.'],
  ['ExplorePipelineQuality', 'Use for aggregate pipeline quality and intervention. Do not use for one deal.'],
  ['DiscoverAccountOpportunity', 'Use for account growth signal discovery. Do not create a lead automatically.'],
  ['ResearchCompetitivePosition', 'Use for evidence-grounded competitive strategy. Do not invent competitor claims.'],
  ['CoachDealStrategy', 'Use for explainable deal coaching plays. Do not make a forecast decision.'],
  ['CreateExecutiveEngagementPlan', 'Use for reviewed executive engagement planning. Do not contact customers.'],
  ['TrackMeetingFollowUp', 'Use for evidence-backed commitment follow-up. Do not infer completion.'],
  ['BuildValueCase', 'Use for customer outcome and payback modeling. Do not set commercial price.'],
  ['ReviewProposalReadiness', 'Use for proposal evidence and readiness decisions. Do not write the proposal.'],
  ['PlanCustomerSuccessHandoff', 'Use for reviewed sold-outcome handoff. Do not close the opportunity.'],
  ['ExploreAgentCapabilities', 'Use for discovering revenue scenarios. Do not use for a specific request.']
]);
const numericFields = new Set(['quantity', 'termMonths', 'discount', 'services', 'probability']);
const descriptions = {
  accountId: 'Exact account record ID, for example CONTOSO or ACC-002. Unknown IDs show no-match.',
  opportunityId: 'Exact opportunity ID, for example ZDR-2042. Must agree with any related record scope.',
  meetingId: 'Exact meeting ID: MTG-2042 or MTG-2043. Unknown or conflicting records show no-match.',
  proposalId: 'Exact proposal ID: PROP-2042 or PROP-2043. Does not grant readiness.',
  exceptionId: 'Exact exception ID: EX-2042 or EX-2043. Does not grant approval.',
  selectedId: 'Exact visible source or opportunity ID to inspect. Unknown or filtered selections remain visible as no-match.',
  period: 'Quarter offset filter: current is 0, next is 1, all includes every seeded quarter. Defaults to current.',
  region: 'Filter actual account region. Defaults to all.',
  query: 'Search capability titles and outcomes; selecting a preview never executes a tool.',
  quantity: 'Whole licensed-user count, 1 to 100000. Defaults to 860; validated at runtime.',
  termMonths: 'Whole contract months, 1 to 120. Defaults to 36; recurring delivery cost scales with term.',
  discount: 'Discount percentage, 0 to 100. Defaults to 14. Authority requirements are not approvals.',
  services: 'One-time services revenue in USD, 0 to 100000000. Defaults to 420000.',
  probability: 'Scenario win probability, 0 to 1 (not a percentage). Defaults to 0.72. Weights contract value.',
  ramp: 'Annual licensed percentages, one number per contract year including a partial final year, each 0 to 100. Example [60,80,100] for 36 months. Omit for full licensing every year. Validated at runtime.'
};
const componentEntries = [];
const componentIds = [];

for (const [key, fields] of definitions) {
  const folder = `${key[0].toLowerCase()}${key.slice(1)}`;
  const folderPath = path.join(componentsRoot, folder);
  const manifestPath = path.join(folderPath, `${key}CopilotComponent.manifest.json`);
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing Yeoman manifest for ${key}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  componentIds.push(manifest.id);
  fs.writeFileSync(path.join(folderPath, `${key}CopilotComponent.tsx`), `import RevenueCopilotComponentBase from '../../shared/RevenueCopilotComponentBase';\nimport type { IRevenueProperties, RevenueIntentKey } from '../../shared/catalog';\n\nexport default class ${key}CopilotComponent extends RevenueCopilotComponentBase<IRevenueProperties> {\n  protected intentKey: RevenueIntentKey = '${key}';\n}\n`);
  const schemaFields = fields.map((field) => {
    const type = field === 'ramp' ? 'array(z.number())' : field === 'period' ? "enum(['current', 'next', 'all'])" : field === 'region' ? "enum(['all', 'North America', 'EMEA', 'Asia Pacific', 'Latin America'])" : `${numericFields.has(field) ? 'number' : 'string'}()`;
    return `  ${field}: z.${type}.optional().describe(${JSON.stringify(descriptions[field])})`;
  });
  fs.writeFileSync(path.join(folderPath, `${key}CopilotComponentProperties.ts`), `import { z } from 'zod';\nimport zodToJsonSchema from 'zod-to-json-schema';\n\nconst schema = z.object({\n${schemaFields.join(',\n')}\n});\nexport type I${key}CopilotComponentProperties = z.infer<typeof schema>;\nexport default zodToJsonSchema(schema);\n`);
  manifest.alias = `${key}CopilotComponent`;
  manifest.tools[0].name = key;
  manifest.tools[0].description.default = boundaries.get(key);
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  componentEntries.push({
    entrypoint: `./lib/copilotComponents/${folder}/${key}CopilotComponent.js`,
    manifest: `./src/copilotComponents/${folder}/${key}CopilotComponent.manifest.json`
  });
}

const configPath = path.join(root, 'config', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
config.bundles = { 'zava-revenue-components': { components: componentEntries } };
config.localizedResources = {};
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);

const agentPath = path.join(root, 'config', 'copilot-agent.json');
const agent = JSON.parse(fs.readFileSync(agentPath, 'utf8'));
agent.agents[0].name.default = 'ZavaMesh Revenue Deal Room';
agent.agents[0].description.default = 'Turn buyer evidence into coordinated deal action and a defensible forecast.';
agent.agents[0].components = componentIds;
fs.writeFileSync(agentPath, `${JSON.stringify(agent, null, 2)}\n`);

const starters = JSON.parse(fs.readFileSync(path.join(root, 'config', 'conversation-starters.json'), 'utf8')).starters;
const declarativeAgentPath = path.join(root, 'copilot', 'declarativeAgent.json');
const declarativeAgent = JSON.parse(fs.readFileSync(declarativeAgentPath, 'utf8'));
declarativeAgent.conversation_starters = starters.map(({ title, text }) => ({ title, text }));
fs.writeFileSync(declarativeAgentPath, `${JSON.stringify(declarativeAgent, null, 2)}\n`);
console.log(`Configured ${definitions.length} immutable revenue components in one shared bundle.`);