# Overnight run log – Brainwave Bandits, Junction 2026

Started Sat 14.11 01:21 Helsinki. Check-ins scheduled 03:00, 04:45, 06:15, 07:30.
Rules: real public data for the gap; synthetic only for demo patients (labelled); web app; outputs also in project claude/overnight/.
NOTE: Junction rules say team size 1–4; team-plan lists 5 roles → check team registration.

## Stage status
- [ ] 1 Research
- [ ] 2 Gap analysis
- [ ] 3 Agent design
- [ ] 4 Web app
- [ ] 5 Deck/docs/sheet
- [ ] 6 Video + submission pack
- [ ] 7 QA + morning report

## Log (time – what – result/mistake)
- 01:21 Read team-plan, keynote findings, challenge text, guidebook. Submission needs: name, punchline, description, tech, ≤2:00 video (strict), demo+source links, deck PDF. Stage pitch 3 min + 3 min Q&A.
- 01:35 Read strategy + roadmap. Key hooks: Goal 3 indicators (lung 5y survival +14pp to SE/NO level; mortality −10%; treatment within target times THL 21/2016). 2.5: ≥70% stage I–II by 2035; stage only in ~40% of clinical notifications; symptom→diagnosis data NOT collected; AI for early detection explicitly in target state. Roadmap 2.5.2 standardised referral criteria (Nordic SVF style), 3.5.3 AI tools €1.14M FICAN, link to "ennakoiva sote 2" (predictive social & health care legislation). Roadmap p.12: lymphoma study – public route doubles time to diagnosis vs private.
- 01:35 Launched 3 research agents (A regional outcomes, B waiting times, C AI evidence).
- 01:50 Own research: Lung cancer quality-registry report (Cancer Registry/Syöpäjärjestöt, Dec 2024 + 2nd report Apr 2026): 27% curative treatment; ~half missing stage; ~1/5 no cell type; surgery share ~16% Sisä-Suomi vs ~10% Länsi/Pohjois; stage info nationally 42% (Syöpä 2024 report), 60% Sisä-Suomi. syoparekisteri.fi PDFs NOT fetchable from here (allowlist) → rely on press releases; mark "via press release".
- 01:50 Mistake/limit: WebFetch blocks syoparekisteri.fi direct URLs unless they surfaced in a search; PDF fetch failed (client_error).
- 01:55 Working concept (to be validated by data): "AJOISSA" ('in time') – a safety-net agent for PUBLIC primary care: detect (signals in visits/labs/notes) → act (standardised referral / direct test) → track (pathway clock per patient) → measure (step times per health centre = data the strategy says is not collected). Equity frame: it is the 'pushy advocate' for patients who can't demand urgent care themselves (roadmap p.12).
- 01:55 Design plan: polar-night ink base #13202E, snow text #EEF2F5, lingonberry #C8344A (lost time), aurora mint #5FD3B0 (recovered time), amber #F0B43C (warning); Archivo (variable width) + Source Serif 4 for narrative; hero = the pathway 'river' where public route stretches vs occupational route.
- 01:27 NOTE: earlier log times were estimates; real clock started 01:21. From now on times come from `date`.
- 01:27 Built agent engine v1 (app/js/engine.js): FI+EN lexicon with negation & duration; PLCOm2012 prior (Tammemägi NEJM 2013) × top-2 published LRs (Hamilton Thorax 2005 via Okoli PLoS One 2018; Iyen-Omofoman 2013); NG12-style rules; thrombocytosis (Bailey BJGP 2017); repeat-visit pattern. Tested on 6 synthetic cases.
- Mistakes fixed: duration regex missed 'viikkoa'; 'yskinyt verta' not recognised as haemoptysis; 2-week post-cold cough wrongly triggered imaging → now cough counts only if ≥3 wk or repeat visits (NG12 'unexplained').
- Known limitation: LR independence assumption → only top-2 LRs multiplied; PLCOm2012 gives 6-yr risk not point prevalence (same approach as Okoli 2018) → label as 'risk estimate, needs local calibration'.
- 01:35 All 3 research agents done (A regional/SES, B waiting times, C AI evidence). Files in overnight/research + overnight/data.
- KEY FINDING (changes the story): county *survival* differences are mostly NOT significant (FCR Cancer in Finland 2023; OECD 2025). The provable gap is (1) socioeconomic (5-y survival 64 vs 77 % low vs high education; Zai 2025: more stage IV, less surgery, higher mortality after adjustment) and (2) the public vs occupational FRONT DOOR (DLBCL +86 d before specialist). Variation sits *within* hospital districts (67 %, Seppä 2020) → act per health centre.
- KEY FINDING: since 1.1.2025 adults are only guaranteed non-urgent primary care within 3 MONTHS (HE 134/2024). 
- KEY FINDING: legal basis now exists – HE 159/2025 adopted (EV 38/2026): counties may use own records to find health problems early; professional decides. Precedent: Päijät-Häme AINO (CKD) supported by AstraZeneca.
- KEY FINDING: best RCT evidence for this agent class = Murphy JCO 2015 (trigger + human review: CRC work-up 200 → 104 days). No RCT shows stage/survival effect (ERICA pending) → we do NOT claim stage shift.
- CORRECTION for team: lung survival 16.4/26.6/25.5/33.2 is Tichanek Clin Epidemiol 2023 (2016–20), not Acta Oncol 2025 44535 as team-plan says.
- DECISION: Concept = "Ajoissa" safety-net agent for public primary care (detect stalled cancer signals → named nurse worklist → pathway clock → per-health-centre step times). Pathway Gap Finder becomes the county view (kept, not dropped). Why switch emphasis: judges weight Actionability 30% – a county can switch this on under the new law; and the data shows the gap is the public front door, which the agent targets directly.
- MISTAKE fixed: PLCOm2012 6-yr risk was used as a point prior → every heavy smoker crossed 3 % (flu cough flagged for CT). Now ÷6 to annual + cough LR only if persistent. Matti would now be flagged 35 d earlier (2nd visit), not 70 d (flu visit).
- App v1 built: 6 views (gap, agent worklist, county, impact, briefing w/ speech, sources). No console errors.
- 01:43 App published as artifact: https://claude.ai/artifact/WBcU1hw4dpagfNVUQ2Ec3x (added overnight-run banner, clickable health centres).
- 01:43 Pitch deck (Slides type, 19 slides, speaker notes = 3-min stage script, STAGE vs APPENDIX marked): https://claude.ai/artifact/GEu3JWvDxS5fJkWbcpkz1i . Local PDF render: overnight/Ajoissa_pitch_deck.pdf (fallback for the required PDF; prefer the Slides PDF export). Sources in overnight/deck/.
- Mistakes fixed: sticky header overlapped element screenshots → re-shot with static header; big numbers wrapped (150px) → 112px; screenshots overlapped footer source lines → smaller.
- Launched background agent for Docs report + Sheets data.
- 01:46 Docs + Sheets deliverables done. Report (Docs): https://claude.ai/artifact/Fn5RYTFToZxPPAaerQwAGH — 10 sections, 3 drawn charts (Nordic lung survival, DLBCL step gaps, county physician access), 43 numbered refs. Data workbook (Sheets): https://claude.ai/artifact/FrDamYM9Md26HhFQXXa9n4 — 11 tabs incl. formula-driven Gap_DLBCL + Impact_model (225 cases -> 135 flagged -> 20.5 d -> 4,455 work-ups) and Synthetic_cases computed by running engine.js. Local copy: deliverables/Ajoissa_data_and_sources.xlsx (builder: scripts/build_sheet.py). Problems/notes: Sheets slug in prompt was garbled, used c8d96734-5e32-4d19-8f44-7bfb7f01b7e0 from list_types. Brief says "e.g. Pohde" — Pohde is Pohjois-Pohjanmaa (not Päijät-Häme); report says so. Lung incidence 3,000/5.6 M in impact model is the app's rounded figure, not re-verified. DLBCL cohort described inconsistently (app: North Ostrobothnia; research B: n=160, 7 hospitals) — flagged in report limitations. Chart 1 uses 2018-22 men (Khalife/Paappanen); text cites 2016-20 Tichanek values.
- 01:50 Video rendered: overnight/deliverables/Ajoissa_pitch_video.mp4 (1:57.8, 1920×1080/30fps, 13 scenes, generated soundtrack: clock ticks until the Ajoissa reveal, then a warm pad/arpeggio). No voiceover (optional VO script in SUBMISSION.md).
- Mistake fixed in video: captions over screenshots unreadable → gradient band behind captions.
- 01:50 Submission pack written (overnight/SUBMISSION.md): form texts, checklist, VO script, 3-min stage script, demo click path, judge Q&A.
- Added repo root index.html → app/ (GitHub Pages ready) and README.
- Added OPTIONAL live AI in the artifact version only (sample capability): "Ask the analyst" (briefing tab) and "Draft the referral (AI, Finnish)" (agent tab). Hidden automatically where unavailable (GitHub Pages/offline) → demo never depends on it. UNTESTED from here — test on claude.ai in the morning (first click asks consent).
- Independent fact-check agent launched (writes overnight/QA_REPORT.md).
- 06:16 Applied CORRECTIONS.md to the Docs report (Kuitunen 127 vs 76 d / Fig.1 labels, Yle 12.10.2026, HE 159 'approved Apr 2026', CT = expert survey weak-moderate, Murphy colorectal + lung n.s., education vs front-door separated, stage 61 %, new 9.3 Corrections subsection, DLBCL chart caption/subtitle) and the Sheets workbook (Gap_DLBCL medians + Fig.1 labels, README, Impact_model, Sources: Kuitunen, yle2026, ihe2026 DOI 42778, he159, murphy, syopa2024); build_sheet.py patched + .xlsx rebuilt.
- 06:16 Independent fact-check done (overnight/QA_REPORT.md). Main errors found and FIXED in app, deck, video, brief, submission: Kuitunen 2026 is 7 hospitals n=160, tested median 127 vs 76 d (51 d, p=0.027) — "84 days / twelve weeks / North Ostrobothnia" removed, Fig.1 step times labelled; Yle date 12.10.2026; "legal since 2026" → "approved by Parliament April 2026"; CT <10 % labelled expert survey (weak); Murphy limited to colorectal; education gap separated from front-door gap; footer "research prototype, not CE-marked"; stage missing 61 %. Engine: negation now stops at commas/"ja"/"and"; word-start matching; NaN guards; explicit rules can't be vetoed by risk score; Finnish number words in durations. See overnight/CORRECTIONS.md.
- 02:10–06:10 run paused: account usage limit (5-hour limit) hit; resumed after reset. Docs/Sheets correction agent was interrupted by the same limit and resumed at 06:15.
- 06:16 Video scenes B, C, E1, K re-rendered with corrected text (still 1:57.8).

