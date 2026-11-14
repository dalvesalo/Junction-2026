# Morning report — what was built overnight, what works, what won't

Run: Sat 14.11.2026, 01:21 → 06:25 (paused 02:10–06:10 by the account usage limit; see LOG.md for every step and mistake). Everything is also in the repo under `overnight/` and in the project folder `claude/overnight/`.

## Links
| What | Where |
|---|---|
| **Demo app** (live, all views) | https://claude.ai/artifact/M2pRECwjfGtABcJY4WAH53 — owner-only until you share it. Same app offline: `app/index.html` in the repo (works without internet). GitHub Pages ready (root `index.html` redirects to `app/`). |
| **Pitch deck** (19 slides, speaker notes = stage script) | https://claude.ai/artifact/GEu3JWvDxS5fJkWbcpkz1i — local PDF render: `overnight/deliverables/Ajoissa_pitch_deck.pdf` |
| **Pitch video** (1:57.8, music, no voice) | `overnight/deliverables/Ajoissa_pitch_video.mp4` (also sent in chat) |
| **Full report** (Docs, 10 sections, 43 refs, 3 charts) | https://claude.ai/artifact/Fn5RYTFToZxPPAaerQwAGH |
| **Data workbook** (Sheets, 11 tabs, every row sourced, live impact formulas) | https://claude.ai/artifact/FrDamYM9Md26HhFQXXa9n4 — .xlsx copy in `overnight/deliverables/` |
| Submission texts, checklist, VO script, Q&A | `overnight/SUBMISSION.md` |
| One-page brief (all numbers + sources) | `overnight/BRIEF.md` |
| Independent fact-check + what was corrected | `overnight/QA_REPORT.md`, `overnight/CORRECTIONS.md` (all corrections applied to app, deck, video, report, sheet) |
| Code | https://github.com/dalvesalo/Junction-2026 |

## The idea in one breath
**Ajoissa** ("in time"): a safety-net agent for public primary care. Overnight it reads the county's own records (Finnish notes, labs, visit history), puts patients whose cancer signals have stalled on a named nurse's worklist with reason + risk + source, a human decides, and a pathway clock runs until diagnosis or all-clear. The clocks add up to the step-by-step waiting data Finland doesn't measure.

## Why we moved away from "Pathway Gap Finder" as the headline (it's still in, as the County view)
1. **The data killed the county-gap story.** Finnish county *survival* differences are mostly not statistically significant (Cancer Registry 2023, OECD 2025). Pitching "county X is worse" would be attacked. What IS provable: the **socioeconomic gap** (64 vs 77 % survival by education; more stage IV, less surgery after adjustment — Zai 2025) and the **front-door gap** (DLBCL +86 days before the specialist on the public route).
2. **The per-step data the Gap Finder needs doesn't exist publicly.** Instead of faking it, the agent *produces* it (clocks). That turns the data gap into the product.
3. **Actionability is 30 %.** A county can switch on a tracker-style agent now: HE 159/2025 / EV 38/2026 allow it; Päijät-Häme already runs the same model (AINO, AstraZeneca-backed).

## Your four agent ideas — what happened to each
| Idea | Verdict | Why |
|---|---|---|
| AI scans first-visit notes and refers anyone with cancer-like signs | **Kept, but human-in-the-loop** | Auto-referral breaks the law's "professional decides" rule, GDPR Art. 22 and likely MDR class IIb; also floods specialists. Our agent proposes, a nurse decides. |
| Nationwide predictive model over all Finnish data | **Rejected for the demo, kept as phase 2/national** | Needs Findata permits + national data; no trial shows EHR risk models shift stage (ERICA unpublished); demo would be 100 % synthetic → hurts the 20 % data-quality score. |
| Standardise doctor/nurse prose and extract cancer indicators | **Kept as the "Read" step (deterministic lexicon)** | No public Finnish clinical language model exists; our Finnish/English lexicon with negation ("ei veriyskää") is transparent and works live. ML NLP = phase 2. |
| Make getting an appointment faster | **Folded in as prioritisation** | Software can't create GP hours (adults' legal wait is now 3 months); it can make sure the scarce slots/CTs go to the right patients first. |

## What works (tested)
- Engine on 6 synthetic cases + the **"Try your own note"** editor (type any Finnish/English note live — great for judges).
- "Could this have been caught earlier?" re-runs the rules on past visits (Matti: 35 days earlier).
- County view with real THL access data (March 2024) + synthetic per-health-centre clocks, clickable.
- Impact simulator with every assumption visible; honest cost (≈ 4,455 extra work-ups/yr for a 420k county).
- 2-minute briefing with read-aloud (browser voice) and a timer.
- Sources view: every number → source, grade, outcome type; real / model / synthetic tags everywhere.
- No console errors; works offline; fine at 1280 px.

## What won't work / risks (decide in the morning)
1. **Live AI features are untested.** "Ask the analyst" and "Draft the referral (AI, Finnish)" appear only in the claude.ai artifact (they use Claude via the page). Test them; if flaky, don't demo them — everything else is deterministic and offline.
2. **Sharing:** the artifacts are private until you share them. For judges use GitHub Pages (Settings → Pages → main / root) or share the artifact publicly — test in a private window.
3. **Team size rule:** Junction allows 1–4; team plan lists 5 roles. Check.
4. **Fixed after the independent fact-check (see QA_REPORT.md, CORRECTIONS.md):** the lymphoma headline is now the paper's tested result — median 127 vs 76 days, 7 hospitals, n = 160 ("Seven weeks apart", not "84 days / twelve weeks / North Ostrobothnia"); "legal since 2026" → "approved by Parliament April 2026"; CT figure labelled expert survey; Murphy = colorectal; engine bugs fixed (negation past commas, "retired"→tired, NaN, rules overridable). Still to check by a human: 41-day lung primary-care interval is unpublished (Yle) — labelled weak; THL county access is March 2024 (pre-2025 law); HE 159/2025 entry-into-force date not verified.
5. **Correction to the team plan:** lung survival 16.4/26.6/25.5/33.2 % is from Tichanek et al., Clin Epidemiol 2023 (2016–20), not Acta Oncol 2025.
6. **Video has no voice.** VO script with timings is in SUBMISSION.md (record it over the track, ~10 min). Upload to YouTube (public/unlisted) — the form needs a link.
7. **Risk model caveats** (judges from medical affairs will ask): UK likelihood ratios, PLCOm2012 not calibrated for Finland, 6-year risk ÷ 6 as annual prior. All stated on screen. Don't claim stage/survival effect.
8. **Deck:** generated from the Slides type; the local PDF is my render of the same HTML — export the official PDF from the Slides artifact and glance through it (tables render differently there).

## Suggested plan for today (Sat)
- Morning: everyone reads BRIEF.md (10 min). Decide: keep Ajoissa framing? (Recommended.)
- Mentor (Kaisa Kaitila): ask (1) is Kuitunen 2026 North Ostrobothnia or 7 hospitals? (2) would Pohde pilot this? (3) any county measuring symptom→diagnosis? (4) is the AINO model the right precedent to cite to AstraZeneca?
- Builder: test the artifact live-AI; set up GitHub Pages; maybe add one more synthetic case per health centre.
- Pitch person: record VO, upload video, rehearse the 3-min stage script twice with the live demo click path.
- 18:00 feature freeze, then submission form (texts ready in SUBMISSION.md).
