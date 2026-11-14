# Submission pack — Ajoissa (Brainwave Bandits)

Final deadline: **Sunday 15.11 at 10:00**. Set the project to **FINAL** (drafts are not reviewed).

## Form fields (copy-paste)

**Project name:** Ajoissa

**Punchline (one line):** A safety-net agent for Finland's public primary care: same symptom, same speed — whichever door you walk in.

**Challenge:** AstraZeneca — Equal and effective cancer care in Finland

**Description:**
In Finland, the first door you knock on decides how fast cancer is found. Across seven Finnish hospitals, lymphoma patients who entered through public primary care waited a median of 127 days from symptom to treatment, versus 76 days through occupational or private care — and the gap opens before a specialist ever sees them (Kuitunen et al., Cancer Medicine 2026). Occupational care covers 92 % of wage earners, so the public door serves the retired, unemployed and low-paid — and, separately, 5-year cancer survival is 64 % for men with basic education vs 77 % with higher education. Finland has the Nordics' lowest lung-cancer survival (16.4 % vs 26.6 % in Norway), and nobody measures the time between a symptom and a diagnosis.

Ajoissa ("in time") reads a wellbeing services county's own records overnight and starts with what needs no new capacity: abnormal results that nobody followed up — a suspicious chest X-ray, a positive stool test or iron-deficiency anaemia, a raised PSA — for lung, bowel and prostate cancer. Where visit notes exist it also reads them, in Finnish, for symptoms that keep coming back. It puts these patients on a named nurse's worklist, each with a plain-language reason, a risk estimate and the published source behind it. A professional decides every action. Each approved case gets a pathway clock that runs until diagnosis or all-clear and escalates when a step is overdue. The clocks add up to the data Finland is missing: days per pathway step, per health centre.

The agent is deterministic and auditable: a Finnish/English clinical lexicon mapped to ICPC-2 codes, with negation, duration, severity and typo handling (tested on 220 synthetic notes: 200/200 on the development set, 13/20 on a held-out set, results in the app), an optional AI second reading whose every suggestion must quote the note and be confirmed by the clinician, structured record signals (measured weight loss, unfollowed abnormal results, normal chest X-ray with continuing symptoms), a Bayesian lung-cancer risk (PLCOm2012 prior × published primary-care likelihood ratios), explicit NICE NG12-style referral rules (the criteria the national roadmap plans to standardise), thrombocytosis and repeat-visit triggers. The design copies the time windows and exclusions of the only randomised trial of this class of tool (EHR triggers on un-followed results + human review: colorectal work-up 200 → 104 days, prostate 192 → 144; lung arm not significant; Murphy et al., JCO 2015), with Finnish laboratory thresholds (Fimlab) and Käypä hoito's restraint on PSA, and Parliament approved in April 2026 that counties may use their own records to find health problems early (HE 159/2025, EV 38/2026). Päijät-Häme already runs the same list → nurse → doctor model for kidney disease.

The agent never asks for more scans than the county gives it: follow-ups already due go first, then the strongest signals fill the CT slots the county names. Our ask: Päijät-Häme — where the same list → nurse → doctor model already runs for kidney disease (AINO: Mehiläinen's tool, run by Harjun terveys (the county's joint venture with Mehiläinen), with AstraZeneca supporting the project work) — three health centres, six months, about €28,000: one nurse per centre, 45 minutes a day. Every number in the demo is sourced and graded; all patients and health centres are synthetic and labelled as such.

**Technologies used:** JavaScript (vanilla, no framework), HTML/CSS, SVG; deterministic NLP (Finnish/English lexicon mapped to ICPC-2, negation, duration, severity, one-letter typo correction); optional LLM second reading with verbatim-quote validation; Node test runner (220 synthetic notes); Bayesian risk model (PLCOm2012 × likelihood ratios); rule engine; Web Speech API (team briefing read-aloud); Python (data processing, Playwright rendering, ffmpeg video); Claude (research, analysis and code assistant).

