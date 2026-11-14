"""Tabs added or rewritten on 14.11.2026 for 'Ajoissa — data & sources'.

Each tab is plain data (a grid from A1, formulas as strings) so the same content feeds
both the .xlsx (build_sheet.py / patch_xlsx_1411.py) and the live Sheets artifact.
Status column values: real / model / assumption / synthetic.
Sources: overnight/IMPLEMENTATION-PLAN.md v3 (§2, §7, §8), BRIEF.md, research/D_verification_and_nordic.md,
report sections 4.3, 5.8, 6.1, 8.2, tests/RESULTS.md, app/js/app.js (impact + survival), app/js/sources.js.
"""

URL = {
    "tehy": "https://verkkouutiset.fi/a/sairaanhoitajien-palkka-on-jo-3174-euroa-kuukaudessa",
    "kuntaliitto": "https://www.kuntaliitto.fi/sites/default/files/media/file/Sosiaaliturvamaksuennusteet_kes%C3%A4kuu%202026.pdf",
    "yle_doc": "https://yle.fi/a/74-20055894",
    "roadmap": "https://files.hackjunction.app/resources/Kansallinen_syopastrategia_toimeenpanon_tiekartta_2026_2031.pdf",
    "repo": "https://github.com/dalvesalo/Junction-2026",
    "aino": "https://www.sttinfo.fi/tiedote/71870789/paijat-hameen-hyvinvointialue-kroonisen-munuaistaudin-riskipotilaiden-tunnistaminen-kaynnistyy-paijat-hameessa-digitaalisella-tyokalulla?lang=fi",
    "yle_harju": "https://yle.fi/a/74-20028754",
    "yle_omalaakari": "https://yle.fi/a/74-20142712",
    "sitra": "https://sitra.fi/wp/wp-content/uploads/2025/03/tulevaisuusbarometri_2025_paijat-hame.pdf",
    "he134": "https://finlex.fi/api/media/government-proposal/3195/mainPdf/main.pdf",
    "tervesuomi": "https://www.keusote.fi/wp-content/uploads/2025/05/Tilastoraportti_Terve_Suomi_2024.pdf",
    "siunsote": "https://www.siunsote.fi/wp-content/uploads/2026/05/Sosiaalihuollon-yksityisten-palveluntuottajien-Kanta-info-21042026.pdf",
    "pkliitto": "https://pohjois-karjala.fi/julkaisut/pohjois-karjalan-tilanne-ja-kehityskuva-2025",
    "vm": "https://valtioneuvosto.fi/-/10623/pohjois-karjalan-hyvinvointialueelle-myonnetaan-lisarahoitusta-2-6-miljoonaa-euroa",
    "ilomantsi": "https://ilomantsi.fi/wp-content/uploads/2025/04/Laaja-hyvinvointikertomus-ja-suunnitelma-vuosille-2025-2028.pdf",
    "yle_esko": "https://yle.fi/a/74-20213471",
    "he159": "https://www.edilex.fi/mt/stvm20260003",
    "murphy": "https://doi.org/10.1200/JCO.2015.61.1301",
    "fimlab_fhb": "https://fimlab.fi/wp-content/uploads/laboratoriotiedote_150_hematologia_ulosteen-kvantitatiivinen-hemoglobiini-kayttoon.pdf",
    "fimlab_psa": "https://fimlab.fi/en/omalabra/tutkimukset/marker-of-prostate-function/",
    "kh_psa": "https://www.kaypahoito.fi/xmedia/nix/hoi11060a.pdf",
    "results": "https://github.com/dalvesalo/Junction-2026/blob/main/tests/RESULTS.md",
    "hanna": "https://www.bmj.com/content/371/bmj.m4087",
    "tichanek": "https://doi.org/10.2147/CLEP.S406606",
    "olenius": "https://doi.org/10.1186/s12885-022-09460-0",
    "syopa_crc": "https://www.verkkouutiset.fi/a/suolistosyopien-maara-kaantyi-laskuun-suomessa/",
    "jensen": "https://doi.org/10.1186/s12885-017-3623-8",
}

