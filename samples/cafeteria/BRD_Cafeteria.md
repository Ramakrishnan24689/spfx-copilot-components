# Cafeteria Copilot App — Business Requirements Document

**Author:** Sandeep P S
**Date:** 2026-08-29
**Status:** Draft v1 — for review
**Target surface:** SharePoint Copilot App (Copilot component + declarative agent) — _preview technology_

---

## Executive Summary

Employees waste time each day figuring out which cafeteria is open, what is being served, and whether anything matches their dietary needs. Today that information is scattered across printed boards, ad-hoc Teams posts, and static intranet pages that go stale.

This project delivers a **Cafeteria Copilot App**: a SharePoint Framework (SPFx) solution pairing a **Copilot component** with a **declarative agent**, so an employee can ask Microsoft 365 Copilot "what's for lunch today?" and get a rendered, interactive cafeteria and menu experience _inside the Copilot conversation_ — no page navigation, no separate app.

Cafeteria and menu data lives in two SharePoint lists on an intranet site, making the content owner-editable with no custom admin build required for v1.

**v1 delivers:** browse cafeterias, view today's menu, search and filter dishes.
**v2 delivers:** the admin authoring experience (menu creation, cafeteria detail editing).

---

## Problem Statement

- **No single source of truth.** Menus are published inconsistently — some cafeterias post to Teams, some to a wall board, some not at all.
- **Information is not conversational.** Even where an intranet page exists, employees must know it exists, navigate to it, and scan it manually.
- **Dietary needs are hard to serve.** There is no way to ask "is there anything vegan in Building 4 today?" without physically checking.
- **Publishing is high-friction.** Cafeteria managers have no lightweight, structured way to publish a daily menu, so they default to informal channels.

**Consequence:** longer lunch queues at the wrong cafeteria, wasted walking time between buildings, and employees with dietary restrictions repeatedly underserved.

---

## Goals & Success Metrics

| #   | Goal                                             | Success metric                                              | Target (90 days post-launch) |
| --- | ------------------------------------------------ | ----------------------------------------------------------- | ---------------------------- |
| G1  | Make today's menu answerable in one Copilot turn | % of menu queries resolved without leaving the conversation | > 90%                        |
| G2  | Drive adoption as the default lunch lookup       | Weekly active users / eligible headcount                    | > 25%                        |
| G3  | Keep menu data fresh                             | % of cafeterias with a published menu before 09:00 local    | > 85%                        |
| G4  | Serve dietary needs reliably                     | % of menu items carrying at least one dietary tag           | 100%                         |
| G5  | Keep the experience fast                         | Component render time inside Copilot, p95                   | < 1.5 s                      |

> `[confirm: baseline headcount and cafeteria count for the target buildings]`

---

## Stakeholders & Personas

| Persona                                    | Role                                       | Needs                                                                                     | v1 or v2                                    |
| ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------- |
| **Priya — Employee**                       | Knowledge worker, any building             | Wants today's menu fast, filtered to her dietary needs, before she walks anywhere         | v1                                          |
| **Marcus — Cafeteria Manager**             | Runs one cafeteria                         | Wants to publish a daily menu in under 5 minutes without training                         | v2 (v1: edits the SharePoint list directly) |
| **Dana — Facilities / Workplace Services** | Owns cafeteria operations across buildings | Wants consistent publishing across sites and usage signal on which cafeterias are busiest | v2                                          |
| **Sandeep — Solution Owner / Developer**   | Builds and maintains the app               | Wants a maintainable SPFx solution with no bespoke backend                                | v1                                          |
| **SharePoint / M365 Admin**                | Tenant governance                          | Approves app-catalog deployment and any Graph permissions                                 | v1 gate                                     |

---

## Use Cases

Use cases are numbered UC-1 … UC-7. **UC-2 is the day-one must-work case** — if only one thing works, it is "what's for lunch today."

### UC-1 — Browse the list of cafeterias

> As an **employee**, I want to see all cafeterias with their location and open status, so that I can choose where to eat.

