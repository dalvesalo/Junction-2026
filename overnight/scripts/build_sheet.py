"""Build 'Ajoissa — data & sources' workbook from overnight CSVs, sources.js dump and engine run."""
import csv, json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

D = "/home/claude/junction-2026/overnight/data/"
OUT = sys.argv[1]
HDR = PatternFill("solid", fgColor="E8EEF4")
INP = PatternFill("solid", fgColor="FFF4D6")
OUTF = PatternFill("solid", fgColor="E3F4EC")
SYN = PatternFill("solid", fgColor="FBE9EC")
B = Font(bold=True)

wb = Workbook()
first = True


def sheet(name):
    global first
    if first:
        ws = wb.active; ws.title = name; first = False
    else:
        ws = wb.create_sheet(name)
    return ws


def table(ws, header, rows, start=1, widths=None, wrap_cols=()):
    for j, h in enumerate(header, 1):
        c = ws.cell(start, j, h); c.font = B; c.fill = HDR
        c.alignment = Alignment(wrap_text=True, vertical="top")
    for i, r in enumerate(rows, start + 1):
        for j, v in enumerate(r, 1):
            c = ws.cell(i, j, v)
            c.alignment = Alignment(vertical="top", wrap_text=(j in wrap_cols))
    ws.freeze_panes = ws.cell(start + 1, 1)
    for j, h in enumerate(header, 1):
        w = (widths or {}).get(j)
        if w is None:
            vals = [len(str(h))] + [len(str(r[j - 1])) for r in rows if j - 1 < len(r) and r[j - 1] is not None]
            w = min(max(vals) + 2, 45)
        ws.column_dimensions[get_column_letter(j)].width = w


def num(v):
    try:
        f = float(v)
        return int(f) if f.is_integer() and "." not in v else f
    except (ValueError, TypeError):
        return v if v != "" else None


def load(fn):
    with open(D + fn, encoding="utf-8") as f:
        r = list(csv.reader(f))
    return r[0], [[num(x) for x in row] for row in r[1:]]


# README
ws = sheet("README")
ws["A1"] = "Ajoissa — data & sources (Brainwave Bandits, Junction 2026, AstraZeneca challenge)"; ws["A1"].font = Font(bold=True, size=14)
ws["A2"] = "Companion to the report 'Ajoissa — full project report'. Every data row keeps a source column. Grades: strong / moderate / weak. Built 14.11.2026 from overnight/data/*.csv and app/js (engine.js, cases.js, sources.js)."
ws["A2"].alignment = Alignment(wrap_text=True)
rd = [
    ("Gap_DLBCL", "Real (moderate)", "DLBCL: tested median symptom-to-treatment 127 vs 76 days (p = 0.027) plus Fig. 1 cumulative step times per pathway step, occupational/private vs public entry; gap columns are formulas.", "Kuitunen et al. 2026 (7 Finnish hospitals, n = 160); Fig. 1 values with provider labels as in the AstraZeneca keynote"),
    ("Nordic_lung", "Real", "Finland vs Nordic lung-cancer survival, stage, surgery and pathway intervals (plus all-cancer and LBCL rows).", "A_nordic_benchmark.csv"),
    ("SES_Finland", "Real", "Education and income gaps in survival, stage, treatment and mortality in Finland.", "A_ses_gaps_finland.csv"),
    ("County_access_2024", "Real (dated)", "Primary-care access by county, March 2024 (THL Avohilmo via HE 134/2024) joined with Terve Suomi 2024 self-reported unmet physician need. Blank = missing in source.", "B_primary_care_access_by_county_2024-03.csv + B_terve_suomi_2024_unmet_physician_need_by_county.csv"),
    ("County_outcomes_FCR", "Real", "County / YTA incidence, survival and mortality outliers and national references, 2019-2023.", "A_county_outcomes_FCR_2019_2023.csv"),
    ("Denmark_pathways", "Real", "Danish share of cancer pathways within standard time by region, 2025.", "B_denmark_cancer_pathway_within_standard_time_2025.csv"),
    ("Agent_LRs", "Real (UK-derived)", "Likelihood ratios used by the agent's Bayesian lung-cancer step, plus rule thresholds.", "app/js/engine.js + sources.js"),
    ("Impact_model", "MODEL (assumptions)", "Yellow cells are inputs you can change; green cells are formulas. Not a measured result; no stage or survival effect is claimed.", "app impact view; Schut 2025; Yle MOT (weak)"),
    ("Synthetic_cases", "SYNTHETIC", "Six synthetic patients and the agent's actual output (computed by running app/js/engine.js on app/js/cases.js). Not real people.", "engine.js run, 14.11.2026"),
    ("Sources", "Real", "Source list with citation, URL, evidence grade and outcome type.", "app/js/sources.js + research notes"),
]
table(ws, ["Tab", "Real or synthetic", "What it holds", "Built from"], rd, start=4, widths={1: 22, 2: 20, 3: 80, 4: 60}, wrap_cols=(3, 4))
ws.freeze_panes = None