# ---------------------------------------------------------------- Impact_model (rewritten)
IMPACT = {
    "name": "Impact_model",
    "rows": [
        ["Impact model — MODEL, not a measured result. Yellow = inputs (change them), green = formulas. Default county = Päijät-Häme (proposed pilot).", None, None, None, None],
        [None] * 5,
        ["Input", "Value", "Unit", "Source / basis", "Status"],
        ["County population", 205000, "people", "Päijät-Häme, proposed pilot county: 204,676 residents in 2024 (Statistics Finland via Sitra Tulevaisuusbarometri 2025), rounded. " + URL["sitra"], "real (rounded)"],
        ["Lung-cancer cases per year, Finland", 3000, "cases/yr", "Finnish Cancer Registry, rounded (14,926 in 2019-2023, as used in the app; exact figure not re-verified)", "real (rounded)"],
        ["Finland population", 5600000, "people", "Rounded (as used in the app)", "real (rounded)"],
        ["Coverage: health centres using Ajoissa", 1.0, "share", "Full county roll-out; pilot starts with 3 centres", "assumption"],
        ["Sensitivity: share of lung cancers flagged", 0.6, "share", "Schut et al., BJGP 2025 (≈62 % flagged ≈4 months earlier at 3 % PPV); doi:10.3399/BJGP.2023.0489", "real (moderate, Dutch)"],
        ["Current primary-care interval", 41, "days", "Unpublished Finnish lung study via Yle MOT 12.10.2026, https://yle.fi/a/74-20251023 — weak, replace with county data", "real (weak, unpublished)"],
        ["Cut in interval for flagged patients", 0.5, "share", "Team assumption; Murphy JCO 2015 RCT roughly halved colorectal time to work-up (200 -> 104 d); its lung arm (n = 19) was not significant", "assumption"],
        ["Work-ups per earlier diagnosis", 33, "patients", "Schut et al., BJGP 2025", "real (moderate, Dutch)"],
        ["Imaging (CT) slots a week the county gives the agent", 10, "slots/wk", "Set by the county, not by the agent (demo default 10). 0 = Level 0 only: chase follow-ups already due, no new imaging demand", "assumption"],
        [None] * 5,
        ["Outputs", None, None, None, None],
        ["Expected lung cancers per year in county", "=B4*B5/B6", "cases/yr", "pop x 3000 / 5,600,000 (national rate, not the county's own)", "model"],
        ["Flagged per year (uncapped)", "=B15*B7*B8", "patients/yr", "cases x coverage x sensitivity", "model"],
        ["Days earlier per flagged patient", "=B9*B10", "days", "interval x cut", "model"],
        ["Total patient-days earlier per year (uncapped)", "=B16*B17", "days/yr", "flagged x days", "model"],
        ["Work-ups per year (uncapped)", "=B16*B11", "work-ups/yr", "flagged x 33", "model"],
        ["Flagged, low display bound (x0.6)", "=B16*0.6", "patients/yr", "app display convention, not a CI", "model"],
        ["Flagged, high display bound (x1.3)", "=B16*1.3", "patients/yr", "app display convention, not a CI", "model"],
        ["Share of flags that get a slot (capped)", "=IF(B19>0,MIN(1,B12*52/B19),0)", "share", "slots x 52 / uncapped work-ups (max 100 %). Proportional: ranking gets no extra credit for yield", "model"],
        ["Flagged per year (capped by slots)", "=B16*B22", "patients/yr", "uncapped flagged x share", "model"],
        ["Work-ups per year used (capped)", "=B19*B22", "work-ups/yr", "uncapped work-ups x share (= slots x 52 when slots are the limit)", "model"],
        ["Total patient-days earlier per year (capped)", "=B23*B17", "days/yr", "capped flagged x days", "model"],
        [None] * 5,
        ["What we do not claim", None, None, "No stage or survival effect (ERICA RCT has not reported). No reduction in imaging. No Finnish validation yet. The 41-day interval is not the county's own figure. Level 0 (results nobody followed up) needs none of these slots.", None],
    ],
    "headers": [3], "titles": [1, 14, 27],
    "inputs": ["B4:B12"], "outputs": ["B15:B25"],
    "formats": {"B4:B6": "#,##0", "B7:B8": "0%", "B10": "0%", "B15:B21": "#,##0.0", "B22": "0%", "B23:B25": "#,##0.0"},
    "widths": {"A": 300, "B": 110, "C": 90, "D": 520, "E": 170}, "wrap": ["D"],
}

# ---------------------------------------------------------------- Pilot cost
r = URL
PILOT_COST = {
    "name": "Pilot cost (Päijät-Häme)",
    "rows": [
        ["Pilot cost — Päijät-Häme, 6 months, 3 health centres (IMPLEMENTATION-PLAN v3 §7). Yellow = inputs, green = formulas.", None, None, None, None, None],
        [None] * 6,
        ["Input", "Value", "Unit", "Basis", "Source", "Status"],
        ["Nurse pay, monthly", 3174, "€ / month", "Average task-based pay of nurses in wellbeing services counties, 2025", "Tehy calculation from Statistics Finland, Oct 2025 (via Verkkouutiset) " + r["tehy"], "real"],
        ["Working hours a week", 38.25, "h / week", "Full-time week used in the plan", "IMPLEMENTATION-PLAN §7 (not separately sourced)", "assumption"],
        ["Weeks a year", 52, "weeks", "Calendar weeks", "—", "model"],
        ["Employer pension contribution 2026", 0.1994, "share", "Employer share", "Kuntaliitto, Sosiaaliturvamaksuennusteet, 25.6.2026 " + r["kuntaliitto"], "real"],
        ["Sickness insurance 2026", 0.0191, "share", "Employer share", "Kuntaliitto 25.6.2026 (as above)", "real"],
        ["Unemployment insurance 2026", 0.0123, "share", "Employer share", "Kuntaliitto 25.6.2026 (as above)", "real"],
        ["Physician total earnings, monthly", 8197, "€ / month", "Average total earnings, municipal physicians, 2021 (older, all municipal physicians)", "KT statistics via Yle, Lääkäreiden palkkavertailu " + r["yle_doc"], "real"],
        ["Physician working hours a year", 1989, "h / year", "Annual hours used in the plan", "IMPLEMENTATION-PLAN §7 (not separately sourced)", "assumption"],
        ["Pilot health centres", 3, "centres", "Inside the AINO area (Lahti, Hartola, Iitti, Kärkölä)", "Team decision 14.11", "assumption"],
        ["Pilot length", 26, "weeks", "Six months", "Team decision 14.11", "assumption"],
        ["Nurse review time per centre", 3.75, "h / week", "≈ 45 min a day. Benchmark: ≈ 4 h/wk review + 1-2 h/wk messages for 72 clinicians (Murphy, JCO 2015)", "Team estimate", "assumption"],
        ["GP back-up per centre", 1, "h / week", "Signs referrals, unclear cases", "No source", "assumption"],
        ["Data set-up", 20, "person-days", "Read-only nightly extract, thresholds, logging", "No source for days or rate", "assumption"],
        ["Data maintenance", 6, "person-days", "About 1 day a month", "No source", "assumption"],
        ["Day rate, data work", 600, "€ / day", "—", "No source", "assumption"],
        ["Server, low", 0, "€", "Runs on the county's existing infrastructure", "No source", "assumption"],
        ["Server, high", 1000, "€", "—", "No source", "assumption"],
        ["Software licence", 0, "€", "Open source (MIT)", "Repository licence " + r["repo"], "real"],
        ["National roadmap measure 3.5.3 budget", 1140000, "€", "Earmarked for digital and AI early-detection tools", "Kansallinen syöpästrategia – toimeenpanon tiekartta 2026-2031, measure 3.5.3 " + r["roadmap"], "real"],
        [None] * 6,
        ["Calculation", "Value", "Unit", "Formula in words", "Source", "Status"],
        ["Employer contributions multiplier", "=1+B7+B8+B9", "×", "1 + pension + sickness + unemployment (= 1.231). Excludes holiday bonus and supplements, so the real cost is somewhat higher", "Kuntaliitto 2026", "model"],
        ["Nurse pay per hour", "=B4*12/(B5*B6)", "€ / h", "monthly pay × 12 ÷ (38.25 h × 52)", "Tehy / Statistics Finland", "model"],
        ["Nurse cost per hour, total", "=B26*B25", "€ / h", "hourly pay × multiplier (≈ €23.60)", "as above", "model"],
        ["Physician cost per hour, total", "=B10*12/B11*B25", "€ / h", "monthly × 12 ÷ 1,989 h × multiplier (≈ €61)", "KT 2021 via Yle", "model"],
        ["Nurse review hours, pilot", "=B12*B14*B13", "h", "centres × h/week × weeks (= 292.5)", "Team estimate", "model"],
        ["Nurse review cost", "=B29*B27", "€", "hours × nurse €/h", "—", "model"],
        ["GP back-up hours, pilot", "=B12*B15*B13", "h", "centres × h/week × weeks (= 78)", "Assumption", "model"],
        ["GP back-up cost", "=B31*B28", "€", "hours × physician €/h", "—", "model"],
        ["Data set-up cost", "=B16*B18", "€", "days × day rate", "Assumption", "model"],
        ["Data maintenance cost", "=B17*B18", "€", "days × day rate", "Assumption", "model"],
        ["Total, six-month pilot (low)", "=B30+B32+B33+B34+B19+B21", "€", "nurse + GP + set-up + maintenance + server low + licence", "—", "model"],
        ["Total, six-month pilot (high)", "=B30+B32+B33+B34+B20+B21", "€", "as above with server high (plan: ≈ €27,000-28,000)", "—", "model"],
        ["Running cost per health centre after the pilot", "=B14*B6*B27", "€ / year", "3.75 h × 52 weeks (= 195 h) × nurse €/h (≈ €4,600)", "—", "model"],
        ["Pilot as share of roadmap measure 3.5.3", "=B36/B22", "share", "high total ÷ €1.14 M (≈ 2.5 %)", "—", "model"],
        [None] * 6,
        ["Not counted", None, None, "Follow-ups themselves (colonoscopy, repeat PSA, CT): Level 0 follow-ups were already clinically due; symptom flags only use the CT slots the county gives. No euro savings claimed: no Finnish source for the cost of a late or emergency cancer diagnosis.", None, None],
    ],
    "headers": [3, 24], "titles": [1, 40],
    "inputs": ["B4:B22"], "outputs": ["B25:B38"],
    "formats": {"B4": "#,##0", "B7:B9": "0.00%", "B10:B11": "#,##0", "B18:B22": "#,##0", "B25": "0.000",
                "B26:B28": "#,##0.00", "B29": "#,##0.0", "B30": "#,##0", "B31": "#,##0.0", "B32:B37": "#,##0", "B38": "0.0%"},
    "widths": {"A": 270, "B": 110, "C": 90, "D": 380, "E": 380, "F": 100}, "wrap": ["D", "E"],
}