- **Trigger:** User asks Copilot "which cafeterias are open?" / "show me the cafeterias"
- **Main flow:** Agent invokes the `listCafeterias` tool → component renders cafeteria cards (name, building, floor, hours, open/closed badge, cuisine tags) in `inline` mode → user can expand to `fullscreen`.
- **Acceptance criteria:**
  - All active cafeterias from the Cafeterias list are shown.
  - Open/closed status is computed against the user's local time and the cafeteria's hours.
  - Inactive cafeterias are excluded.
  - Renders in under 1.5 s at p95.

### UC-2 — View today's menu for a cafeteria ★ _day-one_

> As an **employee**, I want to see today's menu for a chosen cafeteria, so that I can decide whether to go there.

- **Trigger:** "What's for lunch in Building 4?" / user taps a cafeteria card from UC-1.
- **Main flow:** Agent invokes `getMenu` with cafeteria + date → component renders menu grouped by course (breakfast / lunch / snacks) with item name, description, price, and dietary tags.
- **Acceptance criteria:**
  - Defaults to today in the user's time zone when no date is given.
  - Groups items by meal period and preserves display order.
  - Shows an explicit "No menu published yet for today" empty state rather than a blank panel.
  - Dietary tags render as visually distinct badges.

### UC-3 — Search and filter dishes across cafeterias

> As an **employee with dietary restrictions**, I want to filter today's food by dietary tag, price, or cafeteria, so that I only see what I can actually eat.

- **Trigger:** "Is there anything vegan today?" / "Show me lunch under ₹150"
- **Main flow:** Agent invokes `searchMenuItems` with filters → component renders matching items grouped by cafeteria, each showing which cafeteria and how far/which building.
- **Acceptance criteria:**
  - Supports filtering by dietary tag, price ceiling, cafeteria, and free-text dish name.
  - Filters combine (AND semantics).
  - Zero-result state suggests relaxing the narrowest filter.
  - Filter chips are also adjustable in the rendered UI, not only via chat.

### UC-4 — Compare what's on across cafeterias

> As an **employee**, I want to see today's highlights across every cafeteria in one view, so that I can pick the best option without asking five times.

- **Trigger:** "What are my lunch options today?"
- **Main flow:** `searchMenuItems` with no filters, results grouped by cafeteria showing top items per location.
- **Acceptance criteria:** every open cafeteria with a published menu appears; those without show a "menu not published" note.

### UC-5 — See cafeteria details and hours

> As an **employee**, I want a cafeteria's hours, floor, contact, and payment options, so that I don't arrive after it closes.

- **Trigger:** "When does the Building 4 cafeteria close?"
- **Main flow:** `getCafeteriaDetails` tool → detail panel in `fullscreen` mode.
- **Acceptance criteria:** hours per day of week, contact, payment methods, and any closure notice are shown; a temporary closure notice overrides the computed open status.

### UC-6 — Publish or update a daily menu _(v2)_

> As a **cafeteria manager**, I want to create today's menu from a reusable dish catalog, so that publishing takes under five minutes.

- **Trigger:** Manager opens the admin experience in `fullscreen`, or asks "publish today's menu for Building 4."
- **Main flow:** Manager picks the cafeteria and date → adds items from the dish catalog or creates new ones → sets meal period, price, dietary tags → publishes.
- **Acceptance criteria:**
  - Only members of the Cafeteria Managers group can publish, and only for their assigned cafeterias.
  - Copy-from-yesterday / copy-from-last-week is available.
  - A published menu is immediately visible to UC-2.
  - Edits after publish are permitted and logged with author + timestamp.

### UC-7 — Update cafeteria details _(v2)_

> As a **cafeteria manager or facilities owner**, I want to edit hours, contact, and closure notices, so that the app never sends people to a closed cafeteria.

- **Acceptance criteria:** hours, contact, payment methods, and a dated closure notice are editable; changes take effect in the next component render; audit trail retained via list versioning.

---

## Features & Requirements (Must / Should / Could)

