# Agentic Creation Rules - Zava AI Project Portfolio Agent

> **Purpose.** This file is the reusable engineering and automation playbook validated by the
> **Zava AI Project Portfolio Agent** and cross-checked against the **Zava Employee Agent**. Copy it
> into future samples, replace solution-specific names and counts, and preserve every mandatory
> action/gate unless `todo.md` records an approved exception.
> It covers independently routed Copilot Components, shared full-screen experiences, coherent mock
> data, session-local workflows, visualization-first React UX, automated evidence, and packaging.
>
> **Prime directive:** every sample must be a **self-contained, offline, mock-data showcase** that
> deploys from a committed `.sppkg` in minutes, looks premium, and is structured so the mock can
> later be swapped for live Microsoft 365, SharePoint, Planner, Project, Fabric, financial, or
> governance data with no UI changes.

## Document precedence

- `todo.md` controls this solution's product scope, final component names, UX contracts, phase order,
  and acceptance gates.
- This file controls implementation quality, supported scaffolding, architecture, testing, and safety.
- The validated reference implementations supply proven patterns where neither document is explicit.
- Resolve a conflict in that order and record an approved exception in `todo.md` before coding.

---

## 0. Operating model & how to use this file

### 0.0 Next-sample fast path

Use this short path to start the next sample. The detailed sections below remain the acceptance
criteria; this sequence prevents rediscovery and avoids implementing breadth before the shared model
is proven.

1. **Write the brief bundle.** Provide README objectives, one or more UX designs, a current-target
  component portfolio, and a prompt-routing matrix. For a small sample these may be sections in
  `todo.md`; a complex multi-family sample may use separate component-plan and demo-prompt documents.
  Decide the short keynote, longer business demo, and technical/code walkthrough before polish so
  implementation evidence naturally supports all three.
2. **Freeze identities and package metadata.** Approve final component/tool names, GUID ownership,
  routes, package IDs, and short plugin metadata before generation. API plugin v2.4
  `name_for_human` MUST be **20 characters or fewer**; use a short plugin-facing name when the full
  product/agent display name is longer. Also cap `description_for_human` at 100 characters and
  `description_for_model` at 2,048.
3. **Promote only high-value tools.** Keep a broader future intent inventory, but generate only the
  approved current-target intents. Supporting detail, history, and retrieval-only variants stay as
  internal full-screen routes until they earn independent conversational routing.
4. **Generate final identities with Yeoman.** Never copy, rename, or repurpose component scaffolds.
5. **Install once and automate immediately.** Pin the shared stack; add catalog, media, gallery,
  generated-plugin, and final package-output validators before scaling bodies. Generate/validate bundle
  membership from the catalog instead of maintaining component entries by hand. Confirm the clean
  baseline compiles.
6. **Prove the shared boundary and three operation slices.** Build owner-document theming, current-user
  fallback, intent resolution, fresh-invocation versioning, display-mode routing, then one complete
  information, review, and submit experience.
7. **Scale from the catalog.** Reuse host/workflow/chart mechanics while keeping domain composition and
  evidence specific. Add focused tests and visual evidence with each family or workspace.
8. **Ship through one command.** Source/catalog/media/gallery audits -> clean production tests ->
  package-solution -> validate the generated plugin -> audit the actual `.sppkg` JavaScript/media/icon
  output and size thresholds. Run a clean-clone/offline rehearsal before public submission.

### 0.1 Supported scaffolding and automation

The user approves the solution identity, final component catalog, and intent ownership. The coding
agent MAY automate component creation after that approval, but every component structure MUST come
from the supported SharePoint Yeoman generator. Never create, copy, rename, or reshape a generated
component scaffold by hand.

**Product owner before implementation:**

1. **Approve the final catalog before generation.** The user decides how many Copilot Components the
  solution has and their final names. The user or coding agent may run the generator. Example:

   ```bash
   npm install -g yo @microsoft/generator-sharepoint
   yo @microsoft/sharepoint      # choose "Copilot Component"; repeat / re-run to add more components
   npm install                    # if scaffolded with --skip-install
   ```

  > [!IMPORTANT]
  > When adding a new inline Copilot Component to an existing solution, always create the clean,
  > final-named component with the supported Yeoman generator pattern (replace `NameOfTheComponent`
  > with the intended component name):
  >
  > ```bash
  > yo @microsoft/sharepoint --component-type copilotComponent --component-name NameOfTheComponent --framework none --skip-install
  > ```
  >
  > After generation, update the implementation to follow this playbook. Do not rename the component,
  > transfer another component's GUID, or manually create/copy its structure. If an untouched placeholder
  > has the wrong name, remove it through an explicit scaffold-cleanup step and generate a new component
  > with the final name; never turn it into a different component.

1. **Add the UX design(s)** to the repo (mockups/wireframes under `assets/`, e.g. `assets/*.png`) and
   **write the README objectives** - the summary, the experiences (how many inline / full-screen), the
   signature feature, and the data story. This README-as-brief is the **input** the agent builds from.
2. **Make these rules available to the agent** - reference `agentic-creation-rules.md` one of these ways
   so the agent actually follows it:
   - as a **skill** the agent can load (e.g. a `SKILL.md` that points at / embeds these rules), or
   - as an **agent configuration file** (e.g. `AGENTS.md` / `.github/copilot-instructions.md` / a custom
     `*.agent.md`) that includes or links this file, or
   - **referenced directly in the prompt** ("follow `agentic-creation-rules.md`") when kicking off work.

   Keep a copy of this file in the new sample's root so it travels with the solution.
3. **Approve `todo.md` before implementation.** Dependency installation, mock-data work, and React work
  then follow the order in the approved project plan.

**Agent (this file):**

1. **Follow the approved phase order.** Install the baseline packages (§0.3) before the first React
  implementation. They do not need to precede pure mock-data modeling.
2. **Read the README objectives + the UX design.** Identify how many independently routed inline
  intents are approved and how they continue into full-screen routes. Mirror the final catalog in
  `todo.md`, not any temporary placeholder scaffold.
3. **Generate `todo.md` first** (see §2) from the README + UX. This becomes the user's primary task
   tracker - they review and steer from it. Do **not** start coding until the phased `todo.md` exists.
4. **Implement phase by phase** (see §3), updating `todo.md` as you go (§2.3).
5. **Generate approved components when their phase starts** with the Yeoman command above. Verify
  unique GUIDs, bundles, resources, and registrations before implementing them.
6. **Never deviate** from the Golden Rules (§1) without explicit user approval; never rename a
  generated component or imitate a scaffold through file operations.

### 0.2 Mandatory automation protocol - run for every sample

This sequence is not optional. It exists so a future sample can reach this quality without repeating
the discovery and repair work from Zava. Replace `<count>`, `<name>`, routes, and intent names with the
approved sample values, but keep the actions and gates.

1. **Freeze the brief and catalog.** Read the README/design assets, approve final component names,
   operation ownership, inline/full-screen routes, personas, data story, signature visuals, package
   identity, and plugin-facing metadata limits (`name_for_human` <= 20). Write `todo.md`; do not code
   before approval. An intent earns a current-target component when it satisfies at least two of:
   frequent/time-sensitive decision value, meaningful prompt-driven variation, useful interaction or
   review, a distinctive visualization, and a natural full-screen continuation. Keep other candidates
   documented as future tools or internal routes rather than generating them speculatively.
2. **Generate final identities through Yeoman.** Generate every approved Copilot Component with its
   immutable final name. Never copy, rename, or repurpose a generated folder/GUID.
3. **Create catalog automation immediately.** Add one declarative intent catalog plus scripts that
   configure and validate manifests, adapters, schemas, bundles, localized resources, registrations,
   and tool descriptions. The validator MUST fail on duplicate GUID/tool/description, wrong counts,
  placeholder descriptions/properties, missing registrations, missing generated files, duplicate bundle
  membership, or a manifest absent from the approved bundle strategy.
4. **Install and pin the shared stack once.** React 18, Fluent v9, Griffel, focused D3 modules/types,
   Jest, and only approved optional libraries. Run a clean compile before feature implementation.
5. **Build the shared host before 30 bodies.** Implement current-user resolution, `ownerDocument`
   Griffel rendering, theme provider, consistent top-right full-screen action, operation dispatcher,
   intent metadata, and fresh-properties/passive-rerender behavior. Test this boundary first.
6. **Model one coherent offline domain.** Add source-appropriate typed records, deterministic clock,
   service interface/mock implementation, calculations, scenarios, relationships, and bundled media.
   Add referential-integrity and calculation tests before visual scale-out.
7. **Classify every intent by operation.** Information/status, Review/decision, or Request/submit.
   Implement one complete vertical slice of each operation before scaling siblings.
8. **Give every intent a purpose-designed body.** Shared framing/workflow mechanics are allowed;
   shared generic evidence/review bodies are not. Every root/stage gets a unique `data-layout` identity.
9. **Audit every visible control.** A retained filter/toggle/select/button MUST change records,
   grouping, chart marks, calculations, selected evidence, or workflow stage. Remove unsupported
   decorative affordances. Do not ship controls that only change a caption.
10. **Make forms and decisions explicit.** Prompt values prefill only. Use Draft -> Validate -> Review
  -> Confirm -> Receipt -> Reset/queue, with operation-specific review content, visible validation,
  semantic status colors, and session-only language.
11. **Use charts as data products.** Use installed D3/Vega components for scaled geometry, labels,
  legends, accessible summaries, and dynamic redraws. Selector changes MUST supply materially different
  datasets, not merely rename the same chart.
12. **Add focused test matrices while implementing.** Assert catalog/layout uniqueness, all information
  defaults, retained control effects, selected detail, no-match/error fallback, all review safeguards,
  and every form's prefill/validation/Edit/review/confirm/receipt/reset lifecycle.
13. **Create a local visual harness before Workbench review.** It MUST render every intent, width, and
  theme without a tenant. Automate screenshots plus runtime, overflow, image, control-label, chart,
  keyboard-focus, reduced-motion, and 200% browser-zoom checks. Save a machine-readable evidence file.
14. **Run tenant-host smoke separately.** If `{tenantDomain}` or authentication is unavailable, record
  the exact external prerequisite in `todo.md`; never mark CSP, iframe focus, or screen-reader host
  behavior complete from the local harness.
15. **Package only after all executable gates pass.** Run catalog/media/gallery audits, clean tests with
  zero warnings, production build, Teams/Copilot package generation, `.sppkg` generation,
  generated-plugin validation, final package-output/size audit, diagnostics, and `git diff --check`.
  Stop temporary servers and update `todo.md` immediately.
16. **Educate users when the tool catalog is large.** If the agent has more than 10 purpose-designed
  inline tools, add the catalog-driven Agent Capability Explorer pattern (§6.4) and reserve the final
  conversation starter for “What can this agent do?”. Do not expect three generic starters to explain
  a complex business agent.

**Required reusable automation assets:**

