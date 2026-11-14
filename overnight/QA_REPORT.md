# QA report: Ajoissa submission (independent review)

Reviewer: independent skeptical QA, 13–14.11.2026. Scope: app (sources/data/county-data/app/index/engine/cases), deck slides + speaker notes, SUBMISSION.md, BRIEF.md, video script (film.html). I checked the numbers against the research files and CSVs, and checked the key claims against the original sources (PubMed, publisher/repository full text, Eduskunta, STM, Yle). I edited no files except this one.

---

## (A) MUST-FIX: wrong numbers, wrong attributions, misleading wording

### A1. Kuitunen 2026 DLBCL: wrong region, and the "84 days / twelve weeks" headline is not the paper's headline statistic
- **Where:** `app/js/app.js:70` ("Diffuse large B-cell lymphoma, North Ostrobothnia"); `app/js/sources.js` kuitunen2026 note ("Single-region Finnish cohort (North Ostrobothnia)"); `deck/slides/hook.html:2`; `video/film.html:56`; `index.html` h1 "Twelve weeks apart"; hook/born speaker notes; SUBMISSION description ("reach treatment 84 days later"); BRIEF §1; `engine.js` lymphoma_urgent `why` ("~84 days later").
- **What the paper says** (Kuitunen et al., Cancer Med 2026;15(5):e71920, full text on utupub.fi):
  - It is **multi-centre**, not North Ostrobothnia: "four university hospitals and three secondary hospitals". Prospective, Oct 2014 – Mar 2020, n = 160.
  - Headline result: median symptom-to-treatment interval (STI) **127 days (mean 201)** for "primary healthcare by appointment" vs **76 days (mean 126)** for private or occupational care, Mann–Whitney p = 0.027 (about n = 48 vs 39). The **median gap is 51 days (~7 weeks)**, not 84.
  - The 123/207 and step values (42, 43, 77, 118, 123 / 72, 94, 147, 204, 207) come from **Figure 1, labelled "cumulative diagnostic time"**. The text does not say whether they are medians or means. The paper also does not state which series is which provider; the assignment is an inference, although a plausible one.
  - The comparison excludes the emergency-route categories.
  - The paper does **not** say "twice as long". The ratio is about 1.7 (medians) or 1.6 (means). The "twice" comes from the roadmap, which cites an unpublished study.
- **Correction:** Remove "North Ostrobothnia" everywhere and write "7 Finnish hospitals (n = 160)". Either lead with the paper's tested number ("median 127 vs 76 days to treatment, p = 0.027") or keep 123 vs 207 but label it "cumulative step times, Fig. 1". Change "Twelve weeks apart" to "Seven weeks apart (median)", or keep 12 weeks only with the Fig. 1 label. Keep the source grade moderate and note the small n.
- **Also:** the "Default ≈ North Ostrobothnia (Pohde) size" slider and the county-table highlight of Pohjois-Pohjanmaa were justified as "the keynote's county". That link no longer holds. Pohde can still be the pilot ask, but not because of this study.

### A2. Yle MOT date is wrong
- **Where:** `sources.js` yle2025 (`where: "Yle MOT 23.10.2025"`, `short: "Yle MOT 2025"`); `deck/slides/impact.html:12` ("Yle MOT 2025"); research C row 1.4.
- **Fact:** the article yle.fi/a/74-20251023 is dated **12.10.2026**. "20251023" is an article ID, not a date. The figures themselves are correct: about 155 d, of which patient >50 d, primary care 41 d, specialised care 58 d; Sweden 107 d, Denmark 67 d; unpublished study coordinated by Kuittinen.
- **Correction:** "Yle MOT 12.10.2026 (unpublished study)". Rename the source key to yle2026.

### A3. "Legal since 2026" / "It is legal now" is not verified
- **Where:** `deck/slides/evidence.html:7` and its speaker note; `film.html:144`; `app.js` BRIEF item 5 ("It is legal now"); SUBMISSION description and voiceover at 1:40 ("legal since this year"); BRIEF ("Legal now").
- **Fact:** Parliament **approved** both laws (Health Care Act amendment and Client Data Act §9) in **EV 38/2026, dated 21.4.2026**. The entry-into-force date is left blank in that document ("päivänä kuuta 20"), and HE 159/2025 only says "as soon as possible". I could not confirm the entry-into-force date or the statute number. The team's own sources.js note says "Exact entry-into-force date not verified."
- **Scope** (narrower than the slide implies): the law covers named professionals processing the organiser's own records for health-check and screening target groups and for §24 tasks, i.e. early identification for patients needing special support, examination or treatment.
- **Correction:** "Approved by Parliament in April 2026 (EV 38/2026)". Do not say "legal since" until the entry-into-force date has been checked on Finlex.