| Feature                                                                | Use case   | Priority     | Effort |
| ---------------------------------------------------------------------- | ---------- | ------------ | ------ |
| F1 — Cafeterias SharePoint list + schema                               | UC-1, UC-5 | Must         | S      |
| F2 — Menus / Menu Items SharePoint lists + schema                      | UC-2, UC-3 | Must         | M      |
| F3 — Copilot component scaffold (SPFx v1.24 beta 2+)                   | all        | Must         | S      |
| F4 — `listCafeterias` tool + cafeteria card UI (inline + fullscreen)   | UC-1       | Must         | M      |
| F5 — `getMenu` tool + menu board UI grouped by meal period             | UC-2       | Must         | M      |
| F6 — Open/closed status computed from hours + closure notices          | UC-1, UC-5 | Must         | S      |
| F7 — Declarative agent definition, instructions, conversation starters | all        | Must         | S      |
| F8 — `searchMenuItems` tool with dietary / price / cafeteria filters   | UC-3, UC-4 | Must         | M      |
| F9 — Interactive filter chips in the rendered component                | UC-3       | Should       | M      |
| F10 — `getCafeteriaDetails` tool + detail panel                        | UC-5       | Should       | S      |
| F11 — Cross-cafeteria "today's options" roll-up view                   | UC-4       | Should       | M      |
| F12 — Empty / error / not-published states                             | UC-2, UC-3 | Should       | S      |
| F13 — Admin menu authoring experience                                  | UC-6       | Could (v2)   | L      |
| F14 — Admin cafeteria detail editor                                    | UC-7       | Could (v2)   | M      |
| F15 — Dish catalog with reuse + copy-from-yesterday                    | UC-6       | Could (v2)   | M      |
| F16 — Usage telemetry / most-viewed cafeterias                         | G2, G3     | Could (v3)   | M      |
| F17 — Pre-order or reservation                                         | —          | Out of scope | —      |

**v1 = F1–F8 (Must, 8 items) + F9–F12 (Should, 4 items) if capacity allows.**

---

## Solution Architecture

```
Microsoft 365 Copilot (chat)
        │  user intent: "what's for lunch in Building 4?"
        ▼
Declarative agent  (copilot/declarativeAgent.json + instruction.txt)
        │  selects a tool declared in the component manifest
        ▼
Copilot component  (extends BaseCopilotComponent, @microsoft/sp-copilot-component)
        │  render() reads hostContext.displayMode → 'inline' | 'fullscreen'
        ▼
Data layer  (SPHttpClient → SharePoint REST / Graph)
        ▼
SharePoint lists:  Cafeterias  ·  Menus  ·  MenuItems  ·  Dishes (v2)
```

**Display modes**

- **`inline`** — compact result inside the Copilot conversation: a cafeteria card row or a condensed menu board. Optimised for scannability at narrow width, with a "View full menu" affordance calling `requestDisplayModeAsync('fullscreen')`.
- **`fullscreen`** — the full experience: cafeteria grid, full-day menu board with meal-period sections, filter rail, and (v2) the admin authoring surface.

**UI mockup:** see `cafeteria-copilot-mockup.html` in the same folder — it mocks both `inline` and `fullscreen` modes.

**Surface comparison and justification**

| Option                                          | Fit                                                                                                                                                                                                                                                                                         | Verdict                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **SharePoint Copilot App** (chosen)             | The core need — "what's for lunch?" — is a natural-language question, but the answer is inherently visual (cards, badges, prices, dietary icons). This is exactly the case a Copilot component serves: conversational entry, rendered UI in the answer. Data already belongs in SharePoint. | **Recommended**                                 |
| **Standalone declarative agent** (no component) | Would answer from list content as text only. Loses the menu board, dietary badges, filter chips, and the admin surface entirely. Fine as a fallback if preview status blocks the component.                                                                                                 | Rejected — text-only                            |
| **Classic SPFx web part**                       | Solid, GA-supported, and would render the same UI — but the user must know the intranet page exists and navigate to it. That is the exact friction we are removing. Still a valid _companion_ deployment reusing the same data layer and React components.                                  | Rejected as primary; keep as optional companion |
| **Copilot Studio agent**                        | Adds a licensing and connector layer plus a second authoring surface for no gain — the data is already in SharePoint and the UI need is SPFx-shaped.                                                                                                                                        | Rejected                                        |