# ---------------------------------------------------------------- Pilot county choice
AINO = "AINO: Mehiläinen's tool, run by Harjun terveys, with AstraZeneca supporting the project work"
COUNTY = {
    "name": "Pilot county choice",
    "rows": [
        ["Pilot county choice — Päijät-Häme (pilot), Pohjois-Karjala (second region), Pohjois-Pohjanmaa (considered). IMPLEMENTATION-PLAN v3 §2; report 4.3 and 6.1.", None, None, None, None, None, None],
        [None] * 7,
        ["County", "Role", "Residents", "Physician first visits within 14 d (%), Mar 2024", "Unmet need for a physician (%), 2024", "Record system", "Status"],
        ["Päijät-Häme", "Pilot", 204676, 80, 26.0, "One shared record system, incl. Harjun terveys (Yle 2022)", "real"],
        ["Pohjois-Karjala", "Second region (equity case)", 161441, 93, 32.1, "Switching to Lifecare by end of 2027 (Siun sote 21.4.2026)", "real"],
        ["Pohjois-Pohjanmaa", "Considered, not chosen", None, None, 27.5, "Pohde moving primary care to Esko in 2026 (Yle)", "real"],
        ["Finland (national)", "Reference", None, 71, 24.9, "—", "real"],
        [None] * 7,
        ["County", "Reason", "Figure", "Source", "URL", "Status", None],
        ["Päijät-Häme", "The same model already runs there", AINO + ". Analyses consenting residents' health data, flags untreated chronic kidney disease; a team works the pseudonymised list, nurses contact patients, a physician decides. Pilot in Hartola, Iitti, Kärkölä and Lahti; no patient data goes to AstraZeneca", "Päijät-Häme wellbeing services county, press release 12.3.2026 (STT)", URL["aino"], "real", None],
        ["Päijät-Häme", "A legal route already used", "AINO started on residents' consent while the law changes were pending, and plans to expand once they take effect. HE 159/2025 approved 21.4.2026; entry into force to confirm", "STT 12.3.2026; HE 159/2025 (EV 38/2026)", URL["he159"], "real", None],
        ["Päijät-Häme", "One shared patient-record system", "Harjun terveys uses the shared Päijät-Häme record system, so \"was the follow-up done?\" can be checked in one place", "Yle 2022", URL["yle_harju"], "real", None],
        ["Päijät-Häme", "Continuity of care is a regional priority", "Personal-GP model being introduced; over €1 M state grant for continuity of care (6.7.2026)", "Yle; Päijät-Häme press release 6.7.2026 (STT)", URL["yle_omalaakari"], "real", None],
        ["Päijät-Häme", "A real access gap", "20 % of physician first visits not within 14 days (80 % within, March 2024); 26.0 % self-reported unmet need for a physician (2024)", "THL Avohilmo via HE 134/2024; THL Terve Suomi 2024 (report 4.3)", URL["he134"], "real", None],
        ["Päijät-Häme", "Size suits a pilot", "204,676 residents (2024); the AINO area alone covers 136,000", "Statistics Finland via Sitra 2025; STT 12.3.2026", URL["sitra"], "real", None],
        ["Päijät-Häme", "What we do not claim", "AINO is new (spring 2026) and has no published results yet: cited as a working operating model, not as proof that it works", "—", None, "real", None],
        ["Pohjois-Karjala", "Register access and self-reported need disagree", "Best register access in March 2024 (93 % physician visits within 14 days) but worst self-reported unmet physician need in 2024 (32.1 %; Kanta-Häme lowest at 19.3 %). The register only counts people who got an appointment", "THL Avohilmo via HE 134/2024; THL Terve Suomi 2024 (report 4.3)", URL["tervesuomi"], "real", None],
        ["Pohjois-Karjala", "Highest illness burden", "Highest national health (morbidity) index", "Ilomantsi, Laaja hyvinvointikertomus 2025-2028", URL["ilomantsi"], "real", None],
        ["Pohjois-Karjala", "Tight budget", "Extra state funding of €2.6 M granted to the county", "Ministry of Finance, 30.10.2025", URL["vm"], "real", None],
        ["Pohjois-Karjala", "Why second, not first", "Switching to the Lifecare record system by the end of 2027: fits best as the next step after the switch", "Siun sote, Kanta info 21.4.2026", URL["siunsote"], "real", None],
        ["Pohjois-Karjala", "Size", "161,441 residents", "Pohjois-Karjalan liitto, Tilanne- ja kehityskuva, Oct 2025", URL["pkliitto"], "real", None],
        ["Pohjois-Pohjanmaa", "Data hole on the access measure", "Physician first visits within 14 d: value missing in the source table; all professionals within 14 d 70 %; within 3 months 99 % (March 2024)", "THL Avohilmo via HE 134/2024", URL["he134"], "real", None],
        ["Pohjois-Pohjanmaa", "Unmet need", "27.5 % self-reported unmet need for a physician; client fees hindered use 38.1 % (2024)", "THL Terve Suomi 2024", URL["tervesuomi"], "real", None],
        ["Pohjois-Pohjanmaa", "Record-system change in progress", "Pohde moving primary care across the region to the Esko record system in 2026", "Yle 2026", URL["yle_esko"], "real", None],
        ["Pohjois-Pohjanmaa", "Earlier rationale no longer holds", "It was first picked as \"the keynote's county\"; the DLBCL study (Kuitunen 2026) is multi-centre (7 hospitals), not North Ostrobothnia", "overnight/QA_REPORT.md; CORRECTIONS.md", None, "real", None],
    ],
    "headers": [3, 9], "titles": [1],
    "formats": {"C4:C7": "#,##0", "D4:E7": "0.0"},
    "widths": {"A": 140, "B": 210, "C": 380, "D": 260, "E": 300, "F": 260, "G": 90}, "wrap": ["B", "C", "D", "F"],
}