### A4. "< 10 % of Finnish primary-care units can order a CT" misstates a small survey
- **Where:** `data.js` frontDoor; app Gap view card; `sources.js` ihe2026; deck mechanism slide; BRIEF §4; `engine.js` lung_urgent `why` ("< 10 % in Finland").
- **Fact** (Khalife et al., Acta Oncol 2025;64:734–41, full text): this was a survey of **42 clinicians**, 12 of them Finnish, covering 8 of 21 Finnish regions. "Only one respondent from Finland reported that they have CT scan as an imaging option in primary care". It measures respondents, not units, and no statistics were run. The "<10 % vs 90–100 %" framing is the IHE dashboard's (MSD-funded) rendering. One Khalife co-author is from MSD.
- **Correction:** "In a 42-clinician Nordic survey, 1 of 12 Finnish respondents reported CT access from primary care; most respondents elsewhere did (Khalife 2025, weak–moderate)." Downgrade the grade from moderate to weak–moderate.
- **Wrong URL:** `sources.js` ihe2026 links to `.../article/view/43398`, which is Paappanen. Khalife is 42778.

### A5. Murphy 2015 is generalised beyond what the trial showed
- **Where:** evidence slide speaker note ("halved the time to diagnostic work-up"); `film.html` ("200 → 104 days to diagnostic work-up when a trigger meets a human reviewer", with no cancer named); SUBMISSION ("halved time to colorectal work-up" is fine there); `app.js` impact assumptions ("US cluster RCT on colorectal and prostate red flags").
- **Fact** (PubMed abstract, JCO 2015;33:3560–7, doi:10.1200/JCO.2015.61.1301):
  - Triggers flagged **abnormal test findings with no follow-up**, not symptoms in free text.
  - Colorectal: median 104 vs 200 d. Prostate: 144 vs 192 d is the time at which 40 % had been evaluated, not a median.
  - **Lung trigger: 65 vs 93 d, n = 19, p = 0.59 (not significant)**.
  - Evaluation completed: 73.4 % vs 52.2 %.
- **Correction:** Always say "colorectal". Say that the trial covered lung, colorectal and prostate, and that **the lung arm showed no significant effect (n = 19)**. Expect a judge to raise this, because lung is the Goal 3 anchor. In the video card, add "(colorectal)".

### A6. Equity conflation in the "who" slide script
- **Where:** `deck/slides/who.html` speaker note: "The people left at the public door are older, poorer, less educated — and their survival is 13 points lower."
- **Problem:** the 13-point gap is by **education** (OECD/FCR, all cancers). It is not a gap between public-door and occupational-door patients. No source links the entry route to survival. The video makes the same implied link by cutting from the DLBCL route timeline straight to the education survival bars.
- **Correction:** "Patients with basic education have 13 points lower 5-year survival, and they are also the people more likely to rely on the public door." That keeps the two facts separate.

### A7. Footer contradicts the regulatory analysis
- **Where:** `index.html:108`: "Not a medical device."
- **Problem:** sources.js mdr_rule11, the recs slide and SUBMISSION all say the risk scoring is likely MDR class IIa. The demo shows that risk scoring.
- **Correction:** "Research prototype, not CE-marked, not for clinical use."

### A8. County table column label overstates the metric
- **Where:** `county-data.js` label "Not seen ≤14 d" (computed as 100 − phys14).
- **Fact:** HE 134/2024 Table 7 reports the share of *realised* non-urgent physician visits that took place within 14 days. The complement is "waited > 14 days", not "not seen". Helsinki's 42 % comes from the proposal's text, not the table.
- **Correction:** label it "Waited > 14 d (physician)", add "(of realised visits)" to the subtitle, and mark Helsinki's value as text-derived.

### A9. Source-text slips in sources.js
- `careguarantee2025` note: "A 64-year-old smoker with a persistent cough has no legal right to see a GP within 14 days." The 3-month maximum is confirmed by STM ("hoitotakuu on jatkossa 3 kuukautta"). But STM also says care must be provided "within a reasonable time" based on medical factors and the patient's situation. **Correction:** "...is legally guaranteed a non-urgent visit only within 3 months; anything faster depends on the needs assessment."
- `seppa2020` note: "i.e. at the local, health-centre level". The paper measures municipalities within hospital districts (2007–2016, before the counties existed). It says nothing about health centres. Also, within-district variation *fell* 18 %, which the authors read as improving equity. **Correction:** "between municipalities within hospital districts".
- `data.js` comment "Acta Oncol 2025 — lung cancer 5-yr relative survival": the data is Tichanek, Clin Epidemiol 2023. This is a comment only, but fix it for consistency.

