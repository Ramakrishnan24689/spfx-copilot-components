# Zava and My Day SPFx 1.24 RC0 readiness

Target confirmed on October 20, 2026: SPFx **1.24.0-rc.0**, React / ReactDOM **18.3.1**,
React types **18.3.31 / 18.3.7**, and Heft **1.3.2**.
Reference: the October 19 Project Tracker upgrade (`343f299`).

## Scope and release gates

Eight Zava-prefixed samples identify `vesajuvonen` as their contributor in `assets/sample.json`.
Zava Retail Store identifies `PaoloPia` and is excluded from this contributor-specific upgrade.
No sample is certified for GA merely by adopting RC0.

The requester subsequently added **My Day** to the same runtime, documentation, intent/starter,
visual and deployment-package validation scope.

For each in-scope sample: inspect lifecycle and test APIs; verify distinct tool/component ownership
and starter targets; align source, documentation, and gallery metadata; install the locked dependency
profile; run its production build, tests, and asset checks; inspect dynamic MCP discovery and the
resulting deployment archives; record the exact validation and remaining external gates below.

The canonical creation guide is [assets/agentic-creation-rules-golden.md](assets/agentic-creation-rules-golden.md).
All nine existing local `agentic-creation-rules.md` files are synchronized from it. My Day was
subsequently added to the runtime upgrade scope as well.

## Progress

The framework/dependency migration and production builds have passed for all nine in-scope samples.
The deeper UX audit found product-completion gaps that cannot be certified by unique tool names or
layout IDs alone. The requester explicitly expanded scope to complete Procurement, then Innovation
and Revenue. All three expanded product-completion gates are now implemented, tested and packaged;
their final evidence replaces the earlier migration-only baselines below.

| Sample | Starting point | Status |
| --- | --- | --- |
| [Project Tracker](samples/zava-project-tracker/README.md) | RC0 / React 18 | 172 tests; 100 local UX states; current package/agent verified |
| [Customer Resolution Center](samples/zava-customer-resolution-center/README.md) | Beta 3 / React 18 | 45 tests; 81 visual states; current package/agent verified |
| [Employee Agent](samples/zava-employee-agent/README.md) | Beta 2 / React 17 | 189 tests; 72 original captures plus 12 explorer states; 21-component package verified |
| [Innovation Portfolio](samples/zava-innovation-portfolio/README.md) | Beta 2 / React 17 | 64 tests; 133 captures; expanded workflows and final archives verified |
| [IT Concierge](samples/zava-it-concierge/README.md) | Beta 2 / React 17 | 39 tests; 39 cropped publications + 62 narrow/dark states pass |
| [One Hub](samples/zava-one-hub/README.md) | Beta 5 / React 18 | 50 tests; 4,080 fresh responsive states; five packages verified |
| [Procurement Command Center](samples/zava-procurement-command-center/README.md) | Beta 3 / React 18 | 94 tests; 84 visuals; 22 purpose-specific views and final archives verified |
| [Revenue Deal Room](samples/zava-revenue-deal-room/README.md) | Beta 3 / React 18 | 87 tests; 13 curated + 105 business captures; all 21 experiences and archives verified |
| [My Day](samples/my-day/README.md) | Beta 2 / React 17 | 14 tests; 30 browser states; focus contracts and final archives verified |

## Shared findings and applied changes

- Confirmed RC0 rather than RC1 with the requester.
- RC0 uses dynamic MCP discovery rather than embedded static functions. Generated-plugin validation
  must reflect that shape while preserving independent source-tool and registration audits.
- Updated the golden guidance for RC0 dependencies, React 18 explicit children and root lifecycle
  tests, dynamic MCP package validation, and honest separation of local and authenticated evidence.
- All nine existing local creation guides, including My Day's current guide, are byte-identical
  to the updated golden guide.
- Added a repository-level audit that verifies the lockfile/runtime graph, immutable tool identities,
  compiled property schemas, canonical starter targets, final solution/feature versions, exact
  packaged JavaScript bytes versus current release output, embedded/Teams agent equality, source
  versus packaged instructions, publication image dimensions, and passing full Jest evidence.
- Wired canonical starter/source/packaged-agent checks into every sample's own generated-plugin gate,
  so standalone builds do not silently ship stale starter prompts.
- Restored missing browser dependencies before running actual browser evidence; the IDE test adapter
  did not discover Heft tests, so the repository's canonical Heft/Jest pipelines provide test results.

## Findings and applied changes by sample

### Project Tracker