**Demo link:** https://claude.ai/artifact/M2pRECwjfGtABcJY4WAH53 *(owner-only until shared — share it publicly from claude.ai, or deploy `app/` with GitHub Pages: Settings → Pages → branch main, folder /app is not selectable, so either move app to /docs or use the artifact)*
**Source code:** https://github.com/dalvesalo/Junction-2026 (must be accessible to organisers; MIT licence applies to submissions)
**Video (≤ 2:00, public):** upload `overnight/deliverables/Ajoissa_pitch_video.mp4` (1:57.6, rebuilt 14.11: Hospital blue, story Level 0 → Matti, cursor-driven demo clip, pilot-plan slide, end card "Ajoissa." + slogan; music and soft click sounds, no voiceover) to YouTube as *Unlisted/Public* and paste the link. *(Final cut, Sat 14.11 evening: 1:57.6 — this is the one to upload.)*
**Pitch deck (PDF):** export from https://claude.ai/artifact/GEu3JWvDxS5fJkWbcpkz1i (Share/Export → PDF), or use `overnight/deliverables/Ajoissa_pitch_deck.pdf`.

## YouTube upload (decided 14.11: YouTube, Unlisted)
- Upload from a team member's personal account. Visibility: **Unlisted**. Audience: **No, it's not made for kids**.
- **Title:** Ajoissa — Brainwave Bandits, Junction 2026 (AstraZeneca challenge)
- **Description:**
  ```
  A safety-net agent for Finland's public primary care: same symptom, same speed — whichever door you walk in.

  All patients and health centres in this video are synthetic.
  ```
- **Thumbnail:** `overnight/deliverables/Ajoissa_thumbnail.png` (1280×720; Details → Thumbnail → Upload file; custom thumbnails need a phone-verified YouTube account).
- Before pasting the link into the form: open it in a private window — plays without login, ≤ 2:00, HD finished processing.

## Checklist before 10:00
- [ ] Team size on Junction Platform is 1–4 (rule!). Team plan listed 5 roles — check registration.
- [ ] Share the demo artifact (or deploy app/ to GitHub Pages) and test the link in a private window.
- [ ] Make the repo public or give organisers access.
- [ ] Upload final video to YouTube (Unlisted, see above); check it is ≤ 2:00 and playable without login.
- [ ] Export deck PDF.
- [ ] Phone numbers + Discord usernames of all members.
- [ ] Set to FINAL.
- [ ] Peer review 10:30–13:00: everyone present.

## Voiceover
None (decided 14.11): the video carries its message in captions, with ambient music and soft click sounds in the demo clip.

## 3-minute stage pitch (if top 5) — script in `overnight/PITCH-SCRIPT.md`
Stage slides: cover → hook → who → stakes → mechanism → invisible → solution → **live demo** → evidence → ask → close (≈ 2:50). `earlier` and `county` are shown live in the demo; use them only if the demo fails. Full speaker notes, timings, driver cues and the numbers' sources are in `overnight/PITCH-SCRIPT.md` (the deck chat copies the notes from there). One speaker; second person drives the demo.

**Demo click path (56 s):** Worklist opens (Monday 08:00 at the health centre) → point at the "Already due" rows first (**Aino M.** chest X-ray, **Eero T.** stool test, **Kalevi N.** PSA — Level 0, no new capacity) → click **Matti K.** (red, Act now) → point at the threshold box (lung 21.5 % vs 3 %; platelets 468) and the drafted **Thorax CT** → **Sign and send** (clock starts, Matti moves to "Out of your hands") → **How did Ajoissa decide this?** → **▶ Walk through it step by step**: Read the note (struck-through "veriyskää") → Check the record (weight −5 %) → Calculate (0.91 % → 21.5 %) → Match rules → Propose ("caught 35 days earlier") → County view → click Health centre D → back to slides. Backup: "+ Create a test patient" and let a judge type a note.

