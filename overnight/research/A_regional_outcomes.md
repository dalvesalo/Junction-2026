# A. Regional and socioeconomic differences in Finnish cancer outcomes: research notes

Compiled 2026-11-13 (overnight research agent A). All numbers below come from the cited source. Nothing is estimated. Anything I worked out myself is marked **derived**. CSVs are in `overnight/data/A_*.csv`.

Outcome-type key: **S** = survival, **St** = stage at diagnosis, **M** = mortality, **T** = treatment, **W** = waiting time / process, **I** = incidence.
Evidence grade: **strong** (national register, peer-reviewed or official statistics); **moderate** (single-centre study, secondary citation, or garbled source text); **weak** (survey or expert opinion).

---

## TL;DR for the pitch

1. **In Finland the large, provable gap is between socioeconomic groups. Differences between regions are smaller.** National register data show a **13 percentage-point gap in 5-year survival** between low- and high-education patients (64 vs 77% for men, 65 vs 78% for women). Low-education patients have **10–30% higher odds of stage IV at diagnosis**, less surgery, and **13–22% higher cancer mortality**, even after adjusting for stage, treatment and region.
2. **Regional survival differences in Finland are mostly not statistically significant.** In the Finnish Cancer Registry's (FCR) 2019–2023 county tables, lung-cancer survival is significantly different from the national level in only **one county (Central Finland, men: 23.4% vs 16.2%)**. Prostate survival does not differ significantly in any county. OECD's 2025 profile says survival "does not significantly differ across regions". **Do not claim a large county survival gap. It is not supported.**
3. **County differences do exist in *mortality* and *incidence*.** Examples: male lung-cancer mortality is 66.7 per 100k in Lapland vs 37.6 in Central Ostrobothnia (national 51.7). Colorectal mortality is 26.4 in Kymenlaakso vs 22.3 nationally. These reflect smoking and risk-factor differences more than care quality.
4. **The Nordic gap is real and large for lung cancer.** Finland is last in the Nordics: 5-year lung survival for men is 16.4% vs 26.6% in Norway (2016–20). 1-year survival for men is 43% vs more than 50% elsewhere. Finland has fewer patients at stage I (19.7% vs 30.6% NO). Patients wait longer to see a GP (14 d vs 2–7 d) and are less often seen by a doctor at first contact (40–60% vs 100%).
5. **The data gap is itself a finding.** In the FCR, 61% of cases in 2019–2023 have unknown stage (lung 54%, colorectal 53%). Finland does not register TNM systematically and was excluded from the Nordic TNM paper. **We cannot prove a county-level stage gap from public data. That argues for "pathway-step measurement".**

---

## (a) Table of numbers with sources

### A1. Socioeconomic gaps (national, individual-level register data)

