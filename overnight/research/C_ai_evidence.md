# C. Evidence base: AI for earlier cancer detection and faster referral in primary care

Compiled 2026-11-13 (overnight research agent). Sources: PubMed and the web. Each number links to its source.
**Grades:** strong = RCT, or large population-based data with external validation; moderate = large observational or internal-validation study; weak = vendor or conference abstract, press report, unpublished or qualitative work.
**Outcome codes:** [WT] waiting or diagnostic time, [DET] detection or PPV, [STAGE] stage at diagnosis, [SURV] survival, [PROC] process (follow-up done, referrals).

> Key caveat for the pitch: **no published RCT shows that an EHR cancer-risk tool improves stage or survival.** ERICA, the UK RCT built to test exactly that, has a published protocol only. I found no results in searches up to Nov 2026. The best trial evidence for an AI/EHR *intervention* covers process and time outcomes (Murphy 2015 RCT, below). Pitch the agent as a tool for speed and safety-netting, not as a proven way to shift stage.

---

## (a) Evidence table

### 1. Repeated pre-diagnostic primary-care visits ("missed opportunities")

| # | Finding | Source | Grade | Outcome |
|---|---|---|---|---|
| 1.1 | Share of patients with **≥3 GP consultations before hospital referral**, by cancer: **multiple myeloma 50.6%, pancreatic 41.3%, breast 7.4%, melanoma 10.1%**. Higher odds for young people (16–24 vs 65–74: OR 2.12), women (OR 1.28), and Asian (OR 1.73) or Black (OR 1.83) vs white patients. Lung vs rectal: OR 1.68. | Lyratzopoulos G, Neal RD, Barbiere JM, Rubin GP, Abel GA. *Lancet Oncol* 2012;13(4):353–365. doi:[10.1016/S1470-2045(12)70041-4](https://doi.org/10.1016/S1470-2045(12)70041-4). n≈41,000 respondents to the English Cancer Patient Experience Survey. | Strong (population survey, patient-reported) | [WT] proxy; equity |
| 1.2 | English National Cancer Diagnosis Audit: GPs judged **a delay had occurred in 22%** of cases. Of those, patient factors caused 26%, clinician 28%, system 34%. **Safety-netting recorded in only 44%**. Median primary-care interval 5 days (IQR 0–27). | Swann R, McPhail S, Witt J, et al. *Br J Gen Pract* 2018;68(666):e63–e72. doi:[10.3399/bjgp17X694169](https://doi.org/10.3399/bjgp17X694169) | Strong (national audit, about 17k cases) | [WT], [PROC] |
| 1.3 | **FINNISH DATA, colorectal cancer 2015 (n=3,115):** 2,816 patients had 23,268 health-service events in the year before diagnosis (8.6 per man, 7.9 per woman). Primary-care visit rates began rising **about 4.1 months (men) and 3.2 months (women) before diagnosis**. **65% of inpatient episodes began as urgent admissions.** | Hermiö E, Seppä K, Ryynänen H, et al. *BMC Health Serv Res* 2023;23:279. doi:[10.1186/s12913-023-09298-7](https://doi.org/10.1186/s12913-023-09298-7) | Strong (national registry linkage: Finnish Cancer Registry and THL Avohilmo/Hilmo) | [WT] proxy |
| 1.4 | **FINNISH DATA, lung cancer (UNPUBLISHED):** about 155 days from first symptom to treatment (patient >50 d, **primary care 41 d**, specialist 58 d), vs 107 d in Sweden and 67 d in Denmark. Study coordinated by Prof. Outi Kuittinen (UEF), with sites in Kuopio, Tampere, Turku and Rovaniemi. | Yle MOT, 2025: [yle.fi/a/74-20251023](https://yle.fi/a/74-20251023) | **Weak, unpublished.** Label it as such on slides. | [WT] |
| 1.5 | Guideline-concordant chest imaging within 2 weeks was done for **only 13.9% of new dyspnoea** and **49.5% of haemoptysis** presentations in English primary care. | Koo MM, Mounce LTA, Rafiq M, et al., Lyratzopoulos G. *Thorax* 2024;79(3):236–244. doi:[10.1136/thorax-2022-219509](https://doi.org/10.1136/thorax-2022-219509) | Strong (linked cohort, n≈170k) | [PROC] missed opportunity (lung anchor) |

### 2. Non-specific symptoms → later stage and emergency diagnosis

| # | Finding | Source | Grade | Outcome |
|---|---|---|---|---|
| 2.1 | Patients with **non-specific but concerning symptoms** vs those with site-specific alarm symptoms: **stage IV 32% vs 21%**, **emergency presentation 34% vs 16%**, **≥2 pre-referral GP consultations 59% vs 43%**, GP blood tests 57% vs 35%. Adjusted OR for a long primary-care interval: 1.24. | Pearson C, Poirier V, Fitzgerald K, Rubin G, Hamilton W. *BMJ Open* 2020;10:e033008. doi:[10.1136/bmjopen-2019-033008](https://doi.org/10.1136/bmjopen-2019-033008) | Strong (national audit linked to registry) | [STAGE], [WT] |
| 2.2 | Share diagnosed at stage IV varied by presenting symptom, from 1% (abnormal mole) to 80% (neck lump). For 19 of 20 common symptoms, **more than one-third were diagnosed before stage IV**. Symptom-based early diagnosis is therefore not just finding advanced disease faster. | Koo MM, Swann R, McPhail S, et al. *Lancet Oncol* 2020;21(1):73–79. doi:[10.1016/S1470-2045(19)30595-9](https://doi.org/10.1016/S1470-2045(19)30595-9) | Strong | [STAGE] |
| 2.3 | Patients diagnosed through **emergency routes have substantially lower 1-year relative survival** (Routes to Diagnosis method, all of England 2006–08). | Elliss-Brookes L, McPhail S, Ives A, et al. *Br J Cancer* 2012;107(8):1220–6. doi:[10.1038/bjc.2012.408](https://doi.org/10.1038/bjc.2012.408) | Strong (population-wide; observational) | [SURV] |
| 2.4 | Danish non-specific symptoms pathway (NSSC-CPP): **16.2% of referred patients had cancer** within 6 months (most often lung 17.9%, colorectal 12.6%, haematological 10.1%). **Weight loss and fatigue were present in more than half.** **"GP's gut feeling" was the reason in 22.5%** and was a strong predictor. | Ingeman ML, Christensen MB, Bro F, Knudsen ST, Vedsted P. *BMC Cancer* 2015;15:421. doi:[10.1186/s12885-015-1424-5](https://doi.org/10.1186/s12885-015-1424-5) | Moderate (one region, n=1,278) | [DET] |

### 3. EHR risk tools and blood-test signals

| # | Finding | Source | Grade | Outcome |
|---|---|---|---|---|
| 3.1 | **QCancer (men)** validation AUROC: any cancer 0.87, **lung 0.92**, colorectal 0.90, gastro-oesophageal 0.93, pancreas 0.89, renal 0.94, prostate 0.90, **blood 0.83**. The top 10% of predicted risk captured **59% of all cancers** diagnosed within 2 years (specificity 91%, PPV 10%). | Hippisley-Cox J, Coupland C. *Br J Gen Pract* 2013;63(606):e1–e10. doi:[10.3399/bjgp13X660724](https://doi.org/10.3399/bjgp13X660724) | Moderate–strong (large QResearch validation, same data family; women reported in a companion paper) | [DET] |
| 3.2 | **ERICA RCT**: eRATs for 6 cancers, 530 English practices, live from April 2022 for 2 years. Primary outcome is the **stage I–II vs III–IV** split. Powered for OR 0.8 (≈4.8 percentage points absolute). **No results found as of Nov 2026.** | Hamilton W, Mounce L, Abel GA, et al. *BMJ Open* 2023;13(3):e065232. doi:[10.1136/bmjopen-2022-065232](https://doi.org/10.1136/bmjopen-2022-065232); ISRCTN22560297 | Protocol only; **no outcome evidence yet** | [STAGE] (planned) |
| 3.3 | **ColonFlag / LGI Flag** (blood count + age + sex). AUC 0.82 (Israel, n=779,654) and 0.81 (UK) (Kinar 2016). **0.776** in UK CPRD (Birks 2017, n≈2.2M), with PPV 8.8% at 99.5% specificity. 0.80 at Kaiser (Hornbrook 2017). Age-matched AUC falls to **0.583**, so much of the signal is age. Sensitivity is low where reported (17–25%). | NICE MedTech Innovation Briefing MIB142: [nice.org.uk/advice/mib142](https://www.nice.org.uk/advice/mib142/chapter/Clinical-and-technical-evidence) (summarises Kinar 2016, Birks 2017, Hornbrook 2017, Kinar 2017) | Moderate (retrospective only; no outcome trial) | [DET] |
| 3.4 | **Thrombocytosis** (platelets >400×10⁹/L, age ≥40): 1-year cancer incidence **11.6% in men, 6.2% in women**, rising to **18.1% / 10.1%** with a second raised count within 6 months. Mostly lung and colorectal cancer. **One-third of those with lung or colorectal cancer had no other suggestive symptom.** These figures exceed the NICE 3% referral threshold. | Bailey SER, Ukoumunne OC, Shephard EA, Hamilton W. *Br J Gen Pract* 2017;67(659):e405–e413. doi:[10.3399/bjgp17X691109](https://doi.org/10.3399/bjgp17X691109) | Strong (CPRD cohort, n=50,000) | [DET] |
| 3.5 | **Measured weight loss ≥5%** within 1 year, age 60–69: cancer PPV **3.41% (men), 3.47% (women)**. Risk rises linearly with % loss. | Nicholson BD, Thompson MJ, Hobbs FDR, et al. *J Cachexia Sarcopenia Muscle* 2022;13(5):2492–2503. doi:[10.1002/jcsm.13051](https://doi.org/10.1002/jcsm.13051) | Moderate (US cohort, n=43,302) | [DET] |
| 3.6 | **DO NOT CITE:** Nicholson BD et al., *BMJ* 2020;370:m2651 (unexpected weight loss, CPRD) is marked **RETRACTED** in PubMed. | doi:[10.1136/bmj.m2651](https://doi.org/10.1136/bmj.m2651) | Retracted | — |
| 3.7 | **NLP on free-text GP notes (Netherlands, lung).** n=525,526 patients, 2,386 lung cancers. AUROC **0.88 internal, 0.79 external**. At 3% PPV, an estimated **≈62% of lung cancers flagged ≈4 months before referral**, with **≈33 patients evaluated per earlier diagnosis** and ≈40% missed. (The paper also reports a second set of counts that does not reconcile with the 62%. Check the supplement before quoting 62%.) | Schut MC, Luik TT, Vagliano I, et al. *Br J Gen Pract* 2025;75(754):e316–e322. doi:[10.3399/BJGP.2023.0489](https://doi.org/10.3399/BJGP.2023.0489) | Moderate (retrospective; external validation within NL) | [DET], [WT] lead time |
| 3.8 | Same Dutch group, hierarchical attention model on notes plus structured data (49 practices, 712 cases in analysis): **AUROC 0.91, PPV 3.4%, about 29 patients tested per cancer found early**. | Vagliano I, Rios M, Abukmeil M, Schut MC, et al. *Cancers* 2025;17(7):1151. doi:[10.3390/cancers17071151](https://doi.org/10.3390/cancers17071151) | Moderate (internal test set only) | [DET] |
| 3.9 | **C the Signs** (UK commercial CDS): 235,000+ risk assessments in 1,084 practices (2020–Sep 2024) and 13,585 cancers. Vendor reports **conversion rate 20% above the NHS England average** and **>61,000 unnecessary urgent referrals avoided**. | AACR 2025 abstract 2518, *Cancer Res* 85(8 Suppl 1). Vendor press release: [finanzen.net](https://finanzen.net/nachricht/aktien/real-world-study-across-1-000-nhs-gp-practices-shows-ai-led-triage-detected-20-more-patients-with-cancer-while-reducing-unnecessary-urgent-referrals-by-over-61-000-patients-14428043) | **Weak** (vendor-led conference abstract, no control group) | [DET] conversion, [PROC] |
| 3.10 | C the Signs, independent qualitative evaluation (Suffolk): clinicians found it useful, especially for rare cancers, the referral dashboard and auto-population from SystmOne. Barriers were time, duplicate data entry and low peer uptake. **No quantitative outcomes.** | Knight P, Spear S. Anglia Ruskin Univ., 2021–23 (posted 2025): [aru.figshare.com](https://aru.figshare.com/articles/report/Evaluating_the_Impact_of_an_integrated_clinical_decision_support_tool_intended_to_support_earlier_cancer_diagnosis_in_primary_care_in_Ipswich_and_East_Suffolk_CCG/28919378/1) | Weak (qualitative) | Implementation |

### 4. Safety-netting and referral or test tracking

| # | Finding | Source | Grade | Outcome |
|---|---|---|---|---|
| 4.1 | **RCT. EHR triggers find abnormal findings with no follow-up action**, then a human reviews and messages the GP. 1,256 of 10,673 patients with abnormal findings (11.8%) were flagged. Time to diagnostic evaluation: **colorectal median 104 vs 200 days**, prostate 144 vs 192 days. Lung was not significant (n=19). **Evaluation completed 73.4% vs 52.2% (RR 1.41).** | Murphy DR, Wu L, Thomas EJ, Forjuoh SN, Meyer AND, Singh H. *J Clin Oncol* 2015;33(31):3560–7. doi:[10.1200/JCO.2015.61.1301](https://doi.org/10.1200/JCO.2015.61.1301) | **Strong (cluster RCT, 72 PCPs, US)** | [WT], [PROC] |
| 4.2 | Safety-netting recorded in only **44%** of cancer patients' pre-diagnostic pathways (England). | Swann 2018 (row 1.2) | Strong | [PROC] |
| 4.3 | GPs support safety-netting but judge several guideline elements infeasible: flagging recurrent unexplained symptoms, telling patients all test results. Time and staffing are the barriers. **This argues for automation.** | Tompson A, Nicholson BD, Ziebland S, Evans J, Bankhead C. *Br J Gen Pract* 2019;69(689):e819–e826. doi:[10.3399/bjgp19X706565](https://doi.org/10.3399/bjgp19X706565) | Weak–moderate (qualitative, n=25) | Implementation |
| 4.4 | **CASNET2**: electronic safety-netting toolkit (CRUK/Oxford). Testing is complete; the before/after outcome analysis is **not yet reported**. | [phc.ox.ac.uk/…/casnet2](https://www.phc.ox.ac.uk/research/research-themes/cancer/projects/casnet2); ISRCTN15913081 | No outcome data yet | [PROC] (planned) |

---

## (b) The 5 strongest pitch numbers (all sourced; grade shown)

1. **"Half of myeloma patients and 41% of pancreatic cancer patients saw their GP 3+ times before referral."** Lyratzopoulos, *Lancet Oncol* 2012. Strong. Use for DLBCL/haem by analogy only, and say so: lymphoma was not broken out in this extract.
2. **"In Finland, health-service use starts rising 3–4 months before a colorectal cancer diagnosis, and 65% of pre-diagnostic hospital stays start as emergencies."** Hermiö et al., *BMC HSR* 2023. Strong, Finnish, so best for the jury.
3. **"Non-specific symptoms: stage IV 32% vs 21%, emergency diagnosis 34% vs 16%."** Pearson et al., *BMJ Open* 2020. Strong. This is the case for the non-specific-symptom pathway and for an agent that watches for it.
4. **"An EHR trigger plus human review cut time to colorectal work-up from 200 to 104 days (RCT)."** Murphy et al., *JCO* 2015. Strong. This is the only RCT-level evidence for this class of agent.
5. **"AI reading GP free-text could flag about 6 in 10 lung cancers about 4 months before referral, at 1 cancer per about 33 patients worked up."** Schut et al., *BJGP* 2025. Moderate, retrospective. Quote it with the trade-off and the ≈40% missed.

Backup: a second raised platelet count gives an 18.1% one-year cancer risk in men (Bailey 2017, strong). Finland lung primary-care interval of 41 days (unpublished, weak; label it).

---

## (c) Recommended agent design (grounded in the above)

**Name suggestion:** "Signal Watch", a safety-net and early-warning layer. It is **not** a diagnostic AI.

**Why this design:** The strongest evidence (Murphy RCT 4.1) supports *tracking abnormal findings that never got a follow-up*. Risk-score evidence (QCancer, ColonFlag, NLP) is discrimination only, with no proven stage or survival effect (ERICA pending). So lead with the safety-net, and add risk signals as prioritisation.

**Signals (start with structured data; NLP is a later phase):**
1. *Lab triggers with published PPVs:* repeat thrombocytosis (3.4); new anaemia or iron deficiency in age ≥50 (row 3.3 uses blood counts; the specific anaemia PPV was **not verified in this research run**); measured weight loss ≥5% (3.5).
2. *Repeat-visit pattern:* ≥3 primary-care contacts for related or non-specific complaints (fatigue, weight loss, pain, ICPC-2/ICD-10 R-codes) within about 90 days, with no imaging or referral. This is grounded in 1.1, 1.3 and 2.1.
3. *Lung anchor:* new dyspnoea or haemoptysis with no chest imaging within 14 days (1.5). Age and smoking come from structured fields.
4. *Referral tracking (pathway gap link):* a sent referral with no specialist appointment, or an imaging finding with no recorded action, after N days. Reuses the Pathway Gap Finder step timestamps.

**Action:** a weekly worklist for a named nurse or GP per health centre, not a pop-up in the consultation. Each flag shows its reason in plain language, the evidence and its PPV, and a suggested action: order chest X-ray or CT, re-book, refer to the non-specific-symptoms pathway. This follows the Päijät-Häme CKD model (pseudonymised list, then nurse contact, then physician decision).

**Human in the loop (required both legally and clinically):** a professional decides every action. The agent never contacts patients or makes referrals by itself. This matches StVM 3/2026: *"terveydenhuollon ammattihenkilö päättää niistä toimenpiteistä"*, and it avoids GDPR Art. 22 automated-decision issues.

**Metrics to show in the demo:** flags per 1,000 patients, cancers per flag (PPV), and days from flag to action. Use synthetic data in the demo, **clearly labelled**.

**Scope warning (40-hour hackathon):** Finnish clinical-note NLP is out of scope. No public Finnish clinical BERT model was found. Published Finnish work covers nursing notes (Moen et al., *Stud Health Technol Inform* 2022, doi:10.3233/SHTI220606) and FinBERT continued pretraining on histopathology reports (Luisto et al., arXiv:2604.14815, 2026). Mention NLP as phase 2.

---

## (d) Regulatory path and risks

| Item | Status | Source |
|---|---|---|
| **EU MDR Rule 11** | Software that provides information for diagnostic or therapeutic decisions **starts at class IIa**. It is IIb if an error could cause serious deterioration, and III if it could cause death or irreversible harm. MDCG 2019-11 Rev.1 (June 2025) kept this logic. A risk-flagging CDS is therefore most likely **IIa and needs a notified body**. | [openregulatory.com/mdcg/mdcg-2019-11](https://openregulatory.com/mdcg/mdcg-2019-11) |
| **Pure workflow or tracking** | A tool that only lists overdue referrals or unactioned results, with no patient-specific risk inference, *may* not qualify as a medical device. That depends on the intended purpose (MDCG 2019-11). **This is the fastest route. Design version 1 as a referral and test-result tracker.** This is our interpretation, not legal advice. | MDCG 2019-11 |
| **MDR Art. 5(5) in-house exemption** | A wellbeing services county (health institution) can build and use its own device without CE marking **if** no equivalent CE-marked device meets the need, it runs a QMS that meets the Annex I GSPR, it publishes a declaration, and **it does not transfer the device to another legal entity**. Software used inside the institution qualifies; patient-facing apps do not. This **blocks a nationwide rollout of one county's tool** unless a vendor CE-marks it. | MDCG 2023-1: [health.ec.europa.eu](https://health.ec.europa.eu/system/files/2023-01/mdcg_2023-1_en.pdf) |
| **EU AI Act** | AI medical devices that need notified-body assessment (class IIa+) are high-risk under Annex I. The Digital Omnibus **provisional agreement (6 May 2026)** postpones Annex I high-risk obligations to **2 Aug 2028** and Annex III to 2 Dec 2027. At the time of the source it was **not yet formally adopted**, so check before citing as final. | [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/) |
| **Finnish legal basis to scan own patient data (key enabler)** | **HE 159/2025**, adopted by Parliament (EV 38/2026). It amends the Health Care Act (§13(4), §14, §24) and **Client Data Act 703/2023 §9(2)**. Professionals may process necessary patient data from the organiser's **own register** to define target groups and to **identify health problems early**. Access is limited to named staff and logged. The patient may refuse. The professional decides. HUS and the Uusimaa counties may access each other's data for this. Effective date: "as soon as possible"; **exact date not verified**. | StVM 3/2026: [edilex.fi/mt/stvm20260003](https://www.edilex.fi/mt/stvm20260003); EV 38/2026 |
| **Precedent** | Päijät-Häme / Harjun terveys (with Mehiläinen; AstraZeneca supports project work) runs the **AINO analytics tool** for CKD risk identification. It uses a pseudonymised list, nurse outreach and a physician decision. It was **consent-based** while the law change was pending (March 2026). | [STT 12.3.2026](https://www.sttinfo.fi/tiedote/71870789/paijat-hameen-hyvinvointialue-kroonisen-munuaistaudin-riskipotilaiden-tunnistaminen-kaynnistyy-paijat-hameessa-digitaalisella-tyokalulla?lang=fi) |
| **Secondary Use Act (552/2019) reform** | Most changes apply from **1 May 2026**. Findata or individual controllers handle permits, and anonymisation can happen at the source. **EHDS** secondary use applies from **March 2029**. Model *development* on pooled multi-county or Kanta data needs a Findata permit. **Use inside one county's own register falls under the Client Data Act route above.** | [Dittmar & Indrenius](https://www.dittmar.fi/news/the-reform-of-the-finnish-act-on-the-secondary-use-of-social-and-health-data/); [kanta.fi](https://www.kanta.fi/en/secondary-use-of-kanta-data) |
| **EHR integration** | Uusimaa uses Apotti (Epic). Other counties use Lifecare, Pegasos, Effica and others. A worklist that sits outside the EHR is faster to pilot; integration costs vary by vendor. *(General knowledge; not verified this run.)* | — |

**Realistic timeline for one county (estimate, not sourced):** a tracking-only worklist under the new Client Data Act §9(2) could be piloted in months. A risk-scoring CDS needs either an Art. 5(5) in-house QMS (county-only use) or a CE-marked vendor product (class IIa, typically more than a year). **A national rollout needs CE marking or a national decision.**

**Risks:**
- Alert fatigue and workload: about 29–33 work-ups per early cancer in the NLP studies.
- False reassurance: about 40% missed in Schut 2025.
- Inequity if models are trained on populations that differ from Finland's.
- Unproven effect on stage (ERICA pending).
- Low GP adoption (the C the Signs evaluation).
- Causing "unnecessary worry", flagged explicitly by the Parliament committee.

---

## (e) Existing Finnish initiatives (cite them, don't duplicate them)

| Initiative | What | Relevance | Source |
|---|---|---|---|
| **FICAN** (Finnish Cancer Center, 2019) | 5 regional cancer centres plus a coordinating unit. Coordinates the National Cancer Strategy 2026–2035 roadmap. | Natural owner for scale-up; regional centres sit across the counties. | [stm.fi](https://stm.fi/en/personalized-medicine/national-cancer-center) |
| **iCAN** Digital Precision Cancer Medicine Flagship (UH and HUS, 2019) | Research Council of Finland flagship, €11M for the first 4 years. Precision oncology, data mining, HUS data lake. | Focus is treatment and precision medicine, **not primary-care early detection**. That leaves a gap we can fill. | [helsinki.fi](https://www.helsinki.fi/en/news/healthier-world/digital-health-support-precision-cancer-medicine-ican-new-academy-finland-flagship) |
| **"Kohti suomalaista terveystietoaluetta"** (May 2026) | Over €7M, led by UH, Business Finland Veturi (Orion). HUS, Tampere University Hospital, GE Healthcare, BC Platforms and others. Health-data use model with AI pilots in **cancer** and cardiovascular disease. | Possible partner or data route. | [helsinki.fi](https://www.helsinki.fi/fi/uutiset/vaeston-terveys/suomi-kehittaa-uutta-tapaa-hyodyntaa-terveystietoa-tavoitteena-parempaa-hoitoa-ja-nopeampaa-tutkimusta) |
| **Päijät-Häme AINO** (Mehiläinen / Harjun terveys) | EHR-based risk identification with nurse outreach (CKD), supported by AstraZeneca. | **Direct operating-model precedent** for a cancer-signal worklist, and AstraZeneca is already involved. | STT 2026 (above) |
| **Kuittinen lung-cancer delay study** (UEF, multi-site) | Symptom-to-treatment interval about 155 d (unpublished). | Finnish baseline for the lung anchor. | Yle MOT 2025 |
| **No national cancer quality register** | Finland lacks one, unlike the other Nordics. **€400k earmarked for it was cut in the 2027 budget** (per Yle). | Supports measuring pathway steps locally (the Pathway Gap Finder). | Yle MOT 2025 |
| Siun sote **Kaiku Health** pilot (Sitra) | Symptom monitoring of patients during treatment. | Not early detection; cite only as a county digital-adoption example. | [sitra.fi](https://www.sitra.fi/?p=231163) |

**Searched but NOT found or verified:** "DigiSyöpä" (no hits); Auria or Fimlab AI cancer-detection projects (none found); a public Finnish clinical BERT; Omaolo's MDR status and any cancer content; ERICA results. Do not claim any of these without checking.
