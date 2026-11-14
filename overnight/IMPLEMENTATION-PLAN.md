# Ajoissa — base implementation plan (v1, Sat 14.11.2026)

Written by Claude from what is decided so far. **Team: your pen-and-paper plan fills the same headings.** Lines marked **[TEAM]** are open and need your answer; lines marked **[CHECK]** need a source or a county's confirmation before we state them as fact.

## 1. What is switched on (one sentence)
A nightly job reads the county's own records, finds abnormal results that nobody followed up, and puts them on one web worklist for a named nurse — lung, bowel and prostate first; a professional decides every action.

## 2. Decisions already made
| Decision | Choice | Why |
|---|---|---|
| Form | Data analyst + its own worklist web page. A card inside the patient record is a later phase. | Counties run many record systems, often several at once (e.g. Varsinais-Suomen hyvinvointialue had Lifecare, Pegasos, Mediatri and Medix in production; Pohde is building on Esko; Uusimaa uses Apotti). One plug-in per system is not feasible for a pilot; pop-up cards risk alert overload (AstraZeneca mentor, not citable). |
| Capacity | Level 0 first: follow-ups that were already due. CT slots only as many as the county gives; the agent ranks who is proposed. | The system is overloaded; no new money assumed. |
| Cancers | Lung, bowel (colorectal), prostate. Lymphoma rule stays (it is our Finnish timing evidence). | Lung = Goal 3; bowel and prostate have the trial evidence for this design (Murphy 2015). |
| Legal basis | County's own records only (HE 159/2025, approved 21.4.2026). No private or occupational records in the pilot. | Stay inside law that exists. |
| Hereditary risk | Secondary. Family history is only used to avoid mistaking a relative's illness for the patient's. | Data is thin for lower-income groups; small share of cases. |
| Smoking | Not a yearly form. Ask at any visit when it is missing; read it from notes when it is there. | A form reaches the healthiest smokers first. |