| # | Finding | Value | Population / years | Type | Source | Grade |
|---|---|---|---|---|---|---|
| 1 | 5-yr relative survival, all cancers, low vs high education | Men **64% vs 77%**; women **65% vs 78%** | Finland; FCR "Cancer statistics 2024" (period not stated in profile) | S | OECD/EC *Country Cancer Profile Finland 2025*, sec. 5.2, citing FCR. https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-fi-2024-1666-en.pdf | moderate (secondary citation of FCR; strong underlying data) |
| 2 | 5-yr lung survival by education | Men basic **~13%** vs tertiary **~18%**; women **~20%** vs **~30%** | 2020–2022 | S | *Valtakunnallinen keuhkosyöpäohjelma 2026–2035* preprint (Filha, May 2026), citing FCR data accessed 02.04.2024. https://www.filha.fi/wp-content/uploads/2026/05/Valtakunnallinen-keuhkosyopaohjelma-2026-2035_180526_preprint.pdf | moderate ("about" values) |
| 3 | OR of stage IV at diagnosis, low vs high education, all cancers | Men **1.10** (1.08–1.12); women **1.15** (1.13–1.17) | 469,522 patients aged 30+, diagnosed 2000–2019 | St | Zai X et al. *Disparities in cancer incidence, stage at diagnosis, treatment and mortality across socioeconomic groups in Finland*. BMJ Public Health 2025. DOI 10.1136/bmjph-2025-002829 (PMID 41141305) | strong |
| 4 | OR stage IV by site, low vs high education | Breast (W) **1.30** (1.26–1.35); prostate (M) **1.21** (1.17–1.25); colorectal M 1.10 (1.05–1.15), W 1.09 (1.05–1.15); corpus uteri 1.20; melanoma (W) 1.29 | same | St | Zai 2025 | strong |
| 5 | OR of surgery, low vs high education (adj. for stage) | All solid cancers: M **0.91** (0.90–0.92), W **0.94** (0.92–0.95); NSCLC women **0.85** (0.78–0.93); NSCLC men: not significant | same | T | Zai 2025 | strong |
| 6 | OR of surgery, low vs high **income**, men | **0.79** (0.77–0.80) | same | T | Zai 2025 | strong |
| 7 | HR of cancer-specific mortality, low vs high education (adj. for stage, treatment, region) | Men **1.13** (1.10–1.16); women **1.14** (1.11–1.17); lung (W) **1.22** (1.12–1.33); breast 1.19; colorectal (W) 1.13; prostate 1.12 | same | M | Zai 2025 | strong |
| 8 | Crude treatment rates, high vs low education | Surgery 51 vs 36%; radiotherapy 25 vs 14%; chemo 24 vs 15% | same (unadjusted) | T | Zai 2025 | moderate (unadjusted, confounded by case mix) |
| 9 | Stage missing in registry | **30%** of all cases (2000–2019) | same | data quality | Zai 2025 | strong |
| 10 | CRC 5-yr relative survival by education | Men basic 62 / secondary 64 / high 69%; women 61 / 67 / 71% | 24,462 CRC patients, 2007–2016 | S | Finke I, Seppä K, Malila N, Jansen L, Brenner H, Pitkäniemi J. *Educational inequalities and regional variation in colorectal cancer survival in Finland*. Cancer Epidemiol (online Nov 2020). DOI 10.1016/j.canep.2020.101858 | strong |
| 11 | CRC relative excess risk of death, high vs basic education (adj. for stage, hospital district, municipality) | Men **0.72** (0.64–0.81); women **0.76** (0.59–0.96) | same | S | Finke 2020 | strong |
| 12 | Age-std cancer mortality (40–79 y), primary vs tertiary education | Men **442 vs 272**/100k (~60% higher); women **308 vs 213** (~40% higher) | 2015–2019 | M (population) | EU-CanIneq factsheet Finland 2025. https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/factsheets/canineq/2025/EU-CanIneq-fs-Finland.pdf | strong |
| 13 | Education gap in cancer mortality vs EU | Men 62% (EU 84%); women **43% (EU 37%)**: Finnish women's gap is worse than the EU average | 2015–19 | M | OECD/EC Country Cancer Profile Finland 2025 | strong |
| 14 | Avoidable cancer deaths if everyone had high-education cancer mortality | **4–7%** of deaths in the first 5 y after diagnosis; 8–11% if other-cause mortality is also equalised | Patients diagnosed 1996–2005 (526,143 patients 1971–2005) | M | *Education, survival and avoidable deaths in cancer patients in Finland*. Br J Cancer 2010. DOI 10.1038/sj.bjc.6605861 (PMID 20717112) | strong but dated |
| 15 | Breast screening participation by education | Low **66%** vs high **85%** (2020–21); non-national-language speakers 63% vs 82% | 2020–21 | process (screening) | OECD/EC Country Cancer Profile Finland 2025, citing FCR | strong |
| 16 | Cervical screening by education | Low **51%** vs high **78%** | 2022 | process | same | strong |

### A2. Regional (wellbeing services county / YTA / hospital district) data

