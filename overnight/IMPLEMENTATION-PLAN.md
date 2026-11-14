# Ajoissa — implementation plan (v2, Sat 14.11.2026)

Pilot county: **Pohjois-Karjala (Siun sote)**. Built from the team's decisions of 14.11 and sourced data. Every euro figure shows how it was calculated; anything without a source is marked **assumption**.

---

## 1. In one sentence
Every night Ajoissa reads Siun sote's own records, finds cancer warning signs nobody acted on, and puts them on one worklist for a named nurse per health centre, who spends about 45 minutes a day on it. A professional decides every action.

## 2. Why Pohjois-Karjala

| Reason | Evidence | Source |
|---|---|---|
| Appointments are fast, so the remaining delay is what happens *after* the visit, which is exactly what Ajoissa targets | 93 % of physician visits within 14 days, the best in Finland (March 2024) | THL Avohilmo via HE 134/2024 (report 4.3) |
| People still feel left out: an equity case | Worst self-reported unmet need for a physician in 2024: 32.1 % (lowest region 19.3 %) | THL FinSote/HYTE 2024 (report 4.3) |
| High need | Pohjois-Karjala and Pohjois-Savo have the highest illness burden in Finland's national health index | Kela health index 2020–2022, via Ilomantsi welfare report 2025 |
| A cheap pilot fits its budget | The region asked for €28.4 M extra funding for 2025 and received €2.6 M | Ministry of Finance, 30.10.2025 |
| Size suits a pilot | 161,441 residents (August 2025); over 20 health stations | Pohjois-Karjalan liitto 10/2025; Yle 2023 |

**Risk we state openly:** Siun sote is switching to the Lifecare patient-record system, with completion targeted for the end of 2027 (Siun sote, Kanta info 21.4.2026). Ajoissa reads from the region's data warehouse, not from the record system, so it does not depend on the switch. We still pick pilot centres that are not migrating during the six months.

## 3. What the nurse sees and does

1. **Each morning** the worklist shows patients with a cancer warning sign that nobody has acted on, ranked: emergencies, then follow-ups already overdue (Level 0), then the strongest symptom signals for the CT slots the region has given.
2. **Each row** shows what was found, the original sentence or lab value with its date, how many days overdue, the rule and its source, and a drafted next step (for example "colonoscopy referral" or "repeat PSA").
3. **The nurse decides:** approve (books it in the normal record system, or asks the GP to sign the referral), or dismiss with a reason.
4. **Time:** about 45 minutes a day, 3–4 hours a week, per health centre (team estimate). Benchmark: in the trial this design copies, one part-time reviewer spent about 4 hours a week on chart review and 1–2 hours on messages for 72 primary-care clinicians (Murphy et al., J Clin Oncol 2015).

**Dismissed flags** are archived with the reason (already handled / not clinically relevant / patient declined / wrong patient). They come back on the list, marked "previously dismissed", if the patient has **another visit** or a **new abnormal result**. Reasons are reviewed monthly to tune the rules.

## 4. What it reads (nightly, read-only, from Siun sote's data warehouse)

| Data | Used for |
|---|---|
| First-contact records: triage notes, symptom forms, phone assessments | Symptoms and red flags before the patient even sees a doctor |
| Earlier visits and their notes (last 12 months) | Repeat visits for the same complaint; smoking history; "could this have been caught earlier" |
| Lab results: Hb, MCV, ferritin, PSA, faecal haemoglobin (F-hHb), platelets | The Level 0 triggers |
| Imaging reports marked suspicious by the radiologist | Lung trigger |
| Referrals and procedures (CT, colonoscopy, urology) | To see whether follow-up happened, and to close the clock |
| Visit codes (ICPC-2), age, sex | Rules and exclusions |

**Works without free text:** all three Level 0 triggers use numbers, codes and dates. Notes add the symptom flags (the Matti case). How fresh the warehouse is must be confirmed with Siun sote; AstraZeneca's mentors said "should be daily, varies by county".

**Smoking history:** read from notes when it is there; when it is missing for a patient with lung symptoms, the worklist asks the nurse to record it at the next visit (no yearly form).

## 5. Rules (Level 0 = no new capacity)