---

## (B) SHOULD-FIX: weaknesses judges will attack

1. **The project's own key source undercuts the waiting-time story.** Khalife 2025 reports: "The Nordic experts concurred that a few weeks difference in waiting times does not explain the difference in LC survival." Be ready for this. Answer: the agent targets missed or stalled signals and CT access, not a few days of queue. Also cite Khalife's CT-access point, which the experts did think matters.
2. **The impact model stacks mismatched evidence.**
   - The 60 % flag rate comes from a Dutch NLP model (Schut 2025; AUROC 0.79 external, retrospective). Ajoissa is a keyword lexicon with rules, and its sensitivity is unknown.
   - The 50 % time cut comes from Murphy's colorectal arm (its lung arm was not significant).
   - The 41-day interval is unpublished.
   - 60 % × all county lung cancers ignores patients who never present to public primary care (occupational care, emergency, incidental findings).
   - **Fix:** show the 135 figure as an "if comparable to Schut" scenario, cut the default to public-primary-care presenters, and say that Ajoissa's sensitivity is untested. Schut's own paper has numbers that do not reconcile (291 identified vs 185 missed in the same example), so quote "≈ 6 in 10" with a caveat.
3. **The likelihood ratios are the most favourable available.** Hamilton 2005 single-study LR+ values are used: haemoptysis 13.2, dyspnoea 3.6. These come from a case-control study with a 180-day to 2-year window. Okoli's pooled meta-analysis gives much lower values: haemoptysis 5.97, dyspnoea 2.14, cough 1.75, chest pain 1.76. Also, PLCOm2012 already includes smoking, while Hamilton's LRs are not conditional on smoking. Show a sensitivity line ("with pooled LRs: X %"). The 21.5 % shown for Matti would fall noticeably.
4. **PLCOm2012 is used outside its validated setting.** It was derived in PLCO participants aged 55–74 and validated for screening populations. Here it is applied to symptomatic patients aged 40+, and "÷ 6" is a constant-hazard simplification. The demo discloses this, but the deck says only "needs recalibration". Add "not validated in symptomatic or under-55 populations".
5. **"As RAT pairs do"** (engine.js comment, and implied in the UI). Hamilton's RATs use empirical PPVs for symptom pairs; they do not multiply two LRs. Reword to "two strongest LRs only (conservative heuristic)".
6. **Recs slide grades the tracker "Strong (RCT, time)".** The RCT tested a US test-result tracker, not Ajoissa. Change to "Strong for the pattern (US RCT, colorectal); untested for Ajoissa".
7. **Stage-missing figures differ across deliverables:**
   - deck: 61 % (IHE, citing FCR 2019–23)
   - app data.js: 42 % available, i.e. 58 % missing (Syöpä 2024)
   - strategy: ~40 % recorded
   - lung report: "nearly half"
   - Zai: 30 % (2000–2019)

   Pick one per context and name its year and denominator.
8. **The Hermiö 2023 interpretation is stretched.** The mechanism slide and the briefing say "Patients come back again and again". Hermiö shows service use rising 3–4 months before a colorectal diagnosis, and 65 % of the *pre-diagnostic inpatient episodes* (14 % of events) starting as urgent admissions. The authors read this as a need to recognise symptoms, not as repeat missed visits. Use Lyratzopoulos 2012 for "repeat visits" (verified: lung OR 1.68 vs rectal for ≥3 consultations; myeloma 50.6 %, pancreas 41.3 %, n = 41,299).
9. **Mixed lung-survival periods.** The deck uses 16.4 % (2016–20, Tichanek) and 16.7 % (2018–22, Khalife) side by side. Label the period on each.
10. **"Who pays: roadmap 3.5.3 earmarks €1.14 M"** (SUBMISSION Q&A). I could not verify this; the roadmap PDF is not on disk. Check the page before saying it on stage.
11. **Zai 2025 "after adjusting for stage, treatment and region".** The PubMed abstract confirms HR 1.13 / 1.14 but does not list the covariates. The research file says they include stage, treatment and region. Confirm in the full text (PMC12551501), because a judge may ask.
12. **The county view highlights Pohjois-Pohjanmaa, but its physician ≤14 d value is missing** ("–"). In a live demo this looks like a data hole on the one county being pitched. Use THL 2026 data if anyone can get it, or say why it is missing.
13. **Funding and conflict-of-interest optics.** The IHE dashboard is MSD-funded and Khalife has an MSD co-author. This is fine for an AZ challenge, but disclose it in the Sources view (grade note).
14. **"Two patients … same lump"** is a narrative device: the figures are group medians or cumulative values from n ≈ 87. Keep it, but put "group medians, n = 160 cohort" in the on-screen source line.

