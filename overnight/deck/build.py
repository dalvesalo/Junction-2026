import json, datetime, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
IMG = {k: v[0] for k, v in json.load(open("assets.json")).items()}   # name -> /_blob/ id (files in img/)
# Speaker notes copied from overnight/PITCH-SCRIPT.md (v2, 14.11); they replace the inline notes below.
NOTES = {
 "cover": "STAGE (4 s). Ajoissa. Finnish for \"in time\". Hold a beat on the title.",
 "hook": "STAGE (24 s). Two Finns notice the same lump. One has occupational health care, one goes to the public health centre. Same lymphoma: 76 days to treatment through occupational or private care — 127 through public primary care. Seven weeks. And the gap is already there by the specialist visit; after that, both routes take three to five days. The delay is born at the front door.",
 "born": "APPENDIX / Q&A (not on stage). Gap per step from the paper's Fig. 1 (cumulative step times): +86 days by the specialist visit; specialist → treatment 3–5 days on both routes. Tested result: medians 127 vs 76 days, p = 0.027, n = 160 — moderate evidence.",
 "who": "STAGE (11 s). Who uses the public door? Occupational care covers 92 % of wage earners — so it's the retired, the unemployed, the low-paid. And less-educated patients' cancer survival is thirteen points lower.",
 "stakes": "STAGE (8 s). And Goal 3: Finland has the Nordics' lowest lung-cancer survival. Denmark started below us — and fixed it.",
 "mechanism": "STAGE (10 s). Why? A GP visit takes two weeks, the legal guarantee is three months, few health centres can order a CT. So patients come back, again and again.",
 "invisible": "STAGE (5 s). And nobody measures it. You can't shorten a wait you don't see.",
 "local": "APPENDIX / Q&A (not on stage). Why health centres, not counties: 67 % of municipal survival variation lies inside hospital districts (Seppä 2020). County survival gaps are mostly not significant.",
 "solution": "STAGE (18 s). So we built Ajoissa. Every night it reads the county's own records. First, what needs no new capacity: abnormal results nobody followed up — a suspicious chest X-ray, a positive stool test or iron-deficiency anaemia, a raised PSA. Then symptoms that keep coming back. → switch to the live demo.",
 "demo": "STAGE (56 s) — LIVE DEMO, click path below. Monday, eight a.m., the nurse's worklist. At the top: follow-ups that were already due. Aino's chest X-ray recommended a CT — nobody booked it. Eero's stool test was positive. Kalevi's PSA was never repeated. No new scans needed. Then Matti: smoker, third visit, same cough. Ajoissa read his Finnish note — weight loss, poor appetite — and understood \"no blood\" as a no. His risk is well over the 3 % referral line, so he gets one of the CT slots the county already has. The nurse signs; the clock starts. How did it decide? Step by step: it read the note, checked the record — weight down over five percent — calculated the risk from published evidence, matched the referral rules, and proposed the scan. Same rules on his history: thirty-five days earlier. And every clock leaves timestamps: days per step, per health centre — the data Finland doesn't have. → back to slides at `evidence`.",
 "earlier": "BACKUP ONLY (if the live demo fails; otherwise skip — shown live in \"Behind the flag\"). Run the same rules on Matti's history: he would have been on the list 35 days earlier. Nobody did anything wrong. Nobody had the whole picture.",
 "county": "BACKUP ONLY (if the live demo fails; otherwise skip — shown live in County view). Every clock leaves timestamps. Together they are the data Finland doesn't have: days per step, per health centre.",
 "evidence": "STAGE (13 s). Does it work? In a randomised trial, the same pattern cut time to bowel-cancer work-up from 200 to 104 days. In April, Parliament approved it: counties may use their own records to find problems early.",
 "impact": "APPENDIX / Q&A (not on stage). Modelled, every assumption adjustable in the app. No stage or survival effect claimed. Honest cost: ≈ 33 work-ups per earlier diagnosis (Schut 2025).",
 "recs": "APPENDIX / Q&A (not on stage). 1 Level 0 in 3 health centres (county alone) · 2 fixed existing CT slots · 3 publish step times monthly · 4 phase-2 risk scoring (needs QMS) · 5 national referral criteria (national decision).",
 "ask": "STAGE (18 s). Our ask: Päijät-Häme. AINO — Mehiläinen's tool, run by Harjun terveys, the county's joint venture with Mehiläinen, with AstraZeneca supporting the project work — already runs list, nurse, doctor there for kidney disease. We add cancer: about 28,000 euros, one nurse, 45 minutes a day. Päijät-Häme. Three health centres. Six months.",
 "honest": "APPENDIX / Q&A (not on stage). Real vs modelled vs synthetic. UK-derived likelihood ratios and PLCOm2012 need recalibration on Finnish data.",
 "close": "STAGE (3 s). Same symptom, same speed, whichever door you walk in. Thank you.",
 "matti": "BACKUP ONLY (if the live demo fails; otherwise skip — shown live on the Worklist). Then Matti: smoker, third visit, same cough. Ajoissa read his Finnish note — weight loss, poor appetite — and understood \"no blood\" as a no. His risk is well over the 3 % referral line, so he gets one of the CT slots the county already has. The nurse signs; the clock starts.",
 "behind": "BACKUP ONLY (if the live demo fails; otherwise skip — shown live in \"Behind the flag\"). How did it decide? Step by step: it read the note, checked the record — weight down over five percent — calculated the risk from published evidence, matched the referral rules, and proposed the scan."
}
# --- Native charts (Kuitunen et al. 2026, Fig. 1 cumulative step times, days from first symptom) ---
STEPS = ["First contact", "Physician visit", "Referral", "Specialist visit", "Treatment start"]
OCC = [42, 43, 77, 118, 123]     # occupational / private care
PUB = [72, 94, 147, 204, 207]    # public primary care
FONT = "font-family=\"Source Sans 3, Source Sans Pro, Arial, sans-serif\""