- Used the October 19 RC0 migration as the reference, not a different React/SPFx release line.
- Re-ran the complete production gate: 172 tests, 31 source tools, 188 optional prompt fields,
  39 gallery entries, dynamic discovery and package-output checks.
- Initial rollout added canonical ownership for three starters; the six-starter follow-up below supersedes that baseline.
- Browser-reviewed all 31 inline tools at standard light, narrow light and dark, plus full-screen
  continuations: 100 local states, zero failures. Refreshed inline publication images.
- Fixed the local review server's query-string path handling and updated current metadata/guidance.

### Customer Resolution Center

- Upgraded Beta 3 framework/build/lint packages and React type pins to RC0; retained the existing
  React 18 root and added four reuse/independence/teardown tests (41 -> 45 tests).
- Replaced static-function expectations with dynamic MCP discovery validation.
- Added explicit six-starter routing boundaries to agent instructions.
- Restored three missing README gallery entries: resolution plan, knowledge-from-resolution and
  case-evidence diagnosis. The previous publication gate failed on the missing entries.
- Re-captured all 81 visual states and retained the flagship inline interaction gate.
- Bumped solution/feature and agent versions, regenerated archives and release evidence.
- **External:** the media-provenance checker explicitly reports pending public media-rights review;
  localization/RTL and authenticated host/accessibility gates are not declared complete.

### Employee Agent

- Migrated both Home and family host bases from legacy render/unmount to persistent React 18 roots.
- Added explicit children props to four wrappers; migrated DOM tests to React `act`/client roots and
  strengthened checkbox assertions to DOM semantics rather than serialized attribute ordering.
- Added eight lifecycle tests across the two host bases: 178 total tests pass.
- Fixed a real production webpack mismatch using the reference Fluent motion compatibility pin
  `@fluentui/react-motion@9.16.1`.
- Initial rollout disambiguated the three dashboard/profile/milestone starters; the follow-up below replaces them with six explicit owners.
- Refreshed all 32 publication images and checked 72 standard/narrow/dark/workspace states.
- Initially retained the 20-tool scope. The follow-up below removes the discovery exception by adding the supported generated explorer.

### Innovation Portfolio

- RC0/React 18 runtime, types, host root, theme children, harness and package migration passed.
- Corrected an obsolete gallery-version assertion and refreshed the original 11 curated visuals.
- Fixed the existing production audit gate's vulnerable `fast-uri@3.1.6` override with `3.1.8`;
  the production audit then passed.
- **Product gap found and resolved:** seven business operations reused a generic workflow with
  uncontrolled amount/owner inputs and canned consequences. The requester approved full completion.
  Seven controlled domain flows now have real calculations, validation, exact-record decisions,
  review/confirmation/semantic receipts and reset; all 17 intent/property surfaces were audited.
- Narrowed meaningful schemas and retained state across passive mode/theme changes; unknown IDs
  remain visible no-match rather than defaulting to an unrelated idea.
- Final production gate: **64 tests, zero warnings**, clean production dependency audit, harness
  type check, and **133 visual captures** (11 curated plus 122 business/responsive/state captures).
- Removed the accidentally introduced legacy test `Simulate` import; tests use native DOM events and
  React `act`. Current package and agent bytes pass the independent repository audit.

### IT Concierge

- Migrated the shared host and visual harness to React 18 roots.
- Corrected cleanup from the web-part-style `onDispose` hook to awaited Copilot `onTeardown`.
- Added four lifecycle tests: 39 total tests pass.
- Added canonical starter targets using actual registered `Tool` names; fixed the generated matrix
  that previously printed internal view keys as if they were tool names.
- Corrected an obsolete gallery validator URL pointing at `spfx-copilot-apps`.
- Improved publications to crop the actual experience at standard inline width, removing unused
  browser background. All 39 curated publications and 62 additional narrow/dark states pass.
- Retained the measured main-bundle/lazy-chunk strategy and existing sample size budgets.

### One Hub

- Upgraded the complete mixed-host SPFx dependency set from Beta 5 to RC0 and updated React types.
- Preserved 38 SharePoint web parts and 37 Copilot Components (75 SPFx manifests total).
- Corrected the explicit static-discovery override to dynamic discovery and retained source-tool/
  compiled-schema/branding audits rather than dropping validation when generated functions became empty.
- Awaited base teardown and added four lifecycle tests; replaced the obsolete React-act typing
  workaround with direct React `act`. All 50 tests pass.
