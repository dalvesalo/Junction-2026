import json, datetime, os
IMG = dict(river="/_blob/6d256670c532ab156209cc6c6d6ae41a", agent="/_blob/7af55f19ad64b0a2e876fd29c2815258",
  reason="/_blob/47a18937f47f82799df5f72368ef2a43", note="/_blob/7e000f0718199d9c05dee215ed65e121",
  county="/_blob/c5f90bc3f53d4ad70ee9fe6fe7317d80", ctable="/_blob/382d74eea6a70fa026197170f900082c",
  impact="/_blob/0d8ccec171839fc03498967c56cd73a4", runbar="/_blob/2a308f08ffb93bce1c088eeb44fa5081")
S = []
FILL={"born","who","stakes","mechanism","local","solution","evidence","impact","recs","honest","ask"}
def slide(id, cls, body, notes, src=None, trans="fade"):
    if id in FILL and "</h2>" in body:
        a,b = body.split("</h2>",1); body = a+"</h2>\n<div class=\"fill\">"+b+"\n</div>"
    srcp = f'<p class="source">{src}</p>' if src else ''
    pad = ' style="padding:128px 128px 160px"' if src else ''
    S.append((id, f'<section id="{id}" class="{cls}" data-transition="{trans}"{pad}>\n{body}\n{srcp}\n<aside>{notes}</aside>\n</section>\n'))

slide("cover","dark cover",'''<div class="cover-wrap">
<p class="eyebrow mint">Junction 2026 · AstraZeneca challenge · Goal 3</p>
<h1 class="wordmark">Ajoissa<span class="mint">.</span></h1>
<p class="lead serif">Same symptom, same speed — whichever door you walk in.</p>
<p class="meta">A safety-net agent for Finland’s public primary care · Brainwave Bandits</p>
</div>''', "STAGE. (5 s) Ajoissa means ‘in time’. Hold a beat on the title before speaking.")

slide("hook","dark",'''<p class="eyebrow berry">Diffuse large B-cell lymphoma · 7 Finnish hospitals · n = 160</p>
<h2>Two patients. Same lymphoma. Seven weeks apart.</h2>
<img class="shot" src="%s" alt="Cumulative step times: public primary care route reaches treatment at day 207, occupational route at day 123; median gap 51 days." style="width:1240px;height:618px;object-fit:contain">''' % IMG["river"],
"STAGE (25 s). Two Finns notice the same lump. One has occupational health care, one doesn’t. Across seven Finnish hospitals, the median wait from symptom to treatment was 76 days through occupational or private care — and 127 through public primary care. Seven weeks. And look where the gap opens: by the specialist visit it is already there; from there both routes take three to five days. The delay is born in primary care.",
src="Kuitunen et al., Cancer Medicine 2026;15(5):e71920 — median 127 vs 76 days, p = 0.027; chart = cumulative step times (Fig. 1) · moderate · waiting time")

slide("born","light",'''<p class="eyebrow berryd">Where the gap emerges</p>
<h2>The delay is born before the specialist</h2>
<div class="steps">
<div class="step"><p class="num">+30</p><p class="lbl">first contact</p></div>
<div class="step"><p class="num">+51</p><p class="lbl">physician visit</p></div>
<div class="step"><p class="num">+70</p><p class="lbl">referral</p></div>
<div class="step hot"><p class="num">+86</p><p class="lbl">specialist visit</p></div>
<div class="step calm"><p class="num">+84</p><p class="lbl">treatment start</p></div>
</div>
<p class="body serif">Extra days on the public route at each step (cumulative step times, Fig. 1). After the specialist the gap stops growing: hospitals are not the bottleneck — the public front door is. The national roadmap describes the same pattern from another, unpublished lymphoma study.</p>''',
"APPENDIX / Q&A. Gap per step from the paper’s Fig. 1 (cumulative step times; values close to the means 201 vs 126). Tested result: medians 127 vs 76 days, p = 0.027. Small n (160).",
src="Kuitunen et al. 2026 (Fig. 1) · National Cancer Strategy roadmap 2026–2031, p. 12 · moderate · waiting time")