def svg_gap():
    W, H, x0, k = 1664, 560, 24, 7.3
    X = lambda d: round(x0 + d * k, 1)
    o = [f'<svg width="1606" height="540" viewBox="0 0 {W} {H}" aria-label="Cumulative days from first symptom on two routes (Kuitunen et al. 2026, Fig. 1). Occupational or private care: first contact day 42, physician 43, referral 77, specialist 118, treatment 123. Public primary care: first contact 72, physician 94, referral 147, specialist 204, treatment 207. The public route reaches treatment 84 days later in cumulative step times; median 51 days later." {FONT}>']
    for d in range(0, 211, 30):
        o.append(f'<line x1="{X(d)}" y1="130" x2="{X(d)}" y2="490" stroke="#3D5578" stroke-width="1"/>')
        o.append(f'<text x="{X(d)}" y="530" fill="#A8B9CC" font-size="24" text-anchor="middle">{d} d</text>')
    o.append(f'<rect x="{X(123)}" y="292" width="{X(207)-X(123)}" height="130" fill="#B42318" fill-opacity="0.22" stroke="#E07A6F" stroke-width="2" stroke-dasharray="8 6"/>')
    o.append(f'<text x="{(X(123)+X(195))/2}" y="334" fill="#F6D5D2" font-size="30" font-weight="800" text-anchor="middle">+84 d</text>')
    o.append(f'<text x="{(X(123)+X(195))/2}" y="364" fill="#F6D5D2" font-size="22" text-anchor="middle">cumulative step times</text>')
    for occ, name, vals, y, col, lab in [(True, "Occupational / private care", OCC, 196, "#A8C8EA", "#DCE6F1"), (False, "Public primary care", PUB, 392, "#E5484D", "#F6D5D2")]:
        o.append(f'<text x="{x0}" y="{y-40}" fill="{lab}" font-size="30" font-weight="700">{name}</text>')
        o.append(f'<line x1="{X(0)}" y1="{y}" x2="{X(vals[-1])}" y2="{y}" stroke="{col}" stroke-width="12"/>')
        for i, d in enumerate(vals):
            o.append(f'<circle cx="{X(d)}" cy="{y}" r="{16 if i == 4 else 11}" fill="#23395B" stroke="{col}" stroke-width="6"/>')
        for i in range(4):
            if occ and i == 1: continue
            txt = "First contact, physician" if (occ and i == 0) else STEPS[i]
            day = "day 42–43" if (occ and i == 0) else f"day {vals[i]}"
            anchor = "end" if i == 3 else "middle"
            xx = X(vals[i]) + (-12 if i == 3 else 0)
            o.append(f'<text x="{xx}" y="{y+48}" fill="{lab}" font-size="22" text-anchor="{anchor}">{txt}</text>')
            o.append(f'<text x="{xx}" y="{y+76}" fill="{lab}" font-size="24" font-weight="700" text-anchor="{anchor}">{day}</text>')
        if occ:
            o.append(f'<text x="{X(123)+30}" y="{y-6}" fill="{lab}" font-size="22">Treatment start</text>')
            o.append(f'<text x="{X(123)+30}" y="{y+22}" fill="{lab}" font-size="26" font-weight="700">day 123</text>')
        else:
            o.append(f'<text x="{X(207)-26}" y="{y-56}" fill="{lab}" font-size="22" text-anchor="end">Treatment start</text>')
            o.append(f'<text x="{X(207)-26}" y="{y-28}" fill="{lab}" font-size="26" font-weight="700" text-anchor="end">day 207</text>')
    o.append(f'<text x="{W}" y="58" fill="#E5484D" font-size="64" font-weight="800" text-anchor="end">+51 days</text>')
    o.append(f'<text x="{W}" y="94" fill="#DCE6F1" font-size="24" text-anchor="end">median, later to treatment on the public route</text>')
    o.append('</svg>')
    return "".join(o)

