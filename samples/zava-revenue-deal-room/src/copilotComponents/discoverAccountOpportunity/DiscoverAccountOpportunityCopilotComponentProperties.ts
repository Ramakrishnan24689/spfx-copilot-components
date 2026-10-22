import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

const schema = z.object({
  accountId: z.string().optional().describe("Exact account record ID, for example CONTOSO or ACC-002. Unknown IDs show no-match."),
  period: z.enum(['current', 'next', 'all']).optional().describe("Quarter offset filter: current is 0, next is 1, all includes every seeded quarter. Defaults to current."),
  region: z.enum(['all', 'North America', 'EMEA', 'Asia Pacific', 'Latin America']).optional().describe("Filter actual account region. Defaults to all."),
  selectedId: z.string().optional().describe("Exact visible source or opportunity ID to inspect. Unknown or filtered selections remain visible as no-match.")
});
export type IDiscoverAccountOpportunityCopilotComponentProperties = z.infer<typeof schema>;
export default zodToJsonSchema(schema);