- Replaced Contoso publisher placeholders with PnP Community metadata.
- Rebuilt the agent, `.sppkg`, and all three Teams workspace archives. Package/evidence checks now run
  after packaging and automatically refresh current README/TODO byte counts.
- Re-captured 39 engineering views and 12 local publication views, preserving three historical
  authenticated Teams images as historical evidence only.
- Re-ran and recorded all 4,080 responsive states with zero failures.
- Documented the intentional mixed-host architecture and audited framework-owned React 17 copies;
  application React/ReactDOM remain 18.3.1.

### Procurement Command Center

- **User-approved expanded completion:** replaced the generic working-note fallback with 22 named,
  purpose-specific business components while retaining all generated identities and tool names.
- Replaced 506 copied property slots with 87 described, intent-specific optional fields. Exported
  schemas retain portable types; runtime UX enforces quantities, dates, weights, authority and rationale.
- Added actual buying-route comparisons, currency-coherent cohorts, policy evidence, sourcing drafts,
  weighted supplier evaluation, guarded awards, contract/qualification/mitigation/negotiation work,
  invoice reconciliation, PO changes, recovery evidence and transparent portfolio scenarios.
- All 12 submit/review operations have explicit review/confirmation, typed session receipts and reset.
  Approval authority cannot be raised by prompt values; legitimate return/decline remains available.
- Unknown records remain no-match and publish no-match model context, not healthy default evidence.
- Preserved drafts across passive theme/mode changes; opening another task protects unconfirmed
  edits with keep/discard and focus continuation. Capability previews cannot confirm actions.
- Added complete numeric/table equivalents for weighted supplier evaluation and scoped model evidence.
- Replaced the old build-order deadlock that required an existing package before the first package
  could be built; release evidence now derives from current bytes and current test totals.
- Un-ignored only the requested `.sppkg`; generated/debug output remains ignored.
- All 84 standard/narrow/dark/workspace/review/receipt visual states pass; publication images are
  cropped to real content and the reviewed award states are included in gallery metadata.
- Final expanded production gate passes **94 tests with zero warnings**. The independent root audit
  verifies current JavaScript, compiled schemas, canonical starters and both deployment archives.

### Revenue Deal Room

- RC0 runtime/build/type migration, root lifecycle coverage and original 13 visual captures passed.
- Tightened the first starter to explicit deal-risk analysis and added six-owner routing instructions.
- **Product gap found and resolved:** specialist information tools returned the same generic
  "Strong / 3 verified sources / Resolve sponsor access" panel, and multiple operations used a generic
  workflow. The requester approved full completion, not merely different labels.
- All **21 specialist experiences** now have specific evidence/analysis or one of **ten guarded
  workflows**, with accurate record scoping/no-match, controlled properties, ramp-aware commercial
  economics, review/confirmation/receipts/reset, retained mode/theme state and committed model context.
- Preserved the four rich role dashboards and all immutable identities.
- Final production gate: **87 tests, zero warnings**, harness type check, 13 curated captures and
  **105 business-matrix captures with zero failures**. Current release JavaScript and embedded/Teams
  agent bytes pass the independent repository audit.

### My Day

- Added explicitly by the requester after the Zava rollout began.
- Migrated legacy render/unmount to a retained React 18 client root, explicit wrapper children, direct
  React `act`, iframe style insertion regression and independent lifecycle tests.
- Replaced unused required `message` with a meaningful optional `focus` enum. This is intentionally
  one composed personal-day tool, not six falsely advertised independent components: four canonical
  starters own four distinct visible focuses of `MyDayTool`; news/mail focuses also work.
- Lifted data, task checks, drill-down and panel state into the invocation root so passive host
  mode/theme changes do not discard work. Fixed due-today counting so future tasks are excluded.
- Added scoped mock-data model context and clarified the local focus planner is not an AI/WorkIQ call.
- Fixed reduced-motion drawer animation/overflow, narrow drawer replacement and the grid's internal
  minimum-width clipping. Captured all six inline focuses and workspace/panel variants.
- Removed public-npm-only restore assumptions after registry verification found RC0 unavailable on
  npmjs.org. The requester approved the configured Microsoft proxy/backing feed. The renamed registry
  validator allows only approved hosts and rejects credentials/query tokens, not arbitrary feeds.
- Cleanly resolved a new lockfile, ran `npm ci`, and updated Fluent icons to the compatible pinned
  `2.0.337` after the clean dependency graph exposed missing DiamondDismiss exports.
