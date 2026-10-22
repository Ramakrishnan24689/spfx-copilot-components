import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const name = process.argv[2];
assert.match(name || '', /^(?:zava-[a-z-]+|my-day)$/, 'Supply exactly one in-scope sample folder name.');
const root = path.resolve(import.meta.dirname, '..', 'samples', name);
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const pkg = read('package.json');
const require = createRequire(path.join(root, 'package.json'));
const lock = read('package-lock.json');
assert(!pkg.dependencies['@fluentui/react'], 'Do not add a direct Fluent UI v8 application dependency.');
const frameworkParents = ['@microsoft/sp-loader'];
if (pkg.dependencies['@microsoft/sp-webpart-base']) frameworkParents.push('@microsoft/sp-property-pane', '@microsoft/sp-webpart-base');
const allowedReactPaths = new Set(['node_modules/react', 'node_modules/react-dom',
  ...frameworkParents.flatMap(parent => [`node_modules/${parent}/node_modules/react`, `node_modules/${parent}/node_modules/react-dom`])]);
for (const dependencyPath of Object.keys(lock.packages)) {
  if (/(?:^|\/)node_modules\/react(?:-dom)?$/.test(dependencyPath)) assert(allowedReactPaths.has(dependencyPath), `Unexpected application React copy: ${dependencyPath}`);
}
const metadata = read(path.join('assets', 'sample.json'))[0];
assert(metadata.authors.some(author => author.gitHubAccount.toLowerCase() === 'vesajuvonen'), 'Sample is outside this contributor-specific rollout.');
for (const group of ['dependencies', 'devDependencies']) {
  assert.deepEqual(lock.packages[''][group], pkg[group], `Lockfile root ${group} is stale.`);
  for (const [dependency, version] of Object.entries(pkg[group] || {})) {
    if (/^@microsoft\/(?:sp-|spfx-|eslint-(?:config|plugin)-spfx)/.test(dependency)) {
      assert.equal(version, '1.24.0-rc.0', `${dependency} must target RC0.`);
    }
  }
}
for (const [dependency, version, group] of [
  ['react', '18.3.1', 'dependencies'],
  ['react-dom', '18.3.1', 'dependencies'],
  ['@types/react', '18.3.31', 'devDependencies'],
  ['@types/react-dom', '18.3.7', 'devDependencies'],
  ['@rushstack/heft', '1.3.2', 'devDependencies']
]) {
  assert.equal(pkg[group][dependency], version, `${dependency} has the wrong direct version.`);
  assert.equal(lock.packages[`node_modules/${dependency}`].version, version, `${dependency} has the wrong locked version.`);
}
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(path.join(root, 'src'));
const source = files.filter(file => /\.tsx?$/.test(file)).map(file => fs.readFileSync(file, 'utf8')).join('\n');
assert(!/ReactDOM\.render|unmountComponentAtNode|react-dom\/test-utils/.test(source), 'Legacy React lifecycle/test API remains.');
const ts = require('typescript');
const manifests = files.filter(file => file.endsWith('CopilotComponent.manifest.json')).map(file => {
  const parsed = ts.parseConfigFileTextToJson(file, fs.readFileSync(file, 'utf8'));
  assert(!parsed.error, `Invalid component manifest: ${file}`);
  return parsed.config;
});
const tools = manifests.flatMap(manifest => manifest.tools || []);
assert(manifests.every(manifest => manifest.copilotType === 'Ux' && manifest.tools.length === 1), 'Every UX component must own exactly one tool.');
assert.equal(new Set(manifests.map(manifest => manifest.id)).size, manifests.length, 'Component IDs must be unique.');
assert.equal(new Set(tools.map(tool => tool.name)).size, tools.length, 'Tool names must be unique.');
assert.equal(new Set(tools.map(tool => tool.description.default.trim().toLowerCase())).size, tools.length, 'Tool descriptions must be distinct.');
let parameterCount = 0;
const schemasByTool = new Map();
for (const tool of tools) {
  assert.match(tool.name, /^[A-Za-z0-9_-]+$/, 'Invalid source tool name.');
  const schemaModule = tool.propertiesSchema.id.match(/\/lib\/(.+):default;/)?.[1];
  assert(schemaModule, `Invalid property schema reference: ${tool.name}`);
  const schema = require(path.join(root, 'lib-commonjs', schemaModule)).default;
  schemasByTool.set(tool.name, schema);
  assert.equal(schema.type, 'object', `${tool.name} must expose an object schema.`);
  assert(schema.properties && typeof schema.properties === 'object', `${tool.name} properties are missing.`);
  parameterCount += Object.keys(schema.properties).length;
  for (const [parameter, definition] of Object.entries(schema.properties)) {
    assert.match(parameter, /^[A-Za-z0-9_]+$/);
    assert(definition.description?.trim(), `${tool.name}.${parameter} needs a description.`);
  }
}
const registered = new Set(read(path.join('config', 'copilot-agent.json')).agents.flatMap(agent => agent.components));
assert.deepEqual(registered, new Set(manifests.map(manifest => manifest.id)), 'Agent registration must match component identities.');
const starters = read(path.join('config', 'conversation-starters.json')).starters.map(starter => ({
  ...starter, tool: starter.tool || starter.targetName
}));
const declarative = read(path.join('copilot', 'declarativeAgent.json'));
assert.deepEqual(declarative.conversation_starters, starters.map(({ title, text }) => ({ title, text })), 'Declarative starters drifted from canonical targets.');
assert.equal(new Set(starters.map(starter => starter.text.toLowerCase().replace(/\s+/g, ' ').trim())).size, starters.length, 'Starter prompts must be unique.');
if (tools.length > 1) {
  assert.equal(starters.length, 6, 'Each Zava agent must expose exactly six starters.');
  const explorers = tools.filter(tool => /^ExploreAgentCapabilities(?:Tool)?$/.test(tool.name));
  assert.equal(explorers.length, 1, 'Register exactly one dedicated capability-explorer component.');
  assert.equal(starters[5].tool, explorers[0].name, 'The sixth starter must target the dedicated feature explorer.');
  assert(starters.slice(0, 5).every(starter => starter.tool !== explorers[0].name), 'The first five starters must own operational UX.');
  assert.equal(new Set(starters.map(starter => starter.title.trim().toLowerCase())).size, 6, 'Six unique starter titles are required.');
  assert.equal(new Set(starters.map(starter => starter.tool)).size, starters.length, 'Independent multi-tool starter targets must be distinct.');
} else {
  assert.equal(name, 'my-day', 'Single-tool focus starters require an explicit sample contract.');
  assert.equal(new Set(starters.map(starter => JSON.stringify([starter.tool, starter.properties]))).size, starters.length, 'Composed My Day starter focuses must be distinct.');
}
const instructions = fs.readFileSync(path.join(root, 'copilot', 'instruction.txt'), 'utf8');
if (tools.length > 1) {
  for (const tool of tools) assert(instructions.includes(tool.name), `Scenario instructions need an explicit boundary for ${tool.name}.`);
}
for (const starter of starters) {
  assert(tools.some(tool => tool.name === starter.tool), `Unknown starter target ${starter.tool}.`);
  assert(instructions.includes(starter.tool), `Instructions must name starter target ${starter.tool}.`);
  for (const [field, value] of Object.entries(starter.properties || {})) {
    const property = schemasByTool.get(starter.tool).properties[field];
    assert(property, `Starter references unsupported property ${starter.tool}.${field}`);
    if (property.enum) assert(property.enum.includes(value), `Starter has an unsupported ${field} value.`);
  }
}
const images = metadata.thumbnails.map(thumbnail => {
  assert(thumbnail.alt?.trim(), `Missing alt text: ${thumbnail.name}`);
  const buffer = fs.readFileSync(path.join(root, 'assets', thumbnail.name));
  assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Invalid PNG: ${thumbnail.name}`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  assert(width >= 300 && height >= 200 && buffer.length > 10000, `Insufficient publication image dimensions/bytes: ${thumbnail.name}`);
  return { name: thumbnail.name, width, height };
});
const unzipper = require('unzipper');
const solution = read(path.join('config', 'package-solution.json'));
const packagePath = path.join(root, 'sharepoint', solution.paths.zippedPackage);
const bytes = fs.readFileSync(packagePath);
const archive = await unzipper.Open.buffer(bytes);
const javascript = archive.files.filter(entry => /ClientSideAssets\/.*\.js$/i.test(entry.path));
const releaseAssets = path.join(root, 'release', 'assets');
const currentJavaScript = fs.readdirSync(releaseAssets).filter(file => file.endsWith('.js'));
assert(javascript.length > 0, 'Package contains no production JavaScript.');
assert.deepEqual(new Set(javascript.map(entry => path.basename(entry.path))), new Set(currentJavaScript), 'Packaged JavaScript differs from current release output.');
for (const entry of javascript) {
  assert((await entry.buffer()).equals(fs.readFileSync(path.join(releaseAssets, path.basename(entry.path)))), `Packaged UI code is stale: ${entry.path}`);
}
const appManifest = archive.files.find(entry => entry.path === 'AppManifest.xml');
assert(appManifest, 'Packaged app manifest is missing.');
const appXml = (await appManifest.buffer()).toString('utf8');
assert.equal(appXml.match(/<App\b[^>]*\bVersion="([^"]+)"/)?.[1], solution.solution.version, 'Packaged solution version differs from source.');
for (const feature of solution.solution.features || []) {
  const featureEntry = archive.files.find(entry => entry.path === `feature_${feature.id}.xml`);
  assert(featureEntry, `Packaged feature is missing: ${feature.id}`);
  const xml = (await featureEntry.buffer()).toString('utf8');
  assert.equal(xml.match(/<Feature\b[^>]*\bVersion="([^"]+)"/)?.[1], feature.version, 'Packaged feature version differs from source.');
}
const agents = archive.files.filter(entry => /ClientSideAssets\/[^/]+\.zip$/i.test(entry.path));
assert.equal(agents.length, 1, 'Expected one current embedded agent package.');
const agentBytes = await agents[0].buffer();
const agentArchive = await unzipper.Open.buffer(agentBytes);
const pluginEntry = agentArchive.files.find(entry => entry.path === 'ai-plugin.json');
assert(pluginEntry, 'Embedded agent plugin is missing.');
const plugin = JSON.parse((await pluginEntry.buffer()).toString('utf8'));
const bundledAgentEntry = agentArchive.files.find(entry => entry.path === 'declarativeAgent.json');
assert(bundledAgentEntry, 'Embedded declarative agent is missing.');
const bundledAgent = JSON.parse((await bundledAgentEntry.buffer()).toString('utf8'));
assert.deepEqual(bundledAgent.conversation_starters, declarative.conversation_starters, 'Packaged conversation starters are stale.');
assert(bundledAgent.instructions.replace(/\r\n/g, '\n').includes(instructions.trim().replace(/\r\n/g, '\n')), 'Packaged agent instructions are stale.');
const bundledManifestEntry = agentArchive.files.find(entry => entry.path === 'manifest.json');
assert(bundledManifestEntry, 'Embedded Teams manifest is missing.');
const bundledManifest = JSON.parse((await bundledManifestEntry.buffer()).toString('utf8'));
const authoredAgentVersion = read(path.join('copilot', 'manifest.json')).version;
const hotfixPattern = new RegExp(`^${authoredAgentVersion.replaceAll('.', '\\.')}\\.[1-9]\\d*$`);
assert(bundledManifest.version === authoredAgentVersion ||
  (authoredAgentVersion.split('.').length === 3 && hotfixPattern.test(bundledManifest.version)),
  'Packaged agent release version is not the authored base or its RC0-generated hotfix.');
assert.equal(plugin.schema_version, 'v2.4');
assert.deepEqual(plugin.functions, [], 'RC0 discovers tools dynamically.');
assert.equal(plugin.runtimes.length, 1);
assert.equal(plugin.runtimes[0].type, 'RemoteMCPServer');
assert.deepEqual(plugin.runtimes[0].run_for_functions, ['*']);
assert.deepEqual(Object.keys(plugin.runtimes[0].spec), ['url']);
assert.equal(plugin.runtimes[0].auth.type, 'None');
assert.equal(plugin.runtimes[0].spec.url, '{{TENANT_MCP_URL}}');
const teamsPath = path.join(root, 'teams', path.basename(agents[0].path));
assert(fs.existsSync(teamsPath), 'Current generated Teams package must be retained.');
assert(fs.readFileSync(teamsPath).equals(agentBytes), 'Teams ZIP differs from the embedded current build.');
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const junit = fs.readFileSync(path.join(root, 'jest-output', 'JUnit.xml'), 'utf8').match(/<testsuites\b[^>]*>/)?.[0];
assert(junit, 'Full Jest run evidence is missing.');
const tests = Number(junit.match(/\btests="(\d+)"/)?.[1]);
assert(tests > 0 && /\bfailures="0"/.test(junit) && /\berrors="0"/.test(junit), 'All discovered Jest tests must pass.');
console.log(JSON.stringify({
  sample: name, components: manifests.length, tools: tools.length, parameterCount, tests,
  solutionVersion: solution.solution.version, agentVersion: bundledManifest.version, authoredAgentVersion,
  componentIds: manifests.map(manifest => manifest.id),
  starters: starters.map(({ title, tool }) => ({ title, tool })),
  publicationImages: images, packageBytes: bytes.length, packageSha256: hash(bytes),
  agentPackage: path.basename(teamsPath), agentSha256: hash(agentBytes),
  externalGate: 'Authenticated natural-language routing, CSP, focus and host accessibility remain separate.'
}, null, 2));
