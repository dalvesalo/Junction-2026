# Ajoissa — 3-minute stage pitch (v2, Sat 14.11.2026)

**Story since 14.11:** Level 0 first (abnormal results nobody followed up — no new capacity), Matti second (strongest symptom flag gets one of the CT slots the county already has). Pilot: Päijät-Häme, about €28,000, one nurse 45 min a day per health centre.

**Total ≈ 2:50.** One speaker; a second person drives the live demo. Pace ≈ 150 words a minute; numbers take longer to say than they look. If a rehearsal runs over, cut the Eero/Kalevi sentences in the demo first, then the "Why?" slide.

**Deck order (unchanged, `overnight/deck/build.py`):** cover → hook → *born* → who → stakes → mechanism → invisible → *local* → solution → **demo** → *earlier* → *county* → evidence → *impact* → *recs* → ask → *honest* → close → *refs*. *Italic* = not shown on stage (Q&A / backup). `earlier` and `county` are now covered **live** in the demo; show them only if the live demo fails.

**Every number below is in `overnight/BRIEF.md`** (source table at the end). Names of synthetic patients (Aino, Eero, Kalevi, Matti) come from the demo and are labelled synthetic on screen.

**AINO wording (use exactly, in speech and on slides):** "AINO: Mehiläinen's tool, run by Harjun terveys (the county's joint venture with Mehiläinen), with AstraZeneca supporting the project work". Never "AstraZeneca's model" or "with AstraZeneca's support" alone.

---

## Script — speaker notes per slide (deck chat: copy the quoted text into each slide's `<aside>`)

| Slide id | Time | Speaker notes |
|---|---|---|
| `cover` | 0:00–0:04 (4 s) | STAGE (4 s). Ajoissa. Finnish for "in time". *Hold a beat on the title.* |
| `hook` | 0:04–0:28 (24 s) | STAGE (24 s). Two Finns notice the same lump. One has occupational health care, one goes to the public health centre. Same lymphoma: 76 days to treatment through occupational or private care — 127 through public primary care. Seven weeks. And the gap is already there by the specialist visit; after that, both routes take three to five days. The delay is born at the front door. |
| `born` | — | APPENDIX / Q&A (not on stage). Gap per step from the paper's Fig. 1 (cumulative step times): +86 days by the specialist visit; specialist → treatment 3–5 days on both routes. Tested result: medians 127 vs 76 days, p = 0.027, n = 160 — moderate evidence. |
| `who` | 0:28–0:39 (11 s) | STAGE (11 s). Who uses the public door? Occupational care covers 92 % of wage earners — so it's the retired, the unemployed, the low-paid. And less-educated patients' cancer survival is thirteen points lower. |
| `stakes` | 0:39–0:47 (8 s) | STAGE (8 s). And Goal 3: Finland has the Nordics' lowest lung-cancer survival. Denmark started below us — and fixed it. |
| `mechanism` | 0:47–0:57 (10 s) | STAGE (10 s). Why? A GP visit takes two weeks, the legal guarantee is three months, few health centres can order a CT. So patients come back, again and again. |
| `invisible` | 0:57–1:02 (5 s) | STAGE (5 s). And nobody measures it. You can't shorten a wait you don't see. |
| `local` | — | APPENDIX / Q&A (not on stage). Why health centres, not counties: 67 % of municipal survival variation lies inside hospital districts (Seppä 2020). County survival gaps are mostly not significant. |
| `solution` | 1:02–1:20 (18 s) | STAGE (18 s). So we built Ajoissa. Every night it reads the county's own records. First, what needs no new capacity: abnormal results nobody followed up — a suspicious chest X-ray, a positive stool test or iron-deficiency anaemia, a raised PSA. Then symptoms that keep coming back. *→ switch to the live demo.* |
| `demo` | 1:20–2:16 (56 s) | STAGE (56 s) — LIVE DEMO, click path below. Monday, eight a.m., the nurse's worklist. At the top: follow-ups that were already due. Aino's chest X-ray recommended a CT — nobody booked it. Eero's stool test was positive. Kalevi's PSA was never repeated. No new scans needed. Then Matti: smoker, third visit, same cough. Ajoissa read his Finnish note — weight loss, poor appetite — and understood "no blood" as a no. His risk is well over the 3 % referral line, so he gets one of the CT slots the county already has. The nurse signs; the clock starts. How did it decide? Step by step: it read the note, checked the record — weight down over five percent — calculated the risk from published evidence, matched the referral rules, and proposed the scan. Same rules on his history: thirty-five days earlier. And every clock leaves timestamps: days per step, per health centre — the data Finland doesn't have. *→ back to slides at `evidence`.* |
| `earlier` | — | BACKUP ONLY (if the live demo fails; otherwise skip — shown live in "Behind the flag"). Run the same rules on Matti's history: he would have been on the list 35 days earlier. Nobody did anything wrong. Nobody had the whole picture. |
| `county` | — | BACKUP ONLY (if the live demo fails; otherwise skip — shown live in County view). Every clock leaves timestamps. Together they are the data Finland doesn't have: days per step, per health centre. |
| `evidence` | 2:16–2:29 (13 s) | STAGE (13 s). Does it work? In a randomised trial, the same pattern cut time to bowel-cancer work-up from 200 to 104 days. In April, Parliament approved it: counties may use their own records to find problems early. |
| `impact` | — | APPENDIX / Q&A (not on stage). Modelled, every assumption adjustable in the app. No stage or survival effect claimed. Honest cost: ≈ 33 work-ups per earlier diagnosis (Schut 2025). |
| `recs` | — | APPENDIX / Q&A (not on stage). 1 Level 0 in 3 health centres (county alone) · 2 fixed existing CT slots · 3 publish step times monthly · 4 phase-2 risk scoring (needs QMS) · 5 national referral criteria (national decision). |
| `ask` | 2:29–2:47 (18 s) | STAGE (18 s). Our ask: Päijät-Häme. AINO — Mehiläinen's tool, run by Harjun terveys, the county's joint venture with Mehiläinen, with AstraZeneca supporting the project work — already runs list, nurse, doctor there for kidney disease. We add cancer: about 28,000 euros, one nurse, 45 minutes a day. Päijät-Häme. Three health centres. Six months. |
| `honest` | — | APPENDIX / Q&A (not on stage). Real vs modelled vs synthetic. UK-derived likelihood ratios and PLCOm2012 need recalibration on Finnish data. |
| `close` | 2:47–2:50 (3 s) | STAGE (3 s). Same symptom, same speed — whichever door you walk in. Thank you. |