- Updated workspace-specific VS Code instructions, source docs, publisher metadata, current screenshots
  and the ready-made package. The concept mockup is not promoted as an implementation thumbnail.
- Final production gate: **14 tests, zero warnings; 30 browser states, zero runtime/image/label/overflow
  failures**; source/type/starter/compiled-schema/current-package audits pass.

## Registry prerequisite and publication honesty

During validation, `npm view @microsoft/sp-copilot-component@1.24.0-rc.0 version` succeeded through the
configured Microsoft proxy but returned **404** with My Day's npmjs.org override. The requester
explicitly approved inheriting the configured Microsoft RC0 registry rather than pretending the SDK
was already publicly available there.

- Source builds need access to the approved prerelease registry/proxy and its backing feed.
- No credentials are committed. Dependency tarball URLs were checked for embedded credentials and
  query tokens across all nine lockfiles.
- Built `.sppkg` files do not require a local npm restore.
- Rehearse an official public-registry clean clone before making a public GA source-reproducibility
  claim; do not rewrite lockfile URLs to nonexistent public tarballs.

<!-- RC0-EVIDENCE:START -->
## Final verified evidence

**Nine-sample inventory: 754 passing Jest tests (740 freshly re-run Zava tests plus 14 from the unchanged My Day baseline); 204 globally unique Copilot Component identities (203 preserved plus one supported generated explorer); 52 canonical starter/focus contracts; 625 described input fields.**

The six-starter follow-up below freshly validates the eight Zava samples only. My Day retains its prior validated evidence and is byte-for-byte unchanged in that follow-up.

Validated on Windows with Node.js **22.23.2**, TypeScript **5.8.3**, and the project-local RC0/Heft toolchains.
Node 24/26 are permitted by the target engine range; this run did not claim an additional OS/Node test matrix.

| Sample | Full Jest tests | Source tools | Input fields | Publication thumbnails | Final local result |
| --- | ---: | ---: | ---: | ---: | --- |
| [zava-project-tracker](samples/zava-project-tracker/README.md) | 172 | 31 | 188 | 39 | Passed; external gates below remain |
| [zava-customer-resolution-center](samples/zava-customer-resolution-center/README.md) | 45 | 23 | 89 | 10 | Passed; external gates below remain |
| [zava-employee-agent](samples/zava-employee-agent/README.md) | 189 | 21 | 56 | 33 | Passed; external gates below remain |
| [zava-innovation-portfolio](samples/zava-innovation-portfolio/README.md) | 64 | 17 | 22 | 11 | Passed; external gates below remain |
| [zava-it-concierge](samples/zava-it-concierge/README.md) | 39 | 31 | 56 | 39 | Passed; external gates below remain |
| [zava-one-hub](samples/zava-one-hub/README.md) | 50 | 37 | 81 | 15 | Passed; external gates below remain |
| [zava-procurement-command-center](samples/zava-procurement-command-center/README.md) | 94 | 22 | 87 | 13 | Passed; external gates below remain |
| [zava-revenue-deal-room](samples/zava-revenue-deal-room/README.md) | 87 | 21 | 45 | 10 | Passed; external gates below remain |
| [my-day](samples/my-day/README.md) | 14 | 1 | 1 | 7 | Passed; external gates below remain |

### Current deployment packages

These hashes describe the actual generated files retained in this worktree, not a claim of byte-for-byte reproducibility across ZIP timestamps.