| Cancer | Flag when | And none of these within | Not flagged |
|---|---|---|---|
| Lung | Chest X-ray or CT marked suspicious | CT, lung-clinic referral or repeat imaging in 30 days | Under 30, known lung cancer, palliative care, recent lung-clinic review |
| Bowel | F-hHb ≥ 25 µg/g (10–25 with bowel symptoms), or iron-deficiency anaemia (Hb ≤ 110 g/l, MCV ≤ 81 fl, no ferritin ≥ 100) | Colonoscopy referral in 60 days | Under 40 or over 75, recent colonoscopy, known bowel cancer, heavy periods, pregnancy, other bleeding source |
| Prostate | PSA above the lab's age limit (Fimlab: 2.5 / 3.5 / 4.5 / 6.5 µg/l) | Repeat PSA, urology referral or biopsy in 90 days | Under 40 or over 70, known prostate cancer, recent biopsy, prostatitis at the time |

Windows and exclusions copy the randomised trial (Murphy 2015; strong, outcome = time to work-up: bowel 200 → 104 days, prostate 192 → 144 days, lung not significant). Thresholds: Fimlab bulletin 150/2024, Fimlab PSA limits, Käypä hoito PSA 16.4.2025. Siun sote would use its own laboratory's limits.

## 6. People

| Role | Who | Time |
|---|---|---|
| Owner | Chief physician of primary care, Siun sote | 1 steering meeting a month |
| Reviewer | One named nurse per pilot health centre | ≈ 45 min a day (3.75 h a week) |
| Clinical back-up | One GP per centre, signs referrals, unclear cases | ≈ 1 h a week (**assumption**) |
| Data | Siun sote data team | Set-up, then about 1 day a month |
| Partner | AstraZeneca / FICAN (evaluation design), Brainwave Bandits (software) | — |

## 7. Cost

### Hourly costs

| Item | Calculation | Result | Source |
|---|---|---|---|
| Nurse pay | €3,174 a month (average task-based pay of nurses in wellbeing services counties, 2025) × 12 ÷ (38.25 h × 52 weeks) | €19.15 / h | Tehy calculation from Statistics Finland, Oct 2025 (via Verkkouutiset) |
| Employer contributions 2026 | Pension, employer share 19.94 % + sickness insurance 1.91 % + unemployment insurance 1.23 % = 23.1 % | ×1.231 | Kuntaliitto, 25.6.2026 |
| **Nurse, total** | | **≈ €23.60 / h** | Excludes holiday bonus and supplements, so the real figure is somewhat higher |
| Physician, total | €8,197 a month (average total earnings, municipal physicians, 2021) × 12 ÷ 1,989 h × 1.231 | ≈ €61 / h | KT statistics via Yle (2021: older, all municipal physicians) |

### Six-month pilot, three health centres

| Item | Calculation | € | Basis |
|---|---|---|---|
| Nurse review | 3 centres × 3.75 h × 26 weeks = 292.5 h × €23.60 | 6,900 | Sourced rates, team's time estimate |
| GP back-up | 3 × 1 h × 26 = 78 h × €61 | 4,750 | **Assumption** (1 h a week) |
| Data set-up | 20 person-days × €600 | 12,000 | **Assumption** (no source for days or rate) |
| Data maintenance | 6 days × €600 | 3,600 | **Assumption** |
| Server | Runs on Siun sote's existing infrastructure | 0–1,000 | **Assumption** |
| Software licence | Open source (MIT) | 0 | Repository licence |
| **Total** | | **≈ 27,000–28,000** | |

**Running cost after the pilot**, per health centre with one reviewing nurse: 195 h × €23.60 ≈ **€4,600 a year**. All 20+ health stations at that level would be about €92,000 a year, an upper bound, since small stations will have fewer flags.

**What we do not count as cost:** the follow-ups themselves (colonoscopy, repeat PSA, CT). Level 0 follow-ups were already clinically due; Ajoissa makes them happen sooner. Symptom flags only use the CT slots Siun sote chooses to give.

**What we do not claim as savings:** no euro savings. We have no Finnish source for the cost of a late or emergency cancer diagnosis, so we leave it out.

**Funding route:** national cancer roadmap measure 3.5.3 earmarks €1.14 M for digital and AI early-detection tools. The pilot is about 2.5 % of that.

## 8. KPIs (measured by the pathway clocks, per health centre, monthly)

