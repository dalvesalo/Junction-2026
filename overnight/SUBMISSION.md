# Submission pack — Ajoissa (Brainwave Bandits)

Final deadline: **Sunday 15.11 at 10:00**. Set the project to **FINAL** (drafts are not reviewed).

## Form fields (copy-paste)

**Project name:** Ajoissa

**Punchline (one line):** A safety-net agent for Finland's public primary care: same symptom, same speed — whichever door you walk in.

**Challenge:** AstraZeneca — Equal and effective cancer care in Finland

**Description:**
In Finland, the first door you knock on decides how fast cancer is found. Lymphoma patients who enter through public primary care reach treatment 84 days later than those with occupational health care, and the gap is already 86 days when they first see a specialist (Kuitunen et al., Cancer Medicine 2026). The public door serves the people with the worst outcomes: 5-year cancer survival is 64 % for men with basic education vs 77 % with higher education. Finland has the Nordics' lowest lung-cancer survival (16.4 % vs 26.6 % in Norway), and nobody measures the time between a symptom and a diagnosis.

Ajoissa ("in time") reads a wellbeing services county's own records overnight — free-text visit notes in Finnish, lab results and visit history — and puts patients whose cancer signals have stalled on a named nurse's worklist, each with a plain-language reason, a risk estimate and the published source behind it. A professional decides every action. Each approved case gets a pathway clock that runs until diagnosis or all-clear and escalates when a step is overdue. The clocks add up to the data Finland is missing: days per pathway step, per health centre.

The agent is deterministic and auditable: a Finnish/English clinical lexicon with negation detection, a Bayesian lung-cancer risk (PLCOm2012 prior × published primary-care likelihood ratios), explicit NICE NG12-style referral rules (the criteria the national roadmap plans to standardise), thrombocytosis and repeat-visit triggers. The design follows the only randomised evidence for this class of tool (EHR trigger + human review halved time to colorectal work-up, Murphy et al., JCO 2015), and it is legal now: Parliament has allowed counties to use their own records to find health problems early (HE 159/2025, EV 38/2026). Päijät-Häme already runs the same list → nurse → doctor model for kidney disease.

Our ask: one county, three health centres, six months. Every number in the demo is sourced and graded; all patients and health centres are synthetic and labelled as such.

**Technologies used:** JavaScript (vanilla, no framework), HTML/CSS, SVG; deterministic NLP (Finnish/English lexicon, negation and duration detection); Bayesian risk model (PLCOm2012 × likelihood ratios); rule engine; Web Speech API (briefing read-aloud); Python (data processing, Playwright rendering, ffmpeg video); Claude (research, analysis and code assistant).

**Demo link:** https://claude.ai/artifact/WBcU1hw4dpagfNVUQ2Ec3x *(owner-only until shared — share it publicly from claude.ai, or deploy `app/` with GitHub Pages: Settings → Pages → branch main, folder /app is not selectable, so either move app to /docs or use the artifact)*
**Source code:** https://github.com/dalvesalo/Junction-2026 (must be accessible to organisers; MIT licence applies to submissions)
**Video (≤ 2:00, public):** upload `overnight/deliverables/Ajoissa_pitch_video.mp4` (1:57.8) to YouTube as *Unlisted/Public* and paste the link.
**Pitch deck (PDF):** export from https://claude.ai/artifact/GEu3JWvDxS5fJkWbcpkz1i (Share/Export → PDF), or use `overnight/deliverables/Ajoissa_pitch_deck.pdf`.

## Checklist before 10:00
- [ ] Team size on Junction Platform is 1–4 (rule!). Team plan listed 5 roles — check registration.
- [ ] Share the demo artifact (or deploy app/ to GitHub Pages) and test the link in a private window.
- [ ] Make the repo public or give organisers access.
- [ ] Upload video; check it is ≤ 2:00 and playable without login.
- [ ] Export deck PDF.
- [ ] Phone numbers + Discord usernames of all members.
- [ ] Set to FINAL.
- [ ] Peer review 10:30–13:00: everyone present.