| Package | SPFx solution version | Packaged agent version | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| [zava-project-tracker.sppkg](samples/zava-project-tracker/sharepoint/solution/zava-project-tracker.sppkg) | 1.1.0.1 | 1.1.1.2 | 421,245 | `51a4015c6e3b9153f7ef5b9377d757917e0eed637221ce6840686d8c0c7787db` |
| [zava-customer-resolution-center.sppkg](samples/zava-customer-resolution-center/sharepoint/solution/zava-customer-resolution-center.sppkg) | 1.0.0.3 | 1.0.3 | 367,900 | `75550bb3e8e68e142f1aaef558836a65022c29aca6ef70adcbda471b32c2703c` |
| [zava-employee-agent.sppkg](samples/zava-employee-agent/sharepoint/solution/zava-employee-agent.sppkg) | 1.0.0.2 | 1.0.2 | 518,985 | `6fa0448d4afef51e51fcde6d8c1f68bc4f67196ae8f52cbe3e4fcfc13b3589a7` |
| [zava-innovation-portfolio.sppkg](samples/zava-innovation-portfolio/sharepoint/solution/zava-innovation-portfolio.sppkg) | 1.0.0.3 | 1.0.2 | 434,550 | `909aca002ebaf48ab54b0ed6fc60fbbf438e4a7dcdce1934d589d64191b8f8ff` |
| [zava-it-concierge.sppkg](samples/zava-it-concierge/sharepoint/solution/zava-it-concierge.sppkg) | 1.0.0.2 | 1.0.2 | 2,143,926 | `0d1f695204b71a391caca46f076fd8d01f830dffde15d2f005461753293ab8ad` |
| [zava-one-hub.sppkg](samples/zava-one-hub/sharepoint/solution/zava-one-hub.sppkg) | 1.0.0.18 | 1.0.2 | 6,205,975 | `01f01087eceb24e4152458ace15dcd7af12b6b6f237a539817589a7701f4ebec` |
| [zava-procurement-command-center.sppkg](samples/zava-procurement-command-center/sharepoint/solution/zava-procurement-command-center.sppkg) | 1.0.0.2 | 1.0.2 | 292,874 | `23c4c9b6776465e2b13365d980fe4297d9c136d104338c950703e7253d75bd2b` |
| [zava-revenue-deal-room.sppkg](samples/zava-revenue-deal-room/sharepoint/solution/zava-revenue-deal-room.sppkg) | 1.0.0.2 | 1.0.2 | 364,665 | `0e97cb7fb0a67dd1d7635d5d537caf18b321e4338591bb3418b9669a36353055` |
| [my-day.sppkg](samples/my-day/sharepoint/solution/my-day.sppkg) | 1.0.0.1 | 1.1.1 | 469,346 | `b53f33cc8f9fe9b24638cde70510304f530fc2c2f702bb62e9abb67de6287c0d` |

RC0 can append a fourth hotfix segment to the authored three-part agent version. Source base versions and actual packaged hotfix versions are both audited; the local fingerprint cache is ignored.

### Reproduction and checks actually performed

From each of the nine sample folders:

- `npm run build` — **passed** complete production TypeScript/lint/Jest, packaging, and sample-specific output gates; final builds have zero build/lint warnings.
- `npm run check:generated-plugin` — **passed** source/canonical/packaged starter checks and RC0 dynamic discovery. My Day verifies four distinct focus values on its one composed tool rather than inventing four tool identities.
- `npm ls --all --omit=dev` — **passed** production dependency/peer graphs. Upstream npm restore deprecation notices are not misreported as build warnings.

Review-harness type checks — **passed** for all nine:

- `node node_modules\typescript\bin\tsc --project ux-review\tsconfig.json` for Project Tracker, Employee Agent, One Hub, Procurement and My Day.
- `node node_modules\typescript\bin\tsc --project scripts\visual-harness\tsconfig.json` for Customer Resolution, Innovation, IT Concierge and Revenue.

Browser evidence:

| Sample | Exact browser command / validation | Result |
| --- | --- | --- |
| Project Tracker | `npm run start:ux-review` plus the local review-driver matrix | 100 states, zero failures; all 31 inline layouts and full-screen continuations |
| Customer Resolution | `npm run capture:visual`; production `check:flagship-inline` gate | 81 matrix states and 24 flagship interaction checks pass |
| Employee Agent | `npm run start:ux-review` plus local review-driver captures | 72 states, zero failures; all 32 publication images refreshed |
| Innovation | `npm run capture:visual` | 133 captures: 11 curated plus 122 business/responsive/state captures; zero failures |
| IT Concierge | `npm run capture:visual` | 39 cropped publications plus 62 narrow/dark states; zero failures |
| One Hub | `npm run capture:gallery`; `npm run capture:publication`; `npm run check:responsive -- --record` | 39 engineering + 12 fresh local publications; 4,080 responsive states, zero failures; three authenticated publication images retained as historical evidence |
| Procurement | `npm run capture:visual` | 84 actual ownership/standard/narrow/dark/workspace/review/receipt states; zero failures |
| Revenue | `npm run capture:visual`; `node scripts\capture-business-matrix.mjs` | 13 curated + 105 business states, zero failures |
| My Day | `npm run capture:visual` | 30 focus/theme/width/workspace/plan/settings states, zero failures |

Additional checks — **passed**:

- Repository-root `node assets\validate-zava-rc0.mjs <sample-name>` for all nine samples: locked RC0/React versions, allowed framework-owned React copies, source identities, compiled schemas, starter contracts, solution/feature versions, exact current release JavaScript and agent ZIP bytes, PNG dimensions, and passing full Jest evidence.
- All 203 original component GUIDs match their pre-upgrade `HEAD` identities; the follow-up adds one supported generated Employee explorer. No cross-sample GUID collision.
- All nine lockfiles have no embedded credential/userinfo or query-token tarball URLs.
- All nine local creation guides match the golden file byte-for-byte.
- `git diff --check` — **passed**.
- Parent-owned local review servers stopped after validation. No commits or pull requests were created.

The temporary driver scripts for Project Tracker/Employee are session QA helpers; their persisted numeric evidence and refreshed publication PNGs are in each sample. Native sample commands remain the reusable release gates.

### Measured larger-package baselines

IT Concierge retains one main entry and 44 lazy chunks, 2,548,049 total JavaScript bytes with a 1,228,383-byte largest chunk, within its reviewed 2 MiB per-entry / 4 MiB total / 10 MiB package budgets.
One Hub deliberately retains its mixed-host/offline-media showcase and passes its existing 15 MiB package cap; its actual package size is in the table. These are documented sample baselines, not a claim of tenant/network performance certification.

<!-- RC0-EVIDENCE:END -->

## External release gates

Local checks cannot prove natural-language tool selection in Microsoft Copilot, tenant CSP, iframe
focus restoration, host screen-reader behavior, or deployment permissions. Each starter and nearest
sibling collision needs rehearsal in a fresh authenticated conversation. These checks remain pending
unless explicit tenant evidence is recorded; static configuration checks are not model-routing proof.

<!-- SIX-STARTERS:START -->
## Six-starter and scenario-instruction follow-up

Scope: the same eight Vesa-authored Zava samples. **My Day is explicitly excluded**; all 151
tracked/untracked path states and SHA-256 values match the pre-follow-up snapshot. Retail remains
outside this contributor-specific scope.

Every Zava agent now publishes exactly **six distinct prompts, titles and component owners**:
five operational UX components, followed by its one registered dedicated capability explorer.
Canonical maps, source definitions, packaged definitions and packaged instructions agree.
Instructions name all **203** Zava tool boundaries, favor one narrow primary component, distinguish
operational "explore" requests from feature discovery, and preserve human confirmation and offline limits.

### Per-sample findings and verified results

| Sample | Applied changes | Fresh Jest tests | Tool count | Result |
| --- | --- | ---: | ---: | --- |
| [Project Tracker](samples/zava-project-tracker/README.md) | Expanded three starters to six; added delivery health, portfolio AI spend and budget review. Named all 31 routing boundaries; distinguished analytical review from a governed decision. | 172 | 31 | Passed production/package gates |
| [Customer Resolution](samples/zava-customer-resolution-center/README.md) | Retained five operational starters; replaced the sixth with feature discovery. Preserved all six operational flagship regression checks and added the seventeenth collision case. Named all 23 boundaries. | 45 | 23 | Passed production/package gates |
| [Employee Agent](samples/zava-employee-agent/README.md) | Expanded three starters to six. Generated the missing dedicated explorer with RC0 Yeoman, preserving its GUID and all 20 existing identities. Catalog coverage is checked against every operational manifest. | 189 | 21 | Passed production/package gates |
| [Innovation](samples/zava-innovation-portfolio/README.md) | Retained the already-correct five-plus-discovery starter set. Clarified operational exploration versus feature discovery while preserving fixed snapshots, exact idea aliases and separate human confirmations. | 64 | 17 | Passed production/package gates |
| [IT Concierge](samples/zava-it-concierge/README.md) | Retained the correct starter set; wired the configuration generator to the canonical map. Added the missing single-device refresh-eligibility boundary versus fleet refresh-wave planning; retained all 31 routes. | 39 | 31 | Passed production/package gates |
| [One Hub](samples/zava-one-hub/README.md) | Retained the correct starter set and all 37 named routes. Strengthened actual explorer ownership, normalized uniqueness and operational-first validation without changing mixed-host behavior. | 50 | 37 | Passed production/package gates |
| [Procurement](samples/zava-procurement-command-center/README.md) | Retained the correct starter set, exact Tool-suffixed identities, all 22 boundaries and opportunity-versus-realized-value distinctions. Kept authorization and external-write limits explicit. | 94 | 22 | Passed production/package gates |
| [Revenue](samples/zava-revenue-deal-room/README.md) | Retained the correct starter set. Added the omitted growth-signal discovery boundary, completing all 21 routes; preserved exact record IDs, ramp assumptions, probability units and human decision limits. | 87 | 21 | Passed production/package gates |