def svg_born():
    # Two routes to scale. Blue = symptom -> referral (where Ajoissa acts); grey = specialist visit and treatment.
    W, H, k = 1664, 440, 7.0
    X = lambda d: round(d * k, 1)
    blue, grey = ["#2B5D8C", "#4F7FAF"], ["#B7C3CF", "#D3DBE4"]
    o = [f'<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" aria-label="Two routes drawn to scale in days from first symptom (Kuitunen et al. 2026, Fig. 1). Occupational or private care: referral by day 77, treatment at day 123. Public primary care: referral by day 147, treatment at day 207. Blue marks first symptom to referral, where Ajoissa acts; grey marks the specialist visit and treatment." {FONT}>']
    for occ, name, vals, y in [(True, "Occupational / private care", OCC, 52), (False, "Public primary care", PUB, 186)]:
        o.append(f'<text x="0" y="{y-14}" fill="#1B2A3F" font-size="28" font-weight="700">{name}</text>')
        prev = 0
        for i, d in enumerate(vals):
            col = blue[i % 2] if i < 3 else grey[i % 2]
            o.append(f'<rect x="{X(prev)}" y="{y}" width="{max(X(d) - X(prev) - 3, 2)}" height="72" fill="{col}"/>')
            prev = d
        o.append(f'<text x="24" y="{y + 48}" fill="#FFFFFF" font-size="36" font-weight="800">{vals[2]} days</text>')
        o.append(f'<text x="{X(vals[-1]) + 22}" y="{y + 36}" fill="#1B2A3F" font-size="34" font-weight="800">{vals[-1]} days</text>')
        o.append(f'<text x="{X(vals[-1]) + 22}" y="{y + 64}" fill="#4F5F72" font-size="22">to treatment</text>')
    # milestones under the public bar (no day numbers: the scale carries them)
    y = 186 + 72
    for d, t, a in [(72, "First contact", "middle"), (94, "Physician visit", "start"), (147, "Referral", "middle"), (207, "Specialist, treatment", "end")]:
        o.append(f'<line x1="{X(d) - 1.5}" y1="{y}" x2="{X(d) - 1.5}" y2="{y + 12}" stroke="#4F5F72" stroke-width="2"/>')
        xx = X(d) + (6 if a == "start" else 0)
        o.append(f'<text x="{xx}" y="{y + 38}" fill="#4F5F72" font-size="22" text-anchor="{a}">{t}</text>')
    # brackets
    yb = y + 78
    for x1, x2, col, txt, w in [(0, X(147) - 3, "#2B5D8C", "Ajoissa acts here: first symptom to referral", "700"), (X(147) + 6, X(207) - 3, "#8A99AA", "Specialist and treatment: not our target", "400")]:
        o.append(f'<path d="M{x1} {yb - 14} V{yb} H{x2} V{yb - 14}" fill="none" stroke="{col}" stroke-width="4"/>')
        o.append(f'<text x="{(x1 + x2) / 2}" y="{yb + 40}" fill="{col if w == "700" else "#4F5F72"}" font-size="28" font-weight="{w}" text-anchor="middle">{txt}</text>')
    o.append('</svg>')
    return "".join(o)