## Sat 14.11 11:28 — Agent reader v2 (ideas 1, 2, 3, 5, 11)
- engine.js v2: ICPC-2 mapping; typo correction (Damerau ≤ 1; words < 9 letters need a medical word within 4 words; common look-alikes like couch/retired excluded); phrase pattern cough+blood in one clause (blood word must not be negated); severity words → emergency tier only (not when describing smoking); persistence words count as ≥ 3 weeks; list negation closed by or/tai/eikä; follow-on duration sentence; AI reader prompt + reconcile() with verbatim-quote check.
- Structured signals: visit codes, weight > 5 % in ≤ 12 months (AAFP 2014), PLT twice (Bailey 2017), unfollowed abnormal result > 14 d (Murphy 2015), normal CXR + symptoms, antibiotics.
- New synthetic cases c7 Pentti (record says more than the note → CT) and c8 Aino (abnormal X-ray never followed up). c1–c6 outcomes unchanged.
- Tests: dev 200 notes first run 190/200 → 200/200 after general fixes (+1 label corrected); held-out 20 notes first run 11/20, 12/20 after fixing one negation bug; remaining misses = vocabulary gaps (SOB, verilimaa, swollen nodes…), left on purpose. AI-guard unit check passes.
- Bug found and fixed: look-back ("caught earlier?") was seeing today's weights/results.