| # | Finding | Value | Years | Type | Source | Grade |
|---|---|---|---|---|---|---|
| 17 | County lung survival, men: only significant outlier | **Central Finland 23.4%** vs national **16.2%**; other counties not significantly different | 2019–2023 | S | FCR, *Cancer in Finland 2023*, sec. 12.4 (Tables 19–20). https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_en.pdf | strong (full county table not extractable as text) |
| 18 | County lung survival, women | National 25.6%; **no county significantly different** (per report text) | 2019–2023 | S | FCR Cancer in Finland 2023 | strong |
| 19 | Male lung mortality by county (age-std /100k) | National 51.7; **Lapland 66.7**, Kymenlaakso 59.5 (higher); Central Ostrobothnia 37.6, North Savo 43.9, Pirkanmaa 45.8 (lower) | 2019–2023 | M | FCR Cancer in Finland 2023 | strong |
| 20 | Female lung mortality | National 25.1; Northern Finland YTA 28.6, Southern Finland YTA 27.7 (higher); Eastern Finland YTA 19.9, South Ostrobothnia 20.4 (lower) | 2019–2023 | M | FCR Cancer in Finland 2023 | moderate (county list for YTA garbled in extracted text) |
| 21 | Lung incidence by county | Women: Lapland 45.7, Vantaa–Kerava 45.2, Helsinki 43.6 vs national 35.4; men: Lapland 82.4 vs 63.2 | 2019–2023 | I | FCR Cancer in Finland 2023 | strong |
| 22 | Female lung cancer regional risk ratios | Incidence RR **0.78–1.45**; mortality RR **0.76–1.86** across regions | 2018–2022 | I / M | Keuhkosyöpäohjelma preprint citing FCR *Syöpä 2022* (Pitkäniemi et al. 2024) | moderate (secondary) |
| 23 | Colorectal survival by county | National 69.8%; **Central Uusimaa and Kanta-Häme significantly better** (values in Table 18, not extracted) | 2019–2023 | S | FCR Cancer in Finland 2023 | strong |
| 24 | Colorectal mortality by county | National 22.3; **Kymenlaakso 26.4**, South Ostrobothnia 26.0, Satakunta 25.8, Pirkanmaa 24.6 (higher) | 2019–2023 | M | FCR Cancer in Finland 2023 | strong |
| 25 | Breast cancer by county | Survival national 93.0%, only Central Ostrobothnia significantly better; mortality **Helsinki 32.7** vs national 26.4; North Ostrobothnia 20.1 | 2019–2023 | S / M | FCR Cancer in Finland 2023 | strong |
| 26 | Prostate by county | Survival national 93.8%, **no county significantly different**; mortality higher in North Karelia, Satakunta, Lapland; West Uusimaa 31.6 vs 37.3 | 2019–2023 | S / M | FCR Cancer in Finland 2023 | strong |
| 27 | Regional survival summary | "Estimates do not significantly differ across regions, suggesting that the quality of care is comparable across the country" | 2020–22 | S | OECD/EC Country Cancer Profile Finland 2025, sec. 5.2 | strong |
| 28 | Share of municipal survival variation that lies **within** hospital districts (i.e. primary-care level) | **67%** (95% PI 58–76%) of total; within-district variation **fell 18%** (2–33%) from 1997–2006 to 2007–2016. Significant between-district variation in male melanoma, prostate, kidney and pancreatic cancer | ~700,000 patients, 11 cancers, 2007–2016 | S | Seppä K, Malila N, Pitkäniemi J. *Variation in cancer survival between hospital districts and within them in Finland*. Acta Oncol 2020. DOI 10.1080/0284186X.2020.1772500 | strong (reported as SDs, not best-vs-worst) |
| 29 | Breast survival regional variation | Differences "small (<10 percentage points)" from national average across 23 welfare regions; 5-yr RS 88% → 92% (2000–04 → 2015–19) | 100,046 women, 2000–2022 | S | *Regional variation in breast cancer survival in Finland* (Tampere Univ. Trepo record; authors not retrieved). https://core.ac.uk/outputs/670502026 | moderate (abstract only) |
| 30 | Lung cancer: only 27% get curative-intent treatment; stage missing for ~half; county comparison exists but numbers not retrieved | 27% | 2019–2023 | T / data | Syöpäjärjestöt / national cancer quality register lung report (via Verkkouutiset); report: https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html | moderate (news summary; **county values not retrieved**) |
| 31 | Lung: Northern and Eastern Finland use more radiotherapy and drug therapy and less surgery (qualitative) | n/a | 2018 | T | Paappanen V et al. Acta Oncol 2025. DOI 10.2340/1651-226X.2025.43398 | weak (qualitative) |
| 32 | Breast screening by county | Helsinki **73%** (lowest) vs Åland **86%**; national 82% (2023) | 2017–21 / 2023 | process | OECD profile 2025; IHE dashboard 2026 | strong |
| 33 | Screening activity ranking 2024 | Highest: South Ostrobothnia (+13 pts vs national), South Savo, Kainuu. Lowest: **Helsinki (−13 pts)**, Vantaa–Kerava, West Uusimaa | 2024 | process | Syöpäjärjestöt press release 30.6.2026 citing FCR screening annual reports | moderate |
| 34 | Hilmo vs Cancer Registry diagnosis agreement by hospital district (data quality) | National 91.7% same diagnosis; **South Ostrobothnia 88.0%** (9.0% missing in Hilmo) vs South Karelia 93.2% (3.8%) | 2014 cases | data quality | Järvelin J et al. Suom Lääkäril 2019;74(45), Liitetaulukko 2. https://core.ac.uk/download/270319454.pdf | strong (old) |
| 35 | Prostate mortality variation between municipalities | SD 9.0/100k (2005–09) → **2.4** (2015–19); incidence SD up to 56.5 (2000–04). Lower mortality in higher-education municipalities | 123,185 men, 1985–2019 | M / I | Seikkula H, Kaipia A, Boström PJ, Malila N, Pitkäniemi J, Seppä K. Acta Oncol 2022. DOI 10.1080/0284186X.2022.2112971 | strong |
| 36 | CRC surgery in non-academic vs academic hospitals | 5-yr all-cause mortality aHR **1.07** (1.04–1.11); no difference in curative-intent sensitivity analysis | 49,032 resections, 1987–2016 | M | Sarjanoja E et al. Sci Rep 2026. DOI 10.1038/s41598-026-38347-4 | strong (small effect) |