# ---------------------------------------------------------------- Level 0 triggers
LEVEL0 = {
    "name": "Level 0 triggers",
    "rows": [
        ["Level 0 triggers — abnormal results nobody followed up. Windows and exclusions copy Murphy et al. 2015 (cluster RCT); thresholds are Finnish laboratory limits. No new capacity: the follow-up was already clinically due.", None, None, None, None, None, None, None],
        [None] * 8,
        ["Cancer", "Flag when", "No follow-up within (days)", "Follow-up that stops the clock", "Not flagged (exclusions)", "Threshold source", "Window / exclusion source", "Status"],
        ["Lung", "Chest X-ray or CT marked suspicious by the radiologist", 30, "CT, lung-clinic referral or repeat imaging", "Under 30, known lung cancer, palliative care, lung-clinic review in the last 6 months", "Radiologist's marking (no numeric threshold)", "Murphy et al., J Clin Oncol 2015 " + URL["murphy"], "real"],
        ["Bowel", "F-hHb ≥ 25 µg/g, or 10-< 25 µg/g with bowel symptoms recorded; or iron-deficiency anaemia: Hb ≤ 110 g/l, MCV ≤ 81 fl, no ferritin ≥ 100 µg/l", 60, "Colonoscopy referral", "Under 40 or over 75, recent colonoscopy, known bowel cancer, heavy periods, pregnancy, other bleeding source, palliative care", "F-hHb: Fimlab bulletin 150/2024 (< 10 negative, 10-< 25 borderline, ≥ 25 positive) " + URL["fimlab_fhb"] + "; anaemia definition: Murphy 2015", "Murphy et al. 2015", "real"],
        ["Prostate", "PSA above the laboratory's age limit, men aged 40-70 only", 90, "Repeat PSA, urology referral or biopsy", "Under 40 or over 70 (no testing of symptom-free men over 70), known prostate cancer, recent biopsy, prostatitis or urinary infection at the time, palliative care", "Fimlab P-PSA test 4869 " + URL["fimlab_psa"] + "; Käypä hoito PSA-testaus 16.4.2025 (repeat after 1-2 months; overdiagnosis is the main harm) " + URL["kh_psa"], "Murphy et al. 2015 (trial used PSA 4.1-15)", "real"],
        [None] * 8,
        ["PSA age limits (Fimlab)", None, None, None, None, None, None, None],
        ["Age band", "Upper limit (µg/l)", "Source", "Status", None, None, None, None],
        ["Under 50", 2.5, "Fimlab test 4869", "real", None, None, None, None],
        ["50-59", 3.5, "Fimlab test 4869", "real", None, None, None, None],
        ["60-69", 4.5, "Fimlab test 4869", "real", None, None, None, None],
        ["70 and over (agent stays silent: Käypä hoito)", 6.5, "Fimlab test 4869; Käypä hoito 2025", "real", None, None, None, None],
        [None] * 8,
        ["Trial results — Murphy et al., J Clin Oncol 2015;33:3560-7 (strong; outcome = time to diagnostic work-up, not stage or survival)", None, None, None, None, None, None, None],
        ["Arm", "Intervention (days)", "Control (days)", "Days faster", "n", "Significance", "Flags that were real delays", "Status"],
        ["Bowel (colorectal), median", 104, 200, "=C17-B17", 557, "p < 0.001", 0.603, "real"],
        ["Prostate, time to 40 % evaluated", 144, 192, "=C18-B18", 157, "p < 0.001", 0.584, "real"],
        ["Lung, median", 65, 93, "=C19-B19", 19, "p = 0.59, not significant", 0.396, "real"],
        ["All arms: follow-up completed by 7 months", 0.734, 0.522, "=B20-C20", None, "—", 0.596, "real"],
        [None] * 8,
        ["Also from the trial: 11.8 % of abnormal results were flagged. Staffing ≈ 4 h/week chart review + 1-2 h/week messages for 72 primary-care clinicians. Limits: US veterans' hospitals, mostly men, 2011-12.", None, None, None, None, None, None, None],
    ],
    "headers": [3, 9, 16], "titles": [1, 8, 15, 22],
    "formats": {"G17:G20": "0.0%", "B20:D20": "0.0%"},
    "widths": {"A": 210, "B": 300, "C": 120, "D": 200, "E": 320, "F": 340, "G": 220, "H": 80}, "wrap": ["B", "D", "E", "F", "G"],
}

