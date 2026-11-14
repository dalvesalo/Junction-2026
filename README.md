# Ajoissa — the cancer safety net for public primary care

Brainwave Bandits · Junction 2026 · AstraZeneca challenge (equal and effective cancer care in Finland, National Cancer Strategy Goal 3)

**Same symptom, same speed — whichever door you walk in.**

- `app/` — the working demo (static HTML/JS, no build step, works offline: open `app/index.html`). Live: https://claude.ai/artifact/WBcU1hw4dpagfNVUQ2Ec3x
- `app/js/engine.js` — the deterministic agent (v2): Finnish/English note reading mapped to ICPC-2 with negation, duration, severity and typo handling, optional AI second reading with quote checks, structured record signals, PLCOm2012 × likelihood-ratio risk, NG12-style rules, actions and pathway clocks
- `overnight/IMPLEMENTATION-PLAN.md` — base implementation plan (worklist architecture, triggers, people, KPIs, 90 days)
- `tests/` — records.js (38 structured-record tests, smoking, relatives) and 220 synthetic test notes with labels (`notes.js`), runner (`node tests/run.js --write`), results (`RESULTS.md`)
- `overnight/` — research, data (CSV with sources), brief, deck sources, video, submission pack, run log

All patients and health centres in the demo are **synthetic**. Not a medical device. MIT licence.