```text
scripts/configure-intent-components.mjs   # catalog -> adapters/schemas/manifests/registrations
scripts/validate-intent-components.mjs    # fail-fast identity/schema/registration audit
scripts/validate-generated-ai-plugin.mjs  # shipped ZIP -> plugin v2.4/dynamic MCP/length audit
scripts/validate-package-output.mjs        # .sppkg -> JS/media/icon/stale-output/size audit
scripts/validate-gallery-assets.mjs        # sample.json -> metadata/PNG/order/URL coverage audit
scripts/generate-embedded-faces.mjs       # deterministic bundled-media generator/check
scripts/serve-ux-review.mjs               # tenant-free visual harness builder/server
scripts/capture-gallery-assets.mjs         # recommended harness -> catalog-named publication PNGs
ux-review/                                # all-intent host, widths, themes, evidence controls
ux-review/evidence/screenshots/           # one approved image per intent
ux-review/evidence/<phase>-matrix.json     # machine-readable quality evidence
assets/sample.json                         # unified gallery metadata; references real assets only
```

Recommended scripts for future samples:

```json
{
  "check:intents": "node scripts/validate-intent-components.mjs",
  "check:gallery": "node scripts/validate-gallery-assets.mjs",
  "check:generated-plugin": "node scripts/validate-generated-ai-plugin.mjs",
  "check:mock-media": "node scripts/generate-embedded-faces.mjs --check",
  "check:package-output": "node scripts/validate-package-output.mjs",
  "start:ux-review": "node scripts/serve-ux-review.mjs",
  "validate": "npm run check:intents && npm run check:mock-media && npm run check:gallery && heft test --clean",
  "build": "npm run check:intents && npm run check:mock-media && npm run check:gallery && heft test --clean --production && heft package-solution --production && npm run check:generated-plugin && npm run check:package-output"
}
```

### 0.3 Dependencies - install before the owning implementation

The generator scaffolds `@microsoft/sp-copilot-component`, `zod`, and `zod-to-json-schema`. Before the
first React implementation, the agent adds the **React 18 + Fluent UI v9 + Griffel** baseline (pin to
React 18.3.1 for SPFx 1.24), then verifies the build:

```bash
# React 18 runtime + types (UX rendering)
npm install react@18.3.1 react-dom@18.3.1 --save-exact
npm install @types/react@18.3.31 @types/react-dom@18.3.7 --save-dev --save-exact

# Fluent UI v9 (components + icons) - the required UI stack (G4)
npm install @fluentui/react-components@9.54.0 @fluentui/react-icons@2.0.270 --save

# Griffel styling used directly by shared and visualization components
npm install @griffel/react@1.7.7 --save
```

Visualization is a core requirement for this sample. During the approved visualization spike, add
and pin only the D3 modules required by the selected charts, plus their type packages. Prefer focused
modules over the full `d3` bundle. Add Vega/Vega-Lite only where a declarative grammar provides a
clearer or smaller implementation than D3. Validate CSP, teardown, keyboard behavior, and bundle output
immediately after installation.

Add **only when a scenario needs them** (not baseline):

```bash
# PnP React controls - deep imports only; use when they add value (§16)
npm install @pnp/spfx-controls-react --save --save-exact

# PnPjs v4 - only in the live-data (deferred) phase (§16)
npm install @pnp/sp @pnp/graph @pnp/logging --save
```

> Keep versions aligned with the target SPFx release (React 18.3.1, Fluent `@fluentui/react-components`
> 9.x, `@fluentui/react-icons` 2.x). Confirm the exact `@microsoft/sp-copilot-component` /
> `@microsoft/spfx-*` dev-preview versions from what the generator produced for the target SPFx build.

### 0.4 Example human kickoff prompt (design pic + high-level README)

Once the solution is scaffolded and the objectives + design are in the repo, kick the agent off with a
prompt like the one below. **Attach the design image(s) in the chat** (multimodal) and/or reference them
by path so the agent can read the intended layout. Keep the prompt short - the README and the design are
the real brief; this prompt just points the agent at them and sets the sequence.

```text
Follow agentic-creation-rules.md for this sample.

Context:
- The SPFx solution exists and the final component catalog is approved in todo.md.
- Generate each component with its final name through the supported Yeoman command when its phase starts.
- The high-level objectives are in README.md.
- The UX design is attached (and saved at assets/<design-inline>.png / assets/<design-fullscreen>.png).

Please:
1. Read the README objectives and the attached design, then generate todo.md with Markdown checkboxes
  for me to review. Do NOT start coding until I approve the plan.
2. After approval, follow its phase order. Add React 18, Fluent v9, and Griffel before React work and
  confirm the build (`heft test --clean`). Pure mock-data modeling may happen first.
3. After I confirm, implement phase by phase against mock data - fully offline, source-appropriate data,
   Fluent v9, the signature "wow" feature, and the polish defined in the rules.
```

**Why this works:** it anchors the agent to these rules, makes the approved `todo.md` catalog the naming
authority, hands over the design and README as the experience brief, and enforces plan approval before
phased implementation. If only planning is requested, stop before dependency or source changes.

> Tip: for a **single** iteration on one screen you can be more direct - e.g. "Build the full-screen view
> from this design pic, using mock data per `agentic-creation-rules.md`." But for a full sample, prefer
> the plan-first flow above so `todo.md` stays the shared tracker.

---

## 1. Golden rules (non-negotiable)

- **G1 - Copilot Component, not a web part.** No `BaseClientSideWebPart`, **no property pane**, no
  `getPropertyPaneConfiguration`, no `.module.scss` theme tokens, no `@pnp/spfx-property-controls`.
- **G2 - Heft, not Gulp.** Configs extend the rig. Never add `gulpfile.js`.
- **G3 - React 18.3.1.** Functional components. `import * as React from 'react'`. Classic JSX
  (`jsx: "react"`). Use `createRoot` from `react-dom/client`, retain one root per container for
  subsequent `root.render` calls, and call `root.unmount` during teardown. Declare children props explicitly.
- **G4 - Fluent UI v9 always** (`@fluentui/react-components`, `@fluentui/react-icons`). **Tokens only**
  - never hard-code colors. Style with `makeStyles`. (See §8, §17 for Griffel/lint gotchas.)
- **G5 - Mock data first, source-shaped where useful.** All data flows through typed service
  interfaces with a mock implementation. Mirror Microsoft Graph only for entities Graph actually
  supplies. Use Planner/Project-shaped or canonical project-domain contracts for other sources (§9).
- **G6 - Offline and deterministic by default.** Do not initiate runtime data or profile-photo
  requests. A usable image URL already supplied by the Copilot/SharePoint host context may render;
  otherwise use bundled images.  Actions may update a session-local mock store and produce receipts,
  but never persist externally in the mock phase (§10, §12).
- **G7 - Derive UI from props.** Read host state (`theme`, `displayMode`, dimensions) from
  `hostContext`; **never mirror host state in component state**. `render()` is idempotent.
- **G8 - Ship a committed `.sppkg`.** For mock-data samples, commit the built package so anyone can
  deploy without building (§17.4).
- **G9 - Accessibility & reduced-motion are requirements, not extras** (§14, §15).
- **G10 - Keep `todo.md` current** with Markdown checkboxes and explicit in-progress/blocked labels (§2).
- **G11 - Approved automation uses Yeoman.** The user approves the final component catalog. The agent
  may generate those components with Yeoman at the owning phase, but never creates or copies scaffold
  files manually (§0.1).
- **G12 - Component names and generated identities are immutable.** Generate each component with its
  final folder/class name. Never rename it, repurpose another scaffold, transfer a GUID, or evolve a
  placeholder into a differently named intent.
- **G13 - Choose and document the full-screen topology before implementation.** Inline intents remain
  independent tools. Full-screen mode may use a shared multi-workspace shell, an isolated scenario
  workspace, or both. Shared shells initialize the owning workspace/route/context; isolated full
  screens remain outside operational navigation and preserve only their own scenario state (§4.1, §7).
- **G14 - Visualization serves decisions.** D3 and Vega/Vega-Lite may provide high-fidelity charts,
  but every chart needs a decision question, accessible equivalent, deterministic data, and measured
  bundle/runtime cost (§13–§17).
- **G15 - No decorative controls.** Every visible control changes records, grouping, chart geometry,
  calculations, selected evidence, draft values, or workflow stage. Remove controls that cannot yet
  fulfill their label. Static context is text, not a disabled/fake selector.
- **G16 - Share mechanics, not domain meaning.** Shared headers, actions, queue mechanics, validation
  shells, and receipt shells are encouraged. Information bodies, review evidence, review fields,
  consequences, confirmation commands, and receipt details remain operation-specific.
- **G17 - Review exactly what was edited.** Every visible/editable form value shown in review or receipt
  comes from the same live draft state. No hard-coded review labels that can drift from a selector.
- **G18 - Host-document styling is mandatory.** Griffel/Fluent styles render into
  `context.domElement.ownerDocument` through `RendererProvider`; parent-document style injection is not
  sufficient for Copilot Workbench (§8.1).
- **G19 - Evidence before completion.** Checkboxes become complete only after executable validation and,
  for visual work, saved evidence. Local harness results never substitute for tenant-authenticated CSP,
  iframe focus, or screen-reader host checks.
- **G20 - Semantic states are consistent end to end.** Pending/warning is amber, approved/success is
  green, and rejected/blocked/error is red in decision draft, receipt, and updated queue. Pair color
  with text/icon/data semantics; color is never the only signal.
- **G21 - One record, one queue owner.** Inline review queues and full-screen decision centers consume
  one canonical typed record catalog. When an item-level reviewer is embedded in a parent inbox, the
  parent owns list/filter/processed state and the child exposes evidence, decision, confirmation, and
  receipt only; never render a second nested queue.
- **G22 - Validate generated plugin metadata.** The seed `copilot/ai-plugin.json` is expanded during
  build, so source validation alone is insufficient. Keep API plugin v2.4 `name_for_human` at 20
  characters or fewer and validate the final generated `ai-plugin.json` inside the SharePoint-embedded
  agent ZIP after packaging (§5, §17.4).
- **G23 - Emit shared runtime and media once.** When multiple Copilot Components load the same React,
  Fluent, shared host, services, or mock-data graph, group their entries in one SPFx bundle so Webpack
  emits that graph once. Keep separate bundles only for a measured lazy-loading/isolation benefit and
  document the size trade-off. Never repeat a complete base64 media catalog across bundles. Clean before
  every production package and enforce the artifact gates in §18.
- **G24 - Separate invocation, transient, and confirmed state.** Normalize prompt properties into a
  deterministic signature/version owned by the Copilot component instance. Keep supported inline
  filters, selections, drafts, and review stage in a typed transient snapshot across host display-mode
  rerenders; clear it only for a fresh signature. Persist only confirmed mock actions/receipts in a
  sandbox-safe session store. Never put unconfirmed drafts or host context in shared session storage.

---

## 2. Step 1 - Generate `todo.md` (the tracking mechanism)

### 2.1 What `todo.md` is

