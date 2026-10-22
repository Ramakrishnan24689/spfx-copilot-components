# Zava Revenue Deal Room routing matrix

Generated from configured component manifests and the canonical starter configuration. Tool schemas prefill or scope experiences; they never confirm consequential actions.

## Tool boundaries

| Tool | Positive use boundary | Nearest exclusion |
| --- | --- | --- |
| `BuildAccountBrief` | Use for sourced account context and whitespace. | Do not use for one meeting. |
| `QualifyOpportunity` | Use for opportunity qualification and stage judgment. | Do not use for forecast commit. |
| `MapBuyingCommittee` | Use for buyer roles, influence, stance, and access. | Do not use for contact lists. |
| `GetDealRisk` | Use for evidence-ranked risk on one deal. | Do not use for aggregate pipeline risk. |
| `PrepareCustomerMeeting` | Use for preparing one upcoming customer meeting. | Do not use for meeting results. |
| `BuildMutualActionPlan` | Use for buyer and seller close commitments. | Do not use for internal task lists. |
| `ReviewMeetingCommitments` | Use for reviewing proposed meeting updates. | Do not use for meeting preparation. |
| `ShapeSolutionProposal` | Use for an outcome-led solution proposal. | Do not use for pricing approval. |
| `SimulateCommercialOffer` | Use for commercial scenario modeling. | Do not use to approve exceptions. |
| `ReviewDealException` | Use for a governed commercial exception decision. | Do not use for scenario modeling. |
| `InspectForecastCommit` | Use for manager forecast-category decisions. | Do not use for seller qualification. |
| `ExplorePipelineQuality` | Use for aggregate pipeline quality and intervention. | Do not use for one deal. |
| `DiscoverAccountOpportunity` | Use for account growth signal discovery. | Do not create a lead automatically. |
| `ResearchCompetitivePosition` | Use for evidence-grounded competitive strategy. | Do not invent competitor claims. |
| `CoachDealStrategy` | Use for explainable deal coaching plays. | Do not make a forecast decision. |
| `CreateExecutiveEngagementPlan` | Use for reviewed executive engagement planning. | Do not contact customers. |
| `TrackMeetingFollowUp` | Use for evidence-backed commitment follow-up. | Do not infer completion. |
| `BuildValueCase` | Use for customer outcome and payback modeling. | Do not set commercial price. |
| `ReviewProposalReadiness` | Use for proposal evidence and readiness decisions. | Do not write the proposal. |
| `PlanCustomerSuccessHandoff` | Use for reviewed sold-outcome handoff. | Do not close the opportunity. |
| `ExploreAgentCapabilities` | Use for discovering revenue scenarios. | Do not use for a specific request. |

## Conversation starters

| # | Title | Prompt | Expected inline component |
| ---: | --- | --- | --- |
| 1 | Deal risks | Show the risks threatening Contoso's global expansion deal this quarter. | `GetDealRisk` |
| 2 | Buying committee | Map the buying committee for the Contoso expansion. | `MapBuyingCommittee` |
| 3 | Commercial scenario | Model a three-year ramped offer that protects 68% margin. | `SimulateCommercialOffer` |
| 4 | Meeting preparation | Prepare me for tomorrow's Contoso steering meeting. | `PrepareCustomerMeeting` |
| 5 | Forecast decision | Should Contoso remain in commit for Q4? | `InspectForecastCommit` |
| 6 | Explore capabilities | Explore what the Revenue Deal Room agent can do. | `ExploreAgentCapabilities` |

## Sibling collision rehearsal

| Boundary | Prompt A | Expected A | Prompt B | Expected B |
| --- | --- | --- | --- | --- |
| Account context vs meeting prep | Build a brief for the Contoso expansion. | `BuildAccountBrief` | Prepare me for the Contoso steering meeting. | `PrepareCustomerMeeting` |
| Qualification vs forecast | Should we pursue the Contoso expansion? | `QualifyOpportunity` | Should Contoso remain in commit for Q4? | `InspectForecastCommit` |
| Deal risk vs pipeline quality | What can derail the Contoso signature? | `GetDealRisk` | Show pipeline quality for this quarter. | `ExplorePipelineQuality` |
| Scenario vs exception decision | Model a three-year ramped offer for Contoso. | `SimulateCommercialOffer` | Review the Contoso payment-term exception. | `ReviewDealException` |
| Proposal creation vs readiness | Shape the Contoso solution proposal. | `ShapeSolutionProposal` | Review the Contoso proposal readiness. | `ReviewProposalReadiness` |

## Host validation notes

- Verify selected tool and extracted properties in an authenticated Copilot tenant.
- Verify Expand lands in the tool's configured lens and preserves supported context.
- Verify a fresh prompt resets defaults while a passive host rerender preserves local interaction state.
- Local source validation proves catalog metadata alignment, not model routing behavior.
