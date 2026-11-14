# Ajoissa — project brief (single source of truth for all deliverables)

Team: Brainwave Bandits · Junction 2026 · AstraZeneca challenge (equal and effective cancer care in Finland, National Cancer Strategy Goal 3)
Demo app: https://claude.ai/artifact/WBcU1hw4dpagfNVUQ2Ec3x · Repo: https://github.com/dalvesalo/Junction-2026 (app/ folder)

## One line
**Ajoissa** ("in time") is a safety-net agent for public primary care: overnight it reads the county's own records, puts patients whose cancer signals have stalled on a named nurse's worklist with the reason, and runs a clock until each one is diagnosed or cleared — and the clocks give the county the step-by-step waiting data nobody measures today.

Tagline: *Same symptom, same speed — whichever door you walk in.*

## The gap (what the data proves) — every claim sourced
1. **Front-door gap (where it emerges):** DLBCL, 7 Finnish hospitals, n = 160: median symptom-to-treatment **127 days via public primary care vs 76 via private/occupational care (p = 0.027) → 51 days ≈ 7 weeks**. The paper's Fig. 1 cumulative step times (42/43/77/118/123 vs 72/94/147/204/207, provider labels as in the AstraZeneca keynote) show the gap already **+86 days at the specialist visit**; specialist → treatment takes 3–5 days on both routes. *Kuitunen et al., Cancer Medicine 2026;15(5):e71920 — moderate, waiting time.* Roadmap 2026–31 p.12 reports a similar pattern from another, unpublished lymphoma study.
2. **Who is affected (equity):** 5-yr survival all cancers, low vs high education: men **64 % vs 77 %**, women **65 % vs 78 %** (OECD/EC Country Cancer Profile Finland 2025 citing FCR — moderate/strong). Low-education: stage IV OR 1.10 (men)/1.15 (women), surgery OR 0.91/0.94, cancer mortality HR 1.13/1.14 *after adjusting for stage, treatment and region* (Zai et al., BMJ Public Health 2025, 469,522 pts — strong). Occupational care covers 92 % of wage earners (Kela 2026) — retired/unemployed rely on public care.
3. **Goal 3 outcome:** Lung cancer 5-yr survival lowest in Nordics: men FI 16.4 % vs NO 26.6 %; women 25.5 % vs 33.2 % (Tichanek et al., Clin Epidemiol 2023, NORDCAN 2016–20 — strong). Strategy target +14 pp by 2035. Fixable: Denmark men 8.9 % → 26.2 % vs Finland 9.7 % → 16.7 % (1998–2002 → 2018–22; Khalife et al., Acta Oncol 2025 — strong). Stage I FI 19.7 % vs NO 30.6 %; operated FI 11.8 % vs NO 26.6 % (Paappanen 2025 — moderate). Only 27 % reach curative lung treatment (FCR lung report 2026 — moderate).
4. **Mechanism:** GP appointment ~14 d in Finland vs 2–7 d; < 10 % of Finnish primary-care units can order CT vs 90–100 % elsewhere, per a Nordic expert survey (42 clinicians, 12 Finnish; IHE Cancer Dashboard 2026 / Khalife 2025 — weak–moderate). **Since 1.1.2025 adults are only guaranteed non-urgent primary care within 3 months** (HE 134/2024 — strong). Physician visits not realised within 14 days ranged from 7 % (Pohjois-Karjala) to 58 % (Helsinki), March 2024 (THL Avohilmo via HE 134/2024 — strong, old). In Finland primary-care visits rise 3–4 months before a colorectal diagnosis; 65 % of pre-diagnostic hospital stays start as emergencies (Hermiö et al., BMC HSR 2023 — strong).
5. **Where to act:** County survival differences are mostly NOT significant (FCR 2023; OECD 2025) — but 67 % of municipal survival variation lies *within* hospital districts, at the local level (Seppä et al., Acta Oncol 2020 — strong) → act per health centre.
6. **Invisible:** Strategy: symptom→diagnosis data "not collected systematically"; stage missing in 61 % of 2019–23 cases (FCR); cancer target times (THL 4/2017: ≤ 6 weeks referral→treatment) not published by county, while Denmark publishes by region quarterly (77 % within standard time, Sundhedsstyrelsen 2025).