## 3. How it runs (architecture)
1. **Extract (nightly, read-only):** from the county's data store: lab results (Hb, MCV, ferritin, PSA, F-hHb, platelets), imaging reports with the radiologist's "suspicious" marking, referrals and procedures (to know whether follow-up happened), visit codes (ICPC-2), age and sex; visit notes where available. **[CHECK]** which of these each pilot county's data store holds, and how fresh it is (mentor: "should be daily, varies").
2. **Engine (on the county's own servers):** the same deterministic rules as the demo. No patient data leaves the county. The optional AI reading of notes is off in phase 1.
3. **Worklist (web page, single sign-on):** one row per patient: what was found, how long overdue, the source, the proposed action. Buttons: approve, dismiss with reason, not my patient.
4. **Write-back:** phase 1 = the nurse books the follow-up in the normal record system and ticks it off; the next night's run sees the referral and closes the clock. No integration needed. Phase 2 = deep link / card where a system supports it.
5. **Log:** every view and decision is logged (HE 159/2025 requires access logging; patients can opt out).

**Works without free text.** All three Level 0 triggers use numbers, codes and dates. Notes add the symptom-based flags (the Matti case) where a county has them.

## 4. The three Level 0 triggers (copied from the trial, Finnish thresholds)
| Cancer | Flag when | And no … within | Not flagged |
|---|---|---|---|
| Lung | Chest X-ray or CT marked suspicious | CT, lung-clinic referral or repeat imaging in 30 days | under 30, known lung cancer, palliative care, lung-clinic review in last 6 months |
| Bowel | F-hHb ≥ 25 µg/g (10–25 if bowel symptoms recorded), or iron-deficiency anaemia (Hb ≤ 110, MCV ≤ 81, no ferritin ≥ 100) | colonoscopy referral in 60 days | under 40 or over 75, recent colonoscopy, known bowel cancer, heavy periods, pregnancy, other bleeding source, palliative care |
| Prostate | PSA above the laboratory's age limit (Fimlab: 2.5 / 3.5 / 4.5 / 6.5 µg/l) | repeat PSA, urology referral or biopsy in 90 days | under 40 or over 70, known prostate cancer, recent biopsy, prostatitis/UTI at the time, palliative care |

Sources: windows and exclusions Murphy et al., J Clin Oncol 2015 (cluster RCT, strong; outcome = time to work-up); thresholds Fimlab bulletin 150/2024 and Fimlab PSA limits; PSA restraint Käypä hoito 16.4.2025. Thresholds are settings: a county uses its own laboratory's limits.

## 5. People and time
| Role | Who | Time | Source / status |
|---|---|---|---|
| Owner | Chief physician of primary care **[TEAM: confirm title]** | steering, monthly | — |
| Reviewer | Named nurse per health centre (cancer nurse or care coordinator) **[TEAM]** | In the trial: one part-time reviewer ≈ 4 h/week chart review + 1–2 h/week messages for 72 primary-care clinicians | Murphy 2015 (US veterans' hospitals; Finnish hours unknown **[CHECK]**) |
| Clinical back-up | One GP per centre for unclear cases | ad hoc | — |
| Data | County data team: nightly extract, access rights | set-up, then maintenance | **[TEAM/CHECK]** |
| Expected yield | About 6 in 10 flags were real delays in the trial (PPV 59.6 %) | — | Murphy 2015 |

## 6. Cost drivers (no euro figures yet — we will not invent them)
- Nurse review hours (see above) — the main running cost. **[TEAM: hourly cost source, e.g. KT/THL unit costs]**
- Data-team set-up: one extract, one small server, sign-on.
- Follow-ups themselves: already clinically due, so not new demand — but they do get done sooner, which uses slots earlier.
- Possible funding line: roadmap measure 3.5.3 (€1.14 M for digital/AI early-detection tools). **[CHECK: open to county pilots?]**

## 7. KPIs (measured by the clocks, per health centre, monthly)
1. Share of flags acted on within 7 days.
2. Days from abnormal result to follow-up, before vs after (trial benchmark: 200 → 104 days for bowel).
3. Share of flags that were real delays (trial benchmark ≈ 60 %).
4. Flags per 1,000 visits by centre and age group (equity check).
5. Nurse hours per week.
Not a KPI in the pilot: stage or survival (too few cases in six months; no claim).

## 8. First 90 days
| Days | What | Done when |
|---|---|---|
| 1–30 | Three centres chosen; nurses named; data extract agreed; thresholds set to the county's laboratory limits | first test extract runs |
| 31–60 | Shadow run: worklist produced weekly, reviewed, nothing acted on; count real delays vs false flags; baseline days-to-follow-up from the last 12 months | PPV and baseline known |
| 61–90 | Live: nurses act on Level 0 flags; clocks run; first monthly report per centre | first report published |
| After | Add symptom flags from notes with a fixed number of CT slots; decide on phase 2 | steering decision |

## 9. Pilot county
Example: Pohde (North Ostrobothnia) — the Finnish route-timing study comes from Oulu (Kuitunen 2026). Mentor said "possibly yes" (not citable). **[TEAM: who do we name as contact?]**

## 10. What happens to a dismissed flag
Reason is chosen from a short list (already handled / not clinically relevant / patient declined / wrong patient) and logged. A dismissed flag does not return unless a new abnormal result arrives. Dismissal reasons are reviewed monthly to tune the rules. **[TEAM: agree the list]**

## 11. Risks we state openly
- Follow-up may have happened in private care and not be visible → shadow run measures this false-flag rate.
- Trial evidence is from the US veterans' system; lung arm was not significant (n = 19).
- Reading free-text notes is the weakest part (12–13 of 20 unseen test notes fully right); phase 1 does not depend on it.
- When CT slots are capped, a lower-risk patient waits longer. A clinician can override the order.
- PSA: overdiagnosis is the main harm; the agent never proposes a new PSA test.