---

## (C) Engine bugs (reproduce with `node` after `global.window=global; require("./engine.js")`)

Patient `P = {age:64, sex:"M", smoking:{ever:true,current:true,cigsPerDay:20,years:40}}` unless stated otherwise. The output is from `Ajoissa.assess({patient:P, note, labs:{}, history:[]})`.

| # | Input note | Result | Expected | Cause |
|---|---|---|---|---|
| C1 | `Ei kuumetta, yskä 4 viikkoa.` | cough **NEG**, action `none` | cough positive → lung_imaging | Negation looks back 28 chars within a clause; a comma is not a clause boundary. **Serious false negative.** |
| C2 | `No fever, cough for 4 weeks.` | cough NEG, `none` | same | same as C1 (English) |
| C3 | `Denies fever, reports weight loss and cough for 5 weeks.` | weightloss **NEG** | weightloss positive | same as C1 |
| C4 | `Strep-testi negatiivinen, yskä 4 viikkoa…` | cough NEG | positive | the "negat" negator matches "negatiivinen" (a test result) |
| C5 | `Retired teacher, cough for 4 weeks, short of breath.` (66 F never-smoker) | `fatigue` found | no fatigue | "tired" is a substring of "retired". No word boundaries anywhere ("itch" also matches "kitchen" and "switch") |
| C6 | Same as C5 | rule NG12-lung-3 met (≥ 2 symptoms, age ≥ 40) but action = `safety_net` ("No referral now") | chest imaging (NICE: urgent CXR) | `decide()` gates lung rules on posterior ≥ 1 %. Never-smokers who meet an explicit NG12 rule get no referral. This contradicts the "explicit rules" claim. |
| C7 | `Cut finger in the kitchen… Lump in neck…` (50 F) | `pruritus` from "kitchen" → **NG12-lymph urgent → lymphoma_urgent** | lymph alone (no B-symptom, no duration) → no urgent rule | substring match, as in C5 |
| C8 | `Yskä 8 viikkoa, laihtunut.`, smoker with `years` missing | posterior **NaN**; rules lung-2 and lung-3 hit; action `safety_net` | lung_imaging (rules met) | missing field → NaN in plcom2012; every NaN comparison is false; the UI would print "NaN %" |
| C9 | patient with no `age` | NaN; age-gated rules silently skipped | flag the record as incomplete | no input validation |
| C10 | `{age:70, sex:"M"}`, no smoking object, `Laihtunut. Yskä 8 viikkoa.` | treated as **never-smoker** (prior 0.025 %/yr) | show "smoking status unknown" and use a population prior or ask | `!s.ever` treats missing data as never |
| C11 | `Yskä kolme viikkoa.` / `Cough for two months.` / `Cough for 2 years.` | no duration found; the cough is not "persistent" | ≥ 3 weeks | durationWeeks handles digits only, and has no year/vuosi unit |
| C12 | `Kuumetta 4 viikkoa, yskä.` | the cough inherits "4 weeks" from the fever | cough duration unknown | duration is taken from the whole clause, not from the concept |
| C13 | `Aiemmin laihtunut, nyt paino stabiili.` | weightloss positive | historical, so not current | no temporality handling (minor) |
| C14 | `Yskinyt verta 2 päivää.` at age 35 | `safety_net`, with why-text "If the cough has not resolved…" | acceptable under NG12 (< 40), but the message is wrong and it should still say "haemoptysis" | generic safety-net text |
| C15 | Platelets 450 at age 30 | PLT rule fires (urgent for a man) | Bailey's cohort was age ≥ 40 | no age check on the PLT rule |

The six demo cases run as the deck claims:
- Matti: prior 0.91 %, posterior 21.5 %, rules NG12-lung-2, lung-3, PLT and REPEAT, action lung_urgent; flagged 35 days earlier by `earliestFlag`.
- Laura: lymphoma_urgent.
- Ritva: 0.52 % → 19.8 %, lung_urgent.
- Heikki: safety_net.
- Sari: colorectal_test.
- Jorma: none.

