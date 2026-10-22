# Zava Procurement Command Center - 4-minute keynote

## Audience and promise

For Microsoft customers, partners, procurement leaders, and product teams. The promise: Copilot can
turn an outcome into inspectable procurement software while people retain accountability for policy,
supplier, award, invoice, and value decisions.

## Setup and reset

- Deploy the committed `.sppkg`, add **Zava Procurement Command Center**, and start a fresh conversation.
- State once that all records and confirmed actions are deterministic, offline, and session-only.
- Keep `assets/ux-inline-CreatePurchaseIntent.png`, `assets/ux-sourcing-workbench.png`,
  `assets/ux-inline-ReviewSupplierAward.png`, and `assets/ux-spend-command.png` ready as fallback.

## 0:00-0:40 - Ask for an outcome

Prompt: **Find the fastest compliant path for 600 rugged devices within EUR 1.2 million.**

Expected tool: `CreatePurchaseIntentTool`. Show the editable outcome, quantity, locations, currency,
budget, constraints, and needed-by date. Route comparison is a separate explicit request.
The user did not choose a requisition form; Copilot selected bounded UX and the component owns the math.

## 0:40-1:20 - Shape demand

Prompt: **Can we combine similar demand without missing the store launch?**

Expected tool: `AggregateDemandTool`. Filter IT hardware, EMEA, and EUR. Show the computed source
request count and unit total; never sum different currencies. Continue into Sourcing Workbench.

## 1:20-2:20 - Award for total value

Prompt: **Compare the final bids for ZPC-RFP-31 and show how risk changes the recommendation.**

Expected tool: `CompareSupplierBidsTool`. Change risk weight. Point to the D3 geometry, confidence, exact
table, and the Baltic corridor warning. Lowest price is not silently equated with best value.

## 2:20-3:10 - Preserve human accountability

Prompt: **Review the proposed 65/35 split award.**

Expected tool: `ReviewSupplierAwardTool`. Move the split and inspect cost, risk and resilience. Above
70% primary share is blocked. Restore 65%, enter a specific rationale, and review the exact decision.
Optionally confirm the session receipt while stating explicitly that no supplier was awarded externally.

## 3:10-4:00 - Prove value honestly

Prompt: **Resolve invoice exception ZPC-8831.**

Expected tool: `ResolveInvoiceExceptionTool`. Show the EUR 15,000 unmatched freight and the EUR 5,000
tolerance; payment release is unavailable. Then ask a separate prompt:
**Show verified procurement value for IT hardware.** Expected tool: `ExploreSpendPerformanceTool`.
Keep disputed value excluded rather than claiming an unverified saving.

Closing line: **The art of possible is not more procurement chat. It is visual, evidence-aware software
inside the conversation, with policy visible early and people still accountable for every commitment.**

## Rehearsal checklist

- Verify prompt routing and extracted IDs in the authenticated target tenant.
- Verify Expand reaches the expected workspace with current context.
- Verify gradients, chart labels, keyboard marks, mobile layout, and dark mode.
- Reset before each run and keep the screenshot sequence available.