The **single source of truth** for the build, mapped to the README commitments. The user evaluates
scope and progress from it. Generate it **before** coding, from the provided UX design.

### 2.2 Required structure

- **Title + intro** linking to `README.md`.
- **Status legend:** use `- [ ]` for open work and `- [x]` for validated work. Add bold `IN PROGRESS`
  or `BLOCKED: <reason>` text to an open item when needed.
- **Progress (latest)** blockquote - a living 1-paragraph summary; keep it updated.
- **Approach & sequencing** - the phase order (§3).
- **One `## Phase N` section per phase**, each broken into `###` subsections with Markdown checkbox
  items using `- [ ]` and `- [x]`.
- **Deferred - Dynamic data / API integration** section (live Graph/PnPjs/tool schema/provisioning).
- **Docs & cleanup** section.
- **Reusable playbook** pointer back to this rules file.
- **Open decisions** list.

### 2.3 Maintenance rules

- Mark items `[x]` immediately after focused validation. Mark active work by adding **IN PROGRESS** to
  the open item; keep at most one active implementation slice unless parallel work is explicit.
- When a decision changes an earlier item, **strike-through and annotate** rather than deleting
  history (e.g. `~~inert~~ **now live (Phase 5)**`).
- Keep the **Progress (latest)** blockquote accurate; refresh it at the end of each phase.
- Do **not** create separate competing Markdown status files - track progress in `todo.md`.
- After completing a later redesign/scale-out phase, reconcile older phase wording. Change stale
  “generate/implement” items to checked “inline complete” items and leave only the genuinely remaining
  full-screen, integration, accessibility, or documentation work open. Do not let historical planning
  bullets contradict current implementation.
- Test/warning/artifact counts in `todo.md` come from the latest saved command output, never memory.
  Update the top Progress block and every duplicated phase count in the same change.
- Split partially proven tasks. Example: check local light/dark/reduced-motion/200%-zoom validation and
  leave tenant high-contrast/screen-reader validation as a separate open item.
- External prerequisites get one precise open checkbox naming the missing value/authentication and the
  checks it blocks. Do not leave broad “finish Phase” tasks open when all local executable work passed.
- Reusable definitions of done are prose rubrics, not unchecked aggregate project tasks. Keep checkbox
  counts meaningful by recording only concrete implementation, validation, publication, or external
  prerequisite work.
- Evidence files supplement `todo.md`; they do not replace it. Store machine-readable matrices and
  screenshots under the sample's review/evidence folder and link/name them in the relevant checkbox.

---

## 3. Phasing and gates

Build UX-first against mock data and defer live API work. `todo.md` owns the actual phase sequence.
The reusable order below is guidance, not a numbering contract, and package installation may occur
before or after pure mock-data modeling as long as it precedes the code that imports those packages:

0. **Phase 0 - Scope & brief.** User approves final names, UX, and the component catalog. User or agent
  generates components only at the approved phase using Yeoman.
1. **Phase 1 - Mock data structure.** Source-shaped mock modules + view models + mapper + relative-time
   resolution + `MockDataService`. (§9)
2. **Phase 2 - Inline experience.** React components for each inline view; responsive; theming. (§6–§8)
3. **Capability education gate (required for 11+ inline tools).** Catalog-driven inline explorer,
  final conversation starter, safe prompt action, isolated full-screen preview gallery, and evidence (§6.4).
4. **Phase 3 - Full-screen experience.** Approved navigation topology + useful default workspace
  dashboards + exact intent continuation + isolated scenario workspaces where appropriate + the
  **signature hero feature**. (§4.1, §6, §11, §14)
5. **Phase 4 - Shared UI building blocks & theming.** Extract/reuse controls across views; confirm
   theming. Inline drill-downs SHOULD reuse full-screen controls where sensible.
6. **Phase 5 - Configuration impact (optional but high-value).** Session-persisted settings that
   actually reshape the UX. (§12)
7. **Phase 6 - Showcase polish.** Motion/first impression; make the hero feature the "wow" moment;
  narrative coherence of the mock; visual finish; demo enablement (short keynote, longer business
  journey, technical/code walkthrough); demo reliability. (§11–§15)
8. **Deferred - Dynamic data / API integration.** Live service implementations for Graph, SharePoint,
   Planner, Project, Fabric, finance, or governance sources; real signature-feature backend; tool-input
   rework; provisioning. (§16)
9. **Docs & cleanup.** README from PnP template, `assets/sample.json`, real screenshots, commit
   `.sppkg`. (§18)

**Definition of done per phase:** focused behavior checks pass, required visual/evidence checks are
saved, `heft test --clean` passes with **zero lint warnings/errors**, external prerequisites are
isolated explicitly, and relevant `todo.md` items are reconciled immediately after validation.

---

## 4. Architecture & entry points

Each Copilot Component lives under `src/copilotComponents/<name>/`:

- `` `<Name>CopilotComponent.ts` `` - extends `BaseCopilotComponent<TProperties>`. `render()` mounts the
  React tree into `this.context.domElement`; `onTeardown` unmounts. Pass host state + resolved user
  down as props:

  ```ts
  protected render(): void {
    const element = React.createElement(<Name>App, {
      /* tool inputs */ ...this.properties,
      currentUser: resolveCurrentUser(this.context),
      theme: this.hostContext.theme,
      displayMode: this.hostContext.displayMode,
      availableDisplayModes: this.hostContext.availableDisplayModes,
      onRequestFullscreen: this._handleRequestFullscreen
    });
    ReactDOM.render(element, this.context.domElement);
  }
  protected onTeardown(reason?: string): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
    return super.onTeardown(reason);
  }
  ```

- `` `<Name>CopilotComponent.manifest.json` `` - `componentType: "CopilotComponent"`, `copilotType: "Ux"`,
  `capabilities.availableDisplayModes`, and the `tools` array (name, localized description,
  `propertiesSchema` → compiled properties module).
- `` `<Name>CopilotComponentProperties.ts` `` - Zod schema with `.describe()` on **every** field; export
  the inferred type and `export default zodToJsonSchema(schema)`.
- `components/` - React views (§6).

**Multiple experiences:** one prompt-addressable intent gets one final-named component, tool, manifest
GUID, optional schema, and inline root. Related intents share services and visual building blocks.
A multi-workspace solution MAY render one shared full-screen shell with immutable `initialWorkspace`,
`initialRoute`, normalized `initialParams`, and a properties-version token. The shell owns navigation,
settings, workspace/route state, focus restoration, and internal transitions. A specialized intent MAY
instead render an isolated full-screen workspace when shared operational navigation would distract from
its task. Do not copy the shell into component folders or use a public generic `view` property to
multiplex inline intents.

Use a shared intent host similar to the reference `ZavaIntentCopilotComponentBase`: resolve fixed intent
metadata, detect fresh prompt-property signatures, render the focused inline view in inline mode, and
render the shared shell in full-screen mode. Passive host rerenders preserve local interaction state;
a fresh property signature reapplies prompt-derived defaults.

Use one typed resolver per intent or closely related family. Normalize unknown host input before it
reaches React, remove `undefined` transfer values, and return one explicit contract:

```ts
type IntentParam = string | number | boolean | string[];

interface IResolvedIntent<TNormalized> {
  definition: IIntentDefinition<unknown>;
  properties: TNormalized;
  params: Record<string, IntentParam>;
  signature: string;
}
```

- Keep exported tool Zod schemas simple and packaging-safe. A separate runtime-only Zod schema MAY use
  `z.enum`, `.min()`, `.max()`, transforms, `safeParse`, and `.catch()` because it is not passed to
  `zodToJsonSchema`; alternatively use plain normalization functions. Invalid input falls back to a
  useful default instead of failing render.
- Build signatures from normalized values in a deterministic field order. Increment a properties-
  version token only when that signature changes. Theme, dimensions, host context, or other passive
  rerenders MUST NOT increment it or reset edits.
- Compact transferred params by omitting `undefined`; do not serialize absent values into full-screen
  state. Test `{}`, partial, invalid, stale, and fresh values at the resolver boundary.
- The `BaseCopilotComponent` subclass owns the current signature, version, and typed transient snapshot
  because the host can replace inline React with full screen while preserving the component instance.
  Inline operation bodies report snapshots through one callback; full screen consumes the same object.
  Representative information, review, and submit paths MUST prove this boundary before scaling adapters.
- Treat snapshot coverage honestly. A visible continued-context summary is useful foundation, but exact
  route continuation is complete only when the destination module consumes the transferred entity,
  filter, selected evidence, draft, or what-if values. Track specialized adapters explicitly.

### 4.1 Full-screen topology and routing contract

Choose the topology from user workflow, information architecture, and expected screen density. Record
the choice in the README and `todo.md`; do not inherit horizontal tabs or a left rail merely because a
reference sample used them.

| Topology | Use when | Contract |
| --- | --- | --- |
| **Shared workspace shell** | Several intents belong to durable work areas that users naturally move between. | One shell owns navigation and dashboard state. Each inline component expands to its owning workspace, exact route, entity, filters, draft/scenario values, and selected evidence. |
| **Isolated full screen** | The scenario is self-contained, educational, highly immersive, or should not disturb operational workspace state. | Render a dedicated full-screen root outside shared navigation. Preserve the scenario's own context and provide a clear host-owned way back. Do not add a fake primary workspace just to house it. |
| **Hybrid** | Most intents share operational workspaces but one or more scenarios need isolation. | Use the shared shell for operational intents and explicit isolated roots for approved exceptions, all selected from catalog metadata rather than component-name conditionals. |

Model the catalog explicitly:

```ts
type FullscreenDestination =
  | {
      kind: 'workspace';
      workspace: string;
      route: string;
    }
  | {
      kind: 'isolated';
      route: string;
    };

interface IIntentDefinition<TProperties> {
  fullscreen: FullscreenDestination;
  normalize: (properties: TProperties) => Record<string, unknown>;
}
```

**Navigation orientation:**

- Horizontal tabs suit 3-5 peer workspaces with short stable labels and preserve more horizontal chart
  width. Keep the row visible or predictably reachable; on narrow screens allow horizontal scrolling
  or use one accessible workspace selector.
- Vertical navigation suits more workspaces, longer labels, icon-supported categories, or workflows
  where persistent cross-area switching matters more than maximum chart width. Collapse it to an icon
  rail only when every icon has an accessible label and tooltip; replace it with a selector/drawer on
  narrow screens.
- A solution may switch orientation at an approved breakpoint, but workspace identity, order, route
  state, keyboard behavior, and focus destination MUST remain stable. Orientation is layout, not a
  different information architecture.
- Use the available canvas. Full-screen content fills the host width with a readable responsive
  maximum that increases on desktop and projector displays. Do not strand a dashboard in an inline-
  sized center column or stretch compact inline components across the full canvas.

**Workspace dashboard contract:**

- Every primary workspace opens to a useful default dashboard, not an empty shell, route dropdown, or
  enlarged copy of one inline component.