---

## Technical Approach

### Prior work in the tenant

A prior scaffold already exists: **cafeteria-copilot-phase1-2** (a zipped SPFx solution authored by Sandeep P S, generator `@microsoft/generator-sharepoint` with `plusBeta: true`, Node 22.14.0). This BRD should be reconciled against that scaffold before any new `yo` run — reuse it rather than re-scaffolding if the component name and structure match. `[confirm: whether the existing scaffold is the intended baseline]`

### Scaffold

```console
md cafeteria-copilot
cd cafeteria-copilot
yo @microsoft/sharepoint
```

Generator answers:

| Prompt                     | Answer                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Solution name              | `cafeteria-copilot`                                                                         |
| Client-side component type | **Copilot Component**                                                                       |
| Copilot component name     | `CafeteriaCopilot`                                                                          |
| Template                   | React _(No framework is the tutorial default; React is recommended for this UI complexity)_ |

Requires **SPFx v1.24 beta 2 or newer**.

### Project structure

| Path                                                                                    | Purpose                                                                      |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/copilotComponents/cafeteriaCopilot/`                                               | Component source                                                             |
| `src/copilotComponents/cafeteriaCopilot/CafeteriaCopilotCopilotComponent.ts`            | Extends `BaseCopilotComponent`                                               |
| `src/copilotComponents/cafeteriaCopilot/CafeteriaCopilotCopilotComponent.manifest.json` | Component id, `copilotType`, `capabilities.availableDisplayModes`, **tools** |
| `copilot/declarativeAgent.json`                                                         | Agent definition                                                             |
| `copilot/ai-plugin.json`                                                                | Plugin / action definitions                                                  |
| `copilot/instruction.txt`                                                               | Agent instructions                                                           |
| `copilot/manifest.json`                                                                 | App manifest                                                                 |
| `config/copilot-agent.json`                                                             | Groups the component into the agent                                          |

### Component skeleton

`src/copilotComponents/cafeteriaCopilot/CafeteriaCopilotCopilotComponent.ts`

```typescript
import { BaseCopilotComponent } from "@microsoft/sp-copilot-component"

export default class CafeteriaCopilotCopilotComponent extends BaseCopilotComponent<ICafeteriaCopilotProperties> {
  protected render(): void {
    const displayMode: string = this.hostContext.displayMode
    const isFullscreen: boolean = displayMode === "fullscreen"
    // render cafeteria cards / menu board into this.context.domElement
    // using this.properties (cafeteriaId, date, dietaryTags, maxPrice, query)
  }

  private _handleRequestFullscreen = async (): Promise<void> => {
    await this.requestDisplayModeAsync("fullscreen")
  }
}
```

### Tools to declare in the component manifest

Each tool becomes an agent-invokable action backed by a Zod `propertiesSchema`. **Tool descriptions must read as real user intent** — a vague description means Copilot never invokes the tool.

| Tool                     | Description (as the agent sees it)                                                                                                        | Properties                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `listCafeterias`         | "Show all cafeterias with their building, hours, and whether they are open right now."                                                    | `openNow?: boolean`, `building?: string`                                                                 |
| `getMenu`                | "Show the food menu for a specific cafeteria on a specific day, grouped by breakfast, lunch, and snacks."                                 | `cafeteriaId: string`, `date?: string`                                                                   |
| `searchMenuItems`        | "Find dishes available today that match dietary needs, a price limit, a cafeteria, or a dish name — for example vegan options under 150." | `query?: string`, `dietaryTags?: string[]`, `maxPrice?: number`, `cafeteriaId?: string`, `date?: string` |
| `getCafeteriaDetails`    | "Show one cafeteria's opening hours, floor, contact, payment options, and any closure notice."                                            | `cafeteriaId: string`                                                                                    |
| `publishMenu` _(v2)_     | "Create or update the published menu for a cafeteria on a given date."                                                                    | `cafeteriaId: string`, `date: string`, `items: MenuItemInput[]`                                          |
| `updateCafeteria` _(v2)_ | "Update a cafeteria's hours, contact details, or closure notice."                                                                         | `cafeteriaId: string`, `fields: CafeteriaFields`                                                         |

Example properties schema:

```typescript
// searchMenuItems propertiesSchema
import { z } from "zod"

