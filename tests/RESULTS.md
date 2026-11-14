# Ajoissa reader test results

Engine 3.0, run 2026-11-14. All notes are **synthetic** (tests/notes.js); labels were written before each set was run.

## Dev set — 200 notes (160 generated variants + 40 hand-written hard cases)
Used while building v2. First run: 190/200 fully correct (precision 98 %, recall 97 %). After general fixes (Finnish partitive forms, list negation, follow-on duration sentence, long-word typos without context, "bleeding" as a blood word) and one corrected label (B36):

| Measure | Result |
|---|---|
| Finding precision | 100 % |
| Finding recall | 100 % |
| Negations recognised | 46/46 |
| Correct proposed action | 43/43 |
| Severity recognised | 4/4 |
| Notes fully correct | 200/200 |

| Concept | ICPC-2 | TP | FP | FN | Precision | Recall |
|---|---|---|---|---|---|---|
| Coughing up blood | R24 | 26 | 0 | 0 | 100 % | 100 % |
| Cough | R05 | 25 | 0 | 0 | 100 % | 100 % |
| Shortness of breath | R02 | 12 | 0 | 0 | 100 % | 100 % |
| Chest pain | A11 | 9 | 0 | 0 | 100 % | 100 % |
| Weight loss | T08 | 15 | 0 | 0 | 100 % | 100 % |
| Loss of appetite | T03 | 9 | 0 | 0 | 100 % | 100 % |
| Fatigue | A04 | 13 | 0 | 0 | 100 % | 100 % |
| Hoarse voice | R23 | 7 | 0 | 0 | 100 % | 100 % |
| Enlarged lymph node | B02 | 14 | 0 | 0 | 100 % | 100 % |
| Night sweats | A09 | 7 | 0 | 0 | 100 % | 100 % |
| Unexplained fever | A03 | 8 | 0 | 0 | 100 % | 100 % |
| Itching | S02 | 10 | 0 | 0 | 100 % | 100 % |
| Back pain | L02 | 1 | 0 | 0 | 100 % | 100 % |
| Rectal bleeding | D16 | 9 | 0 | 0 | 100 % | 100 % |
| Change in bowel habit | D18 | 4 | 0 | 0 | 100 % | 100 % |
| Diarrhoea or constipation | D11 | 0 | 0 | 0 | – | – |
| Abdominal pain | D01 | 0 | 0 | 0 | – | – |
| Anaemia or iron deficiency (stated) | B82 | 1 | 0 | 0 | 100 % | 100 % |

Remaining failures:
None.

## Held-out set — 20 notes written after the dev fixes

First run: 11/20 fully correct (precision 93 %, recall 58 %). It exposed one bug (a negated list ending in "eikä" also negated a symptom after the comma), which was fixed; that moved one note. The other misses are words the lexicon does not know (SOB, verilimaa, kainalossa patti, swollen nodes, blood-streaked phlegm, hikoilee yöllä, ulosteessa verta). They were left unfixed on purpose: this is the real limit of a fixed word list, and the reason for the AI reader (step 1B), whose suggestions must quote the note and be confirmed by the clinician.

| Measure | Result |
|---|---|
| Finding precision | 94 % |
| Finding recall | 67 % |
| Negations recognised | 4/4 |
| Correct proposed action | 13/20 |
| Severity recognised | 1/1 |
| Notes fully correct | 13/20 |

Failures (left as found):
- **C02** "Bringing up blood-streaked phlegm for a week." → missed haemoptysis; action none (expected lung_urgent)
- **C03** "Pt c/o SOB and fatigue x 6 wks." → missed dyspnoea; action lung_imaging (expected lung_urgent)
- **C04** "Kainalossa patti 4 vk, ei muita oireita." → missed lymph; action none (expected lymphoma_urgent)
- **C05** "Huono ruokahalu ja painoa lähtenyt 7 kg puolessa vuodessa." → missed appetite; action safety_net (expected lung_imaging)
- **C10** "Hikoilee yöllä niin että lakanat kastuvat, kaulalla imusolmuke." → missed lymph; missed nightsweats; action none (expected lymphoma_urgent)
- **C15** "Kova yskä, välillä verilimaa." → missed haemoptysis; false cough; action safety_net (expected lung_urgent)
- **C18** "Feverish, itchy skin, swollen nodes in groin for a month." → missed lymph; action none (expected lymphoma_urgent)

**Limitation:** the notes and labels were written by the team that wrote the lexicon. The dev score shows the known traps are handled; the held-out score is the more honest number, and still not a measure of real-world accuracy. That needs real, de-identified notes labelled by a clinician.

## Structured records, smoking history, relatives (v3)

Expected outcomes written from the published definitions (Murphy 2015 windows and exclusions, Fimlab thresholds, Käypä hoito PSA advice). Synthetic.

| Test | Result |
|---|---|
| Results nobody acted on: flag / wait / stay silent (38 records) | 38/38 |
| Smoking history read from text (18 phrases) | 18/18 |
| Relative's symptom not taken as the patient's (5 notes) | 5/5 |

No failures.
