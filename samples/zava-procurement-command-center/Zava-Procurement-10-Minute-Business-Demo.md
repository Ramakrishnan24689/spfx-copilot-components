# Zava Procurement Command Center - 10-minute business demo

## Story

Megan Bowen needs 600 rugged devices across Europe before a store launch. Fragmented regional demand
becomes one sourcing event. Supplier risk changes a lowest-price recommendation into a defensible split
award. Award terms then explain an invoice exception and determine what value can be counted as realized.

| Time | Role and prompt | Expected tool | Evidence and action |
| --- | --- | --- | --- |
| 0:00 | Requester: fastest compliant path | `CreatePurchaseIntentTool` | Outcome, budget, route, evidence gaps |
| 0:50 | Requester: compare routes | `CompareBuyingOptionsTool` | Contract, reuse, catalog, source consequences |
| 1:35 | Requester: explain policy | `CheckPurchasePolicyTool` | Source, version, threshold, owner, remediation |
| 2:15 | Buyer: combine demand | `AggregateDemandTool` | Currency-coherent source requests, region/category filters, computed unit totals |
| 3:00 | Category manager: run a fair event | `BuildSourcingEventTool` | Source cohort, scope, deadline, qualified invitation, evaluation model and reviewed draft |
| 4:00 | Buyer: compare final bids | `CompareSupplierBidsTool` | Weight change, D3 landscape, exact normalized table |
| 5:10 | Risk lead: top supplier fails | `TrackSupplierRiskTool` | Lead-time evidence, explicit corridor scenario, dependency sequence and modeled exposure |
| 6:00 | Risk lead: reduce exposure | `PlanSupplierRiskMitigationTool` | Owner, trigger, contingency, residual exposure |
| 6:50 | Approver: review 65/35 split | `ReviewSupplierAwardTool` | Cost, concentration, timing, authority, confirmation |
| 8:00 | AP: why invoice does not match | `ResolveInvoiceExceptionTool` | PO/receipt/invoice, tolerance, freight correction |
| 9:00 | Finance: did value materialize | `ExploreSpendPerformanceTool` | Four verified-value stages inline; expand for the D3 value river; keep disputed amounts excluded |

## Safeguards to narrate

- Prompt properties prefill and scope; React components resolve records and own deterministic math.
- Policy, supplier scores, confidence, missing evidence, and alternatives stay inspectable.
- Sourcing launch, qualification, award, renewal, PO, and invoice disposition require human confirmation.
- No mock action writes to ERP, source-to-pay, supplier, contract, or payment systems.

## Fallback

Use the publication images in the same order. The local evidence proves rendering and package contents;
authenticated tenant evidence separately proves routing, CSP, iframe focus, and bridge behavior.