## Sat 14.11 afternoon — AstraZeneca answers applied (engine v3)
- Decisions: lung + bowel + prostate; Level 0 first; worklist not plug-in; county's own records only; hereditary secondary; smoking asked at any visit; visuals parked (UI-STATUS.md).
- Engine v3: typed result triggers with Murphy 2015 windows/exclusions (30/60/90 d), Fimlab F-hHb and PSA limits, Käypä hoito PSA restraint; NICE DG56 stool-test rule; capacity levels 0/1/2; rankWorklist with CT slots; smoking history from text (pack-years with the sum shown); relatives' symptoms excluded; teammate Finnish word lists; 3 new concepts (abdominal pain, anaemia stated, diarrhoea/constipation).
- Cases: c9 Eero (positive stool test never followed up), c10 Kalevi (raised PSA never repeated), c11 Tapio (PSA at 74: agent stays silent). Aino's X-ray moved from 29 to 36 days so it is past the 30-day window. c1–c7 outcomes unchanged.
- Tests: notes dev 200/200, held-out 13/20 (one more right because the teammate's word list covers it; set is no longer strictly unseen); records 38/38, smoking 18/18, relatives 5/5.
- Verified/dropped list: research/D_verification_and_nordic.md. Could not open the Cancer Society release on pre-diagnosis hospital visits → not used.
- Impact view: imaging-slot slider; benefit scaled down in proportion when slots < flags; Level 0 staffing from Murphy.
- Not done: experimental survival estimator (needs stage-specific survival inputs with sources); deck/video visuals untouched.

## Sat 14.11 14:35 — Report updated, experimental survival estimator
- Report (Docs): exec summary "what the county gets" (Level 0 first, slots set by county); 3.3 money or process (OECD, Probst 2012, Jensen 2017); 5.8 Level 0 triggers + capacity levels + engine v3; 6.3 implementation plan (worklist architecture, roles, cost drivers, dismissed flags, risks); recs table rows 1-2 and 90-day plan reworded; 8 capped-slots paragraph; sources added. Record-system examples corrected: Varsinais-Suomi had 4 systems in 2023 and chose Omni360 in 2024 (CGI 22.3.2024); Pohde moved primary care to Esko in 2026 (Yle).
- Impact view: "What it might mean for survival — highly experimental" panel. Proportional hazards with Hanna 2020 HR per 4 weeks (treatment delay, extrapolated; slider 0-8 %), lung 5-yr survival ≈ 20 % (Tichanek 2023), bowel ≈ 61 % (Olenius 2022), bowel cases from Syöpä 2024 (4,153), share via unfollowed result = assumption 10 % (no source), 96 days from Murphy. Prostate left out. Defaults: lung 0.2, bowel 1.8 extra 5-yr survivors a year (420k county, 10 slots). Sanity check Jensen 2017 (45 → 54 %, observational).

## Sat 14.11 16:10 — Pilot county Pohjois-Karjala, implementation plan v2, multi-cancer worklist
- Team decisions: pilot = Pohjois-Karjala (Siun sote); nurse ≈ 45 min/day; reads first-contact records + past visits; dismissed flags archived, return on new visit/result; smoking = ask at any visit.
- IMPLEMENTATION-PLAN.md v2: why PK (best 14-day access, worst unmet need 32.1 %, highest illness index, tight budget, 161,441 residents), Lifecare switch by end-2027 as risk, costs (nurse €23.60/h from Tehy/Statistics Finland €3,174/month + 23.1 % employer contributions Kuntaliitto 2026; physician ≈ €61/h from KT 2021; data set-up and maintenance = assumptions) → 6-month 3-centre pilot ≈ €27–28k; KPIs with targets; 90 days; stop rules.
- Demo: worklist cancer tag + filter (Lung 5, Bowel 2, Prostate 2, Lymphoma 1); bowel/prostate cases no longer show a lung probability ("Why there is no risk percentage"); impact default population 161,000 (PK); county table highlights PK; dismiss text = archived, returns on new visit/result.

## Sat 14.11 17:15 — Pilot county switched to Päijät-Häme (team decision)
- Why: AINO already runs the same list → nurse → physician model on the county's own records (Harjun terveys + AstraZeneca, STT 12.3.2026), consent-based start while law changes pending; one shared record system (Yle 2022); continuity push; 20 % not seen within 14 days, 26.0 % unmet need; 204,676 residents (Sitra/Statistics Finland 2024). Pohjois-Karjala = second region (equity), after its Lifecare switch (end-2027).
- Updated: IMPLEMENTATION-PLAN v3, report (exec Ask, 6.1 rewritten, 6.2 day 0 + consent, 6.3 roles, 6.4, 6.5, 8, 8.2, sources), deck ask + impact (≈ 66 of 110 lung; 0–42 slots/week), demo (pop 205,000, county highlight, impact heading, briefing "What we ask"), brief, submission.
- Not updated: civic preview artifact — the design chat published a new version (14:47 UTC) in the meantime; it must merge main to get the switch.

- 14.11 17:50 — UI v2 (classic look, Hospital blue, worklist first) rolled out: `ui-v2` fast-forwarded into `main`. The old demo artifact (WBcU1hw4dpagfNVUQ2Ec3x) is retired; the demo is now https://claude.ai/artifact/M2pRECwjfGtABcJY4WAH53. Team briefing: https://claude.ai/artifact/XPBNTQvh1Ynet9EMoJfDPH.