S = []
FILL={"born","who","stakes","mechanism","local","solution","evidence","impact","recs","honest","ask"}
def slide(id, cls, body, notes, src=None, trans="fade"):
    notes = NOTES.get(id, notes)
    if id in FILL and "</h2>" in body:
        a,b = body.split("</h2>",1); body = a+"</h2>\n<div class=\"fill\">"+b+"\n</div>"
    srcp = f'<p class="source">{src}</p>' if src else ''
    pad = ' style="padding:128px 128px 160px"' if src else ''
    S.append((id, f'<section id="{id}" class="{cls}" data-transition="{trans}"{pad}>\n{body}\n{srcp}\n<aside>{notes}</aside>\n</section>\n'))

slide("cover","dark cover",'''<div class="cover-wrap">
<p class="eyebrow">Junction 2026 · AstraZeneca challenge · Goal 3</p>
<h1 class="wordmark">Ajoissa<span style="color:#ffffff">.</span></h1>
<p class="lead">Same symptom, same speed, whichever door you walk in.</p>
<p class="meta">A safety-net agent for Finland’s public primary care · Brainwave Bandits</p>
</div>''', "STAGE. (5 s) Ajoissa means ‘in time’. Hold a beat on the title before speaking.")

slide("hook","dark",'''<p class="eyebrow">Diffuse large B-cell lymphoma · 7 Finnish hospitals · n = 160</p>
<h2>Two patients. Same lymphoma. Seven weeks apart.</h2>
<div class="chart">''' + svg_gap() + '''</div>''',
"STAGE (25 s). Two Finns notice the same lump. One has occupational health care, one doesn’t. Across seven Finnish hospitals, the median wait from symptom to treatment was 76 days through occupational or private care — and 127 through public primary care. Seven weeks. And look where the gap opens: by the specialist visit it is already there; from there both routes take three to five days. The delay is born in primary care.",
src="Kuitunen et al., Cancer Medicine 2026;15(5):e71920 · median 127 vs 76 days, p = 0.027; chart = cumulative step times (Fig. 1) · moderate · waiting time")

slide("born","light",'''<p class="eyebrow">Where the gap emerges</p>
<h2>The delay is born before the specialist</h2>
<div class="chart" style="flex:1;align-items:center">''' + svg_born() + '''</div>''',
"APPENDIX / Q&A. Gap per step from the paper’s Fig. 1 (cumulative step times; values close to the means 201 vs 126). Tested result: medians 127 vs 76 days, p = 0.027. Small n (160).",
src="Kuitunen 2026, Fig. 1: cumulative step times; median total 127 vs 76 d (p = 0.027) · moderate · waiting time")

slide("who","light",'''<p class="eyebrow">Who pays for the slow door</p>
<h2>It lands on those who can’t skip the queue</h2>
<div class="cols2">
<div><p class="huge2 red">64 % vs 77 %</p><p class="body">5-year cancer survival, men with basic vs higher education (women: 65 % vs 78 %).</p></div>
<div><ul class="facts">
<li>Less-educated patients: <b>more stage IV</b>, <b>less surgery</b>, <b>13–14 % higher cancer-specific mortality</b> in a national register study.</li>
<li>Occupational care covers <b>92 % of wage earners</b>. Retired, unemployed and low-income people use the public door.</li>
</ul></div></div>''',
"STAGE (15 s). And it isn’t random who uses which door. Occupational care covers 92% of wage earners — so the public door serves the retired, the unemployed, the low-paid. Separately, Finnish registry data shows survival 13 points lower for less-educated patients, with more late-stage diagnoses. Two findings, one direction: Goal 3’s equity problem.",
src="OECD/EC Country Cancer Profile Finland 2025 (FCR data) · Zai et al., BMJ Public Health 2025 (n = 469,522) · strong · Kela 2026")

slide("stakes","dark",'''<p class="eyebrow">Goal 3 · lung cancer</p>
<h2>Finland has the Nordics’ lowest lung-cancer survival. It is fixable.</h2>
<div class="cols2">
<div class="kpi"><p class="huge2">16.4 %</p><p class="body">Finland, men, 5-year survival<br>Norway: 26.6 % · strategy target: +14 pp</p></div>
<div class="kpi"><p class="huge2 hi">8.9 → 26.2 %</p><p class="body">Denmark’s men in 20 years, starting below Finland (Finland: 9.7 → 16.7 %)</p></div>
</div>
<p class="body serif soft">Only 27 % of Finnish lung-cancer patients reach curative treatment. Stage I: 19.7 % in Finland vs 30.6 % in Norway.</p>''',
"STAGE (15 s). The strategy’s Goal 3 asks for 14 more percentage points of lung-cancer survival. Denmark did more than that in twenty years. It started below us.",
src="Tichanek et al., Clin Epidemiol 2023 (NORDCAN) · Khalife et al., Acta Oncol 2025 · strong · FCR lung report 2026; Paappanen 2025 · moderate")