slide("who","light",'''<p class="eyebrow berryd">Who pays for the slow door</p>
<h2>It lands on those who can’t skip the queue</h2>
<div class="cols2">
<div><p class="huge2 berryd">64 % vs 77 %</p><p class="body">5-year cancer survival, men with basic vs higher education (women: 65 % vs 78 %).</p></div>
<div><ul class="facts">
<li>Less-educated patients: <b>more stage IV</b>, <b>less surgery</b>, <b>13–14 % higher cancer-specific mortality</b> in a national register study.</li>
<li>Occupational care covers <b>92 % of wage earners</b>. Retired, unemployed and low-income people use the public door.</li>
</ul></div></div>''',
"STAGE (15 s). And it isn’t random who uses which door. Occupational care covers 92% of wage earners — so the public door serves the retired, the unemployed, the low-paid. Separately, Finnish registry data shows survival 13 points lower for less-educated patients, with more late-stage diagnoses. Two findings, one direction: Goal 3’s equity problem.",
src="OECD/EC Country Cancer Profile Finland 2025 (FCR data) · Zai et al., BMJ Public Health 2025 (n = 469,522) — strong · Kela 2026")

slide("stakes","dark",'''<p class="eyebrow mint">Goal 3 · lung cancer</p>
<h2>Finland has the Nordics’ lowest lung-cancer survival. It is fixable.</h2>
<div class="cols2">
<div class="kpi"><p class="huge2">16.4 %</p><p class="body">Finland, men, 5-year survival<br>Norway: 26.6 % · strategy target: +14 pp</p></div>
<div class="kpi"><p class="huge2 mint">8.9 → 26.2 %</p><p class="body">Denmark’s men in 20 years — from below Finland (9.7 → 16.7 %)</p></div>
</div>
<p class="body serif soft">Only 27 % of Finnish lung-cancer patients reach curative treatment. Stage I: 19.7 % in Finland vs 30.6 % in Norway.</p>''',
"STAGE (15 s). The strategy’s Goal 3 asks for 14 more percentage points of lung-cancer survival. Denmark did more than that in twenty years. It started below us.",
src="Tichanek et al., Clin Epidemiol 2023 (NORDCAN) · Khalife et al., Acta Oncol 2025 — strong · FCR lung report 2026; Paappanen 2025 — moderate")

slide("mechanism","light",'''<p class="eyebrow berryd">Why the door is narrow</p>
<h2>Four facts about the public front door</h2>
<div class="grid4">
<div class="card"><p class="num2">3 months</p><p class="body">legal wait for non-urgent adult primary care since 1.1.2025</p></div>
<div class="card"><p class="num2">14 d vs 2–7</p><p class="body">to a GP in Finland vs other Nordic countries</p></div>
<div class="card"><p class="num2">&lt; 10 %</p><p class="body">of Finnish primary-care units can order a CT, per a Nordic expert survey (elsewhere: 90–100 %)</p></div>
<div class="card"><p class="num2">3–4 months</p><p class="body">of rising visits before a colorectal diagnosis; 65 % of hospital stays start as emergencies</p></div>
</div>''',
"STAGE (15 s). Since January 2025, an adult’s legal right is a primary-care visit within three months. A GP visit takes two weeks. According to Nordic experts, few health centres can order a CT. So patients come back, again and again — Finnish data shows visits rising for months before a cancer is found.",
src="HE 134/2024 (strong) · IHE Cancer Dashboard Finland 2026 / Khalife 2025 expert survey, 42 clinicians (weak–moderate) · Hermiö et al., BMC HSR 2023 (strong)")

slide("invisible","berry",'''<h2 class="statement">Nobody measures the wait between a symptom and a cancer diagnosis.</h2>
<p class="body light-soft">The strategy says this data “is not collected systematically”. Stage is missing for 61 % of cancers diagnosed in 2019–2023. Cancer target times are not published by county — Denmark publishes them by region every quarter.</p>''',
"STAGE (10 s). And here’s the real problem: none of this is measured. You cannot shorten a wait you do not see.",
src="National Cancer Strategy 2026–2035, 2.5 · Finnish Cancer Registry · Sundhedsstyrelsen 2025")

slide("local","light",'''<p class="eyebrow berryd">Where a county can act</p>
<h2>The variation is local — at the health-centre level</h2>
<div class="cols2">
<div><p class="huge berryd">67 %</p><p class="body">of the variation in cancer survival between Finnish municipalities lies <b>inside</b> hospital districts, not between them.</p></div>
<div><p class="body">Survival differences between counties are mostly not statistically significant. The differences that matter sit closer to the patient: in which health centre, which door, which week.</p><p class="body"><b>So the fix belongs to the county — per health centre — not to a national reform that is years away.</b></p></div>
</div>''',
"APPENDIX / Q&A. Why we target health centres not counties. Honest point: county survival gaps are small; within-district variation dominates.",
src="Seppä et al., Acta Oncol 2020 — strong · Finnish Cancer Registry, Cancer in Finland 2023; OECD 2025")