export const searchMenuItemsSchema = z.object({
  query: z.string().optional().describe('Dish name or keyword, e.g. "paneer"'),
  dietaryTags: z
    .array(
      z.enum([
        "Vegetarian",
        "Vegan",
        "Halal",
        "Jain",
        "GlutenFree",
        "NutFree",
        "Contains Egg",
      ]),
    )
    .optional()
    .describe("Dietary requirements the dish must satisfy"),
  maxPrice: z
    .number()
    .optional()
    .describe("Maximum price per item in local currency"),
  cafeteriaId: z
    .string()
    .optional()
    .describe("Restrict results to one cafeteria"),
  date: z
    .string()
    .optional()
    .describe("ISO date; defaults to today in the user's time zone"),
})
```

### Conversation starters (declarative agent)

- "What's for lunch today?"
- "Which cafeterias are open right now?"
- "Show me vegan options today"
- "When does the Building 4 cafeteria close?"

### Data model — SharePoint lists

> List and column names below are **proposed**, not observed in the tenant. `[confirm: target site URL and whether any of these lists already exist]`

**List: `Cafeterias`**

| Column           | Type                  | Notes                                                       |
| ---------------- | --------------------- | ----------------------------------------------------------- |
| `Title`          | Single line           | Cafeteria name                                              |
| `Building`       | Single line           |                                                             |
| `Floor`          | Single line           |                                                             |
| `Capacity`       | Number                | Optional                                                    |
| `CuisineTags`    | Choice (multi)        | Indian / Continental / Asian / Grill                        |
| `OpeningHours`   | Multiple lines (JSON) | Per weekday open/close, e.g. `{"mon":["08:00","19:00"], …}` |
| `ContactEmail`   | Person or Single line |                                                             |
| `PaymentMethods` | Choice (multi)        | Card / UPI / Payroll deduction / Cash                       |
| `ClosureNotice`  | Multiple lines        | Free text, overrides open status                            |
| `ClosureUntil`   | Date                  |                                                             |
| `IsActive`       | Yes/No                | Filters out decommissioned cafeterias                       |
| `ImageUrl`       | Hyperlink             | Optional hero image                                         |

**List: `Menus`**

| Column        | Type                | Notes                              |
| ------------- | ------------------- | ---------------------------------- |
| `Title`       | Single line         | e.g. "Building 4 — 2026-08-29"     |
| `Cafeteria`   | Lookup → Cafeterias |                                    |
| `MenuDate`    | Date                | Indexed — the primary query filter |
| `Status`      | Choice              | Draft / Published                  |
| `PublishedBy` | Person              |                                    |
| `PublishedOn` | Date & time         |                                    |

**List: `MenuItems`**

| Column        | Type           | Notes                                                                     |
| ------------- | -------------- | ------------------------------------------------------------------------- |
| `Title`       | Single line    | Dish name                                                                 |
| `Menu`        | Lookup → Menus |                                                                           |
| `MealPeriod`  | Choice         | Breakfast / Lunch / Snacks / Dinner                                       |
| `Description` | Multiple lines |                                                                           |
| `Price`       | Currency       |                                                                           |
| `DietaryTags` | Choice (multi) | Vegetarian / Vegan / Halal / Jain / Gluten-free / Nut-free / Contains egg |
| `SpiceLevel`  | Choice         | Mild / Medium / Hot                                                       |
| `SortOrder`   | Number         | Display order within a meal period                                        |
| `IsSoldOut`   | Yes/No         | v2                                                                        |

**List: `Dishes` (v2)** — reusable catalog so managers don't retype items daily.

### Data access

- Use `SPHttpClient` from the component context against the SharePoint REST API for list reads.
- Query pattern for UC-2: filter `Menus` by `Cafeteria` + `MenuDate` + `Status eq 'Published'`, then expand `MenuItems`.
- **Index `MenuDate` and `Cafeteria`** — without indexes these queries hit list view thresholds as history accumulates.
- Cache list reads for the duration of a single Copilot turn; do not cache across turns (menus change intraday for sold-out items).

### Permissions

- **Read:** all employees need read on the three lists — grant via the site's Visitors group or a dedicated read group.
- **Write (v2):** a `Cafeteria Managers` SharePoint group with contribute on `Menus`, `MenuItems`, and `Dishes`; item-level scoping per cafeteria if managers must be restricted to their own site. `[confirm: whether per-cafeteria write scoping is required]`
- No tenant-wide Graph API permission is required for the SharePoint-list-only design. If a future phase adds user profile or presence data, that introduces an admin-consent gate.

---

## Delivery Plan & Phases

### Phase 0 — Foundations (prep)

1. Confirm the target SharePoint site and whether the existing **cafeteria-copilot-phase1-2** scaffold is the baseline.
2. Provision the `Cafeterias`, `Menus`, and `MenuItems` lists with the schema above; add indexes on `MenuDate` and `Cafeteria`.
3. Seed real data for **two pilot cafeterias**, including at least one full week of menus.
4. Verify the tenant app catalog exists and confirm who can deploy to it.
5. Install/verify the SPFx v1.24 beta 2+ toolchain and Node version.

### Phase 1 — v1 build (F1–F8)

6. Scaffold or open the Copilot component solution.
7. Build the data layer: typed models + a `CafeteriaService` wrapping the REST calls.
8. Implement `listCafeterias` and the cafeteria card UI for `inline` and `fullscreen`.
9. Implement open/closed computation from `OpeningHours` + `ClosureNotice`, in the user's local time zone.
10. Implement `getMenu` and the menu board UI grouped by meal period, with the not-published empty state.
11. Implement `searchMenuItems` with dietary, price, cafeteria, and text filters.
12. Author `declarativeAgent.json`, `instruction.txt`, `ai-plugin.json`, and the conversation starters.
13. Test the inner loop in the **Copilot Workbench** at `/_layouts/15/copilotworkbench.aspx`.
14. Package (`gulp bundle --ship`, `gulp package-solution --ship`), deploy to the app catalog with **"Enable this app and add it to all sites."**
15. Pilot with the two seeded cafeterias and a small user group; collect feedback for two weeks.

### Phase 2 — v2 admin (F13–F15)

16. Add the `Dishes` catalog list and the `Cafeteria Managers` group with scoped permissions.
17. Build the fullscreen menu authoring surface: dish picker, meal-period sections, price and tag entry, publish action.
18. Add copy-from-yesterday / copy-from-last-week.
19. Add the cafeteria detail editor (hours, contact, closure notice).
20. Declare `publishMenu` and `updateCafeteria` tools with permission checks enforced server-side (list permissions), not only in the UI.
21. Roll out to all cafeteria managers with a one-page how-to.

### Phase 3 — Scale & polish (F16)

22. Roll out to all buildings.
23. Add usage telemetry and a facilities-facing view of publishing compliance (G3).
24. Optional: deploy the companion SPFx web part on the intranet home page reusing the same components.

### Dependencies

| Dependency                                      | Owner                           | Needed by        |
| ----------------------------------------------- | ------------------------------- | ---------------- |
| Target SharePoint site + list provisioning      | Sandeep / site owner            | Phase 0          |
| Real cafeteria and menu data for pilot          | Facilities / cafeteria managers | Phase 0          |
| Tenant app catalog access + deployment approval | SharePoint admin                | Phase 1, step 14 |
| SPFx v1.24 beta 2+ toolchain                    | Sandeep                         | Phase 1          |
| Cafeteria Managers group + permission scoping   | Site owner                      | Phase 2          |
| Agent publication approval                      | M365 admin                      | Phase 1, step 14 |

---

## Risks & Mitigations

| #   | Risk                                                                                                                                                                     | Impact | Likelihood | Mitigation                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **SharePoint Copilot Apps are in preview and subject to change — Microsoft explicitly states they are not for production use.** APIs may break between preview releases. | High   | High       | Treat v1 as a pilot, not a production rollout. Keep the data layer and UI components decoupled from `BaseCopilotComponent` so they can be re-hosted in a GA SPFx web part if the preview shifts. Re-test on every SPFx beta bump. |
| R2  | Dependency on SPFx v1.24 **beta 2+** — a beta toolchain in the build pipeline                                                                                            | Medium | Medium     | Pin exact versions in `package.json`; document the Node version; avoid CI enforcement until GA.                                                                                                                                   |
| R3  | Menus not published on time, so the app shows empty states and loses trust                                                                                               | High   | Medium     | Explicit "not published yet" state rather than a blank panel; publishing-compliance metric (G3); a daily reminder to managers; copy-from-yesterday to make publishing near-zero-effort.                                           |
| R4  | Stale or wrong dietary tags cause a real safety issue for allergy sufferers                                                                                              | High   | Low        | Make `DietaryTags` mandatory on every item; display a standing "confirm with cafeteria staff for severe allergies" disclaimer; never infer tags.                                                                                  |
| R5  | List view threshold as menu history accumulates                                                                                                                          | Medium | Medium     | Index `MenuDate` and `Cafeteria`; archive menus older than 90 days.                                                                                                                                                               |
| R6  | Agent does not invoke the right tool because descriptions are vague                                                                                                      | Medium | Medium     | Write tool descriptions in real user language; test each conversation starter in the Copilot Workbench; iterate on `instruction.txt`.                                                                                             |
| R7  | App catalog deployment blocked or delayed by admin review                                                                                                                | Medium | Medium     | Engage the SharePoint admin in Phase 0, not at step 14.                                                                                                                                                                           |
| R8  | Timezone / multi-region hours computed incorrectly                                                                                                                       | Medium | Medium     | Store hours per cafeteria with an explicit time zone; compute open status against that zone, not the user's.                                                                                                                      |

---

## Out of Scope

- Pre-ordering, reservations, or queue-time estimates.
- Payments, wallet balance, or payroll-deduction integration.
- Nutritional analysis, calorie counts, or macro tracking.
- Feedback, ratings, or reviews of dishes.
- Inventory, stock, or supplier management.
- Native mobile app (the experience rides on the Copilot and SharePoint mobile clients).
- Multi-language menu content (English only for v1).

---

## Open Questions & Assumptions

**Open questions**

1. Is the existing **cafeteria-copilot-phase1-2** scaffold the intended baseline, or do we start fresh?
2. Which SharePoint site hosts the lists, and does the user own it? `[confirm: site URL]`
3. How many cafeterias and buildings are in scope, and which two are the pilot?
4. Must cafeteria managers be scoped to only their own cafeteria's menus, or is shared write acceptable?
5. Are prices shown in a single currency, and is per-cafeteria currency needed?
6. Do any cafeterias already publish menus in a system we should read from instead of re-keying?
7. Is a companion intranet web part wanted in Phase 3, or is Copilot-only sufficient?
8. Who owns daily publishing compliance — facilities, or each cafeteria manager individually?

**Assumptions**

- A1 — Menu content is authored per day, per cafeteria; there is no fixed rotating menu that would change the data model.
- A2 — All users have access to Microsoft 365 Copilot. _(Note: during the preview, no Copilot license is required to build, deploy, or run SharePoint Copilot Apps.)_
- A3 — SharePoint lists are sufficient at expected volume — roughly `cafeterias × 365 × items-per-day` menu item rows per year — with indexing and archiving.
- A4 — Cafeteria managers have SharePoint access and can be granted contribute rights.
- A5 — No integration with an external catering or POS system is required for v1.
- A6 — Admin functionality is deliberately deferred to v2; in v1 the SharePoint list forms are the authoring interface.

---

## Reference

- Build your first SharePoint Copilot App — https://learn.microsoft.com/en-us/sharepoint/dev/spfx/copilot/get-started/build-your-first-copilot-app
- Copilot Workbench — `<your-site>/_layouts/15/copilotworkbench.aspx`