All eight solution/feature versions and authored agent versions were incremented once from their
previous worktree release. The current deployment table above contains the actual package hashes
and SDK-generated versions, including legitimate fourth-segment RC0 hotfixes.

### All 48 published starter-to-component contracts

| Agent | # | Published prompt | Owning tool |
| --- | ---: | --- | --- |
| Project Tracker | 1 | What needs my attention across my projects this week? | `GetMyWorkSummary` |
| Project Tracker | 2 | Compare Customer Service Copilot with Contract Intelligence on delivery and value. | `CompareProjects` |
| Project Tracker | 3 | Show the current delivery health of Customer Service Copilot. | `GetProjectHealth` |
| Project Tracker | 4 | Analyze AI spending across the portfolio this quarter. | `GetPortfolioAiSpend` |
| Project Tracker | 5 | Review the project budget request for Customer Service Copilot. | `ReviewProjectBudget` |
| Project Tracker | 6 | Show me the project and portfolio scenarios you can help with. | `ExploreAgentCapabilities` |
| Customer Resolution | 1 | 42 Alpine House stores cannot activate their handhelds. Create the support case. | `TriageCustomerIssue` |
| Customer Resolution | 2 | Are today's activation failures isolated or one emerging incident? | `DetectServiceIncident` |
| Customer Resolution | 3 | Review today's activation incident candidates and help me decide the next one. | `ReviewIncidentResponse` |
| Customer Resolution | 4 | Review pending customer recovery requests, starting with Alpine House. | `ReviewServiceRecovery` |
| Customer Resolution | 5 | Draft a French and English update for Alpine House with the next update time. | `ComposeCustomerUpdate` |
| Customer Resolution | 6 | Explore the customer-resolution features this agent supports. | `ExploreAgentCapabilities` |
| Employee Agent | 1 | Show my HR dashboard for this week. | `GetMyHRDashboard` |
| Employee Agent | 2 | Draft a vacation request for November 9 through November 13, 2026. | `RequestTimeOff` |
| Employee Agent | 3 | Compare benefit plans for an employee with two children, prioritizing dental coverage and a low deductible. | `CompareBenefitPlans` |
| Employee Agent | 4 | Show my mandatory learning due in the next 14 days. | `GetRequiredLearning` |
| Employee Agent | 5 | Show the leave requests awaiting my approval. | `GetApprovalInbox` |
| Employee Agent | 6 | Explore the employee and HR features this agent supports. | `ExploreAgentCapabilitiesTool` |
| Innovation | 1 | Submit an idea to reduce new-hire onboarding time by half. | `SubmitInnovationIdea` |
| Innovation | 2 | Compare innovation participation and conversion across regions. | `ExploreGlobalInnovation` |
| Innovation | 3 | Show stage conversion in our innovation portfolio funnel. | `ExploreInnovationPortfolio` |
| Innovation | 4 | Show which innovation portfolio health measures are outside target. | `GetInnovationPortfolioHealth` |
| Innovation | 5 | Review Smart Onboarding Journey for gate approval. | `ReviewIdeaGate` |
| Innovation | 6 | Explore what this agent can do. | `ExploreAgentCapabilities` |
| IT Concierge | 1 | Submit an IT support ticket because my video calls drop when I undock. | `ReportItIssueTool` |
| IT Concierge | 2 | Run device diagnostics for battery drain on my Surface. | `RunDeviceDiagnosticsTool` |
| IT Concierge | 3 | Show all pending requests awaiting my approval. | `GetApprovalQueueTool` |
| IT Concierge | 4 | Show company fleet health by region and department. | `GetFleetHealthTool` |
| IT Concierge | 5 | Correlate signals for major incident INC-7091. | `CorrelateMajorIncidentTool` |
| IT Concierge | 6 | Explore what Zava IT Concierge can do. | `ExploreAgentCapabilitiesTool` |
| One Hub | 1 | What's new across Zava this week? | `ShowCompanyNews` |
| One Hub | 2 | Find the parental leave policy for Finland. | `FindCompanyKnowledge` |
| One Hub | 3 | Help me send praise to Johanna for making the accessibility lab welcoming. | `ShowRecognitionAndCommunities` |
| One Hub | 4 | Show EMEA bookings this quarter. | `ShowSalesPerformance` |
| One Hub | 5 | Show me Zava offices around the world. | `ShowOfficeDetails` |
| One Hub | 6 | Show me all the company and employee experiences Zava One can help with. | `ExploreAgentCapabilities` |
| Procurement | 1 | Find the fastest compliant path for 600 rugged devices within EUR 1.2 million. | `CreatePurchaseIntentTool` |
| Procurement | 2 | Compare the final rugged-device bids and show how risk changes the award. | `CompareSupplierBidsTool` |
| Procurement | 3 | Show our concentration and continuity exposure for Fabrikam Devices. | `TrackSupplierRiskTool` |
| Procurement | 4 | Review the proposed split award for sourcing event ZPC-RFP-31. | `ReviewSupplierAwardTool` |
| Procurement | 5 | Show the largest addressable spend leakage this quarter. | `DetectSpendLeakageTool` |
| Procurement | 6 | Explore what the Procurement agent can do. | `ExploreAgentCapabilitiesTool` |
| Revenue | 1 | Show the risks threatening Contoso's global expansion deal this quarter. | `GetDealRisk` |
| Revenue | 2 | Map the buying committee for the Contoso expansion. | `MapBuyingCommittee` |
| Revenue | 3 | Model a three-year ramped offer that protects 68% margin. | `SimulateCommercialOffer` |
| Revenue | 4 | Prepare me for tomorrow's Contoso steering meeting. | `PrepareCustomerMeeting` |
| Revenue | 5 | Should Contoso remain in commit for Q4? | `InspectForecastCommit` |
| Revenue | 6 | Explore what the Revenue Deal Room agent can do. | `ExploreAgentCapabilities` |