# Gap_DLBCL
ws = sheet("Gap_DLBCL")
steps = [("Symptom onset", 0, 0), ("First contact", 42, 72), ("Physician visit", 43, 94), ("Referral", 77, 147), ("Specialist visit", 118, 204), ("Treatment start", 123, 207)]
src = "Kuitunen et al., Cancer Medicine 2026;15(5):e71920, doi:10.1002/cam4.71920. Multi-centre (4 university + 3 secondary hospitals), n = 160, 2014-2020. CUMULATIVE STEP TIMES from the paper's Fig. 1 (statistic type not stated; close to the means); provider labels as shown in the AstraZeneca keynote, Junction 13.11.2026"
rows = []
for i, (s, o, p) in enumerate(steps, 2):
    rows.append([s, o, p, f"=C{i}-B{i}", ("=D2" if i == 2 else f"=D{i}-D{i-1}"), "Waiting time", "moderate", src])
table(ws, ["Step (Fig. 1 cumulative step times)", "Occupational / private route (cumulative days from onset, Fig. 1)", "Public route (cumulative days from onset, Fig. 1)", "Gap (days) = public - occupational", "Gap added at this step (days)", "Outcome type", "Evidence grade", "Source"], rows, widths={1: 22, 2: 20, 3: 18, 4: 18, 5: 16, 6: 14, 7: 12, 8: 70}, wrap_cols=(1, 2, 3, 8))
m0 = len(rows) + 3
ws.cell(m0, 1, "Tested headline (lead with this)").font = B
msrc = "Kuitunen et al. 2026, text: Mann-Whitney p = 0.027 (about n = 48 vs 39); emergency-route categories excluded. Not 'twice as long' (ratio ~1.7 medians, ~1.6 means); the roadmap's 'twice' cites an unpublished study."
med = [
    ["Median symptom-to-treatment (days)", 76, 127, f"=C{m0+1}-B{m0+1}", None, "Waiting time", "moderate", msrc],
    ["Mean symptom-to-treatment (days)", 126, 201, f"=C{m0+2}-B{m0+2}", None, "Waiting time", "moderate", "Kuitunen et al. 2026, text"],
]
for i, r in enumerate(med, m0 + 1):
    for j, v in enumerate(r, 1):
        c = ws.cell(i, j, v); c.alignment = Alignment(vertical="top", wrap_text=(j in (1, 8)))
ws.cell(m0 + 3, 1, "Median gap = 51 days (about 7 weeks), p = 0.027. Public = primary healthcare by appointment; occupational/private = private or occupational care. Small n: moderate evidence, waiting-time outcome only.").alignment = Alignment(wrap_text=False)

# Nordic_lung, SES, FCR, Denmark
for name, fn in [("Nordic_lung", "A_nordic_benchmark.csv"), ("SES_Finland", "A_ses_gaps_finland.csv"), ("County_outcomes_FCR", "A_county_outcomes_FCR_2019_2023.csv"), ("Denmark_pathways", "B_denmark_cancer_pathway_within_standard_time_2025.csv")]:
    h, r = load(fn)
    table(sheet(name), h, r)