### A3. Nordic benchmark (lung and NHL focus)

| # | Finding | Value | Years | Type | Source | Grade |
|---|---|---|---|---|---|---|
| 37 | 5-yr lung relative survival | Men **FI 16.4%** vs NO 26.6% (best); women **FI 25.5%** vs NO 33.2%. Finland worst of DK/FI/NO/SE | 2016–2020 | S | Tichanek F, Försti A, Hemminki O, Hemminki A, Hemminki K. *Survival in Lung Cancer in the Nordic Countries Through A Half Century*. Clin Epidemiol 2023;15:503–510. DOI 10.2147/CLEP.S406606 | strong |
| 38 | 1-yr lung survival | Men **FI 43%** vs >50% elsewhere; women FI 52.4% vs ~60% | 2016–2020 | S | Tichanek 2023 | strong |
| 39 | 5-yr lung survival, men, trend | FI 9.7% (1998–2002) → **16.7%** (2018–22); DK 8.9% → 26.2%; SE 26.8%; NO 28.2%; IS 28.4% (2018–22) | 1998–2022 | S | Khalife G et al. Acta Oncol 2025;64:734–741, DOI 10.2340/1651-226X.2025.42778; Paappanen V et al. Acta Oncol 2025, DOI 10.2340/1651-226X.2025.43398 | strong |
| 40 | **Denmark went from below Finland to +9.5 pp above it in 20 years** (derived: 26.2 − 16.7) | Denmark is the "it is fixable" example | 1998–2022 | S | **derived** from #39 | strong (derived) |
| 41 | Lung stage at diagnosis | Stage I: **FI 19.7%** vs NO 30.6%, SE 25.8%. Stage I–IIIA: FI 39.5% vs NO 48.7%, SE 50.4%, DK 44.0% | FI 2018 (5 hospitals, n=545) vs national registries | St | Paappanen 2025 | moderate (FI figure is a cohort) |
| 42 | Lung surgery share of all patients | FI **11.8%** (FCR) vs NO 26.6%, DK 26.0% | 2018 | T | Paappanen 2025 | moderate |
| 43 | Lung stage IV share, single centre | **59.5%** (2013–19), unchanged from 57.8% (2007–12); 5-yr OS 17.8% | Tampere UH (Pirkanmaa) | St | Ahvonen J, Luukkaala T, Laitinen T, Jukkola A. Acta Oncol 2023;62:571–578. DOI 10.1080/0284186X.2023.2213444 | moderate |
| 44 | Lung pathway intervals (modal expert answers) | Health-centre appointment **FI 14 d** vs 2–7 d; specialist after GP **2–4 wk** vs 1–2 wk; doctor at first contact **40–60%** vs 80–100%; only 1 of 8 Finnish regions reported primary-care CT access | 2023–24 survey, 8 of 21 Finnish regions | W | Khalife 2025 | weak–moderate (survey) |
| 45 | Finland, all cancers | Lowest 5-yr survival in Nordics: **men 69%, women 73%** | 2019–2023 | S | IHE *Cancer Dashboard Finland* (Malmberg & Hofmarcher, Feb 2026; MSD-funded), citing NORDCAN. https://ihe.se/app/uploads/2026/04/IHE-Cancer-Dashboard-Finland_.pdf | strong (data); note funder |
| 46 | Cancers where Finland is **significantly** lowest in Nordics | Men: **lung, NHL, myeloma, CLL**. Women: lung, MPD, CLL | 2016–2020 | S | Hemminki K, Karihtala P, Hemminki A. Suom Lääkäril 2024;79:e40201 | strong (numeric NHL values not retrieved) |
| 47 | Haematological malignancies | "FI tended to be the lowest" in 2015–2019; FI CLL 5-yr just over 80% vs 95% DK/NO women; country differences small for NHL | 1970–2019 | S | Hemminki K et al. Leukemia 2023;37:854–863. DOI 10.1038/s41375-023-01852-w | strong |
| 48 | Large B-cell lymphoma, Finland | 5-yr OS **50.0%** (48.7–51.3) vs matched controls 82.6%; 1-yr OS 67.4% | Diagnosed 2008–2019 | S (overall) | Anttalainen A et al. Acta Oncol 2025;64:303–311. DOI 10.2340/1651-226X.2025.42539 | strong (no Nordic comparator in paper) |
| 49 | CT scanners per 100k | FI 17, SE 28, NO 30, DK 44 | 2021 | resource | Tichanek 2023 citing OECD | strong |
| 50 | Unknown stage in FCR | **61%** of all cases; breast 35%, lung 54%, colorectal 53%, melanoma 87% | 2019–2023 | data quality | IHE dashboard 2026 citing FCR | strong |
| 51 | Finland TNM | "No TNM data were available from Finland"; TNM "not registered systematically" | 2004–2016 | data quality | Engholm G et al. Acta Oncol 2024;63:303–312. DOI 10.2340/1651-226X.2024.35232 | strong |