slide("solution","dark",'''<p class="eyebrow mint">Our solution</p>
<h2>Ajoissa: a safety net for public primary care</h2>
<div class="flow">
<div class="fstep"><p class="fh">Read</p><p class="fb">Overnight: results nobody followed up (lung, bowel, prostate), labs, visit notes (FI/EN) — the county’s own records</p></div>
<div class="fstep"><p class="fh">Weigh</p><p class="fb">Bayesian risk: smoking-history prior × published symptom likelihood ratios</p></div>
<div class="fstep"><p class="fh">Match</p><p class="fb">Explicit referral rules (3 % threshold) — the criteria roadmap 2.5.2 will standardise</p></div>
<div class="fstep"><p class="fh">Act</p><p class="fb">A named nurse’s worklist: one proposed action, a reason, a source</p></div>
<div class="fstep mintb"><p class="fh">Track</p><p class="fb">A pathway clock until diagnosis or all-clear. Overdue? Back on top.</p></div>
</div>
<p class="body serif soft">Deterministic: same record, same answer. A professional decides every action. Nothing is sent to a patient automatically.</p>''',
"STAGE (20 s). So we built Ajoissa — ‘in time’. Every night it reads the health centre’s own records, weighs the cancer signals with published evidence, and puts the patients whose signals have stalled on a named nurse’s list, with the reason and the source. Then it runs a clock until each one is diagnosed or cleared. A human decides every step.")

slide("demo","dark",'''<p class="eyebrow mint">Live demo · synthetic patients</p>
<h2>Monday morning at the health centre</h2>
<img class="shot" src="%s" alt="Ajoissa worklist: Matti K., 64, third visit for the same cough; the note with findings highlighted; the agent's reasoning: read, weigh, match, act." style="width:1380px;height:682px;object-fit:contain">''' % IMG["agent"],
"STAGE (30 s) — switch to the LIVE DEMO here if possible. Matti, 64, smoker, third visit for the same cough. Ajoissa read the Finnish note — weight loss, poor appetite, and it understood ‘no blood’ as a negative. Risk 0.9 % → 21.5 %, four rules met. Proposed action: direct thorax CT. The nurse approves; the clock starts.",
src="All patients synthetic. Risk method: PLCOm2012 (Tammemägi, NEJM 2013) × LR+ (Hamilton 2005; Iyen-Omofoman 2013) · rules after NICE NG12")

slide("earlier","dark",'''<p class="eyebrow mint">Re-running the same rules on his past visits</p>
<div class="cols2">
<div><p class="huge mint">35 days</p><h3>earlier.</h3><p class="body">At Matti’s second visit — “cough continues, antibiotics” — Ajoissa would already have put him on the list for chest imaging. Nobody did anything wrong. Nobody had the whole picture.</p></div>
<img src="%s" alt="Matti's note with findings highlighted and his two earlier visits: 70 and 35 days ago." style="width:760px;height:843px;object-fit:contain">
</div>''' % IMG["note"],
"STAGE (15 s). And this is the moment that matters: run the same rules on his history, and he would have been on the list 35 days earlier. Nobody did anything wrong. Nobody had the whole picture.")

slide("county","light",'''<p class="eyebrow berryd">For the county’s cancer lead</p>
<div class="cols2 wide">
<div><h2>The clocks become the missing data</h2><p class="body">Every tracked patient leaves timestamps. Added up: median days per step, per health centre, every week — the measurement the strategy says does not exist.</p><p class="body">Overdue clocks escalate automatically.</p></div>
<img src="%s" alt="County view: median days per step for health centre A, a table of six health centres, and open pathway clocks with on-time and overdue statuses (synthetic)." style="width:780px;height:824px;object-fit:contain">
</div>''' % IMG["county"],
"STAGE (10 s). Every clock leaves timestamps. Together they are the data Finland doesn’t have: how many days each step takes, in each health centre, this week.",
src="Health-centre data shown are synthetic")