# ---------------------------------------------------------------- Reader tests
TESTS = {
    "name": "Reader tests",
    "rows": [
        ["Reader tests — SYNTHETIC notes and records written by the team (tests/RESULTS.md, engine 3.0, 14.11.2026). Not real-world accuracy: that needs de-identified notes labelled by a clinician.", None, None, None, None, None, None, None],
        [None] * 8,
        ["Test set", "Items", "Fully correct", "Share correct", "Finding precision", "Finding recall", "Source", "Status"],
        ["Dev notes, first run", 200, 190, "=C4/B4", 0.98, 0.97, "tests/RESULTS.md " + URL["results"], "synthetic"],
        ["Dev notes, after general fixes (used while building)", 200, 200, "=C5/B5", 1.0, 1.0, "tests/RESULTS.md", "synthetic"],
        ["Held-out notes, first run", 20, 11, "=C6/B6", 0.93, 0.58, "tests/RESULTS.md", "synthetic"],
        ["Held-out notes, now (the honest number)", 20, 13, "=C7/B7", 0.94, 0.67, "tests/RESULTS.md", "synthetic"],
        ["Records: result nobody acted on — flag / wait / stay silent", 38, 38, "=C8/B8", None, None, "tests/RESULTS.md (expected outcomes from Murphy 2015, Fimlab, Käypä hoito)", "synthetic"],
        ["Smoking history read from text", 18, 18, "=C9/B9", None, None, "tests/RESULTS.md", "synthetic"],
        ["Relative's symptom not taken as the patient's", 5, 5, "=C10/B10", None, None, "tests/RESULTS.md", "synthetic"],
        [None] * 8,
        ["Held-out misses (left as found: words the lexicon does not know)", None, None, None, None, None, None, None],
        ["Note", "ID", "Missed", "Expected action", "Status", None, None, None],
        ["Bringing up blood-streaked phlegm for a week.", "C02", "haemoptysis", "lung_urgent", "synthetic", None, None, None],
        ["Pt c/o SOB and fatigue x 6 wks.", "C03", "dyspnoea", "lung_urgent", "synthetic", None, None, None],
        ["Kainalossa patti 4 vk, ei muita oireita.", "C04", "lymph node", "lymphoma_urgent", "synthetic", None, None, None],
        ["Huono ruokahalu ja painoa lähtenyt 7 kg puolessa vuodessa.", "C05", "appetite loss", "lung_imaging", "synthetic", None, None, None],
        ["Hikoilee yöllä niin että lakanat kastuvat, kaulalla imusolmuke.", "C10", "lymph node, night sweats", "lymphoma_urgent", "synthetic", None, None, None],
        ["Kova yskä, välillä verilimaa.", "C15", "haemoptysis (and a false cough)", "lung_urgent", "synthetic", None, None, None],
        ["Feverish, itchy skin, swollen nodes in groin for a month.", "C18", "lymph node", "lymphoma_urgent", "synthetic", None, None, None],
    ],
    "headers": [3, 13], "titles": [1, 12],
    "synthetic": ["A4:A10"],
    "formats": {"D4:F10": "0%"},
    "widths": {"A": 330, "B": 70, "C": 110, "D": 110, "E": 120, "F": 110, "G": 320, "H": 90}, "wrap": ["A", "C", "G"],
}