slide("mechanism","light",'''<p class="eyebrow">Why the door is narrow</p>
<h2>Four facts about the public front door</h2>
<div class="grid4">
<div class="card"><p class="num2">3 months</p><p class="body">legal wait for non-urgent adult primary care since 1.1.2025</p></div>
<div class="card"><p class="num2">14 d vs 2–7 d</p><p class="body">to a GP in Finland vs other Nordic countries</p></div>
<div class="card"><p class="num2">&lt; 10 %</p><p class="body">of Finnish primary-care units can order a CT, per a Nordic expert survey (elsewhere: 90–100 %)</p></div>
<div class="card"><p class="num2">3–4 months</p><p class="body">of rising visits before a colorectal diagnosis; 65 % of hospital stays start as emergencies</p></div>
</div>''',
"STAGE (15 s). Since January 2025, an adult’s legal right is a primary-care visit within three months. A GP visit takes two weeks. According to Nordic experts, few health centres can order a CT. So patients come back, again and again — Finnish data shows visits rising for months before a cancer is found.",
src="HE 134/2024 (strong) · IHE Cancer Dashboard Finland 2026 / Khalife 2025 expert survey, 42 clinicians (weak–moderate) · Hermiö et al., BMC HSR 2023 (strong)")

slide("invisible","alert",'''<h2 class="statement">Nobody measures the wait between a symptom and a cancer diagnosis.</h2>
<p class="body on-accent">The strategy says this data “is not collected systematically”. Stage is missing for 61 % of cancers diagnosed in 2019–2023. Cancer target times are not published by county. Denmark publishes them by region every quarter.</p>''',
"STAGE (10 s). And here’s the real problem: none of this is measured. You cannot shorten a wait you do not see.",
src="National Cancer Strategy 2026–2035, 2.5 · Finnish Cancer Registry · Sundhedsstyrelsen 2025")

slide("local","light",'''<p class="eyebrow">Where a county can act</p>
<h2>The variation is local, at the health-centre level</h2>
<div class="cols2">
<div><p class="huge red">67 %</p><p class="body">of the variation in cancer survival between Finnish municipalities lies <b>inside</b> hospital districts, not between them.</p></div>
<div><p class="body">Survival differences between counties are mostly not statistically significant. The differences that matter sit closer to the patient: in which health centre, which door, which week.</p><p class="body"><b>So the county can act, health centre by health centre, without waiting years for a national reform.</b></p></div>
</div>''',
"APPENDIX / Q&A. Why we target health centres not counties. Honest point: county survival gaps are small; within-district variation dominates.",
src="Seppä et al., Acta Oncol 2020 · strong · Finnish Cancer Registry, Cancer in Finland 2023; OECD 2025")

slide("solution","dark",'''<p class="eyebrow">Our solution</p>
<h2>Ajoissa. A safety net for public primary care</h2>
<div class="flow">
<div class="fstep"><p class="fn">1</p><p class="fh">Read</p><p class="fb">Overnight, the visit notes (FI/EN): symptoms, how long, what was ruled out</p></div>
<div class="fstep"><p class="fn">2</p><p class="fh">Check the record</p><p class="fb">Results nobody followed up, weights, labs and repeat visits in the county’s own records</p></div>
<div class="fstep"><p class="fn">3</p><p class="fh">Calculate</p><p class="fb">Each value against its published limit; for lung, smoking-history prior × symptom likelihood ratios</p></div>
<div class="fstep"><p class="fn">4</p><p class="fh">Match rules</p><p class="fb">Explicit referral rules (3 % threshold), the criteria that roadmap 2.5.2 will standardise</p></div>
<div class="fstep last"><p class="fn">5</p><p class="fh">Propose</p><p class="fb">One drafted order on a named nurse’s list, and a clock until diagnosis or all-clear</p></div>
</div>
<div class="levelbar"><p class="lv">Level 0 first</p><p>Results that fell through the cracks.</p></div>
<p class="body soft">Deterministic: same record, same answer. A professional decides every action. Nothing is sent to a patient automatically.</p>''',
"STAGE (20 s). So we built Ajoissa — ‘in time’. Every night it reads the health centre’s own records in five steps: read the notes, check the record, calculate against published limits, match explicit referral rules, and propose one action to a named nurse — with the reason and the source. It starts with Level 0: results that were already due and nobody followed up. Then it runs a clock until each patient is diagnosed or cleared. A human decides every step.")