slide("evidence","light",'''<p class="eyebrow berryd">Why we believe it works — and why now</p>
<h2>Proven pattern. Legal now. Already done once.</h2>
<div class="grid3">
<div class="card"><p class="num2">200 → 104 d</p><p class="body">Randomised trial: EHR triggers for un-followed abnormal results + a human reviewer halved time to colorectal work-up; completed evaluations 52 % → 73 %. (Lung arm too small to show an effect.)</p><p class="tag">Murphy et al., JCO 2015 · strong · time</p></div>
<div class="card"><p class="num2">Approved 2026</p><p class="body">Parliament approved (April 2026) letting a county use its own records to find health problems early. The professional decides; the patient may refuse.</p><p class="tag">HE 159/2025 → EV 38/2026 · in-force date to confirm</p></div>
<div class="card"><p class="num2">Done before</p><p class="body">Päijät-Häme’s AINO tool already finds kidney-disease risk patients this way — list → nurse → doctor — with AstraZeneca’s support.</p><p class="tag">Päijät-Häme 12.3.2026</p></div>
</div>''',
"STAGE (20 s). Does it work? In a randomised trial, the same pattern — automatic trigger on un-followed results, human review — halved the time to colorectal work-up. Is it allowed? Parliament approved it this April: counties may use their own records to find problems early. Has it been done? Päijät-Häme already runs this model for kidney disease — with AstraZeneca’s support.")

slide("impact","dark",'''<p class="eyebrow mint">Päijät-Häme, year one — a model, every assumption adjustable in the demo</p>
<h2>What it buys, and what it costs</h2>
<div class="grid3">
<div class="kpi"><p class="huge mint">≈ 66</p><p class="body">lung-cancer patients a year on a faster route (of ≈ 110), if every flag gets a slot</p></div>
<div class="kpi"><p class="huge mint">≈ 21 d</p><p class="body">earlier to diagnostic imaging per flagged patient</p></div>
<div class="kpi"><p class="huge amber">0–42</p><p class="body">imaging slots a week: 0 for follow-ups already due; the region sets the rest</p></div>
</div>
<p class="body soft">We do <b>not</b> claim a stage or survival effect: the UK trial built to test that has not reported. The pilot measures it.</p>''',
"APPENDIX / Q&A. Model for Päijät-Häme (205,000 people): national incidence rate; 60 % flagged (Schut 2025); 50 % cut of a 41-day interval (Murphy 2015; 41 d is an unpublished Finnish figure). Ranges in the app.",
src="Model · Schut et al., BJGP 2025 (moderate) · Murphy et al. 2015 (colorectal) · Yle MOT 12.10.2026 (unpublished study, weak)")

slide("recs","light",'''<p class="eyebrow berryd">Recommendations</p>
<h2>What a county can do on Monday</h2>
<table class="recs">
<tr><th style="width:40%">Action</th><th style="width:22%">Owner</th><th style="width:20%">Evidence</th><th style="width:18%">County alone?</th></tr>
<tr><td>Switch on Ajoissa in 3 health centres: chase results nobody followed up (lung, bowel, prostate)</td><td>Chief physician, primary care</td><td>Strong (RCT, time)</td><td>Yes</td></tr>
<tr><td>Name a fixed number of existing CT slots for the agent’s strongest symptom flags</td><td>Imaging lead</td><td>Weak–moderate</td><td>Yes, no new capacity</td></tr>
<tr><td>Publish step times per health centre monthly</td><td>County cancer lead</td><td>Moderate</td><td>Yes</td></tr>
<tr><td>Phase 2: calibrated risk scoring (MDR route)</td><td>County + FICAN</td><td>Moderate (detection)</td><td>Needs QMS</td></tr>
<tr><td>National referral criteria + published pathway times</td><td>STM, FICAN, THL</td><td>Moderate</td><td>No — national</td></tr>
</table>''',
"APPENDIX / Q&A. Tracker-only phase 1 likely not a medical device (our reading of MDCG 2019-11, not legal advice); risk scoring = class IIa.")

slide("ask","mint",'''<h2 class="statement dark-text">Päijät-Häme. Three health centres. Six months.</h2>
<div class="grid3 dark-text">
<div><p class="num3">≤ 7 days</p><p class="body">from flag to a decision, for every flag</p></div>
<div><p class="num3">Days</p><p class="body">from flag to imaging, per health centre</p></div>
<div><p class="num3">Share</p><p class="body">of cancers diagnosed via a tracked route</p></div>
</div>
<p class="body dark-text" style="margin-top:1.2em">Where the same list → nurse → doctor model already runs for kidney disease (AINO, with AstraZeneca) · about €28,000 · one nurse, 45 minutes a day, per health centre · no new scanners</p>''',
"STAGE (15 s). Our ask: Päijät-Häme. They already run this exact model for kidney disease — a list from their own records, a nurse, a doctor — with AstraZeneca. We extend it to cancer: three health centres, six months, about 28,000 euros, one nurse, 45 minutes a day. We measure three things. And at the end, Finland has its first real numbers for the wait between a symptom and a diagnosis.")