- A dashboard coordinates several decision-relevant regions: identity/scope hero, 3-5 reconciled
  metrics, one dominant visual or work queue, supporting evidence, and clear operations.
- Selectors such as project, account, employee, store, period, or scenario update all compatible
  dashboard regions together. Show the selected scope and offer Reset where state can accumulate.
- Enter dashboards without opening a detail/review/action panel automatically. An explicit Review or
  action launcher opens one bounded panel; preserve the dashboard behind it and restore launcher focus
  on close.
- A deep-linked inline intent becomes the highlighted focused module inside the broader dashboard.
  The user sees both the exact answer they expanded and the surrounding workspace context.
- Workspace landing is only the shell foundation, not proof of exact route continuation. Until the
  route-specific module and its transferred state are visible and tested, track that continuation as
  open rather than claiming the catalog route alone completes it.
- Keep route selection secondary. Prefer visible dashboard sections and direct evidence actions over a
  mandatory “View” dropdown that hides most information one route at a time.

**Exact continuation contract:**

1. Inline answers the immediate conversational question and allows meaningful local interaction.
2. Expand requests host full-screen mode without optimistic local mode changes.
3. The same component resolves its catalog destination and supplies normalized prompt parameters plus
   transient interaction state when supported.
4. Shared shells focus the owning dashboard/route; isolated roots focus their scenario heading.
5. Preserve entity, comparison set, filters, selected evidence, draft fields, and safe what-if values.
   A fresh invocation reapplies new prompt defaults; a passive host rerender does not reset user work.
6. Full screen adds context and operations. It never resets to a generic home page or merely scales the
   inline layout wider.

**Required validation:**

- Test one exact landing per workspace and every isolated destination.
- Test fresh invocation versus passive rerender and at least one transient inline interaction surviving
  Expand for each operation model (information, review, submit).
- Test keyboard navigation and focus for both navigation orientations used by the solution.
- Capture every default dashboard at mobile, standard, desktop/keynote, light, and dark states. Assert
  no horizontal overflow, blank charts, inaccessible controls, or inline-width content stranded on a
  large canvas.

### 4.2 Repeatable implementation sequence

Use this order to avoid rebuilding navigation and state after route bodies already exist:

1. **Inventory destinations with the intent catalog.** Assign every intent exactly one workspace route
  or isolated route. Validate that all manifests support full screen before building UI.
2. **Choose navigation from the information architecture.** Decide horizontal, vertical, or responsive
  orientation from workspace count, labels, workflow, and chart-width needs. Freeze workspace IDs and
  order; visual orientation may adapt later without changing routing.
3. **Build one shell and one isolated-root adapter.** Implement host mode detection, catalog destination
  resolution, exact landing, focus management, settings location, and responsive canvas constraints.
  Do this before creating multiple full-screen pages.
4. **Build useful default dashboards first.** Implement one representative workspace dashboard with
  scope selector, metrics, dominant visual/queue, evidence, and operations. Validate it at mobile and
  keynote widths, then scale the composition pattern to sibling workspaces without copying one generic
  card grid.
5. **Embed the invoked intent as focused context.** Reuse the validated intent body inside the owning
  dashboard when deep-linked. Key stateful review/submit bodies by route/entity so switching requests
  cannot leak stale local state.
6. **Add transient-state transfer deliberately.** Separate prompt-normalized invocation state from local
  interaction state. Test selection/filter/draft/scenario continuity during Expand and reset only when
  the properties-version signature proves a fresh invocation.
7. **Add cross-workspace journeys after defaults work.** Use typed destinations from evidence, queues,
  and decision threads. Never use browser URLs for internal navigation or add a route dropdown as the
  only way to discover workspace content.
8. **Automate the visual matrix.** Add harness controls for every real host checkpoint, including a
  desktop/keynote width. Remove harness-only transitions that make measurements stale. Measure the
  settled host and dashboard widths, not just the selected option label.
9. **Validate and package once per material slice.** Run focused shell/dashboard tests immediately,
  capture screenshots and machine-readable evidence, then run the complete production package gate.

**Efficiency heuristic:** share host mechanics, navigation, responsive primitives, metrics, and panel
framing; keep workspace composition, domain evidence, calculations, and decision operations specific.
This gives future samples a reusable architecture without making every product look like the same
dashboard with different labels.

---

## 5. Tool input schema (Zod)

```ts
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
const schema = z.object({ message: z.string().describe('...') });
export type I<Name>Props = z.infer<typeof schema>;
export default zodToJsonSchema(schema);
```

- Every field MUST have `.describe()` - the text drives how Copilot populates the tool.
- All prompt fields SHOULD be optional so `{}` produces a useful default and extraction can be partial.
  This sample's catalog validator makes `.optional()` mandatory.
- The authored Copilot Component schema is JSON Schema draft-07. SPFx 1.24 RC0 uses dynamic MCP tool
  discovery, so the generated API plugin has an empty `functions` array and wildcard runtime routing,
  rather than embedded functions and mirrored tool schemas. Validate generated `ai-plugin.json` from
  the agent ZIP embedded under `sharepoint/solution/debug/ClientSideAssets/`, and continue validating
  every component schema and registration with the source catalog audit.
- This sample's validated parameter subset supports top-level `type: object`, `properties`, and optional
  `required`; each parameter supports `type`, `items`, string `enum`, `description`, and `default`.
  Supported types are `string`, `array`, `boolean`, `integer`, and `number`; array items are simple
  parameters. Property names match `^[A-Za-z0-9_]+$`.
- Copilot Component property schemas MUST NOT emit `minLength`, `maxLength`, `maxItems`, `minimum`,
  or `maximum`. Do not use Zod string `.min()`, string `.max()`, string `.length()`, array `.max()`,
  or numeric `.min()`/`.max()` in exported tool schemas. Preserve bounds, trimming, and empty-value
  handling in plain normalization code or a separate runtime-only schema that is never exported.
- Published plugin v2.4 metadata limits are: `name_for_human` 20 characters,
  `description_for_human` 100, and `description_for_model` 2,048. Other unspecified plugin strings
  SHOULD stay within 4,000 characters. These limits apply to authored/generated plugin metadata,
  including function and parameter descriptions; they do not define a maximum extracted runtime
  property value. Enforce business-safe runtime value lengths in normalization/UI validation without
  emitting unsupported `maxLength` into the tool schema.
- Accept only SPFx's deployment-time `{{TENANT_MCP_URL}}` and `{{TENANT_ORIGIN}}` placeholders in the
  generated Remote MCP runtime. Validate plugin metadata, its MCP URL, and wildcard discovery routing
  at build time. Validate dynamically discovered tools, annotations, output templates, and host CSP
  in an authenticated tenant; those are no longer embedded in this generated plugin.
- Use `z.object({})` when prompt extraction cannot improve the initial experience. Do not add ceremonial
  placeholder inputs. Finalize useful optional parameters with the initial component implementation.

---

## 6. Component & view structure

- **Root selector** (`<Name>App.tsx`) - thin; picks the view from `displayMode`
  (`'fullscreen'` → full-screen view; anything else → inline). Wraps children in the theme provider.
- **Per-mode views** - each component owns a focused `<Name>Inline.tsx`; a multi-tab application may
  delegate full-screen mode to one shared shell rather than create `<Name>Fullscreen.tsx` 30 times.
  Approved isolated destinations use a dedicated root selected from catalog metadata.
- **Building blocks** - `components/inline/`, `components/fullscreen/`. **Reuse** full-screen controls in
  inline drill-downs where it makes sense (My Day reuses `AgendaTimeline` + `TasksPanel` in inline;
  keeps a separate inline list only where the compact UX differs).