### Validation actually performed

- From each of the eight Zava folders, `npm run build` — **passed**, including the existing
  production TypeScript/lint/Jest, package, generated-plugin and sample-specific gates. **740 tests** pass.
  Project's final text-only routing refinements were then regenerated with
  `heft build --production`, `heft package-solution --production`,
  `npm run check:generated-plugin` and `npm run check:package-output` — **passed**;
  its unchanged UI retains the full 172-test production result.
- Repository root `node assets\validate-zava-rc0.mjs <sample-name>` for all eight names above —
  **passed**. These checks inspect compiled property schemas, exact six-starter ownership, complete
  named instruction boundaries, source-versus-packaged text, source/feature versions, current JavaScript
  bytes and embedded-versus-Teams ZIP equality. New artifacts do not merely reuse the previous binaries.
- Both the real root guard and each standalone starter guard were exercised with ten malformed
  contracts plus a valid control: **176 executions, 160 invalid contracts rejected, 16 valid controls
  accepted**. Cases include five/seven starters, duplicate targets/prompts/titles, wrong explorer
  position, missing/duplicate explorer registration, and unknown operational/final targets.
- Employee `node node_modules\typescript\bin\tsc --project ux-review\tsconfig.json` —
  **passed**. Seven new UI behavior tests and four root lifecycle tests bring Employee to **189 tests**.
  Its 20-feature catalog is checked against every operational source manifest by the package gate.
- Employee browser review — **12 host states passed**, covering 340/760/1440 px, light/dark and
  inline/fullscreen; no runtime errors or horizontal overflow. Search, family filtering, no-match and
  retained search across mode/theme transitions passed. This is **12 tested states and one newly
  captured publication image**, not a claim of 12 screenshots. Evidence:
  [explorer state results](samples/zava-employee-agent/assets/six-starter-explorer-evidence.json).
- Employee `npm run check:gallery`, `npm run check:generated-plugin` and
  `npm run check:package-output` — **passed** after the new publication image. The package contains
  **21 components, one shared 922,205-byte JavaScript asset**, no duplicate media payload, and remains
  below the unchanged 1 MiB JavaScript review budget. All **33** publication thumbnails validate.
- All **202 original Zava GUIDs** are preserved; the only addition is the supported generated Employee
  explorer `d48c2178-27ab-4f5d-b685-b3016b5f1b08`. All 203 current Zava GUIDs are globally unique.
  The eight local creation guides remain byte-identical to the existing golden guide.
- `git diff --check` — **passed**. No My Day source, documentation, definition, guide or archive was
  changed. No commits or pull requests were created.

**External gate remains:** local deterministic checks cannot certify authenticated natural-language
Copilot selection, tenant CSP, iframe focus, permission behavior, or the host accessibility matrix.
Rehearse all six starters in fresh tenant conversations for each agent. Previous media-rights,
localization/RTL and public-registry availability gates remain as documented; RC0 adoption alone
is not a GA certification.
<!-- SIX-STARTERS:END -->