slide("how","accent center",'''<h2 class="statement">How Does It Work?</h2>''',
"TRANSITION (1 s). Switch to the live demo here. Click path: PITCH-SCRIPT.md.")

slide("demo","dark",'''<p class="eyebrow">Live demo · Level 0 · synthetic patients</p>
<h2>Monday 8 am</h2>
<div class="shotrow"><img class="shot" src="%s" alt="Ajoissa worklist with Kalevi N. selected: a raised PSA of 6.8 µg/l 128 days ago that was never repeated, already due and 38 days overdue." style="width:1079px;height:580px;object-fit:contain"></div>''' % IMG["level0"],
"STAGE (20 s) — switch to the LIVE DEMO here if possible. Monday, 08:00. Overnight Ajoissa read the centre’s own records. At the top: results nobody followed up — Level 0. Kalevi, 63: a raised PSA 128 days ago, never repeated, now 38 days overdue. No new capacity needed — this follow-up was already due; the agent makes sure it happens. A clinician signs before anything is sent.",
src="All patients synthetic · Level 0 windows and exclusions after Murphy et al., JCO 2015 · PSA limits: Käypä hoito 2025")

slide("matti","dark",'''<p class="eyebrow">Live demo · then the symptoms that keep coming back</p>
<h2>Matti, 64: third visit for the same cough</h2>
<div class="shotrow">
<img class="shot" src="%s" alt="Worklist with Matti K. selected: third visit for the same cough; lung risk estimate 21.5 percent against a 3 percent referral threshold; four rules met." style="width:1131px;height:580px;object-fit:contain">
<img class="shot" src="%s" alt="Drafted order for Matti K.: thorax CT, urgent, first step within 7 days; uses 1 of the 2 CT slots the county gave the agent this week; draft, not sent until a clinician signs." style="width:306px;height:580px;object-fit:contain">
</div>''' % (IMG["matti_list"], IMG["matti_order"]),
"STAGE (25 s). Second on the list: Matti, 64, smoker, third visit for the same cough. Ajoissa read the Finnish note — weight loss, poor appetite — and it understood ‘ei veriyskää’, no blood, as a negative. Risk 0.9 % → 21.5 %, four rules met. Drafted order: thorax CT, using one of the CT slots the county gave the agent this week. The nurse signs; the clock starts.",
src="All patients synthetic. Risk method: PLCOm2012 (Tammemägi, NEJM 2013) × LR+ (Hamilton 2005; Iyen-Omofoman 2013) · rules after NICE NG12")

slide("behind","dark",'''<p class="eyebrow">Read → Check the record → Calculate → Match rules → Propose</p>
<h2>Behind the flag: every step, every source</h2>
<div class="shotrow"><img class="shot" src="%s" alt="Behind the flag for Matti K., step 3 of 5, Calculate: starting risk 0.91 percent, times 6.2 for weight loss, times 4.8 for loss of appetite, equals 21.5 percent, above the 3 percent referral threshold." style="width:1228px;height:580px;object-fit:contain"></div>''' % IMG["behind"],
"STAGE (15 s). Behind the flag: the same five steps, one at a time. Here, step 3: a starting risk from his age and smoking, times the two strongest published likelihood ratios — 21.5 %, above the 3 % referral threshold. Every number has its source. Same record in, same result out.",
src="Tammemägi et al., NEJM 2013 (PLCOm2012) · Hamilton et al., Thorax 2005 · NICE NG12 · LRs UK-derived; recalibration on Finnish data needed")

slide("earlier","light",'''<p class="eyebrow">Re-running the same rules on his past visits</p>
<p class="huge red">35 days earlier.</p>
<p class="body">At Matti’s second visit (“cough continues, antibiotics”), Ajoissa would already have put him on the list. Nobody did anything wrong, but nobody had the whole picture.</p>
<div class="shotrow"><img class="shot" src="%s" alt="Matti's visit note in Finnish with cough, weight loss and loss of appetite highlighted and ‘ei veriyskää’ (no coughing up blood) struck through as negated." style="width:1300px;height:467px;object-fit:contain"></div>''' % IMG["note"],
"STAGE (15 s). And this is the moment that matters: run the same rules on his history, and he would have been on the list 35 days earlier. Nobody did anything wrong. Nobody had the whole picture.")