## Likely judge questions — short answers
- **"Where do the extra scans come from?"** Nowhere. Level 0 chases follow-ups that were already due. For symptom flags the county names a number of CT slots; the agent ranks who is proposed and never asks for more. We say openly that a lower-risk patient then waits longer.
- **"Won't PSA flags cause overdiagnosis?"** The agent never proposes a new PSA test. It only flags a raised PSA already taken in men aged 40–70 that was never repeated, as Käypä hoito says it should be; it stays silent for men over 70.
- **"Isn't this just alert fatigue?"** It's a weekly/overnight worklist for one named nurse, not pop-ups; specificity is built in (Jorma's back pain and Heikki's 2-week post-cold cough are *not* escalated). Honest cost in the impact view: ≈ 33 work-ups per earlier diagnosis (Schut 2025).
- **"Is it a medical device?"** Phase 1 (tracker + county-chosen rules, human decides) may not be a device under MDCG 2019-11 — our reading, not legal advice. Phase 2 risk scoring = likely MDR class IIa: in-house exemption (Art. 5(5)) for one county, or CE-marked vendor for national scale.
- **"Is it legal to scan records?"** HE 159/2025 approved by Parliament 21.4.2026 (EV 38/2026): counties may process their own register data to identify health problems early; professional decides; patient may refuse; access logged. Exact entry-into-force date to confirm.
- **"Does it improve survival?"** We don't claim that. The RCT evidence is for speed (200 → 104 days). The pilot is designed to measure stage and route.
- **"Why not just fix GP access?"** Yes, and roadmap 2.5.1 does (omalääkäri). That takes years and money; Ajoissa makes the existing capacity look at the right patients first, and measures the effect.
- **"Your risk numbers are UK-based."** Yes — flagged on screen. PLCOm2012 and the LRs must be recalibrated on Finnish data (Findata permit / county register) in phase 2.
- **"Your lymphoma gap — is that significant?"** Yes: medians 127 vs 76 days, p = 0.027, but n = 160 — moderate evidence; we say so.
- **"Does a few weeks even matter for lung survival?"** Experts in Khalife 2025 doubt waiting alone explains the Nordic gap — we agree; that's why we measure (clocks) and don't promise survival.
- **"Why lymphoma data for a lung-cancer agent?"** DLBCL is the only published Finnish route-timing data (the "where"); lung is the Goal 3 indicator (the "why it matters"). The agent's rules cover lung, lymphoma, colorectal and non-specific signals.
- **"Who pays?"** Phase 1 is software on existing data + one nurse's hours per health centre; roadmap 3.5.3 earmarks €1.14 M for AI/digital early-detection tools via FICAN.

- **"Can Ajoissa refer a patient straight to an oncologist?"** No. Specialist care needs a doctor's referral (Health Care Act §52), and an automated decision about a person is restricted (GDPR Art. 22) and would raise the device class. Also, suspected cancer goes to the diagnosing specialist (CT / lung clinic, colonoscopy, urology), not oncology. Ajoissa drafts the right next step; a doctor signs.
- **"Isn't this common sense — why doesn't the doctor see it?"** Common symptoms, rare cancer; a different doctor each visit; results arrive after the patient has left; weeks between visits. ≥ 3 GP visits before referral in 41–51 % for some cancers (Lyratzopoulos 2012); only ~half of haemoptysis got imaging within 2 weeks (Koo 2024); Finnish primary-care visits rise 3–4 months before a bowel diagnosis (Hermiö 2023). Ajoissa is the memory between visits.
- **"Why not skip the first visit?"** A CT needs a doctor's justification (radiation law) and a referral; the doctor also rules out emergencies and other causes. Ajoissa flags the triage note overnight so the visit comes sooner with the next step drafted.
- **"Why Päijät-Häme?"** Because it already works there: the same list → nurse → doctor model runs on the county's own records for kidney disease (AINO: Mehiläinen's tool, run by Harjun terveys (the county's joint venture with Mehiläinen), with AstraZeneca supporting the project work), started on residents' consent (press release 12.3.2026). One shared record system, a personal-GP push, a real access gap (20 % not seen within 14 days). AINO has no results yet, so we cite it as an operating model, not as proof. Pohjois-Karjala is the second region, for the equity case. Pilot ≈ €28,000.
