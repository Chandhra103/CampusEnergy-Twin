# CampusEnergy Twin

CampusEnergy Twin is an AI-powered digital twin and decision-support platform for sustainable campus energy management. It helps educational institutions monitor energy consumption, predict demand, detect unusual usage patterns, simulate energy-efficiency and renewable-energy scenarios, and understand potential sustainability impacts.

**Core workflow:** Monitor → Predict → Detect → Simulate → Recommend → Act

**Primary alignment:** UN SDG 7 — Affordable and Clean Energy. The application can also support discussion of SDG 11, SDG 12, and SDG 13, but it does not claim that the software itself has achieved any SDG target.

## What is included

The application is a responsive React + TypeScript workspace with a persistent navigation sidebar and the following connected areas:

- Dashboard with KPI cards, energy trend, building comparison, peak-demand signal, and explainable insight.
- Digital Campus Twin with an interactive conceptual building map and building detail panel.
- Building Energy Monitoring with period filters, building comparison, modeled metrics, and trend charts.
- AI Predictions with a local deterministic baseline forecast, uncertainty indication, inputs, and illustrative model metrics.
- Anomaly Detection with baseline deviation evidence, possible contributing factors, and mark-as-reviewed state.
- What-If Simulator with LED, AC, schedule, equipment, and solar assumptions plus scenario comparison.
- Renewable Planning with roof area, capacity, generation, grid requirement, and contribution estimates.
- Peak Demand analysis with historical/predicted peaks and flexible-activity review prompts.
- AI Recommendations with reason, supporting evidence, expected direction, assumptions, and confidence.
- EnergyAI Assistant with grounded answers from demo data, model outputs, scenario calculations, and a project knowledge base.
- Sustainability Impact Dashboard with energy, cost, CO₂e, renewable, and SDG alignment views.
- Reports with a downloadable text sustainability brief that preserves assumptions and limitations.
- Data Management with browser-side CSV upload, required-column validation, duplicate detection, and dataset preview.
- Responsible AI, project limitations, About, and configurable Settings pages.

## Role-based workspace

The workspace now supports five role modes: **Facility Manager** (default operational view), **Sustainability Manager**, **Energy Analyst**, **Administrator**, and **Demo / Evaluator**. The evaluator role can explore the complete prototype but is read-only for important settings, scenario saving, and data upload. The new **Action Center** prioritizes high-priority anomalies, medium-priority peak signals, and modeled opportunities with View, Analyze, Simulate, and Verify / Resolve actions. Verify / Resolve records a human review in the demo workspace; it does not claim that a physical issue has been resolved or control equipment.

The dashboard now uses a role-aware greeting, the explicit `DEMO PERIOD • SEPTEMBER 2026` label, and the persistent `DEMO MODE • SYNTHETIC DATA` message. AI prediction, anomaly, recommendation, and simulation areas expose concise “Why am I seeing this?” explanations covering data considered, factors, assumptions, and limitations.


## Multi-source platform upgrade

CampusEnergy Twin now opens with a working prototype authentication layer. Users can sign in, create a profile, enter clearly labeled Demo Data, switch among the five supported roles, see their name, role, and institution, and log out. The role model remains **Facility Manager**, **Sustainability Manager**, **Energy Analyst**, **Administrator**, and **Demo / Evaluator**; Student mode is not available. Demo / Evaluator is read-only for important configuration, user administration, CSV upload, and stream activation.

The new **Data Sources** center presents the three acquisition levels in one workflow: **Manual / CSV data**, **Demo / Synthetic data**, and **Smart meter / IoT / API**. CSV uploads are validated in-browser for required columns, records, detected buildings, invalid values, and duplicates, and a downloadable example template is available. The smart-meter layer is explicitly a **SIMULATED • SMART METER** stream with changing sample readings; it does not claim a physical meter connection. External API configuration is represented as integration-ready architecture only, and API keys are not stored in this frontend prototype.

The active source label is surfaced in the workspace header and Data Sources center using the required concepts: `DEMO • SYNTHETIC DATA`, `UPLOADED • CAMPUS DATASET`, `SIMULATED • SMART METER`, and `CONNECTED • API DATA`. The existing digital twin, prediction, anomaly, simulation, recommendation, assistant, reporting, and responsible-AI flows remain in place. Persistent database ingestion and recalculation of every analytical page from imported CSV/API records remain backend integration work; the current fallback preserves the deterministic demo dataset when no persisted analytics service is connected.

## Demo mode and data provenance