- **Drill-down navigation** - inline owns local `view` state via `useState`; provide a back affordance
  (a shared `InlineDetailHeader` with an optional title so reused cards don't double their title).

### 6.1 Operation models and dispatchers

Classify every intent in one catalog-owned helper before implementing bodies. Do not infer operation
type from component names at render time.

| Operation | Inline contract | Required states |
| --- | --- | --- |
| Information/status | Answer one decision question immediately with a specific visual/list hierarchy. | useful default, filter/group change, selected detail where relevant, no-match, error fallback |
| Review/decision | Start with a ranked queue; selected request opens purpose-specific evidence and consequences. | queue, review, decision draft, confirm, receipt, updated queue |
| Request/submit | Show real labeled controls initialized from prompt properties; never auto-submit. | draft, validation, review, confirm, receipt, prompt-backed reset |

- Use one operation-aware router (`getInlineOperation(intentKey)`) and separate information, review,
  and submit dispatchers. Unknown intents fail loudly in development; do not render a generic KPI body.
- Every intent/stage root has a stable unique `data-layout` value. Add a catalog test that renders all
  intents and asserts the expected count of unique default layouts.
- A shared application root owns only framing: workspace accent, title/summary, full-screen action,
  routed body, and status/context footer. It does not own a universal intent body.

### 6.2 Truthful control audit

Before a route can pass its inline gate, inventory every visible `button`, `select`, input, slider,
tab, and clickable chart mark:

1. Record the control label, state variable, and exact output it changes.
2. Keep it only if a test can prove changed records, grouping, chart marks/data, calculation, selected
   evidence, draft value, validation, or workflow stage.
3. If the intended behavior is not implemented, remove the affordance and present the context as text.
4. Add `aria-pressed` to binary toggles and `aria-label` to controls whose visible text does not provide
   a stable accessible name.
5. Selector choices must create material variance. Different labels over the same records/geometry do
   not satisfy this rule. Grouping selectors must change headings and membership; metric selectors must
   supply different datasets; filters must be capable of producing an intentional no-match state.

### 6.3 Domain-specific reviews and receipts

- Share `ReviewActions`, workflow transitions, and receipt framing only. Build separate review
  components for each operation/domain.
- Keep review records in one canonical typed catalog when the same work appears in inline queues and a
  full-screen decision center. IDs, people, due state, evidence, amounts, safeguards, and receipt inputs
  must come from that source; tests compare the matching queue records directly.
- Give the outer decision center sole ownership of list filters, selection, and processed status.
  Embedded item-level reviews hide their own queue and back-to-queue affordances, report completion to
  the parent, and leave the resulting receipt visible beside the updated list row.
- Review labels and values must map to visible draft fields. If a value appears in review, expose it in
  the source form or identify it explicitly as a derived calculation.
- Confirmation button text names the operation (`Publish weekly update`, `Submit timesheet`,
  `Submit usage record`), never generic `Confirm submission` when several tools differ.
- Receipts name the record created/updated, include matching key values, stable sample ID, session-only
  language, next step, and a Reset/Create another action that restores initial prompt-backed values.
- Review queues preserve filters and mark processed items semantically after returning from receipts.
  Return/Reject rationale requirements are visible beside the field; never hide a character threshold
  behind a disabled button.

### 6.4 Agent Capability Explorer - mandatory for more than 10 inline tools

Complex agents need an end-user education surface. When an agent exposes **more than 10 independently
routed, purpose-designed inline tools**, it MUST include one additional final-named Copilot Component
whose job is to explain the agent's business capabilities and help users start the right experience.
This is not technical API documentation and not a static help page.

**Conversation starter contract:**

- Reserve the **last conversation starter** for the explorer. Recommended copy:

  ```json
  {
    "title": "Explore what this agent can do",
    "text": "Show me the project and portfolio scenarios you can help with."
  }
  ```

  If the agent intentionally exposes exactly three starters, this is the **third** starter. Retain two
  high-value direct tasks and let the explorer cover the remaining breadth.

- Agent instructions route broad capability/help prompts (“what can you do?”, “show available
  scenarios”, “help me get started”) to the explorer before broad summary fallbacks.
- Keep the other starters focused on high-value first-run tasks. The explorer starter is the durable
  entry point to the complete breadth of the agent.

**Component identity and ownership:**

- Generate one immutable final-named component such as `ExploreAgentCapabilities` through Yeoman.
- Classify it as an **education/discovery** operation in the intent catalog rather than forcing it into
  information/review/submit. It may use a dedicated dispatcher because its navigation and preview
  behavior differ from operational answers.
- Exclude the explorer itself from the capabilities it advertises to avoid recursion.

**Single dynamic source of truth:**

- Extend the same catalog that configures tools and routes; never maintain a second hand-written list
  of capabilities in the React component or agent instructions.
- Every advertised intent supplies education metadata:
  - end-user scenario name and one-sentence business outcome;
  - workspace/category and audience;
  - operation model (`information`, `review`, `submit`);
  - one natural-language example prompt with realistic mock entities;
  - optional tags/search keywords and featured rank;
  - deterministic `previewProperties` that render a useful mock preview;
  - preview safety (`readOnly`, `scenario`, and whether actions are disabled in gallery mode).
- Add validator assertions: every advertised intent has complete unique education metadata, prompt text
  maps to the owning tool, categories are valid, preview properties normalize, and the explorer count
  equals the advertised catalog count.

**Inline education UX:**

- Lead with business language: “What are you trying to accomplish?” not component/tool names.
- Group scenarios into 4-7 understandable categories based on the agent domain (for Zava: My Work,
  Project delivery, Portfolio decisions, Approvals). Show counts and searchable/filterable scenarios.
- Each scenario row/card includes outcome, example prompt, operation cue, and a clear action. Avoid a
  wall of 30 cards; use category navigation plus a compact selected-detail panel.
- Selecting a scenario shows the prompt and a lightweight preview/expected result. Do not nest full
  Copilot component frames or duplicate the global component header.
- “Try this prompt” MUST use a documented host prompt-submit API only when one exists and is verified in
  the target host. Otherwise provide an honest `Copy prompt` action and visible instruction to send it
  in chat. Never invent or call an unsupported host API.
- The inline explorer has the same top-right full-screen action and responsive/accessibility standards
  as other components.

**Isolated full-screen education gallery:**

- Full-screen opens a dedicated explorer route, separate from operational dashboard tabs, so users can
  learn without mutating the main project/portfolio state.
- Provide category navigation, search, audience/outcome filters, scenario detail, prompt copy/launch,
  and a deterministic live preview rendered from `previewProperties` through the owning shared React
  experience/router.
- Gallery preview mode is safe and read-only by default. Review/submit experiences stop before final
  confirmation, clearly display `Demo preview - no action applied`, and offer Reset preview.
- Support Previous/Next scenario for guided demos and a “Featured tour” that visits representative
  information, review, and submit experiences. Do not add fake animation or autoplay.
- Render previews inside an isolated boundary with stable keys so changing scenario resets only preview
  state, not the explorer shell. Lazy-load heavy preview code when possible.

**Required tests and evidence:**

- Threshold rule: catalogs with 10 or fewer tools do not require the explorer; catalogs with 11+ fail
  validation unless the explorer component, route, and final starter exist.
- Catalog completeness and exclusion of the explorer itself.
- Category/search/filter counts; selected-detail and keyboard navigation; prompt copy success/failure;
  host launch feature detection and fallback; preview reset; Previous/Next and featured tour.
- Preview smoke for every advertised intent using its deterministic properties; no network calls,
  external writes, confirmation side effects, nested global headers, runtime errors, or overflow.
- Narrow/standard/full-screen, light/dark, reduced-motion, 200% zoom, screen-reader naming, and one
  screenshot per category plus representative preview states.

**Reusable extraction goal:** Keep catalog types, category/filter shell, scenario card/detail, prompt
actions, preview boundary, and tests under a shared `capabilityExplorer/` module with domain content
injected from the sample catalog. Future complex Copilot Apps should adopt the module by supplying
metadata, routes, and preview adapters rather than copying Zava-specific UI/data.

---

## 7. Display-mode mechanism (inline ↔ full-screen)

- Read `hostContext.displayMode` on every render. **Never** mirror it in state.
- **Inline → full-screen:** `await this.requestDisplayModeAsync('fullscreen')` (only value accepted).
  Surface one shared **View in full screen** button in the inline header's top-right corner.
- **Full-screen → inline:** host-only; you learn via `onHostContextChanged` re-render.
- Never request a mode not in `hostContext.availableDisplayModes`.
- Pass `onRequestFullscreen` down through props; do not optimistically mutate UI on request.
- Resolve the destination from immutable catalog metadata after the host reports full-screen mode.
  Shared destinations open the exact workspace/route; isolated destinations open their dedicated root.
- Display mode and route are separate concerns: the host owns mode, while the application owns internal
  workspace/route state after full screen is active.
- Do not use Expand as generic “open app” navigation. It is continuation of the current component,
  including its prompt context and, where implemented, transient interaction state.

---

## 8. Theming (Fluent v9)

- **Single provider.** A `<Name>ThemeProvider` wraps the tree once; derive the Fluent theme from the
  `theme` prop (`'dark'` → `webDarkTheme`, else `webLightTheme`; default light when undefined).

### 8.1 Host-document Griffel renderer

- **Always target the component document.** Resolve
  `const targetDocument = context.domElement.ownerDocument` in the component base and pass it into the
  shared provider. Workbench may host the component in an iframe; parent-document styles do not apply.
- **Iframe style insertion + flicker-free theme flips.** Create one Griffel DOM renderer for the target
  document, wrap with `RendererProvider`, and remount the Fluent provider **exactly once** after the
  first commit via a key that changes 0→1. Keep the key stable thereafter so theme flips preserve
  in-flight state:

  ```tsx
  import { createDOMRenderer, RendererProvider } from '@griffel/react';

  const renderer = React.useMemo(
    () => createDOMRenderer(props.targetDocument),
    [props.targetDocument]
  );
  const [gen, setGen] = React.useState(0);
  React.useEffect(() => setGen(1), []);
  const theme = props.theme === 'dark' ? webDarkTheme : webLightTheme;
  return (
    <RendererProvider renderer={renderer} targetDocument={props.targetDocument}>
      <FluentProvider key={gen} theme={theme} targetDocument={props.targetDocument} className={styles.provider}>
        {children}
      </FluentProvider>
    </RendererProvider>
  );
  ```

- **Tokens only.** No hex/rgb for text. On brand surfaces use `colorNeutralForegroundOnBrand`.
- **Test the actual boundary.** Render into a secondary `Document`, verify generated Griffel style
  buckets appear there, and verify the one-time remount does not loop or reset user state.
- **Verify token names in the live target document.** An undefined CSS custom property invalidates an
  entire gradient. Inspect computed styles for workspace accents in light/dark modes; never assume a
  Fluent token exists because a similarly named token exists.

---

## 9. Data (source-shaped mock to canonical view models)

### 9.1 Modules & shapes

- `mockData/*.ts` - one typed array per logical source. Use Graph shapes for users, groups, calendars,
  and other Graph-backed entities; use Planner/Project shapes where those APIs own the data; use
  explicit canonical contracts for portfolio, finance, AI usage, governance, and approval records.
  Bundled TypeScript is imported directly with no runtime fetch. Add a `mockData/index.ts` barrel.
- `models/sources/` contains source-specific raw types. `models/seeds.ts` contains relative-time seeds.
  `models/<name>.ts` contains lean canonical view models consumed by the UI.
- `services/mappers.ts` contains pure source-to-view-model projections reused by later live services.
- `services/I<Name>DataService.ts` + `Mock<Name>DataService.ts` - the interface + mock impl that
  imports the mock arrays, calls `resolveMockData(now)`, runs the mapper, returns a single view-model
  aggregate.

### 9.2 Personas & the real signed-in user

- Use the **standard Microsoft 365 demo personas** (Megan Bowen, Diego Siciliani, Lee Gu, ...) for all
  senders/authors/organizers - consistent Contoso names/emails via a shared `mockData/people.ts`.
- Resolve the signed-in user's name synchronously from page context. If host context already provides
  a usable `https:`, `data:`, or `blob:` photo URL, render it without issuing another request. Do not
  construct `userphoto.aspx` or call Graph for a photo. If no usable host photo exists, use the bundled
  current-user persona image, then Fluent Avatar initials as the final fallback.

### 9.3 Time resolution - always "today", forward-biased

- Author entities with **relative offsets from `now`** (e.g. `startOffsetMin`, `dueOffsetMin`,
  `receivedOffsetMin`), never absolute dates.
- `services/resolveMockData(now = new Date())` computes source-appropriate absolute dates while keeping
  stable IDs and relationships intact.
- Bias: meetings ahead of now; some past to prove "next" filtering; mail/news in the recent past so
  "1h ago" reads naturally. Resolve seeds against a clock memoized for the current fresh properties
  version. Passive rerenders reuse it; a fresh invocation may capture a new clock.
- **Never** hard-code a clock time in copy (e.g. "before the 2:30 sync") - it drifts.

### 9.4 Narrative coherence (storytelling)

- Curate meetings + tasks + mail + news into **one connected story** so any AI/summary feature reads as
  insightful, not random (My Day themes the day around shipping the app: design-review meeting ↔
  related task ↔ flagged mail ↔ news post).

### 9.5 Mock-data and media automation

- Build mock records as a connected domain, not independent component fixtures. A blocker should affect
  its task, milestone, approval, capacity, risk, and forecast records consistently.
- Give grouped/list experiences enough variance to prove their controls. Include multiple people,
  projects, statuses, due bands, values, and edge cases; avoid one record per group or labels that merely
  restate the grouping choice.
- Add referential-integrity tests: every person/project/objective/work item/milestone/risk/allocation/
  usage/request/approval/route/media key resolves; relationships and IDs are stable and deterministic.
- Store source portraits under `assets/faces/` and generate one typed media catalog. Prefer package-
  hosted asset URLs for substantial media; a generated base64 catalog is acceptable only when the
  production build emits it once in a measured shared bundle. Add a `--check` mode that fails if source
  count, generated count, keys, or output drift. Never edit generated media catalogs manually.
- Use a session-local action overlay for confirmed mock actions. Seed data remains immutable; Reset
  removes overlays and restores the deterministic baseline.
- Current dates derive from one supplied clock per fresh invocation. Do not hard-code stale “today”
  values in copy or let passive host rerenders advance the clock.

---

## 10. Imagery and host-provided media

- **One source, one catalog, one emitted payload.** Keep authored images in shared `assets/` folders and
  expose typed keys from one shared media catalog. Components reference keys/URLs; they never own copied
  binaries or per-component image registries.
- **Prefer package-hosted static files for substantial shared media.** Emit each optimized photo or
  thumbnail once with `ClientSideAssets` and resolve its package URL through the shared catalog. Hashed
  package assets remain offline/tenant-hosted and can use normal browser caching across component loads.
- **Base64 is measured fallback, not a blanket prohibition.** Tiny assets may be inlined. A shared
  persona catalog may also be base64 when one production bundle emits it exactly once and measurement
  shows the resulting package is acceptable. Never repeat encoded photo catalogs across independent
  bundles; base64 adds about 33% before compression and prevents independent browser caching.
- **Host media exception.** A usable `https:`, `data:`, or `blob:` photo URL already supplied by host
  context may render without an app-initiated request. Always retain a package-hosted persona or Fluent
  Avatar initials fallback. Never construct profile-photo endpoints or fetch runtime CDN/stock media.
- **Authoring workflow.** Download royalty-free media once, optimize dimensions/quality for its rendered
  size, record source/license beside it, and generate/check the catalog deterministically. Missing images
  use initials or a gradient/icon fallback; keys remain valid identifiers.
- **Cache data, not invocation state.** Immutable seed records, parsed media catalogs, and expensive pure
  lookup/calculation results may live in module-level caches shared by the bundle. Key scenario/date-
  dependent results explicitly. Do not cache mutable drafts, selected evidence, host context, current
  user, or properties-version state across component instances.
- The release audit (§18.4) verifies one emitted copy/hash per substantial image and zero repeated full
  base64 catalogs across JavaScript entries.

---

## 11. Signature decision experiences

- Build the signature experiences named in `todo.md` deterministically from coherent mock data. For
  this sample they include Project comparison, AI spend control tower, and resource what-if approval.
- Prefer immediate, explainable insight over generic AI theater. Use a thinking/shimmer/streaming state
  only when the user explicitly initiates a generation step and the delay helps explain that action.
  Do not add fake waiting to charts, filters, comparisons, forms, or approvals.
- Every signature experience connects one decisive visual, the relevant people, the surprising change
  or constraint, supporting evidence, and an obvious next action within ten seconds.
- **Reduced-motion:** detect `matchMedia('(prefers-reduced-motion: reduce)')` and reveal everything at
  once, no streaming/animation.
- A later live implementation replaces only services/calculators and returns the same view-model shape.

---

## 12. Configuration impact - session-persisted settings (optional)

- A settings drawer whose values persist to **`sessionStorage`** (intentionally session-scoped for the
  demo; call out "stored in this session only, not saved permanently").
- Provide a `utils/settings.ts` with a typed settings interface, `load`/`save` (guarded for sandboxed
  hosts), and a `use<Name>Settings()` hook that reads once and writes on change.
- Make settings **actually reshape the UX**: e.g. a live unit toggle updates a card immediately; a
  **visible-panels** set drives a **dynamic, re-flowing layout** (drop empty columns; keep at least one
  panel visible).

### 12.1 Session-local actions, scenarios, and receipts

- Forms and decisions use Draft -> Validate -> Review -> Confirm -> Receipt. Prompt values prefill a
  draft but never submit, approve, reject, assign, or mutate automatically.
- Validation belongs to visible intent-specific fields, not unrelated hidden defaults. Announce why a
  review/confirm action is disabled with `role="alert"` or described helper text. Do not hide minimum
  rationale/length requirements behind a disabled button.
- All editable controls are controlled by the same draft object consumed by review and receipt.
  Changing project, category, model, environment, date, sponsor, objective, classification, or status
  must visibly change the matching review. Derived values are labeled as calculations.
- Edit returns from review without losing the draft. Create another/Reset restores the initial
  prompt-backed draft, not the just-submitted values.
- Decision status uses consistent semantics through draft, receipt, and queue: pending amber, approved
  green, returned/rejected red. Return/Reject require a visible rationale rule and cannot silently fail.
- Persist confirmed mock actions in a typed session-local store guarded for sandboxed hosts. Apply
  immutable overlays to the seeded baseline so actions and receipts can appear across related inline
  and full-screen routes during the same session.
- Keep in-memory state authoritative and use `sessionStorage` as best-effort persistence; sandbox denial
  MUST NOT break the workflow. Expose immutable reads, append-only record commands, subscriptions for
  cross-route synchronization, and Reset. Test storage reload, denied-storage fallback, subscriptions,
  remount restoration, and UI reset.
- Persist only confirmed actions. Prompt defaults, in-progress drafts, selected evidence, host context,
  and transient workflow stage remain component-instance state unless a product requirement explicitly
  defines resumable drafts and their privacy/lifecycle contract.
- Receipts include stable sample ID, timestamp, actor, result, and next-step text. Provide an explicit
  Reset demo data command that clears the session overlay and restores the deterministic baseline.
- Reuse validated submit/request workflows from dashboard launchers instead of cloning their forms.
  Bound overlays and panels to the Copilot host container, not the browser viewport. Standalone inline
  mode keeps its normal receipt; embedded mode may report confirmed completion to the parent so the
  panel closes and the dashboard can show a session-only success notice.
- What-if scenarios stay separate from confirmed mock actions, pin the approved baseline, and display
  `Scenario - not applied` until the user deliberately moves into a review flow.

**Mandatory lifecycle tests per submit/request intent:** prompt prefill, invalid visible field,
announced validation, Edit preservation, matched review values, explicit confirmation, receipt content,
and prompt-backed reset. **Mandatory lifecycle tests per review intent:** queue count/filter, selection,
evidence, safeguards, rationale, confirmation, semantic receipt, updated queue, and preserved queue state.

---

## 13. Motion & first impression

- Shared `utils/motion.ts` exporting keyframe objects (`fadeIn`, `fadeInUp`).
- **Staggered entrance** for cards/panels and smooth view transitions. Because inline `style` is
  **forbidden by lint**, implement stagger with **static delay classes** in `makeStyles`
  (`delay0..delayN`) + `mergeClasses`, not inline `animationDelay`.
- **Every animation** MUST include a `@media (prefers-reduced-motion: reduce)` guard that disables it.
- D3 transitions use the same reduced-motion signal and render their final state immediately when
  motion is reduced. Motion explains changed state; it is never required to read exact values.

---

## 14. Layout & responsiveness

- **Fluid width:** root fills `100%` of the host iframe; `boxSizing: 'border-box'`, `minWidth: 0`; no
  fixed pixel width. Treat ~320px as the narrow end.
- **Route-specific composition:** choose stable grid tracks, aspect ratios, and min/max constraints for
  each decision surface. Do not force every route into the same auto-fit card grid.
- **Dashboard-specific composition:** every primary workspace gets an intentional default dashboard
  with several coordinated information regions. Do not require users to cycle a route dropdown to see
  basic scope health, money, work, exceptions, and actions that belong together.
- **Adaptive navigation:** horizontal tabs and vertical rails are both valid. Choose based on workspace
  count, label length, workflow, and chart-width needs. Preserve one workspace model across responsive
  orientation changes and provide correct `tablist`/`tab` semantics or equivalent navigation landmarks.
- **Large / projector displays:** step the content `maxWidth` up via `@media (min-width: …)` (e.g.
  1280 → 1440 → 1680px) so big screens use the canvas.
- **Full-screen use of space:** dashboards should gain columns, analytical width, comparison context,
  or adjacent decision panels as space increases. Cap compact inline previews at realistic inline width;
  do not cap the full operational dashboard to that same width.
- **Isolated experiences:** isolated full-screen roots still follow mobile/desktop/keynote constraints,
  but they do not inherit shared operational navigation or mutate its saved route/filter state.
- Use cards only for repeated entities, approvals, modals, or genuinely bounded tools. Do not nest
  cards or turn full-width sections and every chart into floating cards. Maps, Sankey flows, radial
  views, comparison canvases, and timelines may use unframed analytical space.

---

## 15. Accessibility & visual finish

- **Dark-mode contrast:** token-based throughout; no hard-coded text colors; audit badges, rings,
  banners, and any brand surfaces.
- **Real links:** external links use `target="_blank"` **and** `rel="noopener noreferrer"`.
- **Empty / light-day states** must be positive and intentional ("You're all caught up on important
  mail.", "No meetings today - enjoy the open calendar.").
- **Iconography:** make it meaningful and domain-specific; status, risk, approval, budget, and capacity
  icons reinforce visible labels rather than decorating the surface.
- Provide `aria-label`s on icon-only controls; decorative visuals use `aria-hidden`.
- Every D3/Vega chart has a visible insight sentence and keyboard-reachable table/list equivalent.
  Tooltips supplement labels and never contain the only exact value. Color, area, link width, angle,
  geography, proximity, or animation is never the sole carrier of meaning.

---

## 16. Live integration (deferred phase) & libraries

- **D3 visualization modules** - use the smallest set required for the approved chart: selection,
  scale, shape, hierarchy, Sankey, geo, zoom, array, or time formatting. Wrap imperative rendering in
  React components with deterministic teardown; do not let D3 own application state.
- Prefer reusable typed React chart components for recurring forms (trend/area, capacity bars,
  waterfall, progress donut, bubbles, treemap, Sankey). D3 computes scales/layout/paths; React owns
  data, selection, events, accessible names, and lifecycle.
- Do not hand-position data marks with CSS when an installed chart/layout module can encode the values.
  Use `scale*`, `pie`/`arc`, `hierarchy`/`treemap`, or `sankey` so geometry is derived from data.
- Metric/grouping controls supply materially different arrays, hierarchy shares, paths, group headings,
  and narratives. Add tests that compare geometry/data identities before and after selection.
- Separate comparison series enough to read them. Preserve established values/endpoints, but avoid
  overlapping actual/forecast paths that visually collapse into one line.
- Every SVG uses `role="img"`, a metric-specific `aria-label`, `<title>`, `<desc>`, visible exact values
  where practical, and a neighboring textual insight. Interactive marks support keyboard activation.
- **Vega/Vega-Lite** - optional for declarative analytical views where it reduces custom code. Bundle
  specifications and geography locally; never fetch runtime map tiles or specifications.

- **PnP React controls** (`@pnp/spfx-controls-react`) - use when they add value; **deep imports only**
  (`.../lib/ListView`). Pass the component context down. Do **not** use `@pnp/spfx-property-controls`.
- **PnPjs v4** (`@pnp/sp`, `@pnp/graph`) for live data. Singleton `getSP`/`getGraph` initialized **once**
  from the Copilot component context; **selective imports**; always `.select(...)`.
- Keep the mapper and view models unchanged when swapping Mock → live service via a `useMock` flag /
  service factory.

---

## 17. Build, lint & packaging

### 17.1 Commands

- Dev: `heft start --clean` (`https://localhost:4321`).
- Validate: `heft test --clean` (build + lint + jest).
- Release/final gate: `npm run build`.
- The future-sample `build` script MUST run this order as one command:

  ```bash
  npm run check:intents && npm run check:mock-media && npm run check:gallery && heft test --clean --production && heft package-solution --production && npm run check:generated-plugin && npm run check:package-output
  ```

  Keep both generated-output checks after `package-solution`: `check:generated-plugin` validates
  generated `ai-plugin.json` inside the SharePoint-embedded agent ZIP, then `check:package-output`
  audits the final `.sppkg`. Do not ask operators to remember separate release commands that can package
  an invalid catalog or skip generated output validation.
- Node.js **>=22.14.0 <23.0.0**.

### 17.2 Lint / Griffel gotchas (learned - avoid these)

- **No inline `style={{…}}`** (rule forbids CSS inline styles) → use `makeStyles` classes; for dynamic
  values like stagger delay, use discrete static classes.
- **No `background` shorthand** in `makeStyles` (Griffel) → use `backgroundImage` (+ `backgroundColor`).
- Do not mix a border shorthand in a base Griffel style with `borderColor` in a nested state such as
  `:disabled`; override the complete `border` declaration in that state. Disabled controls must pair
  native `disabled` semantics with visibly muted token-based foreground, background, border, and cursor.
- **Dot-notation** preferred → object keys used with dot access must be valid identifiers (avoid
  hyphenated keys you then index with `['…']`).
- Animations use `animationName` with **inline keyframe objects**; reference shared keyframes from
  `utils/motion.ts`.
- Keep component functions formatted across readable lines. Long single-line JSX makes structural
  patches ambiguous and increases the chance of inserting fragments into neighboring functions.
- For generated/minified legacy lines, use exact one-occurrence replacements only after verifying the
  match count is exactly one. Never run an unbounded repository-wide replacement.
- After the first structural edit, compile immediately before another edit. If a patch corrupts a
  boundary, recover the smallest owning function from the last compiled state/session evidence; do not
  continue stacking edits on malformed JSX.
- Manual code edits use the repository patch tool. Formatting/bulk generation may use approved scripts;
  scripts must be deterministic and rerunnable.

### 17.3 Quality gate

- A phase is not done until focused behavior tests and `heft test --clean` are **green with zero
  warnings**. Build success without behavior/evidence coverage is not completion.
- Report filtered test runs precisely: distinguish selected tests passed, total tests discovered, and a
  complete all-tests gate. Never turn a filtered run's discovered total into an “all tests passed” claim;
  refresh package/evidence totals only after the corresponding complete command runs.
- Maintain one tenant-free UX harness capable of selecting every intent, host width, and theme.
- Minimum inline matrix for a multi-intent sample:
  - every catalog intent at narrow (~340px) and standard (~760px) widths;
  - light and dark themes;
  - runtime/page errors, horizontal overflow, broken images, unlabeled controls, unlabeled/blank charts;
  - keyboard focus/activation for component controls;
  - reduced motion and real browser 200% page-scale emulation;
  - useful default, changed/filter state, selected detail, no-match, and error fallback as applicable.
- Minimum full-screen matrix for a multi-workspace sample:
  - every default workspace dashboard at mobile (~340px), standard/tablet (~760px), desktop (~980px+),
    and keynote/projector width when available;
  - every navigation orientation actually used, including keyboard movement, selection semantics, and
    focus on destination content;
  - one exact inline-to-full-screen continuation per workspace and every isolated destination;
  - selectors materially update coordinated dashboard regions; decision queues open the matching review;
  - runtime/page errors, horizontal overflow, blank charts, unreadable labels, and stranded inline-width
    content checks in light and dark themes.
- Save one screenshot per intent and a JSON evidence summary with timestamp, counts, failures, test total,
  warning count, package artifacts, and external prerequisites. Evidence belongs under a predictable
  `ux-review/evidence/` path and is refreshed after material visual changes.
- Local harness evidence cannot prove tenant CSP, `requestDisplayModeAsync`, iframe focus restoration,
  or host screen-reader output. Record unresolved `{tenantDomain}`/authentication as a single explicit
  external gate; do not leave broad implementation tasks ambiguously open.
- Required test families:
  - catalog/layout uniqueness and registration/schema/media audits;
  - intent resolver normalization, compact params, deterministic signatures, and fresh-versus-passive
    properties-version behavior;
  - information defaults plus retained-control effects, detail, no-match, error boundary;
  - review queue/evidence/safeguard/rationale/confirm/receipt/updated-queue semantics;
  - form prompt prefill/validation/Edit/review/confirm/receipt/reset;
  - owner-document style insertion and current-user/media fallbacks;
  - calculations and mock referential integrity.

### 17.4 Ship the package

- Commit the built **`sharepoint/solution/<name>.sppkg`**. Un-ignore **only** the package in
  `.gitignore` (re-include the folder, ignore its contents, un-ignore the `.sppkg`); keep `debug/` and
  other build junk ignored. Repackage after substantive changes.
- Keep exactly the current Teams/Copilot agent ZIP; delete stale pre-rename/generated ZIPs before
  packaging. Inspect ZIP entries to confirm manifest, color icon, outline icon, and plugin/agent files.
- After packaging, report audit counts, tests/failures, warning count, artifact names/sizes/timestamps,
  diagnostics, `git diff --check`, and whether temporary review/dev servers were stopped.

---

## 18. Optimized delivery and bundle efficiency

Bundle size is a release requirement, not a cleanup task. Optimize the deployable production package,
while using development bundles and source maps only to diagnose which modules cause growth.

### 18.1 Share one runtime across related Copilot Components

- When a solution has multiple Copilot Components that use the same React, Fluent UI, services, or
  experience graph, place their entries in **one shared bundle** in `config/config.json`. Each component
  keeps its own manifest, GUID, tool, and entrypoint inside that bundle. Validate component-entry count
  and exact manifest coverage rather than expecting one bundle per component.
- Separate bundles remain valid when they produce a measured lazy-loading, update, or isolation benefit.
  Record the reason and compare total compressed package size plus the largest initial-load bundle; do
  not assume more bundles are smaller or that one bundle is universally best.
- Keep shared UI, data services, schemas, immutable seeds, and media catalogs behind common modules.
  Avoid importing an unrelated feature graph into an otherwise isolated bundle.
- Use supported named imports from tree-shakable packages. `@fluentui/react-icons` declares
  `sideEffects: false`; import only named icons from its supported package export and verify production
  output contains only those icons. Do not use unsupported internal deep paths. If every component uses
  one shared application graph, bundle consolidation prevents the same tree-shaken icon subset from
  being emitted once per component.

The catalog/configuration script SHOULD generate this shape for a shared graph; do not hand-maintain a
bundle object per component:

```json
{
  "bundles": {
    "<sample>-copilot-components": {
      "components": [
        { "entrypoint": "./lib/copilotComponents/<name>/<Name>CopilotComponent.js", "manifest": "./src/copilotComponents/<name>/<Name>CopilotComponent.manifest.json" }
      ]
    }
  }
}
```

The validator compares catalog count, bundle-entry count, unique manifest count, and exact source-
manifest coverage. It validates component entries, not `Object.keys(config.bundles).length === count`.

### 18.2 Keep media out of repeated JavaScript

- Emit photos and other substantial media as package-hosted files and reference them by URL. A shared
  URL string is cheap; repeating encoded binary content in every JavaScript entry is not.
- Import only the media keys needed by an experience. Do not return a global `media` object containing
  every asset from every mock data service response.
- Optimize source images before packaging and choose dimensions appropriate to their rendered size.
  Preserve a source/license record and a graceful visual fallback.
- If a measured shared bundle keeps an existing base64 catalog, verify it occurs in exactly one
  JavaScript artifact and include its compressed contribution in the release report. Migrate it to
  package-hosted files when image growth, independent caching, or lazy loading justifies the change.

### 18.3 Clean production packaging is mandatory

- The release command MUST run source audits, clean before compiling, package, then inspect generated
  output. Use the canonical §17.1 `npm run build`; its core compile/package sequence remains:

  ```bash
  heft test --clean --production && heft package-solution --production
  ```

- Keep one npm script for the complete §17.1 sequence so local and automated builds cannot drift. Running
  only `heft package-solution --production` can package stale unminified files already present under
  `sharepoint/solution/debug/ClientSideAssets`.
- After packaging, staging MUST contain only the current hashed production component JavaScript and
  its required license/static files. A plain `*-copilot-component.js` beside a hashed
  `*-copilot-component_<hash>.js` is a release failure.
- Do not judge production delivery size from `dist` after a development build. Inspect the `.sppkg`
  archive and its `ClientSideAssets` entries.

### 18.4 Release size gates

For every final build, record the `.sppkg` size, total compressed client-side JavaScript, largest
JavaScript entry, and duplicate media count in `todo.md` or the build log.

- **No stale outputs:** zero unhashed development component bundles in the package.
- **No duplicate media:** each substantial image binary/hash is packaged once; zero complete base64
  image catalogs repeated across component bundles.
- **Investigate regressions:** explain any package increase over 10% from the previous accepted build.
- **Default investigation thresholds:** inspect any production JavaScript entry over 1 MiB raw or any
  sample `.sppkg` over 10 MiB. A justified feature may exceed these values, but not silently.
- Compare both raw and compressed sizes. Use source maps or a bundle analyzer to attribute growth to
  application source, media, Fluent icons, and other dependencies before changing architecture.
- Record bundle strategy (shared or intentionally split), component-entry count, production JavaScript
  file count, and the reason for any exception. Smoke every component after consolidation because one
  shared bundle must still expose each manifest/entry independently.

### 18.5 Required automated package audit

`scripts/validate-package-output.mjs` MUST inspect `paths.zippedPackage` from
`config/package-solution.json` after packaging and fail on:

- zero production JavaScript files or any unhashed/stale JavaScript under `ClientSideAssets/`;
- duplicate substantial media hashes in package-hosted files;
- the same inline base64 image payload appearing across multiple JavaScript bundles;
- Fluent icon-font payloads when the sample uses named SVG icon imports.

It MUST report package bytes, production JavaScript file count/total bytes/largest entry, packaged media
count, inline image count, duplicate counts, icon-font presence, and configurable investigation flags.
Use `MAX_PRODUCTION_JS_BYTES` and `MAX_SPPKG_BYTES` (defaults: 1 MiB and 10 MiB) as investigation
thresholds, not automatic architectural verdicts. Save or capture this JSON-shaped output in the build
log/evidence and update `todo.md` when the accepted baseline changes.

---

## 19. Docs & sample gallery

- **README** from the PnP sample template: Summary, Screenshots, Applies to, Prerequisites, **Minimal
  Path to Awesome** (with a "ready-made package" callout linking the `.sppkg`), Features, mock-data and
  safety disclosure, accessibility/responsive evidence, localization/worldwide scope, validation
  status, demo assets, Solution structure, References, author + version history.
  Use plain hyphens `-` in prose (avoid em dashes). One screenshot per row (no crowded tables).
- If a public tenant-testing/deployment video exists, include a GitHub-compatible clickable thumbnail
  (`img.youtube.com` linked to the video) plus a text link. Do not use unsupported iframe embeds in a
  GitHub README.
- Maintain one prompt-routing matrix for every current-target tool: primary prompt, expected tool,
  expected normalized properties, inline result, and full-screen destination. Add sibling collision
  pairs and record selected tool, extracted properties, visible UX, Expand destination, and whether a
  fresh prompt resets defaults. Use the same matrix as routing test data and demo rehearsal input.
- For a complex catalog, keep a concise component plan that separates current-target tools from future
  candidates and states why each current tool earned independent routing. Keep demo scripts separate
  from this engineering playbook. Publish three useful cuts where scope warrants it:
  - a roughly 3-minute keynote that proves multiple inline UX shapes before one full-screen payoff;
  - a roughly 10-minute business-value journey across evidence, trade-offs, workspaces, and confirmation;
  - a roughly 5-minute developer walkthrough pairing live UX with exact owning code and build output.
  Each script includes audience, setup/reset, prompts, expected tools/properties, presenter actions,
  safety/feature guardrails, fallback path, and rehearsal checklist.
- For agents with 11+ operational tools, document the capability explorer, its final conversation
  starter, category model, prompt copy/launch behavior, safe preview mode, and how future maintainers add
  education metadata for a new tool without editing the explorer UI.
- **`assets/sample.json`** (PnP gallery schema): unique `name`, `source: "pnp"`, title, short/long
  descriptions, `products`, `metadata` (`SAMPLE-TYPE`, `CLIENT-SIDE-DEV: React`, `SPFX-VERSION`),
  `thumbnails` (reference **only assets that exist**), `authors`, `references`. Keep thumbnails in sync
  with the real files in `assets/`.
- Capture every current inline component plus representative full-screen workspace, mobile, dark,
  education, and receipt states for publication. Promote only settled, validated harness evidence or
  recapture from the current build with animation disabled and the host frame clipped consistently.
- Prefer a deterministic `capture-gallery-assets.mjs` Playwright script: derive intent names from the
  catalog, select harness intent/mode/width controls, disable animation/transition during capture, wait
  for two animation frames, clip `.host` rather than the harness toolbar, use stable kebab-case names,
  and fail on missing/blank/overflowing output. Recapture only after the visual matrix is green.
- `validate-gallery-assets.mjs` MUST parse `sample.json`, enforce required PnP metadata, unique names and
  orders, local file existence, PNG signature/minimum dimensions, descriptive alt text, exact raw GitHub
  URLs, expected screenshot count, and no unlisted publication PNGs.
- Before public submission, validate README/demo links, run the canonical clean build, report final
  artifact hashes, stop review servers, perform a clean-clone/offline rehearsal, and isolate any
  tenant-authenticated CSP/focus/screen-reader/high-contrast prerequisite as one external gate.
- Do not add another competing rules, skill, or agent-definition file for this sample. This project-
  specific playbook and `todo.md` are the implementation authorities.

---

## 20. Solution structure (mirror this)

```text
samples/<name>/
  README.md
  todo.md                         # phased Markdown checkbox tracker
  agentic-creation-rules.md       # project-specific engineering playbook
  <Sample>-3-Minute-Demo.md       # short inline-first keynote
  <Sample>-10-Minute-Demo.md      # comprehensive business-value journey
  <Sample>-5-Minute-Tech-Demo.md  # UX + architecture/code walkthrough
  <Sample>-Demo-Prompts.md        # all-tool routing/property/collision matrix
  assets/                         # sample.json, screenshots, faces/, source images
  scripts/                        # catalog/media/gallery/plugin/package-output validators and generators
  config/                         # Heft/SPFx + copilot-agent.json, config.json, package-solution.json
  copilot/                        # manifest.json, declarativeAgent.json, ai-plugin.json, instruction.txt
  sharepoint/solution/<name>.sppkg  # committed, ready-to-deploy
  src/copilotComponents/<name>/
    <Name>CopilotComponent.ts / .manifest.json / <Name>CopilotComponentProperties.ts
    components/
      <Name>App.tsx               # root selector
      <Name>ThemeProvider.tsx     # single FluentProvider (stable-key)
      <Name>Inline.tsx             # focused intent surface
  src/copilotComponents/shared/
    experiences/                   # shared intent host, workspace shell, isolated full-screen roots
    dashboards/                    # useful default workspace dashboard compositions
    capabilityExplorer/            # reusable catalog education, prompt actions, previews, gallery
    models/                        # sources/, canonical models, seeds, routes
    services/                      # mock aggregate, mappers, session store, current user
    mockData/                      # source records, people, embedded media
    visualizations/                # D3/Vega adapters, renderers, specs, summaries
    utils/                         # datetime, formatting, motion, settings
```

---

## 21. Cross-sample consistency checklist (apply to every sample)

- [ ] Final component catalog approved; every component generated with its final immutable name through
  Yeoman by the user or agent; no manually copied scaffold.
- [ ] Package identity frozen before generation; API plugin v2.4 `name_for_human` is 20 characters or
  fewer (using a short plugin-facing name if needed), human description <= 100, model description <= 2,048.
- [ ] Current-target tools satisfy the component selection test; future/supporting intents remain
  documented internal routes or candidates rather than speculative component bundles.
- [ ] Catalog-driven configure/validate scripts pass: unique GUIDs/tools/descriptions, expected bundles,
  schemas, resources, registrations, and no scaffold placeholders.
- [ ] Copilot Component (no web part / no property pane); Heft; React 18; Fluent v9.
- [ ] Focused inline root + approved shared/isolated/hybrid full-screen topology;
  `requestDisplayModeAsync` for the consistent top-right View in full screen control.
- [ ] Every primary workspace has a useful default dashboard; navigation orientation is justified by
  workspace count/labels/workflow and uses the available mobile, desktop, and projector canvas.
- [ ] Every intent catalog entry owns an exact shared-workspace or isolated full-screen destination;
  Expand preserves prompt context and validated transient state rather than opening generic home.
- [ ] Intent resolvers normalize unknown input, compact absent params, and increment a deterministic
  properties-version token only for fresh prompt state, never passive host rerenders.
- [ ] The component instance owns typed transient information/review/submit state across host mode
  rerenders; fresh signatures clear it; destination modules consume transferred state where exact
  continuation is claimed.
- [ ] Operation-aware information/review/submit dispatchers; unique `data-layout` identities; no generic
  fallback body or shared domain review evidence.
- [ ] If the catalog has 11+ operational inline tools, one generated Agent Capability Explorer exists,
  complete education metadata validates, and the final conversation starter routes to it.
- [ ] Single stable-key theme provider; Griffel renderer targets `ownerDocument`; tokens only; no
  `background` shorthand; no inline styles.
- [ ] Typed service contracts + Mock impl; source-appropriate raw data; canonical view models; mappers;
  relative-time resolution.
- [ ] Standard M365 demo personas; host identity/photo when already available; bundled fallback; one
  connected story.
- [ ] Authored imagery is offline and referenced through one shared media catalog; substantial images
  are package-hosted or a measured base64 catalog is emitted once; no app-initiated media requests;
  graceful fallbacks.
- [ ] Every retained control changes records/grouping/geometry/calculation/evidence/stage; unsupported
  decorative affordances removed; option datasets have material variance.
- [ ] Information intents cover useful default, changed/filter, selected-detail, no-match, and shared
  error fallback where applicable.
- [ ] Review decisions cover queue -> evidence -> draft -> confirm -> semantic receipt -> updated queue;
  visible safeguards/rationale; green approved, red returned/rejected.
- [ ] Submit/request forms cover prompt prefill -> visible validation -> matched review -> confirm ->
  receipt -> prompt-backed reset; every reviewed value is draft-backed or explicitly derived.
- [ ] Confirmed decisions/submissions append typed immutable session receipts; in-memory fallback,
  guarded sessionStorage, subscriptions, remount restoration, and Reset are tested. Unconfirmed drafts
  and host context are not persisted.
- [ ] D3/Vega geometry derives from data; metric/group selectors redraw materially different data;
  accessible names, exact values/insight, keyboard behavior, and text/list equivalent supplied.
- [ ] Approved deterministic signature experiences with immediate insight and reduced-motion safety.
- [ ] Optional session-persisted settings that reshape the UX; visibility-driven re-flow layout.
- [ ] Staggered entrance + reduced-motion guards; large-display scaling; positive empty states.
- [ ] Tenant-free all-intent harness passes width/theme/runtime/overflow/image/label/chart/keyboard/reduced-
  motion/200%-zoom matrix; screenshots and JSON evidence saved.
- [ ] Capability explorer search/categories/prompt actions/read-only previews/tour pass; every advertised
  intent has deterministic preview coverage and the explorer does not advertise itself.
- [ ] Tenant-authenticated Workbench smoke passes CSP, display-mode request, iframe focus, and screen-reader
  output, or the missing tenant/auth prerequisite is explicitly recorded.
- [ ] Catalog/media audits and `heft test --clean` green (zero warnings); current agent ZIP and committed
  `.sppkg` inspected and regenerated; generated plugin v2.4 metadata/dynamic MCP discovery and length
  limits pass against the actual SharePoint-embedded ZIP; no stale package artifacts.
- [ ] Bundle strategy is measured: shared component entries deduplicate common runtime/media/icons or
  intentional split bundles document their lazy-loading benefit; production icon output contains only
  supported named imports; package report records JS count/size and duplicate-media count.
- [ ] `check:package-output` runs last and passes against the final `.sppkg`: hashed JS only, no duplicate
  media/base64 payloads across bundles, no accidental Fluent icon font, and size investigation flags
  recorded against the accepted baseline.
- [ ] `check:gallery` passes: every publication screenshot exists, is a valid adequately sized PNG,
  has unique order/alt text/raw URL in `assets/sample.json`, and no publication PNG is unlisted.
- [ ] Prompt-routing matrix covers every current tool, normalized properties, inline result, exact
  full-screen destination, sibling collisions, and fresh-invocation reset behavior.
- [ ] README includes real screenshots, ready-made package, safety/accessibility/worldwide/validation
  scope, demo links, and a GitHub-compatible tenant-testing video when available.
- [ ] Short keynote, longer business demo, and technical/code demo are rehearsable, accurately scoped,
  linked from README, and do not claim unimplemented state transfer or external writes.
- [ ] Clean-clone/offline build rehearsal passes; final `.sppkg` and agent ZIP hashes are reported;
  temporary servers are stopped; one canonical tenant prerequisite gate names any remaining host checks.
- [ ] `todo.md` generated first and kept current with Markdown checkboxes and validation-backed status.