slide("county","page",'''<p class="eyebrow">For the county’s cancer lead</p>
<div class="cols2 wide">
<div style="display:flex;flex-direction:column;gap:36px"><h2>The clocks become the missing data</h2><p class="body">Every patient leaves timestamps: the missing data that nobody else collects. Median days spent on each step, measured in every health centre.</p><p class="body"><b>Overdue clocks escalate automatically.</b></p></div>
<img class="shot" src="%s" alt="County view (synthetic): health centre A median days per step, a table of six health centres, and open pathway clocks with on-time, at-risk and overdue statuses." style="width:545px;height:760px;object-fit:contain">
</div>''' % IMG["county"],
"STAGE (10 s). Every clock leaves timestamps. Together they are the data Finland doesn’t have: how many days each step takes, in each health centre, this week.",
src="Health-centre data shown are synthetic")

slide("evidence","light",'''<p class="eyebrow">Why we believe it works, and why now</p>
<h2>Proven pattern. Legal now. Already done once.</h2>
<div class="grid3">
<div class="card"><p class="num2">200 d → 104 d</p><p class="tag2">median time to bowel-cancer work-up</p><p class="body">Randomised trial: EHR triggers for un-followed abnormal results + a human reviewer halved time to colorectal work-up; completed evaluations 52 % → 73 %. (Lung arm too small to show an effect.)</p><p class="tag">Murphy et al., JCO 2015 · strong · time</p></div>
<div class="card"><p class="num2">Approved 2026</p><p class="body">Parliament approved (April 2026) letting a county use its own records to find health problems early. The professional decides; the patient may refuse.</p><p class="tag">HE 159/2025 → EV 38/2026 · in-force date to confirm</p></div>
<div class="card"><p class="num2">Done before</p><p class="body">Päijät-Häme already finds kidney-disease risk patients this way (list → nurse → doctor) with AINO: Mehiläinen’s tool, run by Harjun terveys; AstraZeneca supports the project work.</p><p class="tag">Päijät-Häme 12.3.2026</p></div>
</div>''',
"STAGE (20 s). Does it work? In a randomised trial, the same pattern — automatic trigger on un-followed results, human review — halved the time to colorectal work-up. Is it allowed? Parliament approved it this April: counties may use their own records to find problems early. Has it been done? Päijät-Häme already runs this model for kidney disease — with AstraZeneca’s support.")

slide("impact","dark",'''<p class="eyebrow">Päijät-Häme, year one · a model, every assumption adjustable in the demo</p>
<h2>What it buys, and what it costs</h2>
<div class="grid3">
<div class="kpi"><p class="huge hi"><span class="thin">≈</span> 66</p><p class="body">lung-cancer patients a year on a faster route (of ≈ 110), if every flag gets a slot</p></div>
<div class="kpi"><p class="huge hi"><span class="thin">≈</span> 21 d</p><p class="body">earlier to diagnostic imaging per flagged patient</p></div>
<div class="kpi"><p class="huge amber">0–42</p><p class="body">imaging slots a week: 0 for follow-ups already due; the region sets the rest</p></div>
</div>
<p class="body soft">We do <b>not</b> claim a stage or survival effect: the UK trial built to test that has not reported. The pilot measures it.</p>''',
"APPENDIX / Q&A. Model for Päijät-Häme (205,000 people): national incidence rate; 60 % flagged (Schut 2025); 50 % cut of a 41-day interval (Murphy 2015; 41 d is an unpublished Finnish figure). Ranges in the app.",
src="Model · Schut et al., BJGP 2025 (moderate) · Murphy et al. 2015 (colorectal) · Yle MOT 12.10.2026 (unpublished study, weak)")