Negation works for "Ei veriyskää", "kiistää laihtumista" and "Ei yskää." **The demo is safe, but avoid commas after a negated item if judges type their own notes.**

Suggested minimal fixes:
- End the negation scope at `,` and at "and/ja", and drop "negat".
- Use word-start boundaries (`(^|[^a-zäöå])form`).
- Parse number words (yksi–kymmenen, one–ten) and add a `vuo|year` unit.
- Let any NG12 rule hit set at least `lung_imaging` regardless of the posterior.
- Validate required fields and show "incomplete data" instead of NaN.

---

## (D) Verified as correct

- **PLCOm2012 coefficients** match the published model exactly, checked against the resplab PLCOm2012 R implementation of Tammemägi 2013: age 0.0778868 (−62), education −0.0812744 (−4), BMI −0.0274194 (−27), COPD 0.3553063, cancer history 0.4589971, family history 0.587185, current smoker 0.2597431, intensity −1.822606·(10/cpd − 0.4021541613), duration 0.0317321 (−27), quit time −0.0308572 (−10), constant −4.532506. Current smokers get quit time = 0, which is correct. Race terms are omitted, which is reasonable for Finland. A hand calculation for Matti gives 6-year risk 5.48 %, matching the engine.
- **Hamilton 2005 LR+ values via Okoli 2018 Table 3:** haemoptysis 13.2, weight loss 6.2, appetite loss 4.8, dyspnoea 3.6, chest/rib pain 3.3, fatigue 2.3. Iyen-Omofoman: cough 2.5, hoarseness 1.9. Never-smoker prior 0.124 % (61 F) is in Okoli Table 5. The time horizon is not stated in Okoli, so the "5-year → ÷ 5" step is the team's assumption; label it.
- **Tichanek 2023 (NORDCAN 2016–20):** 5-year survival, men FI 16.4 % vs NO 26.6 %; women FI 25.5 % vs NO 33.2 %; Finland worst. 1-year survival: men FI 43 % vs > 50 %; women FI 52.4 % vs ~60 %.
- **Khalife 2025:** men's 5-year survival FI 9.7 % → 16.7 %, DK 8.9 % → 26.2 %, IS 28.4 % (1998–2002 → 2018–22). GP appointment 14 d vs 2–7 d (modal survey answer, which Finnish experts called "optimistic"). Doctor at first contact 40–60 % vs 80–100 %. n = 42 respondents.
- **Murphy 2015:** colorectal 104 vs 200 d; evaluation completed 73.4 % vs 52.2 % (RR 1.41).
- **Bailey 2017:** 11.6 % men, 6.2 % women; 18.1 % / 10.1 % after a second raised count; one-third of lung/colorectal cases had no other symptom; > 3 % NICE threshold.
- **Seppä 2020:** 67 % (95 % PI 58–76 %) of variation within hospital districts; fell 18 % since 1997–2006.
- **Zai 2025:** stage IV OR 1.10 / 1.15; mortality HR 1.13 / 1.14; n = 469,522 (240,746 + 228,776).
- **Lyratzopoulos 2012:** myeloma 50.6 %, pancreas 41.3 %, n = 41,299.
- **Hermiö 2023:** n = 3,115; rise 3–4 months before diagnosis; 65 % of inpatient episodes urgent.
- **Schut 2025:** AUROC 0.88 / 0.79; ~4 months before referral; 33 evaluated per earlier diagnosis; ~4 in 10 missed; retrospective.
- **Care guarantee:** 3 months for non-urgent primary care from 1.1.2025; under-23s excluded (STM release).
- **HE 159/2025:** approved by Parliament, EV 38/2026, 21.4.2026; the content matches the description. Only "in force" is unverified (see A3).
- **Yle figures:** 155 / 41 / 58 / >50 d; SE 107, DK 67; unpublished (see A2 for the date).
- **ERICA:** no published results found (protocol only, ISRCTN22560297), so "has not reported" stands.
- **Internal arithmetic:**
  - DLBCL step gaps +30 / +51 / +70 / +86 / +84 (from the Fig. 1 values).
  - Impact defaults: 420,000 × 3,000 / 5.6 M = 225 cases; × 0.6 = 135; 41 × 0.5 = 21 d; 135 × 33 = 4,455 work-ups (~86 a week). 14,926 / 5 ≈ 2,985 a year.
  - County table values match both B_*.csv files row by row.
  - Engine output matches the deck and video (0.9 % → 21.5 %, four rules, 35 days).
- **Labelling:** synthetic data is tagged on every screen, and the Yle 41-day figure is labelled weak and unpublished.