slide("honest","light",'''<p class="eyebrow berryd">Data quality and transparency</p>
<h2>What is real, what is modelled, what is invented</h2>
<div class="grid3">
<div class="card"><p class="num2 tealtxt">Real</p><p class="body">Nordic survival, education gap, DLBCL route timing, county access (THL, March 2024), legal changes — each with source and grade.</p></div>
<div class="card"><p class="num2 bluetxt">Modelled</p><p class="body">Impact numbers. Risk estimates use UK likelihood ratios and PLCOm2012 — both need recalibration on Finnish data.</p></div>
<div class="card"><p class="num2 ambertxt">Synthetic</p><p class="body">All patients, health centres and timestamps in the demo. Tagged on every screen.</p></div>
</div>''',
"APPENDIX / Q&A. Limitations: DLBCL values read from a slide; county access data is pre-2025; 41-day lung interval unpublished.")

slide("close","dark cover",'''<div class="cover-wrap">
<h1 class="wordmark">Ajoissa<span class="mint">.</span></h1>
<p class="lead serif">In time — for everyone, whichever door they walk in.</p>
<p class="meta">Demo: claude.ai/artifact/WBcU1hw4dpagfNVUQ2Ec3x · Code: github.com/dalvesalo/Junction-2026</p>
</div>''',
"STAGE (5 s). Same symptom, same speed — whichever door you walk in. Thank you.")

slide("refs","light",'''<p class="eyebrow berryd">Key sources</p>
<div class="refs">
<p>Kuitunen et al. Cancer Medicine 2026;15:e71920 · Tokola et al. Cancer Medicine 2025</p>
<p>Tichanek et al. Clin Epidemiol 2023;15:503 · Khalife et al. Acta Oncol 2025;64:734 · Paappanen et al. Acta Oncol 2025;64:909</p>
<p>Zai et al. BMJ Public Health 2025 · OECD/EC Country Cancer Profile Finland 2025 · Seppä et al. Acta Oncol 2020</p>
<p>Hermiö et al. BMC Health Serv Res 2023;23:279 · Lyratzopoulos et al. Lancet Oncol 2012 · Pearson et al. BMJ Open 2020</p>
<p>Murphy et al. J Clin Oncol 2015;33:3560 · Schut et al. Br J Gen Pract 2025 · Bailey et al. Br J Gen Pract 2017</p>
<p>Hamilton et al. Thorax 2005; Okoli et al. PLoS One 2018 · Tammemägi et al. NEJM 2013 (PLCOm2012) · NICE NG12</p>
<p>National Cancer Strategy 2026–2035 & roadmap 2026–2031 · HE 134/2024 · HE 159/2025, EV 38/2026 · THL Avohilmo; Terve Suomi 2024</p>
<p>IHE Cancer Dashboard Finland 2026 · Sundhedsstyrelsen 2025 · Päijät-Häme AINO release 12.3.2026 · Finnish Cancer Registry</p>
</div>''', "APPENDIX. Full reference list with DOIs is in the project report and the app’s Sources view.")

order=[i for i,_ in S]
for i,h in S: open(f"project/slides/{i}.html","w").write(h)
deck={"v":5,"createdOnFiles":{"v":1,"at":datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")},"lists":"css","format":{"v":1,"shared":["project/deck.css"]},
 "title":"Ajoissa — pitch deck (Brainwave Bandits, Junction 2026)","order":order,"cover":"cover",
 "sections":{"s1":{"description":"The gap: where and for whom the delay emerges","start":"hook"},"s2":{"description":"The solution: Ajoissa safety-net agent and demo","start":"solution"},"s3":{"description":"Evidence, impact, recommendations and the ask","start":"evidence"},"s0":{"description":"Title","start":"cover"},"s4":{"description":"Transparency and sources","start":"honest"}},
 "faces":{"archivo":{"family":"Archivo","href":"https://fonts.googleapis.com/css2?family=Archivo:wght@400..800&display=swap"},"source-serif-4":{"family":"Source Serif 4","href":"https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400..700;1,400..700&display=swap"}},
 "designSystems":[]}
json.dump(deck,open("project/deck.json","w"),ensure_ascii=False,indent=1)
print(order)