slide("recs","light",'''<p class="eyebrow">Recommendations</p>
<h2>What a county can do on Monday</h2>
<table class="recs">
<tr><th style="width:40%">Action</th><th style="width:22%">Owner</th><th style="width:20%">Evidence</th><th style="width:18%">County alone?</th></tr>
<tr><td>Switch on Ajoissa in 3 health centres: chase results nobody followed up (lung, bowel, prostate)</td><td>Chief physician, primary care</td><td>Strong (RCT, time)</td><td>Yes</td></tr>
<tr><td>Name a fixed number of existing CT slots for the agent’s strongest symptom flags</td><td>Imaging lead</td><td>Weak–moderate</td><td>Yes, no new capacity</td></tr>
<tr><td>Publish step times per health centre monthly</td><td>County cancer lead</td><td>Moderate</td><td>Yes</td></tr>
<tr><td>Phase 2: calibrated risk scoring (MDR route)</td><td>County + FICAN</td><td>Moderate (detection)</td><td>Needs QMS</td></tr>
<tr><td>National referral criteria + published pathway times</td><td>STM, FICAN, THL</td><td>Moderate</td><td>No, national decision</td></tr>
</table>''',
"APPENDIX / Q&A. Tracker-only phase 1 likely not a medical device (our reading of MDCG 2019-11, not legal advice); risk scoring = class IIa.")

slide("ask","accent",'''<h2 class="statement"><span class="pre">Implementation</span><br>Päijät-Häme. Three health centres. Six months.</h2>
<p class="goals">Goals</p>
<div class="big-ask">
<div><p class="num3">≤ 7 days</p><p class="body">from flag to a decision, for every flag</p><p class="ourtag">pilot target (ours)</p></div>
<div><p class="num3">Days</p><p class="body">from flag to imaging, per health centre</p></div>
<div><p class="num3">Standardise</p><p class="body">diagnose cancers via a tracked route</p></div>
</div>
<p class="body on-accent">Where the same list → nurse → doctor model already runs for kidney disease (AINO: Mehiläinen’s tool, run by Harjun terveys; AstraZeneca supports the project work) · about €28,000 · one nurse, 45 minutes a day, per health centre · no new scanners</p>''',
"STAGE (15 s). Our ask: Päijät-Häme. The same list → nurse → doctor model already runs there for kidney disease — AINO, run by Harjun terveys and supported by AstraZeneca: a list from the county’s own records, a nurse, a doctor. We extend it to cancer: three health centres, six months, about 28,000 euros, one nurse, 45 minutes a day. We measure three things. And at the end, Finland has its first real numbers for the wait between a symptom and a diagnosis.")

slide("honest","light",'''<p class="eyebrow">Data quality and transparency</p>
<h2>What is real, what is modelled, what is invented</h2>
<div class="grid3">
<div class="card"><p class="num2 tealtxt">Real</p><p class="body">Nordic survival, education gap, DLBCL route timing, county access (THL, March 2024), legal changes, each with source and grade.</p></div>
<div class="card"><p class="num2 bluetxt">Modelled</p><p class="body">Impact numbers. Risk estimates use UK likelihood ratios and PLCOm2012; both need recalibration on Finnish data.</p></div>
<div class="card"><p class="num2 ambertxt">Synthetic</p><p class="body">All patients, health centres and timestamps in the demo. Tagged on every screen.</p></div>
</div>''',
"APPENDIX / Q&A. Limitations: DLBCL values read from a slide; county access data is pre-2025; 41-day lung interval unpublished.")

slide("close","dark cover",'''<div class="cover-wrap">
<h1 class="wordmark">Ajoissa<span style="color:#ffffff">.</span></h1>
<p class="lead">In time, for everyone, whichever door they walk in.</p>
<p class="meta">Demo: claude.ai/artifact/M2pRECwjfGtABcJY4WAH53 · Code: github.com/dalvesalo/Junction-2026</p>
</div>''',
"STAGE (5 s). Same symptom, same speed, whichever door you walk in. Thank you.")

slide("refs","light",'''<p class="eyebrow">Key sources</p>
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
deck={"v":5,"createdOnFiles":{"v":1,"at":"2026-11-14T15:08:56Z"},"lists":"css","format":{"v":1,"shared":["project/deck.css"]},
 "title":"Ajoissa — pitch deck (Brainwave Bandits, Junction 2026)","order":order,"cover":"cover",
 "sections":{"s1":{"description":"The gap: where and for whom the delay emerges","start":"hook"},"s2":{"description":"The solution: Ajoissa safety-net agent and demo","start":"solution"},"s3":{"description":"Evidence, impact, recommendations and the ask","start":"evidence"},"s0":{"description":"Title","start":"cover"},"s4":{"description":"Transparency and sources","start":"honest"}},
 "faces":{"source-sans-3":{"family":"Source Sans 3","href":"https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400..800;1,400..800&display=swap"}},
 "designSystems":[]}
json.dump(deck,open("project/deck.json","w"),ensure_ascii=False,indent=1)
print(order)