# County access join
ha, ra = load("B_primary_care_access_by_county_2024-03.csv")
ht, rt = load("B_terve_suomi_2024_unmet_physician_need_by_county.csv")
tmap = {r[0]: r for r in rt}
rows = []
for r in ra:
    t = tmap.get(r[0], [None] * len(ht))
    rows.append([r[0], r[3], r[2], r[4], t[2], t[3], r[6] or None, "THL Avohilmo via HE 134/2024 vp, tables 6, 7, 11 (March 2024): https://finlex.fi/api/media/government-proposal/3195/mainPdf/main.pdf", "THL Terve Suomi 2024, Tilastoraportti 31/2025, Liitetaulukko 6: https://www.keusote.fi/wp-content/uploads/2025/05/Tilastoraportti_Terve_Suomi_2024.pdf", "strong (register, pre-2025 law change) / strong (survey, self-reported)"])
missing = set(tmap) - {r[0] for r in ra}
for m in sorted(missing):
    t = tmap[m]
    rows.append([m, None, None, None, t[2], t[3], "not in access table", "", "THL Terve Suomi 2024 (as above)", "strong"])
table(ws := sheet("County_access_2024"), ["County", "Physician first visits within 14 d (%) Mar 2024", "All professionals within 14 d (%) Mar 2024", "Within 3 months (%) Mar 2024", "Insufficient physician services vs need (%) 2024", "Client fees hindered use (%) 2024", "Notes", "Source (access)", "Source (survey)", "Grade"], rows, widths={1: 20, 2: 16, 3: 16, 4: 14, 5: 18, 6: 16, 7: 40, 8: 50, 9: 50, 10: 30}, wrap_cols=(7,))