The application works immediately without external API keys or a backend service. It ships with a clearly labeled synthetic dataset and deterministic calculations so the full workflow is usable after deployment.

The UI distinguishes:

- **Demo / synthetic data:** generated campus values used to demonstrate the workflow.
- **Model prediction:** future values estimated from historical patterns and modeled features.
- **Scenario estimate:** outputs derived from user-entered assumptions.
- **Data-derived answer:** a value calculated from the active application dataset.
- **Knowledge-base explanation:** methodology and SDG context.

Synthetic, predicted, and simulated values are never presented as real meter readings or guaranteed savings.

## Technologies

- React 19, TypeScript, Vite, Tailwind CSS 4
- Recharts for responsive charts
- Lucide React for interface icons
- Sonner for lightweight notifications
- Wouter-compatible scaffold routing foundation; the implemented experience uses a stable single-workspace navigation model
- Browser FileReader API for CSV validation
- Deterministic local analytics and rule-based explanations for offline demo operation

## Local setup

```bash
pnpm install
pnpm dev
```

Open the Vite URL printed by the dev server. For production validation:

```bash
pnpm check
pnpm build
```

The static build is generated under `dist/public`; the scaffold server can serve it with:

```bash
pnpm start
```

## Demo journey

1. Open **Dashboard** and review the clearly labeled synthetic campus status.
2. Open **Digital Campus Twin** and select **Computer Labs** to inspect consumption, occupancy, operating hours, load profile, recent trend, prediction, and AI note.
3. Open **What-If Simulator**, set the LED upgrade to 30%, and inspect the scenario estimate.
4. Save the scenario and compare it with the preloaded baseline, schedule, and combined scenarios.
5. Open **EnergyAI Assistant** and ask “What changes in the simulated scenario?”, “Which building consumed the most energy?”, or “Why was Lab 2 flagged?”.
6. Open **Reports** and export the current sustainability brief.
7. Optionally open **Data Management** and upload a CSV containing at minimum `date`, `building`, and `energy_consumption`.

## Simulation methodology

The demo uses transparent directional calculations rather than claiming production-grade savings:

- Cost estimate = energy consumption × configurable tariff.
- CO₂e estimate = energy consumption × configurable emissions factor.
- LED, AC, schedule, and equipment assumptions reduce the baseline according to visible modeled coefficients.
- Solar generation subtracts assumed daily generation from modeled grid requirement.
- Scenario comparison preserves each scenario’s assumptions in the table.

Actual savings require implementation, local validation, and before/after measurement.

## AI/model explanation

The prediction screen frames the output as a local baseline model based on historical consumption, time of day, day of week, aggregated occupancy, AC usage, lighting usage, equipment usage, and temperature where available. The demo exposes an illustrative holdout evaluation and uncertainty range to communicate that future values are not guaranteed.

Anomaly detection combines a modeled baseline with a deviation threshold. The UI provides observed value, expected range, deviation, timestamp, building, and possible contributing factors. It deliberately does not infer an exact physical cause.

Recommendations are explainable decision-support prompts. They include reason, supporting data, expected direction of impact, assumptions, and confidence. They do not control equipment or make decisions on behalf of administrators.

## Responsible AI and privacy

The prototype avoids unnecessary personal data. Occupancy is treated as aggregated context; the CSV guidance explicitly discourages names, phone numbers, facial data, and other identifying information. Facility managers and administrators remain responsible for final decisions. Poor or incomplete data can produce poor predictions, and the report retains these limitations.

## Known limitations

The default experience is a frontend-only demo. It does not connect to live meters, control electrical equipment, guarantee energy savings, infer exact equipment faults, or represent a real grid topology. Tariff and emissions factors are configurable assumptions, not hard-coded local facts. The local assistant is deterministic and intentionally says when the workspace lacks enough information.

## Testing summary

- `pnpm check` passes with no TypeScript errors.
- `pnpm build` passes and emits the deployable static bundle.
- The key workflow is implemented end-to-end: data context → dashboard → twin → prediction → anomaly review → scenario simulation → recommendation → impact → report.
- Responsive styles cover desktop, tablet, and mobile layouts, including a mobile sidebar and stacked analytics cards.
- CSV success and failure paths are handled with human-readable toasts and validation results.
- Interactive states include building selection, sliders, scenario saving, anomaly review toggles, role selector, settings, assistant prompts, CSV upload, and report export.

## Project context

CampusEnergy Twin was built as an AI + sustainability student project in the context of the 1M1B AI for Sustainability Virtual Internship, in collaboration with IBM SkillsBuild & AICTE. It does not claim official endorsement beyond that stated context.
