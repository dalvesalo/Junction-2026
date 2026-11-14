# D — Verification of teammate research + "money or process?" (Sat 14.11.2026)

## 1. Teammate research ("cancer research.md"): what was checked

| Item | Status | What we use | Source |
|---|---|---|---|
| F-hHb < 10 negative, 10–< 25 borderline, ≥ 25 positive | **Verified** at the primary source | Bowel trigger thresholds | Fimlab bulletin 150/2024 |
| PSA age limits 2.5 / 3.5 / 4.5 / 6.5 µg/l | **Verified** | PSA trigger | Fimlab test 4869 |
| No PSA testing for symptom-free men over 70 | **Verified**; plus: repeat an abnormal PSA after 1–2 months; overdiagnosis is the main harm | PSA restraint, action text | Käypä hoito, PSA-testaus 16.4.2025 |
| Platelets > 400 as cancer trigger (11.6 % / 6.2 %) | Already verified earlier | Unchanged | Bailey 2017 |
| Iron-deficiency combination (Hb below range + MCV < 82 + ferritin < 30, man or post-menopausal woman) | **Not verified** (no Käypä hoito source found) → **replaced** | Trial definition: Hb ≤ 110 g/l, MCV ≤ 81 fl, no ferritin ≥ 100, with the trial's exclusions | Murphy 2015 |
| NICE: who gets a stool test | **Verified** | FIT rule in the engine | NICE DG56 (2023) |
| Colonoscopy criterion "bowel change > 6 weeks, age > 50, F-hHb > 10" | Not re-opened (Lääkärilehti PDF); partly used: loose stools count as bowel change only if ≥ 6 weeks | weak until re-read | LL-KOLONOSKOPIA |
| "3 in 4 bowel-cancer patients had specialist visits before diagnosis; anaemia most common" | **Not verified** (press release page could not be opened) → not used | Use Hermiö 2023 instead (visits rise 3–4 months before diagnosis) | — |
| 85 % of lung-cancer patients have a significant smoking history | Secondary source only (news article quoting the Cancer Registry) → weak, background only | not in the model | Verkkouutiset |
| PLCOm2012 thresholds 1.51 % / 1.70 % | Not needed (we do not screen) → not used | — | — |
| 5-ARI drugs "halve" PSA | Factor **dropped**; Käypä hoito only says they affect PSA → engine shows a note without a number | note only | Käypä hoito |
| Low sodium, high ALP, low Hb as lung cues | **Dropped** (unverified, late-stage, non-specific) | — | — |
| Liver values, CEA for bowel | **Dropped** (teammate doc itself says CEA is not an early-detection test) | — | — |
| BRCA, gene scores, lifestyle factors, breast-cancer module | **Parked** as secondary (team decision 14.11) | family words only used to exclude relatives' symptoms | — |
| ICD-10 code lists | Not verified, **not used** (engine uses ICPC-2 visit codes) | — | — |
| Reference ranges from the Toronto teaching handout (LAB-ESIM) | **Dropped** as a source | — | — |
| Finnish word lists (bowel, lung, smoking) | Used: bowel and lung symptom words, smoking phrases | lexicon + smoking reader | teammate doc |
| Reading records from private and occupational providers | **Out of the pilot** (HE 159/2025 covers the county's own records) | — | — |

## 2. The trial our design copies (re-read at the source)
Murphy DR et al., J Clin Oncol 2015;33:3560–7 (cluster RCT, 72 primary-care clinicians, two US sites). **Strong; outcome = time to diagnostic work-up, not stage or survival.**
- Triggers: suspicious chest imaging (30 days); positive stool test, rectal bleeding or iron-deficiency anaemia (60 days); PSA 4.1–15 (90 days), each "without follow-up".
- Results: bowel median 104 vs 200 days (n = 557, p < 0.001); prostate 144 vs 192 days at the 40 % point (n = 157, p < 0.001); lung 65 vs 93 days, **not significant** (n = 19). Followed up by 7 months: 73.4 % vs 52.2 %.
- 59.6 % of flags were real delays (bowel 60.3 %, prostate 58.4 %, lung 39.6 %). 11.8 % of abnormal results were flagged.
- Staffing: ≈ 4 h/week chart review + 1–2 h/week messages.
- Limits for us: US veterans' system, mostly men, 2011–12.

## 3. Money or process? (mentor question: why do Denmark, Sweden and the UK do better)
| Finding | Evidence | Grade / outcome |
|---|---|---|
| Finland is not short of scanners by Nordic standards: OECD tables show about 21–25 CT scanners per million in Finland vs about 28–40 in Denmark; the UK has about 8, among the lowest in the OECD. | OECD Health Statistics key tables; Health at a Glance Europe 2018 (older years) | moderate, capacity; **old data, exact latest values not retrieved** |
| Finland *uses* its scanners less: combined CT, MRI and PET exams per person are among the lowest in the OECD. | Health at a Glance 2025 and 2021 | moderate, utilisation |
| The UK has the fewest scanners yet runs a national fast-track referral system with a stated risk threshold (3 %). | NICE NG12; OECD | strong for the guideline, not for outcomes |
| Denmark's turnaround was organisational: 32 standard cancer pathways agreed nationally in 2007–08 by clinicians, officials and politicians, with fixed maximum times; waiting times fell. | Probst et al., Health Policy 2012 | moderate, waiting time |
| After the Danish pathways, 3-year relative survival of symptomatic patients diagnosed via primary care rose from 45 % to 54 % (n = 7,725); authors warn of lead-time and selection bias. | Jensen, Tørring & Vedsted, BMC Cancer 2017 | moderate, survival (observational) |
| Denmark publishes pathway times by region every quarter; Finland does not publish by county. | Sundhedsstyrelsen 2025; THL 4/2017 (already in our brief) | strong, transparency |

**Reading:** the difference looks more like process than machines — fixed time limits, a named route for suspected cancer, and public measurement. That is what Ajoissa adds at county level without new scanners: a time limit per abnormal result, a named person, and a clock that is published. **Caveat:** we did not find a study that separates money from process directly; this is our interpretation of the sources above.