## Optional voiceover for the video (≈ 1:55; record over the existing track, music stays under)
| Time | Line |
|---|---|
| 0:00 | Two people in Finland notice the same lump in their neck. |
| 0:09 | One has occupational health care. One goes to the public health centre. |
| 0:14 | Watch the days. The first starts treatment on day 123. The second… on day 207. |
| 0:25 | Eighty-four days. Same lymphoma. Twelve weeks apart. |
| 0:33 | And the delay is born before a specialist ever sees them — in primary care. |
| 0:43 | It falls on the people who can't skip the queue. And Finland has the Nordics' lowest lung-cancer survival. Denmark fixed theirs. We can too. |
| 0:56 | But nobody measures the wait between a symptom and a diagnosis. You cannot shorten a wait you do not see. |
| 1:03 | So we built Ajoissa. Finnish for "in time". |
| 1:10 | Every night it reads the health centre's own records… |
| 1:20 | …finds Matti, back for the third time with the same cough, reads his note in Finnish — even the "no blood" — and puts him on a nurse's list with a reason and a source. A human decides. Then a clock runs until he's diagnosed or cleared. |
| 1:32 | Run the same rules on his history: thirty-five days earlier. |
| 1:40 | The pattern is proven in a randomised trial. It's legal since this year. And a Finnish county already does it for kidney disease. |
| 1:49 | One county. Three health centres. Six months. Ajoissa — same symptom, same speed, whichever door you walk in. |

## 3-minute stage pitch (if top 5) — follow the deck's STAGE slides
Slides: cover → hook (river) → who → stakes → mechanism → invisible → solution → **live demo (Matti)** → earlier → county → evidence → ask → close. Speaker notes in each slide contain the script with timings (≈ 2:50 total). One speaker; second person drives the demo.

**Demo click path (60 s):** Safety-net agent tab → (counters run) → Matti K. → point at highlighted Finnish note and struck-through "veriyskää" → risk waterfall 0.9 % → 21.5 % → Approve and start the clock → scroll to "Could this have been caught earlier? 35 days" → County view tab → click Health centre D → back to slides.

## Likely judge questions — short answers
- **"Isn't this just alert fatigue?"** It's a weekly/overnight worklist for one named nurse, not pop-ups; specificity is built in (Jorma's back pain and Heikki's 2-week post-cold cough are *not* escalated). Honest cost in the impact view: ≈ 33 work-ups per earlier diagnosis (Schut 2025).
- **"Is it a medical device?"** Phase 1 (tracker + county-chosen rules, human decides) may not be a device under MDCG 2019-11 — our reading, not legal advice. Phase 2 risk scoring = likely MDR class IIa: in-house exemption (Art. 5(5)) for one county, or CE-marked vendor for national scale.
- **"Is it legal to scan records?"** HE 159/2025 adopted (EV 38/2026): counties may process their own register data to identify health problems early; professional decides; patient may refuse; access logged. Exact entry-into-force date to confirm.
- **"Does it improve survival?"** We don't claim that. The RCT evidence is for speed (200 → 104 days). The pilot is designed to measure stage and route.
- **"Why not just fix GP access?"** Yes, and roadmap 2.5.1 does (omalääkäri). That takes years and money; Ajoissa makes the existing capacity look at the right patients first, and measures the effect.
- **"Your risk numbers are UK-based."** Yes — flagged on screen. PLCOm2012 and the LRs must be recalibrated on Finnish data (Findata permit / county register) in phase 2.
- **"Why lymphoma data for a lung-cancer agent?"** DLBCL is the only published Finnish route-timing data (the "where"); lung is the Goal 3 indicator (the "why it matters"). The agent's rules cover lung, lymphoma, colorectal and non-specific signals.
- **"Who pays?"** Phase 1 is software on existing data + one nurse's hours per health centre; roadmap 3.5.3 earmarks €1.14 M for AI/digital early-detection tools via FICAN.