---

## (b) Strongest gap we can prove

**1. Socioeconomic gap: the strongest finding. Use it as the equity headline.**
- Low-education patients in Finland have **5-year survival of 64–65% vs 77–78%** for high-education patients, a gap of about 13 percentage points (FCR via OECD 2025). Outcome: survival.
- Low-education patients are diagnosed **later** (stage IV OR 1.10 men / 1.15 women; breast 1.30) and are **operated on less** (OR 0.91 / 0.94; lung surgery in women 0.85; low-income men 0.79). They **die more** even after adjusting for stage, treatment and region of residence (HR 1.13 / 1.14; lung in women 1.22) (Zai et al. 2025, n = 469,522). Outcomes: stage, treatment, mortality. Grade: strong.
- For lung specifically, 5-year survival is ~13% vs ~18% (men) and ~20% vs ~30% (women) by education (2020–22, FCR via Filha preprint). Grade: moderate.
- For the pitch: there is no individual-level education data at the county level. The county-level proxies are screening participation (Helsinki 73% vs Åland 86%) and the share of low-education residents in each county.

**2. Nordic lung gap: the strongest "benchmark" finding (fits the Pathway Gap Finder concept directly).**
- Finland's 5-year lung survival for men is **16.4–16.7% vs 26–28%** in DK/NO/SE/IS. Finland is last, and **Denmark overtook Finland by ~9.5 pp in 20 years** (derived). The gap is already visible at **1 year** (43% vs >50%), which points to diagnosis and early treatment rather than late care. Fewer patients are at stage I (19.7% vs 30.6% in NO), and fewer are operated on (11.8% vs ~26%). The GP step is slower (14 d vs 2–7 d) and patients are less often seen by a doctor at first contact. Grade: strong for survival, moderate for stage and treatment, weak–moderate for pathway intervals.

**3. Regional (county) gap: be honest, it is mainly mortality and incidence, not survival.**
- In 2019–2023 county tables, lung survival differs significantly in only one county (Central Finland, men: **23.4% vs 16.2%** nationally). This is the single best regional survival gap we can cite.
- Mortality and incidence gaps are real: male lung mortality is **66.7 (Lapland) vs 37.6 (Central Ostrobothnia)** per 100k against 51.7 nationally. These reflect smoking history as much as care.
- Two-thirds of the municipal variation in survival sits *within* hospital districts, i.e. at the primary-care level (Seppä 2020). This supports per-health-centre referral feedback over county-vs-county league tables.

**Recommended framing:** "Finland's gap is in *who* gets diagnosed early (education and income) and *how fast* the first steps happen (Nordic benchmark), not mainly in *where* you live. Counties cannot see this today because 54% of lung cancers have no stage recorded."

---

## (c) Data we looked for but could not find