## Why an agent, and why now (evidence for the solution)
- **RCT:** EHR triggers for abnormal results without follow-up + human review cut median time to colorectal work-up **200 → 104 days** (prostate 192 → 144; lung arm not significant, n = 19); completed evaluation 73 % vs 52 % (Murphy et al., JCO 2015 — strong, time outcome). This is our design pattern.
- Missed opportunities are common: ≥ 3 GP visits before referral in 50.6 % (myeloma), 41.3 % (pancreas) (Lyratzopoulos, Lancet Oncol 2012 — strong). Non-specific symptoms → stage IV 32 % vs 21 %, emergency 34 % vs 16 % (Pearson, BMJ Open 2020 — strong). Imaging within 2 weeks for only 13.9 % of new dyspnoea, 49.5 % of haemoptysis (Koo, Thorax 2024 — strong).
- Thrombocytosis: 1-yr cancer incidence 11.6 % men / 6.2 % women (Bailey, BJGP 2017 — strong).
- AI on GP free text flags ≈ 62 % of lung cancers ≈ 4 months before referral at 3 % PPV, ≈ 33 work-ups per earlier diagnosis, ≈ 40 % missed (Schut, BJGP 2025 — moderate).
- **Approved by Parliament 21.4.2026:** HE 159/2025 (EV 38/2026; entry-into-force date to confirm): counties may use their own patient records to identify health problems early; a professional decides; patient may refuse; access logged. Precedent: **Päijät-Häme AINO** (CKD risk list → nurse → physician), AstraZeneca-supported (STT 12.3.2026).
- Regulation: a pure referral/result tracker may not be a medical device (MDCG 2019-11); risk scoring = likely MDR class IIa → phase it (our reading, not legal advice). AI Act Annex I obligations likely 2 Aug 2028.
- **No stage/survival effect is claimed.** ERICA RCT (UK) has not reported. The pilot measures it.

## How the agent works (deterministic, auditable)
1. **Read** — FI/EN lexicon mapped to ICPC-2 codes over free-text notes: negation (incl. lists), duration, severity words (urgency only), one-letter typos next to medical words, phrase patterns ("cough … blood"); optional AI second reading that must quote the note. Structured data: ICPC-2 visit codes, measured weight loss > 5 % (AAFP 2014), repeat platelets, abnormal results with no follow-up, normal chest X-ray with continuing symptoms, repeat antibiotics. Test set: tests/RESULTS.md.
2. **Weigh** — Bayesian lung-cancer risk: PLCOm2012 prior (Tammemägi NEJM 2013; 6-yr risk ÷ 6) × the two strongest published LR+ (Hamilton 2005 via Okoli 2018: haemoptysis 13.2, weight loss 6.2, appetite loss 4.8, dyspnoea 3.6, chest pain 3.3, fatigue 2.3; cough 2.5 & hoarseness 1.9 Iyen-Omofoman 2013). Cough counts only if ≥ 3 weeks or repeat visits.
3. **Match** — explicit NICE NG12-style rules (3 % PPV threshold), which roadmap 2.5.2 plans to standardise nationally; lymphadenopathy + B-symptoms; iron-deficiency anaemia → FIT; thrombocytosis; ≥ 3 visits in 90 days for the same complaint.
4. **Act** — one proposed action (direct thorax CT, chest imaging + 2-week review, neck ultrasound/biopsy, FIT, safety-net check-in) + a pathway clock with step targets; overdue clocks escalate.
5. **Explain** — every number with source; "Could this have been caught earlier?" re-runs the same rules on past visits (synthetic Matti: flagged 35 days earlier).
Human decides every action. Nothing goes to patients automatically. Same input → same output.

## Recommendations (actionability) — for one wellbeing services county
| # | Action | Owner | First 90 days | KPI | Evidence | County alone? |
|---|---|---|---|---|---|---|
| 1 | Switch on Ajoissa tracker (no risk score) in 3 health centres under Client Data Act §9(2) | Primary-care chief physician + data team | Weekly worklist, named nurse, 3 trigger types | % flags acted on ≤ 7 d; days flag → imaging | Murphy 2015 RCT (strong, time) | Yes |
| 2 | Give those centres direct CT for agent-flagged patients | Imaging lead | Reserved urgent slots | Days to CT | IHE 2026; NICE NG12 (weak–moderate, time) | Yes, if capacity |
| 3 | Publish step times per health centre monthly (from the clocks) | County cancer lead | Dashboard | Median days per step vs THL target | SE/DK/NO practice; strategy 2.5 (moderate) | Yes |
| 4 | Add risk scoring (phase 2) via in-house MDR Art. 5(5) route or CE-marked vendor; recalibrate on Finnish data | County + FICAN | Validation study | PPV, sensitivity | Schut 2025, QCancer (moderate, detection) | Needs QMS; scale = national |
| 5 | National: standardised referral criteria (roadmap 2.5.2) + publish cancer pathway times by county | STM/FICAN/THL | — | — | Nordic SVF/pakkeforløp (moderate) | No — national |

## Pilot ask
One county (e.g. Pohde), three health centres, six months. KPIs: share of flags acted on within 7 days; median days flag → imaging; share of cancers diagnosed via a tracked route; first published per-health-centre step-time report.

## Honest limitations
- Synthetic demo patients/health centres/timestamps (always tagged). County access data March 2024 (pre-2025 law change). DLBCL values read from slide. LRs are UK-derived; PLCOm2012 not calibrated for Finland. 41-day lung primary-care interval is unpublished (Yle, weak). Impact model is a model: no stage/survival claim. Workload cost is real (≈ 33 work-ups per earlier diagnosis).