# Agent_LRs
lr = [
    ("Haemoptysis (veriyskä)", 13.2, "Hamilton et al., Thorax 2005;60:1059-65 (CAPER), LR+ as tabulated in Okoli et al., PLoS One 2018;13:e0207686", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+), UK primary care case-control, age > 40"),
    ("Weight loss (laihtuminen)", 6.2, "Hamilton 2005 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Loss of appetite (ruokahaluttomuus)", 4.8, "Hamilton 2005 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Dyspnoea (hengenahdistus)", 3.6, "Hamilton 2005 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Chest pain (rintakipu)", 3.3, "Hamilton 2005 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Cough, persistent >= 3 wk or repeat visits (yskä)", 2.5, "Iyen-Omofoman et al., Br J Cancer 2013 (THIN), LR+ as calculated in Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Fatigue (väsymys)", 2.3, "Hamilton 2005 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
    ("Hoarseness (äänen käheys)", 1.9, "Iyen-Omofoman 2013 via Okoli 2018", "https://doi.org/10.1371/journal.pone.0207686", "moderate", "Diagnostic accuracy (LR+)"),
]
ws = sheet("Agent_LRs")
table(ws, ["Symptom", "LR+ (lung cancer, primary care)", "Source", "URL", "Evidence grade", "Outcome type"], lr, widths={1: 40, 2: 14, 3: 70, 4: 40, 5: 12, 6: 40}, wrap_cols=(3,))
r0 = len(lr) + 3
notes = [
    ("Method", "Prior = PLCOm2012 6-year risk / 6 (ever-smokers; Tammemägi NEJM 2013, doi:10.1056/NEJMoa1211776) or 0.124 % / 5 (never-smokers; Okoli 2018). Posterior odds = prior odds x the two strongest LR+ only (symptoms not independent)."),
    ("Urgent threshold", "Posterior >= 3 % (NICE NG12 PPV threshold) or age >= 40 with haemoptysis -> direct thorax CT."),
    ("Watch threshold", "Posterior >= 1 % with a lung or repeat-visit rule -> chest imaging + 2-week review."),
    ("Platelets rule", "Platelets > 400 x10^9/L: 1-year cancer incidence 11.6 % men / 6.2 % women (Bailey et al., BJGP 2017, doi:10.3399/bjgp17X691109; strong)."),
    ("Caveat", "LRs are UK-derived; PLCOm2012 not calibrated for Finland. Local recalibration needed (phase 2)."),
]
for i, (k, v) in enumerate(notes):
    ws.cell(r0 + i, 1, k).font = B
    c = ws.cell(r0 + i, 3, v); c.alignment = Alignment(wrap_text=True, vertical="top")

# Impact_model
ws = sheet("Impact_model")
ws["A1"] = "Impact model — MODEL, not a measured result. Yellow = inputs (change them), green = formulas."; ws["A1"].font = Font(bold=True, size=12)
inputs = [
    ("County population", 420000, "people", "Example county size", "assumption"),
    ("Lung-cancer cases per year, Finland", 3000, "cases/yr", "Finnish Cancer Registry, rounded (as used in the app; exact figure not re-verified)", "rounded"),
    ("Finland population", 5600000, "people", "Rounded (as used in the app)", "rounded"),
    ("Coverage: health centres using Ajoissa", 1.0, "share", "Full county roll-out; pilot starts with 3 centres", "assumption"),
    ("Sensitivity: share of lung cancers flagged", 0.6, "share", "Schut et al., BJGP 2025 (≈62 % flagged ≈4 months earlier at 3 % PPV); doi:10.3399/BJGP.2023.0489", "moderate"),
    ("Current primary-care interval", 41, "days", "Unpublished Finnish lung study via Yle MOT 12.10.2026, https://yle.fi/a/74-20251023", "weak — replace with county data"),
    ("Cut in interval for flagged patients", 0.5, "share", "Team assumption; Murphy JCO 2015 RCT roughly halved colorectal time to work-up (200 -> 104 d); its lung arm (n = 19) was not significant", "assumption"),
    ("Work-ups per earlier diagnosis", 33, "patients", "Schut et al., BJGP 2025", "moderate"),
]
table(ws, ["Input", "Value", "Unit", "Source / basis", "Status"], inputs, start=3, widths={1: 42, 2: 14, 3: 12, 4: 80, 5: 28}, wrap_cols=(4,))
ws.freeze_panes = None
for i in range(4, 4 + len(inputs)):
    ws.cell(i, 2).fill = INP
for a in ("B7", "B8", "B10"):
    ws[a].number_format = "0%"
ws["B4"].number_format = ws["B5"].number_format = ws["B6"].number_format = "#,##0"
o = 4 + len(inputs) + 1
ws.cell(o, 1, "Outputs").font = B
outs = [
    ("Expected lung cancers per year in county", "=B4*B5/B6", "cases/yr", "pop x 3000 / 5,600,000"),
    ("Flagged per year", f"=B{o+1}*B7*B8", "patients/yr", "cases x coverage x sensitivity"),
    ("Days earlier per flagged patient", "=B9*B10", "days", "interval x cut"),
    ("Total patient-days earlier per year", f"=B{o+2}*B{o+3}", "days/yr", "flagged x days"),
    ("Extra work-ups per year", f"=B{o+2}*B11", "work-ups/yr", "flagged x 33"),
    ("Flagged, low display bound (x0.6)", f"=B{o+2}*0.6", "patients/yr", "app display convention, not a CI"),
    ("Flagged, high display bound (x1.3)", f"=B{o+2}*1.3", "patients/yr", "app display convention, not a CI"),
]
for i, (k, f, u, n) in enumerate(outs, o + 1):
    ws.cell(i, 1, k); c = ws.cell(i, 2, f); c.fill = OUTF; c.number_format = "#,##0.0"
    ws.cell(i, 3, u); ws.cell(i, 4, n)
w = o + len(outs) + 2
ws.cell(w, 1, "What we do not claim").font = B
ws.cell(w, 4, "No stage or survival effect (ERICA RCT has not reported). No reduction in imaging. No Finnish validation yet. The 41-day interval is not the county's own figure.").alignment = Alignment(wrap_text=True)

# Synthetic_cases
cases = json.load(open("/tmp/cases_out.json"))
rows = []
for c in cases:
    rows.append([c["id"], c["name"] + " (synthetic)", c["age"], c["sex"], c["centre"], c["headline"], c["noteEn"], c["noteFi"], c["labs"], c["visits90"], c["findings"], c["prior"], c["posterior"], c["steps"], c["rules"] or "none", c["action"], c["target"], c["clock"] or "none", c["earlier"], c["earlierAction"], "SYNTHETIC — app/js/cases.js; output computed with app/js/engine.js on 14.11.2026"])
ws = sheet("Synthetic_cases")
table(ws, ["ID", "Name", "Age", "Sex", "Health centre", "Headline", "Note (EN gloss)", "Note (FI, as read by agent)", "Labs", "Earlier related visits", "Findings extracted", "Prior 1-yr lung risk", "Posterior lung risk", "Bayesian steps", "Rules met", "Proposed action", "First clock target (days)", "Clock steps", "Would have flagged N days earlier", "Action at that earlier visit", "Source"], rows,
      widths={1: 5, 2: 20, 3: 6, 4: 5, 5: 22, 6: 26, 7: 50, 8: 50, 9: 22, 10: 10, 11: 40, 12: 12, 13: 12, 14: 60, 15: 60, 16: 45, 17: 10, 18: 40, 19: 12, 20: 40, 21: 45}, wrap_cols=(7, 8, 11, 14, 15, 16, 18, 20, 21))
for i in range(2, 2 + len(rows)):
    ws.cell(i, 12).number_format = ws.cell(i, 13).number_format = "0.00%"
    ws.cell(i, 2).fill = SYN

# Sources
S = json.load(open("/tmp/sources.json"))
FIX = {  # corrections after independent fact-check (overnight/CORRECTIONS.md), 14.11.2026
    "kuitunen2026": {"where": "Cancer Medicine 2026;15(5):e71920", "url": "https://doi.org/10.1002/cam4.71920", "note": "Multi-centre prospective cohort: 4 university + 3 secondary hospitals, n = 160, 2014-2020 (not North Ostrobothnia). Tested: median symptom-to-treatment 127 days (public primary care by appointment) vs 76 days (private/occupational), p = 0.027 = 51 days (about 7 weeks); means 201 vs 126. Step values 42/43/77/118/123 vs 72/94/147/204/207 are cumulative step times from Fig. 1 (provider labels as in the AstraZeneca keynote). Does not say 'twice as long'."},
    "yle2025": {"key": "yle2026", "short": "Yle MOT 12.10.2026 (unpublished study)", "where": "Yle MOT 12.10.2026, study coordinated by Kuittinen (unpublished); 20251023 in the URL is an article ID, not a date"},
    "ihe2026": {"url": "https://doi.org/10.2340/1651-226X.2025.42778", "grade": "weak-moderate", "note": "Expert survey (Khalife et al. 2025, doi:10.2340/1651-226X.2025.42778): 42 clinicians, 12 Finnish (8 of 21 regions). Only 1 Finnish respondent reported CT access from primary care; most respondents elsewhere did. IHE renders this as < 10 % vs 90-100 %. Measures respondents, not units; no statistics. IHE dashboard MSD-funded; one Khalife co-author from MSD. GP appointment ~14 d vs 2-7 d (modal answer)."},
    "khalife2025": {"url": "https://doi.org/10.2340/1651-226X.2025.42778"},
    "he159": {"short": "HE 159/2025 (approved, EV 38/2026)", "note": "Approved by Parliament 21.4.2026 (EV 38/2026). Entry into force to be confirmed on Finlex; do not say 'legal since' until checked. Professional decides every action; patient can refuse; access logged."},
    "murphy2015": {"note": "Cluster RCT; triggers flagged abnormal test results without follow-up. Colorectal median 104 vs 200 days; prostate 144 vs 192 d (time at which 40 % evaluated); lung arm 65 vs 93 d, n = 19, p = 0.59 (not significant). Evaluation completed 73.4 % vs 52.2 %. Always say 'colorectal'."},
    "syopa2024": {"note": "Stage available for 42 % of cases nationally; best area (Sisä-Suomi) 60 %. Different year/denominator: the report uses stage missing 61 % (FCR 2019-2023, via IHE) consistently."},
}
for k, f in FIX.items():
    if k in S:
        S[k].update({a: b for a, b in f.items() if a != "key"})
S = {FIX.get(k, {}).get("key", k): v for k, v in S.items()}
rows = [[k, v["short"], f'{v["title"]}. {v["where"]}', v["url"] or None, v["grade"], v["measure"], v.get("note") or None] for k, v in S.items()]
extra = [
    ["fcr2023", "Finnish Cancer Registry 2025", "Cancer in Finland 2023, sec. 12.4 (county tables)", "https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_en.pdf", "strong", "Incidence / survival / mortality by county", "Only significant outliers extractable"],
    ["finke2020", "Finke et al. 2020", "Educational inequalities and regional variation in colorectal cancer survival in Finland. Cancer Epidemiol 2020", "https://doi.org/10.1016/j.canep.2020.101858", "strong", "Survival", None],
    ["filha2026", "Valtakunnallinen keuhkosyöpäohjelma 2026-2035 (preprint)", "Filha, May 2026, citing FCR", "https://www.filha.fi/wp-content/uploads/2026/05/Valtakunnallinen-keuhkosyopaohjelma-2026-2035_180526_preprint.pdf", "moderate", "Survival by education (lung)", "'About' values"],
    ["eucanineq2025", "EU-CanIneq factsheet Finland 2025", "IARC/EC", "https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/factsheets/canineq/2025/EU-CanIneq-fs-Finland.pdf", "strong", "Mortality by education", None],
    ["terve_suomi2024", "THL Terve Suomi 2024", "Tilastoraportti 31/2025, Liitetaulukko 6", "https://www.keusote.fi/wp-content/uploads/2025/05/Tilastoraportti_Terve_Suomi_2024.pdf", "strong", "Self-reported access (unmet need)", None],
    ["engholm2024", "Engholm et al. 2024", "Nordic TNM comparison. Acta Oncol 2024;63:303-312", "https://doi.org/10.2340/1651-226X.2024.35232", "strong", "Data quality (no Finnish TNM)", None],
    ["jarvelin2019", "Järvelin et al. 2019", "Hilmo vs Cancer Registry diagnosis agreement. Suom Lääkäril 2019;74(45)", "https://core.ac.uk/download/270319454.pdf", "strong (old)", "Data quality", None],
    ["hus2026", "HUS waiting list April 2026", "Hoitoa odottavat potilaat erikoisaloittain 2026 huhtikuu", "https://www.hus.fi/sites/default/files/2026-05/hoitoa-odottavat-potilaat-erikoisaloittain-2026-huhtikuu.pdf", "strong", "Waiting time (specialised care queue)", None],
    ["erica2023", "Hamilton et al. 2023 (ERICA protocol)", "BMJ Open 2023;13(3):e065232", "https://doi.org/10.1136/bmjopen-2022-065232", "protocol only", "Stage (planned, not reported)", None],
    ["mdcg2023_1", "MDCG 2023-1", "Health institution exemption, MDR Art. 5(5)", "https://health.ec.europa.eu/system/files/2023-01/mdcg_2023-1_en.pdf", "strong", "Regulation", None],
    ["aiact_omnibus", "Gibson Dunn 2026", "EU AI Act omnibus agreement: postponed high-risk deadlines", "https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/", "moderate", "Regulation", "Provisional agreement, not formally adopted at time of source"],
    ["gdpr22", "GDPR art. 22", "Regulation (EU) 2016/679, Article 22", "https://eur-lex.europa.eu/eli/reg/2016/679/oj", "strong", "Regulation", None],
]
table(sheet("Sources"), ["Key", "Short name", "Citation", "URL", "Evidence grade", "Outcome type", "Note"], rows + extra, widths={1: 18, 2: 34, 3: 70, 4: 50, 5: 14, 6: 30, 7: 60}, wrap_cols=(3, 7))

wb.save(OUT)
print("saved", OUT, [ws.title for ws in wb.worksheets])