# ---------------------------------------------------------------- Survival (experimental)
SURV = {
    "name": "EXPERIMENTAL survival",
    "rows": [
        ["HIGHLY EXPERIMENTAL — not a claim. A transparent what-if: if diagnosis comes earlier, and if earlier helps as much as published data on TREATMENT delay suggests, how many more people would be alive at 5 years?", None, None, None, None],
        ["Method: proportional hazards, S_new = S^(1/h^(days/28)); h = hazard ratio per 4 weeks of delay. Earlier diagnosis can look like longer survival only because the clock starts sooner (lead-time bias). h = 1 (0 %) is a real possibility.", None, None, None, None],
        [None] * 5,
        ["Input", "Value", "Source / basis", "URL", "Status"],
        ["h: hazard ratio per 4 weeks of delay", 1.06, "Hanna et al., BMJ 2020;371:m4087: ≈ 6-8 % higher risk of death per 4-week delay for surgery (34 studies, 1.27 M patients). Measures delay AFTER diagnosis; using it for the diagnostic interval is our extrapolation", URL["hanna"], "assumption (value real, use extrapolated)"],
        ["Lung 5-year relative survival now", 0.20, "Between men 16.4 % and women 25.5 % (Tichanek et al., Clin Epidemiol 2023, NORDCAN 2016-20)", URL["tichanek"], "model (from real values)"],
        ["Lung patients flagged a year (capped by slots)", "=Impact_model!B23", "From Impact_model (capped)", None, "model"],
        ["Lung days earlier", "=Impact_model!B17", "From Impact_model", None, "model"],
        ["Bowel 5-year relative survival now", 0.61, "Olenius et al., BMC Cancer 2022;22:356 (FCR, 2006-2015: right colon 59.9 %, left 61.0 %, rectum 62.3 %)", URL["olenius"], "real"],
        ["New colorectal cancers in Finland, 2024", 4153, "Syöpä 2024 report (Finnish Cancer Registry) via Verkkouutiset — secondary source", URL["syopa_crc"], "real"],
        ["County population", "=Impact_model!B4", "From Impact_model (Päijät-Häme default)", None, "real (rounded)"],
        ["Finland population", "=Impact_model!B6", "From Impact_model", None, "real (rounded)"],
        ["Coverage", "=Impact_model!B7", "From Impact_model", None, "assumption"],
        ["Share of bowel cancers found through a result nobody followed up", 0.10, "No source. The pilot would measure it", None, "assumption"],
        ["Days earlier for those bowel cancers", 96, "Murphy et al. 2015: median 200 vs 104 days to work-up (time to work-up, not to diagnosis)", URL["murphy"], "real"],
        [None] * 5,
        ["Output", "Value", "Formula in words", None, "Status"],
        ["Lung: hazard factor h^(days/28)", "=B5^(B8/28)", "h to the power of days/28", None, "model"],
        ["Lung: 5-year survival after the change", "=B6^(1/B18)", "S^(1/factor)", None, "model"],
        ["Lung: extra 5-year survivors a year", "=B7*(B19-B6)", "patients × (S_new − S)", None, "model"],
        ["Bowel: cases a year in the county", "=B11*B10/B12*B13", "population × 4,153 / 5.6 M × coverage", None, "model"],
        ["Bowel: patients through an unfollowed result", "=B21*B14", "cases × share", None, "model"],
        ["Bowel: hazard factor h^(days/28)", "=B5^(B15/28)", "h to the power of days/28", None, "model"],
        ["Bowel: 5-year survival after the change", "=B9^(1/B23)", "S^(1/factor)", None, "model"],
        ["Bowel: extra 5-year survivors a year", "=B22*(B24-B9)", "patients × (S_new − S)", None, "model"],
        ["Total extra 5-year survivors a year (what-if)", "=B20+B25", "lung + bowel", None, "model"],
        [None] * 5,
        ["Prostate is left out: not in the hazard-ratio review, survival already high, faster diagnosis risks overdiagnosis. Sanity check: after Denmark's cancer pathways, 3-year relative survival of symptomatic patients diagnosed via primary care rose 45 % → 54 % (Jensen, Tørring & Vedsted, BMC Cancer 2017; observational, same lead-time caveat). This tab does not change Impact_model: no stage shift and no survival gain is claimed.", None, None, None, None],
    ],
    "headers": [4, 17], "titles": [1, 2, 28],
    "inputs": ["B5:B6", "B9:B10", "B14:B15"], "outputs": ["B18:B26"], "alert": ["A1"],
    "formats": {"B5": "0.00", "B6": "0%", "B7:B8": "#,##0.0", "B9": "0%", "B10:B12": "#,##0", "B13:B14": "0%", "B18": "0.000", "B19": "0.0%", "B20": "0.00", "B21:B22": "#,##0.0", "B23": "0.000", "B24": "0.0%", "B25:B26": "0.00"},
    "widths": {"A": 330, "B": 110, "C": 460, "D": 260, "E": 200}, "wrap": ["C"],
}

NEW_TABS = [PILOT_COST, COUNTY, LEVEL0, TESTS, SURV]

README_ROWS = [
    ["Pilot cost (Päijät-Häme)", "MODEL (sourced rates + labelled assumptions)", "Six-month, three-centre pilot cost with live formulas: nurse €3,174/month ÷ (38.25 h × 52) × 1.231; physician ≈ €61/h; data work as assumptions; total ≈ €27,000-28,000; running cost per centre ≈ €4,600/yr.", "IMPLEMENTATION-PLAN v3 §7"],
    ["Pilot county choice", "Real", "Päijät-Häme (pilot), Pohjois-Karjala (second region), Pohjois-Pohjanmaa (considered) with sourced reasons and figures.", "IMPLEMENTATION-PLAN v3 §2; report 4.3, 6.1"],
    ["Level 0 triggers", "Real", "Lung / bowel / prostate thresholds, windows and exclusions, PSA age limits, and the trial results.", "Murphy 2015; Fimlab 150/2024 and test 4869; Käypä hoito 16.4.2025"],
    ["Reader tests", "SYNTHETIC", "Reader test results: dev 200/200, held-out 13/20, records 38/38, smoking 18/18, relatives 5/5; held-out misses.", "tests/RESULTS.md"],
    ["EXPERIMENTAL survival", "HIGHLY EXPERIMENTAL — not a claim", "What-if survival estimator: S_new = S^(1/h^(days/28)) with Hanna 2020 HR, Tichanek, Olenius, Syöpä 2024 count, 10 % assumption, 96 days. Inputs linked to Impact_model.", "app impact view; report 8.2"],
]