## Live demo click path (driver) — 56 s, from SUBMISSION.md

| Time | Speaker says | Driver does |
|---|---|---|
| 1:20 | "Monday, eight a.m., the nurse's worklist." | Demo already open on **Worklist** (landing). |
| 1:23 | "At the top: follow-ups that were already due … No new scans needed." | Hover/point at the "Already due" rows: **Aino M.** (chest X-ray), **Eero T.** (stool test), **Kalevi N.** (PSA). Don't click. |
| 1:33 | "Then Matti … one of the CT slots the county already has." | Click **Matti K.** (red, Act now). Point at the threshold box and the drafted **Thorax CT**; point at "CT slots free this week". |
| 1:51 | "The nurse signs; the clock starts." | **Sign and send** → Matti moves to "Out of your hands", clock starts. |
| 1:55 | "How did it decide? Step by step: …" | **How did Ajoissa decide this?** → **▶ Walk through it step by step**: Read the note (struck-through "veriyskää") → Check the record (weight −5 %) → Calculate → Match rules → Propose ("caught 35 days earlier"). One click per phrase. |
| 2:08 | "And every clock leaves timestamps …" | **County view** (Evidence menu) → click **Health centre D**. |
| 2:16 | — | Back to slides at `evidence`. |

**If the demo breaks:** stay on slides and use the `demo` → `earlier` → `county` slides with their backup notes (same words, ≈ same time). Backup in Q&A: "+ Create a test patient" and let a judge type a note.

## For the deck chat — on-slide text still uses the old AINO wording

Notes above are ready to copy. Two slide **bodies** also need the exact AINO wording (I did not edit `build.py`):
- `evidence`, third card: replace "with AstraZeneca's support" → "Päijät-Häme already finds kidney-disease risk patients this way — list → nurse → doctor — with AINO: Mehiläinen's tool, run by Harjun terveys (the county's joint venture with Mehiläinen), with AstraZeneca supporting the project work."
- `ask`, bottom line: replace "(AINO, with AstraZeneca)" → "(AINO: Mehiläinen's tool, run by Harjun terveys (the county's joint venture with Mehiläinen), with AstraZeneca supporting the project work)".
- Optional: `solution` "Read" box could say "Level 0 first: results nobody followed up" to match the spoken order.

## Numbers used and where they are in BRIEF.md

| Spoken | BRIEF.md | Evidence |
|---|---|---|
| 76 vs 127 days, seven weeks, gap already there at specialist, 3–5 days after | The gap §1 (Kuitunen 2026) | moderate · waiting time |
| 92 % of wage earners | §2 (Kela 2026) | — |
| survival thirteen points lower (64 % vs 77 % men, 65 % vs 78 % women) | §2 (OECD/EC 2025, FCR) | moderate/strong · survival |
| lowest Nordic lung survival; Denmark started below Finland | §3 (Tichanek 2023; Khalife 2025) | strong · survival |
| GP ~two weeks; guarantee three months; few centres can order CT | §4 (IHE 2026 survey; HE 134/2024) | weak–moderate; strong |
| 3 % referral line; weight loss > 5 % | How the agent works §2–3 | method |
| 35 days earlier | How the agent works §5 (synthetic Matti) | synthetic demo |
| 200 → 104 days | Why an agent (Murphy 2015 RCT) | strong · time |
| Parliament approved in April | Why an agent (HE 159/2025, 21.4.2026) | strong |
| about €28,000; 45 min a day; three centres, six months | Pilot ask (€27,000–28,000) | cost model, part assumption |
