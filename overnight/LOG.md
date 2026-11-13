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