# Sources added 14.11.2026 (key, short, citation, url, grade, outcome, note, added)
SOURCES_ROWS = [
    ["hanna2020", "Hanna et al. 2020", "Mortality due to cancer treatment delay: systematic review and meta-analysis. BMJ 2020;371:m4087", URL["hanna"], "moderate", "Overall survival (per 4-week treatment delay)", "34 studies, 1.27 M patients; 6-8 % per 4 weeks for surgery. Delay AFTER diagnosis; our use is an extrapolation.", "14.11.2026"],
    ["olenius2022", "Olenius et al. 2022", "Long-term survival among colorectal cancer patients in Finland, 1991-2015. BMC Cancer 2022;22:356", URL["olenius"], "strong", "5-year relative survival", "FCR, n = 59,465; 2006-2015: right colon 59.9 %, left 61.0 %, rectum 62.3 %.", "14.11.2026"],
    ["syopa2024_crc", "Syöpä 2024 report (bowel)", "New colorectal cancers in Finland, 2024. Finnish Cancer Registry, Syöpä 2024 (via Verkkouutiset)", URL["syopa_crc"], "moderate", "Incidence", "4,153 new colon and rectal cancers in 2024 (4,582 in 2023). Secondary source.", "14.11.2026"],
    ["jensen2017", "Jensen, Tørring & Vedsted 2017", "Prognostic consequences of implementing cancer patient pathways in Denmark. BMC Cancer 2017;17:627", URL["jensen"], "moderate", "3-year relative survival (observational)", "45 % → 54 %, n = 7,725; lead-time and selection bias.", "14.11.2026"],
    ["probst2012", "Probst et al. 2012", "Cancer patient pathways in Denmark as a joint effort between bureaucrats, health professionals and politicians. Health Policy 2012;105:65-70", None, "moderate", "Waiting time (policy process)", "32 standard pathways agreed 2007-08 with fixed maximum times.", "14.11.2026"],
    ["oecd_hag", "OECD Health at a Glance", "Health at a Glance 2021 and 2025; Health at a Glance: Europe 2018 (CT scanners and exams per capita)", None, "moderate", "Capacity / utilisation", "Finland ≈ 21-25 CT per million vs DK ≈ 28-40, UK ≈ 8 (older data); Finland's scan use among the lowest.", "14.11.2026"],
    ["fimlab_fhb", "Fimlab F-hHb 2024", "Ulosteen kvantitatiivinen hemoglobiini. Fimlab laboratoriotiedote 150/2024", URL["fimlab_fhb"], "strong", "Laboratory threshold", "< 10 negative, 10-< 25 borderline, ≥ 25 µg/g positive.", "14.11.2026"],
    ["fimlab_psa", "Fimlab PSA", "P-PSA reference limits by age. Fimlab test 4869", URL["fimlab_psa"], "strong", "Laboratory threshold", "2.5 / 3.5 / 4.5 / 6.5 µg/l by age band.", "14.11.2026"],
    ["kh_psa", "Käypä hoito PSA 2025", "Eturauhassyöpä: PSA-testaus. Käypä hoito, 16.4.2025", URL["kh_psa"], "strong", "National guideline", "No testing of symptom-free men > 70; repeat abnormal PSA after 1-2 months; overdiagnosis main harm.", "14.11.2026"],
    ["aafp2014", "Gaddey & Holder 2014", "Unintentional weight loss in older adults. Am Fam Physician 2014;89(9):718-22", "https://www.aafp.org/pubs/afp/issues/2014/0501/p718.html", "moderate", "Definition", "> 5 % in 6-12 months.", "14.11.2026"],
    ["icpc2", "ICPC-2 (THL code service)", "International Classification of Primary Care, Finnish version. THL / Kanta Koodistopalvelu", "https://koodistopalvelu.kanta.fi", "strong", "Coding standard", "Reason-for-visit codes in Avohilmo.", "14.11.2026"],
    ["massive_haem", "Haemoptysis severity guidance", "Patient.info professional reference (Haemoptysis) and related guidance", "https://patient.info/doctor/Haemoptysis", "moderate", "Urgency (safety)", "No agreed volume cut-off; agent escalates on wording.", "14.11.2026"],
    ["tehy2025", "Verkkouutiset / Tehy 2025", "Sairaanhoitajien palkka on jo 3174 euroa kuukaudessa (Tehy calculation, Statistics Finland)", URL["tehy"], "moderate", "Cost input (pay)", "€3,174/month average task-based pay, wellbeing services counties, 2025.", "14.11.2026"],
    ["kuntaliitto2026", "Kuntaliitto 2026", "Sosiaaliturvamaksuennusteet, June 2026", URL["kuntaliitto"], "strong", "Cost input (employer contributions)", "Pension 19.94 % + sickness 1.91 % + unemployment 1.23 %.", "14.11.2026"],
    ["yle_doctorpay", "Yle (KT statistics 2021)", "Lääkäreiden palkkavertailu", URL["yle_doc"], "weak-moderate", "Cost input (pay)", "Municipal physicians €8,197/month total earnings, 2021 (old).", "14.11.2026"],
    ["sitra2025", "Sitra 2025", "Tulevaisuusbarometri 2025, Päijät-Häme (Statistics Finland population)", URL["sitra"], "strong", "Population", "204,676 residents in 2024.", "14.11.2026"],
    ["yle_harju2022", "Yle 2022", "Harjun terveys uses the shared Päijät-Häme patient-record system", URL["yle_harju"], "moderate", "Record system", None, "14.11.2026"],
    ["yle_omalaakari", "Yle", "Omalääkärimalli alkaa vaiheittain Päijät-Hämeessä", URL["yle_omalaakari"], "moderate", "Continuity of care", None, "14.11.2026"],
    ["ph_continuity2026", "Päijät-Häme 6.7.2026", "Hoidon jatkuvuuden kehittämiselle reilu miljoona euroa valtionavustusta. County press release (STT), 6.7.2026", None, "moderate", "Continuity of care (funding)", "Over €1 M state grant.", "14.11.2026"],
    ["siunsote2026", "Siun sote 21.4.2026", "Kanta info for private social-care providers (Lifecare roll-out by end of 2027)", URL["siunsote"], "moderate", "Record system", None, "14.11.2026"],
    ["pkliitto2025", "Pohjois-Karjalan liitto 2025", "Pohjois-Karjalan tilanne- ja kehityskuva, October 2025", URL["pkliitto"], "strong", "Population", "161,441 residents.", "14.11.2026"],
    ["vm2025", "Ministry of Finance 30.10.2025", "Pohjois-Karjalan hyvinvointialueelle lisärahoitusta 2,6 miljoonaa euroa", URL["vm"], "strong", "County finances", None, "14.11.2026"],
    ["ilomantsi2025", "Ilomantsi 2025", "Laaja hyvinvointikertomus 2025-2028 (national health index)", URL["ilomantsi"], "moderate", "Illness burden", None, "14.11.2026"],
    ["yle_pkstations", "Yle 2023", "Pohjois-Karjalassa yli 20 terveysasemaa", "https://yle.fi/a/74-20028934", "moderate", "Service network", None, "14.11.2026"],
    ["yle_pohde_esko", "Yle 2026", "Pohde ottaa Esko-potilastietojärjestelmän käyttöön koko alueen perusterveydenhuollossa", URL["yle_esko"], "moderate", "Record system", None, "14.11.2026"],
    ["cgi2024", "CGI 22.3.2024", "OMNI360 valittiin Varsinais-Suomen hyvinvointialueen potilastietojärjestelmäksi", "https://www.cgi.com/fi/fi/uutinen/cgin-suomessa-kehittama-omni360-valittiin-varsinais-suomen-hyvinvointialueen", "moderate", "Record system", None, "14.11.2026"],
    ["reader_tests", "Ajoissa reader tests", "tests/RESULTS.md, engine 3.0, 14.11.2026 (synthetic notes and records)", URL["results"], "synthetic", "Reader accuracy on team-written data", "Not real-world accuracy.", "14.11.2026"],
]


