/* SYNTHETIC demo patients. Not real people, not real records.
   Written to resemble Finnish primary-care notes (with English gloss).
   Each case has a "without agent" timeline taken from the published
   medians we cite (see sources.js) so the comparison is honest about
   what is modelled. */
(function (g) {
  g.AJOISSA_CASES = [
    {
      id: "c1", name: "Matti K.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 64, sex: "M", bmi: 24, education: 2, copd: true, smoking: { ever: true, current: true, cigsPerDay: 20, years: 44 } },
      labs: { plt: 468, hb: 139 },
      codes: [{ code: "R05", daysAgo: 70 }, { code: "R05", daysAgo: 35 }],
      weights: [{ daysAgo: 70, kg: 79.5 }, { daysAgo: 0, kg: 75.5 }],
      history: [
        { daysAgo: 70, related: true, text: "Yskä 1 vk, flunssa. Kotihoito-ohjeet." },
        { daysAgo: 35, related: true, text: "Yskä jatkuu. Antibioottikuuri (amoksisilliini)." }
      ],
      record: {"gp": "Dr. A. Virtanen", "dx": ["J44.9 COPD"], "meds": ["Tiotropium inhaler"]},
      note: "Tulosyy: yskä, kolmas käynti saman vaivan vuoksi.\nEsitiedot: COPD, tupakoi 20 savuketta/pv, 44 vuotta. Edelliset käynnit 70 ja 35 vrk sitten, amoksisilliinikuuri ilman apua.\nNykytila: 64-v mies. Yskä jatkunut 10 viikkoa. Laihtunut 4 kg kahdessa kuukaudessa, ruokahalu huono. Ei veriyskää. Yskii aamuisin limaa, väri ei muuttunut.\nStatus: Yleistila hyvä. RR 142/86, p 78, SpO2 95 %. Keuhkoissa ei rahinoita. Sydän: ääni puhdas, rytmi säännöllinen. Kaulalla ei tunnu suurentuneita solmukkeita.\nArvio: pitkittynyt yskä tupakoitsijalla.\nSuunnitelma: PVK otettu, trombosyytit 468. Kontrolli tarvittaessa.",
      noteEn: "Reason for visit: cough, third visit for the same complaint.\nHistory: COPD, smokes 20 a day for 44 years. Earlier visits 70 and 35 days ago; a course of amoxicillin did not help.\nNow: 64-year-old man. Cough for 10 weeks. Lost 4 kg in two months, poor appetite. No coughing up blood. Morning phlegm, colour unchanged.\nExamination: General condition good. BP 142/86, pulse 78, SpO2 95 %. Lungs clear on auscultation. Heart sounds normal, regular rhythm. No palpable nodes in the neck.\nAssessment: prolonged cough in a smoker.\nPlan: blood count taken, platelets 468. Follow-up if needed.",
      headline: "Third visit for the same cough"
    },
    {
      id: "c2", name: "Laura S.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 45, sex: "F", smoking: { ever: false } },
      labs: { hb: 128 },
      history: [{ daysAgo: 21, related: true, text: "Kaulalla patti, todennäköisesti infektio. Kontrolli tarvittaessa." }],
      record: {"gp": "Dr. A. Virtanen", "dx": [], "meds": []},
      note: "Tulosyy: patti kaulalla.\nEsitiedot: terve, ei säännöllisiä lääkkeitä. Käynyt 21 vrk sitten, tulkittu infektioksi, kontrolli tarvittaessa.\nNykytila: 45-v nainen. Kaulalla oikealla suurentunut imusolmuke, kooltaan 2,5 cm, ollut 5 viikkoa, ei aristava. Yöhikoilua viime viikot ja kutinaa. Ei kuumetta.\nStatus: Yleistila hyvä. Nielu siisti, hampaistossa ei infektiota. Kainaloissa ja nivusissa ei tunnu suurentuneita solmukkeita.\nArvio: pitkittynyt imusolmukkeen suurentuma, B-oireita.\nSuunnitelma: PVK, CRP. Harkitaan jatkotutkimuksia.",
      noteEn: "Reason for visit: lump in the neck.\nHistory: healthy, no regular medication. Seen 21 days ago, thought to be an infection, follow-up if needed.\nNow: 45-year-old woman. Enlarged lymph node on the right side of the neck, 2.5 cm, present for 5 weeks, not tender. Night sweats in recent weeks and itching. No fever.\nExamination: General condition good. Throat clean, no dental infection. No enlarged nodes in the armpits or groin.\nAssessment: persistent lymph-node enlargement with B-symptoms.\nPlan: blood count, CRP. Further tests to be considered.",
      headline: "Neck lump that hasn't gone away"
    },
    {
      id: "c3", name: "Ritva H.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 74, sex: "F", bmi: 23, education: 1, smoking: { ever: true, current: false, cigsPerDay: 15, years: 35, quitYears: 9 } },
      labs: {},
      history: [],
      record: {"gp": "Dr. L. Mäkelä", "dx": ["I10 High blood pressure"], "meds": ["Amlodipine 5 mg"]},
      note: "Tulosyy: verta ysköksissä.\nEsitiedot: verenpainetauti, entinen tupakoitsija, lopettanut 9 vuotta sitten (15 savuketta/pv, 35 vuotta). Lääkkeenä amlodipiini.\nNykytila: 74-v nainen. Yskinyt verta kahtena aamuna tällä viikolla. Hengenahdistusta portaissa. Ei kuumetta.\nStatus: Yleistila hyvä. RR 156/88, p 84, SpO2 94 %. Keuhkoissa ei rahinoita. Nielu siisti.\nArvio: veriyskä entisellä tupakoitsijalla.\nSuunnitelma: keuhkokuva, PVK. Soitto kun tulokset valmiit.",
      noteEn: "Reason for visit: blood in the sputum.\nHistory: high blood pressure, former smoker, quit 9 years ago (15 a day for 35 years). On amlodipine.\nNow: 74-year-old woman. Coughed up blood on two mornings this week. Breathless on stairs. No fever.\nExamination: General condition good. BP 156/88, pulse 84, SpO2 94 %. Lungs clear. Throat clean.\nAssessment: coughing up blood in a former smoker.\nPlan: chest X-ray, blood count. Phone call when results are ready.",
      headline: "Blood in the sputum"
    },
    {
      id: "c4", name: "Heikki P.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 59, sex: "M", bmi: 29, education: 4, smoking: { ever: true, current: true, cigsPerDay: 10, years: 30 } },
      labs: {},
      history: [],
      record: {"gp": "Dr. L. Mäkelä", "dx": [], "meds": []},
      note: "Tulosyy: yskä flunssan jälkeen.\nEsitiedot: ei pitkäaikaissairauksia. Tupakoi 10/pv.\nNykytila: 59-v mies. Flunssan jälkeen yskä 2 viikkoa. Yleisvointi hyvä. Ei veriyskää, ei laihtumista, ei hengenahdistusta.\nStatus: Nielu lievästi punoittava. Keuhkoissa ei rahinoita. SpO2 97 %.\nArvio: infektion jälkeinen yskä.\nSuunnitelma: oireenmukainen hoito. Uusi käynti, jos oireet jatkuvat yli 3 viikkoa.",
      noteEn: "Reason for visit: cough after a cold.\nHistory: no chronic illness. Smokes 10 a day.\nNow: 59-year-old man. Cough for 2 weeks after a cold. Feels well otherwise. No blood, no weight loss, no breathlessness.\nExamination: Throat slightly red. Lungs clear. SpO2 97 %.\nAssessment: post-infectious cough.\nPlan: symptomatic treatment. New visit if symptoms last more than 3 weeks.",
      headline: "Cough after a cold"
    },
    {
      id: "c5", name: "Sari L.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 67, sex: "F", smoking: { ever: false } },
      labs: { hb: 98, ferritinLow: true },
      history: [{ daysAgo: 40, related: true, text: "Väsymys. Laboratoriokokeet." }],
      record: {"gp": "Dr. A. Virtanen", "dx": ["E03.9 Underactive thyroid"], "meds": ["Thyroxine 75 µg", "Iron 100 mg (new)"]},
      note: "Tulosyy: väsymys, laboratoriotulokset.\nEsitiedot: kilpirauhasen vajaatoiminta, tyroksiini. Käynyt 40 vrk sitten, laboratoriokokeet otettu.\nNykytila: 67-v nainen. Väsymystä 3 kuukautta. Hb 98, ferritiini matala. Ei näkyvää verenvuotoa. Suolen toiminnan muutos viime viikkoina.\nStatus: Yleistila hyvä, iho kalpea. RR 128/78, p 88. Vatsa pehmeä, ei resistenssiä.\nArvio: raudanpuuteanemian tyyppinen löydös.\nSuunnitelma: rautalääkitys aloitettu. Kontrolli-Hb 1 kk.",
      noteEn: "Reason for visit: tiredness, lab results.\nHistory: underactive thyroid, on thyroxine. Seen 40 days ago, labs taken.\nNow: 67-year-old woman. Tired for 3 months. Hb 98, low ferritin. No visible bleeding. Change in bowel habit in recent weeks.\nExamination: General condition good, pale skin. BP 128/78, pulse 88. Abdomen soft, no mass.\nAssessment: picture of iron-deficiency anaemia.\nPlan: iron started. Repeat Hb in 1 month.",
      headline: "Tired, with low iron"
    },
    {
      id: "c6", name: "Jorma V.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 52, sex: "M", smoking: { ever: false } },
      labs: {},
      history: [],
      record: {"gp": "Dr. L. Mäkelä", "dx": [], "meds": []},
      note: "Tulosyy: selkäkipu.\nEsitiedot: terve, ei säännöllisiä lääkkeitä. Työskentelee varastossa.\nNykytila: 52-v mies. Selkäkipu nostamisen jälkeen eilen. Ei säteilyä, ei puutumista. Yleisvointi hyvä.\nStatus: Lannerangan liikkuvuus kivun rajoittama. Lasègue negatiivinen molemmin puolin. Refleksit symmetriset.\nArvio: akuutti mekaaninen alaselän kipu.\nSuunnitelma: kipulääke, liikkeelle ohjaus. Sairausloma 3 pv.",
      noteEn: "Reason for visit: back pain.\nHistory: healthy, no regular medication. Works in a warehouse.\nNow: 52-year-old man. Back pain after lifting yesterday. No radiating pain, no numbness. Feels well otherwise.\nExamination: Lower-back movement limited by pain. Straight-leg raise negative on both sides. Reflexes symmetric.\nAssessment: acute mechanical low-back pain.\nPlan: painkiller, advice to keep moving. Sick leave 3 days.",
      headline: "Back pain after lifting"
    },
    {
      id: "c7", name: "Pentti R.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 68, sex: "M", bmi: 26, education: 2, smoking: { ever: true, current: false, cigsPerDay: 20, years: 38, quitYears: 6 } },
      labs: {},
      codes: [{ code: "R05", daysAgo: 62 }, { code: "R05", daysAgo: 0 }],
      weights: [{ daysAgo: 150, kg: 88 }, { daysAgo: 62, kg: 85.5 }, { daysAgo: 0, kg: 82.5 }],
      results: [{ test: "Chest X-ray", daysAgo: 60, abnormal: false, finding: "no focal findings" }],
      history: [{ daysAgo: 62, related: true, text: "Yskä 3 vk. Keuhkokuva otettu, normaali." }],
      record: {"gp": "Dr. A. Virtanen", "dx": ["I10 High blood pressure"], "meds": ["Ramipril 5 mg"]},
      note: "Tulosyy: kontrollikäynti.\nEsitiedot: entinen tupakoitsija, lopettanut 6 vuotta sitten. Verenpainetauti. Keuhkokuva 60 vrk sitten.\nNykytila: Yskä edelleen. Keuhkokuva oli normaali. Kotona ei mitattu painoa.\nStatus: Yleistila hyvä. Keuhkoissa ei rahinoita.\nArvio: ennallaan.\nSuunnitelma: Jatketaan seurantaa.",
      noteEn: "Reason for visit: follow-up.\nHistory: former smoker, quit 6 years ago. High blood pressure. Chest X-ray 60 days ago.\nNow: Still coughing. Chest X-ray was normal. Weight not measured at home.\nExamination: General condition good. Lungs clear.\nAssessment: unchanged.\nPlan: Continue to monitor.",
      headline: "The note says little — the record says more"
    },
    {
      id: "c8", name: "Aino M.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 58, sex: "F", smoking: { ever: false } },
      labs: {},
      results: [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 36, abnormal: true, followedUp: false, finding: "round shadow in the right upper zone, CT recommended" }],
      history: [],
      record: {"gp": "Dr. L. Mäkelä", "dx": ["I10 High blood pressure"], "meds": ["Ramipril 5 mg"]},
      note: "Tulosyy: verenpaineen kontrolli.\nEsitiedot: verenpainetauti, lääkkeenä ramipriili. Keuhkokuva otettu 36 vrk sitten muun tutkimuksen yhteydessä.\nNykytila: Ei uusia oireita. Kotimittaukset keskimäärin 134/82.\nStatus: RR 136/84, p 72. Sydän: ääni puhdas.\nArvio: verenpaine tavoitteessa.\nSuunnitelma: Lääkitys jatkuu ennallaan. Seuraava kontrolli 12 kk.",
      noteEn: "Reason for visit: blood-pressure check.\nHistory: high blood pressure, on ramipril. Chest X-ray taken 36 days ago during another investigation.\nNow: No new symptoms. Home readings average 134/82.\nExamination: BP 136/84, pulse 72. Heart sounds normal.\nAssessment: blood pressure at target.\nPlan: Medication unchanged. Next check in 12 months.",
      headline: "A result nobody acted on"
    },
    {
      id: "c9", name: "Eero T.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 66, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "fhb", test: "Stool test (F-hHb)", daysAgo: 75, value: 62, followedUp: false }],
      history: [{ daysAgo: 82, related: false, text: "Vatsan toiminta muuttunut, välillä verta ulosteessa. F-hHb pyydetty." }],
      record: {"gp": "Dr. L. Mäkelä", "dx": ["I10 High blood pressure"], "meds": ["Bisoprolol 5 mg"]},
      note: "Tulosyy: verenpainelääkityksen uusinta.\nEsitiedot: verenpainetauti. F-hHb pyydetty 82 vrk sitten.\nNykytila: Ei muuta asiaa.\nStatus: RR 138/84, p 70.\nArvio: verenpaine hyvässä hoitotasapainossa.\nSuunnitelma: Resepti uusittu vuodeksi.",
      noteEn: "Reason for visit: blood-pressure prescription renewal.\nHistory: high blood pressure. Stool test (F-hHb) requested 82 days ago.\nNow: Nothing else.\nExamination: BP 138/84, pulse 70.\nAssessment: blood pressure well controlled.\nPlan: Prescription renewed for a year.",
      headline: "A positive stool test, never followed up"
    },
    {
      id: "c10", name: "Kalevi N.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 63, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8, followedUp: false }],
      history: [{ daysAgo: 128, related: false, text: "Virtsaamisvaivoja. PSA otettu." }],
      record: {"gp": "Dr. A. Virtanen", "dx": ["M17.1 Knee osteoarthritis (probable)"], "meds": []},
      note: "Tulosyy: polvikipu.\nEsitiedot: PSA otettu 128 vrk sitten virtsaamisvaivojen vuoksi.\nNykytila: Polvikipu portaissa 2 viikkoa. Ei turvotusta. Ei vammaa.\nStatus: Oikea polvi: ei nestettä, liikelaajuudet normaalit, nivelrako aristaa mediaalisesti.\nArvio: todennäköinen nivelrikko.\nSuunnitelma: Fysioterapeutin ohjaus, kipulääke tarvittaessa.",
      noteEn: "Reason for visit: knee pain.\nHistory: PSA taken 128 days ago because of urinary symptoms.\nNow: Knee pain on stairs for 2 weeks. No swelling. No injury.\nExamination: Right knee: no fluid, normal range of movement, tender on the inner joint line.\nAssessment: probable osteoarthritis.\nPlan: Physiotherapy advice, painkiller if needed.",
      headline: "A raised PSA that was never repeated"
    },
    {
      id: "c11", name: "Tapio J.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 74, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "psa", test: "PSA", daysAgo: 140, value: 7.1, followedUp: false }],
      history: [],
      record: {"gp": "Dr. L. Mäkelä", "dx": ["I10 High blood pressure", "E11.9 Type 2 diabetes"], "meds": ["Metformin 1 g × 2", "Losartan 50 mg"]},
      note: "Tulosyy: vuosikontrolli.\nEsitiedot: verenpainetauti, tyypin 2 diabetes. PSA otettu 140 vrk sitten muiden kokeiden yhteydessä.\nNykytila: Vointi hyvä, ei virtsaamisvaivoja.\nStatus: RR 132/80. Jalkojen tunto normaali.\nArvio: hoitotasapaino hyvä.\nSuunnitelma: Lääkitys jatkuu. Seuraava kontrolli 12 kk.",
      noteEn: "Reason for visit: annual check.\nHistory: high blood pressure, type 2 diabetes. PSA taken 140 days ago with other tests.\nNow: Feels well, no urinary symptoms.\nExamination: BP 132/80. Normal sensation in the feet.\nAssessment: good control.\nPlan: Medication continues. Next check in 12 months.",
      headline: "Raised PSA at 74 — the agent stays silent"
    }
  ];
})(typeof window !== "undefined" ? window : globalThis);