| # | KPI | Target for the pilot | Benchmark |
|---|---|---|---|
| 1 | Share of flags decided (approved or dismissed) within 7 days | ≥ 80 % (team target) | — |
| 2 | Days from abnormal result to follow-up done, vs the last 12 months | Clearly shorter | Trial: 200 → 104 days (bowel) |
| 3 | Share of flags that were real missed follow-ups | ≥ 50 % | Trial: ≈ 60 % |
| 4 | Nurse time per day | ≤ 45 min | Team estimate |
| 5 | Flags and approvals per 1,000 residents by health centre and age group | No group left behind | Equity check |
| 6 | Dismissed flags that came back with a new visit or result | Reported | — |

Not a KPI in a six-month pilot: stage or survival (too few cases). The experimental survival estimator is shown separately and clearly labelled.

**Expected volume (model):** about 86 lung and 120 bowel cancers a year in a region of 161,000 (national rates: about 3,000 lung and 4,153 bowel cancers a year in 5.6 million people). How many of these pass through a missed follow-up is unknown; the shadow run measures it.

## 9. First 90 days

| Days | What | Done when |
|---|---|---|
| 0 | Regional board decision; owner and three pilot centres named (not migrating to Lifecare during the pilot) | Decision minuted |
| 1–30 | **Governance:** legal basis under HE 159/2025, data protection impact assessment, access logging, patient opt-out. **Data:** read-only nightly extract agreed with the data team; thresholds set to Siun sote's laboratory limits. **People:** nurses and back-up GPs named, 2-hour training | First test extract runs |
| 31–60 | **Shadow run:** worklist produced every morning, reviewed, nothing acted on. Count real misses vs false flags (including follow-ups done in private care); measure nurse minutes; baseline days-to-follow-up from the last 12 months | Real-miss rate and baseline known |
| 61–90 | **Live:** nurses act on Level 0 flags; clocks run; first monthly step-time report per health centre | First report published |
| Day 90 | Go / no-go for months 4–6; decide whether to add symptom flags with a fixed number of CT slots | Board decision |

**Stop rules:** nurse time above 60 minutes a day for two weeks; fewer than 30 % of flags are real misses after the shadow run.

## 10. Risks
- **Follow-up done in private or occupational care** may be invisible to Siun sote → false flags; the shadow run measures this.
- **Trial evidence** is from US veterans' hospitals, mostly men, 2011–12; its lung arm was not significant (n = 19).
- **Reading free text** is the weakest part (13 of 20 unseen test notes fully right); phase 1 does not depend on it.
- **Record-system switch** to Lifecare by end-2027: handled by reading from the warehouse and choosing centres outside the migration window.
- **Capped CT slots:** a lower-risk patient waits longer; a clinician can override the order.
- **PSA:** overdiagnosis is the main harm; the agent never proposes a new PSA test, only the follow-up of one already taken.

## Sources (new in v2)
- Siun sote. Kanta info for private social-care providers, 21.4.2026 (Lifecare roll-out by end of 2027). https://www.siunsote.fi/wp-content/uploads/2026/05/Sosiaalihuollon-yksityisten-palveluntuottajien-Kanta-info-21042026.pdf
- Pohjois-Karjalan liitto. Tilanne- ja kehityskuva, October 2025 (161,441 residents). https://pohjois-karjala.fi/julkaisut/pohjois-karjalan-tilanne-ja-kehityskuva-2025
- Ministry of Finance. Pohjois-Karjalan hyvinvointialueelle lisärahoitusta 2,6 miljoonaa euroa, 30.10.2025. https://valtioneuvosto.fi/-/10623/pohjois-karjalan-hyvinvointialueelle-myonnetaan-lisarahoitusta-2-6-miljoonaa-euroa
- Ilomantsi. Laaja hyvinvointikertomus 2025–2028 (national health index). https://ilomantsi.fi/wp-content/uploads/2025/04/Laaja-hyvinvointikertomus-ja-suunnitelma-vuosille-2025-2028.pdf
- Verkkouutiset. Sairaanhoitajien palkka on jo 3174 euroa kuukaudessa (Tehy / Statistics Finland). https://verkkouutiset.fi/a/sairaanhoitajien-palkka-on-jo-3174-euroa-kuukaudessa
- Kuntaliitto. Sosiaaliturvamaksuennusteet, June 2026. https://www.kuntaliitto.fi/sites/default/files/media/file/Sosiaaliturvamaksuennusteet_kes%C3%A4kuu%202026.pdf
- Yle. Lääkäreiden palkkavertailu (KT statistics 2021). https://yle.fi/a/74-20055894
- Yle. Pohjois-Karjalassa yli 20 terveysasemaa (2023). https://yle.fi/a/74-20028934