# ---------------------------------------------------------------- openpyxl renderer
def render_xlsx(wb, tab, index=None):
    from openpyxl.styles import Font, PatternFill, Alignment
    from openpyxl.utils import column_index_from_string
    from openpyxl.utils.cell import range_boundaries
    HDR = PatternFill("solid", fgColor="E8EEF4"); INP = PatternFill("solid", fgColor="FFF4D6")
    OUT = PatternFill("solid", fgColor="E3F4EC"); SYN = PatternFill("solid", fgColor="FBE9EC")
    ALERT = PatternFill("solid", fgColor="F8D7DA")
    if tab["name"] in wb.sheetnames:
        idx = wb.sheetnames.index(tab["name"]); del wb[tab["name"]]
        index = idx if index is None else index
    ws = wb.create_sheet(tab["name"], index)
    wrap = {column_index_from_string(c) for c in tab.get("wrap", [])}
    for i, row in enumerate(tab["rows"], 1):
        for j, v in enumerate(row, 1):
            if v is None: continue
            c = ws.cell(i, j, v)
            c.alignment = Alignment(vertical="top", wrap_text=(j in wrap and i not in tab.get("titles", [])))
    def cells(rng):
        a, b, c2, d = range_boundaries(rng if ":" in rng else rng + ":" + rng)
        for r in range(b, d + 1):
            for col in range(a, c2 + 1):
                yield ws.cell(r, col)
    ncol = max(len(r) for r in tab["rows"])
    for h in tab.get("headers", []):
        for j in range(1, ncol + 1):
            if ws.cell(h, j).value is not None:
                ws.cell(h, j).font = Font(bold=True); ws.cell(h, j).fill = HDR
                ws.cell(h, j).alignment = Alignment(wrap_text=True, vertical="top")
    for t in tab.get("titles", []):
        ws.cell(t, 1).font = Font(bold=True, size=12 if t == 1 else 11)
    for key, fill in (("inputs", INP), ("outputs", OUT), ("synthetic", SYN), ("alert", ALERT)):
        for rng in tab.get(key, []):
            for c in cells(rng): c.fill = fill
    for rng, fmt in tab.get("formats", {}).items():
        for c in cells(rng): c.number_format = fmt
    for col, px in tab.get("widths", {}).items():
        ws.column_dimensions[col].width = round(px / 7)
    if tab.get("headers"):
        ws.freeze_panes = ws.cell(tab["headers"][0] + 1, 1)
    return ws


def add_readme_and_sources(wb):
    from openpyxl.styles import Font, PatternFill, Alignment
    ws = wb["README"]
    have = {ws.cell(r, 1).value for r in range(1, ws.max_row + 1)}
    r = ws.max_row + 1
    for row in README_ROWS:
        if row[0] in have: continue
        for j, v in enumerate(row, 1):
            c = ws.cell(r, j, v); c.alignment = Alignment(wrap_text=(j in (3, 4)), vertical="top")
        r += 1
    for row in range(1, ws.max_row + 1):
        if ws.cell(row, 1).value == "Impact_model":
            ws.cell(row, 3).value = "Yellow cells are inputs you can change; green cells are formulas. Default county Päijät-Häme (205,000). Capped-slots formula: share of flags that get a slot = slots × 52 ÷ uncapped work-ups. Not a measured result; no stage or survival effect is claimed."
    ws = wb["Sources"]
    have = {ws.cell(r, 1).value for r in range(1, ws.max_row + 1)}
    ws.cell(1, 8, "Added on").font = Font(bold=True)
    ws.cell(1, 8).fill = PatternFill("solid", fgColor="E8EEF4")
    ws.column_dimensions["H"].width = 12
    r = ws.max_row + 1
    for row in SOURCES_ROWS:
        if row[0] in have: continue
        for j, v in enumerate(row, 1):
            c = ws.cell(r, j, v); c.alignment = Alignment(wrap_text=(j in (3, 7)), vertical="top")
        r += 1


def apply_all(wb):
    """Rewrite Impact_model in place and add the 14.11 tabs after it, before Synthetic_cases."""
    render_xlsx(wb, IMPACT)
    pos = wb.sheetnames.index("Impact_model") + 1
    for k, tab in enumerate(NEW_TABS):
        render_xlsx(wb, tab, pos + k)
    add_readme_and_sources(wb)