- **Full county tables (Tables 16–20) and maps (Figs 34–38) of *Cancer in Finland 2023*.** These hold county-level incidence, 5-yr survival and mortality for prostate, breast, colorectal and lung (women and men). The PDF is reachable, but the table values were not extractable as text. Download the PDF manually and read pages 67–71. Only significant outliers (above) are captured.
- **Lung cancer quality register report (keuhkosyöpäraportti) with county values** (curative-treatment %, stage completeness by county, 2019–2023). The URL is known, but my fetch tool could not open it. The THL press release ("Keuhkosyövän toteamisessa on eroja hyvinvointialueiden välillä") was also blocked. **Highest-value item to fetch manually.**
- **Stage distribution by county** (localised / distant / unknown) for any cancer: not found in any public source. FCR does not publish it in the annual report text, and the statistics app (Shiny, https://tilastot.syoparekisteri.fi/syovat/?_inputs_&language=%22en%22) could not be queried by my tools.
- **Survival by education per county or YTA:** not found.
- **Best-vs-worst county survival difference and "excess deaths if all counties matched the best":** not found for recent years. Seppä 2020 reports only SDs. A 2010 BJC study gives avoidable deaths by *education* (4–7%), not by region.
- **Numeric NHL 5-yr survival, Finland vs Nordics:** Hemminki 2024 (Lääkärilehti) says Finland is significantly lowest for men, but the PDF was not accessible. Get it from NORDCAN directly (https://nordcan.iarc.fr), or from Hemminki K et al. Blood Cancer J 2022 (DOI 10.1038/s41408-022-00728-z, figures only).
- **Emergency-route diagnosis in Finland:** no Finnish or Nordic-comparable figure found. Finland is not in ICBP Module 9 (McPhail et al. 2022). No Finnish register study of the emergency-presentation share was found.
- **Stage IV share Finland vs Nordics from national registries:** not available because Finland does not register TNM systematically (Engholm 2024). Only cohort figures exist (Paappanen 2025, Ahvonen 2023).
- **Full text of Seppä 2020 and Finke 2020** (hospital-district random-effect estimates): paywalled or blocked. Only the abstracts were used.

---

## (d) Downloadable files / URLs to fetch later

| What | URL | Note |
|---|---|---|
| Cancer in Finland 2023 (PDF, county tables pp. 67–71) | https://syoparekisteri.fi/assets/files/2025/06/Syopa_2023_en.pdf | Tables as images or complex layout; read manually |
| Cancer in Finland 2022 (PDF) | https://syoparekisteri.fi/assets/files/2024/06/Cancer_2022_EN.pdf | Regional risk ratios, survival by education (per Filha citation) |
| Cancer in Finland 2024 (HTML) | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/cancer_in_finland_2024.html | Not fetched |
| Syöpä 2022 tilastoraportti (Finnish HTML) | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/syopa_2022_tilastoraportti.html | Fetch failed |
| Lung cancer quality report (county comparisons) | https://syoparekisteri.fi/assets/themes/ssy3/factsheets/keuhkosyoparaportti.html | **Priority** |
| FCR statistics app (download selected tables) | https://tilastot.syoparekisteri.fi/syovat/?_inputs_&language=%22en%22 | Shiny app; manual CSV export |
| FCR screening annual reports (county participation) | https://syoparekisteri.fi/raportit-ja-katsaukset/seulontojen-vuosiraportit/ | |
| CRC screening annual report 2022 (PDF) | https://syoparekisteri.fi/assets/files/2024/12/Annual-report-on-colorectal-cancer-screening-2022.pdf | |
| NORDCAN (survival by country, CSV export) | https://nordcan.iarc.fr | For NHL and lung Nordic numbers |
| EU-CanIneq Finland factsheet | https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/factsheets/canineq/2025/EU-CanIneq-fs-Finland.pdf | |
| OECD Country Cancer Profile Finland 2025 (EN) | https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-fi-2024-1666-en.pdf | |
| Zai 2025 MPIDR working paper version (may have supplementary tables) | https://www.demogr.mpg.de/papers/working/wp-2025-016.pdf | |
| Zai 2025 BMJ PH supplementary file | https://doi.org/10.1136/bmjph-2025-002829 | Supplement has income results, missing-stage analysis |

No direct CSV/XLSX links were found. Every source above is a PDF, HTML page or interactive app.

## CSV files written
- `overnight/data/A_county_outcomes_FCR_2019_2023.csv`: county and YTA values stated in *Cancer in Finland 2023* (significant outliers and national reference values only).
- `overnight/data/A_ses_gaps_finland.csv`: education and income gaps (survival, stage, treatment, mortality).
- `overnight/data/A_nordic_benchmark.csv`: Finland vs Nordics (lung, all cancers, LBCL).
- `overnight/data/A_hilmo_fcr_diagnosis_agreement_by_hospital_district_2014.csv`: data-quality table by hospital district (useful for the "data quality and transparency" criterion).
