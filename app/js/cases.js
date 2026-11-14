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
      note: "64-v mies. Yskä jatkunut 10 viikkoa, kolmas käynti saman vaivan vuoksi. Laihtunut 4 kg kahdessa kuukaudessa, ruokahalu huono. Ei veriyskää. Tupakoi 20 savuketta/pv, 44 vuotta. Keuhkoissa ei rahinoita.",
      noteEn: "64-year-old man. Cough for 10 weeks, third visit for the same complaint. Lost 4 kg in two months, poor appetite. No coughing up blood. Smokes 20 a day for 44 years. Lungs clear on auscultation.",
      headline: "Third visit for the same cough"
    },
    {
      id: "c2", name: "Laura S.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 45, sex: "F", smoking: { ever: false } },
      labs: { hb: 128 },
      history: [{ daysAgo: 21, related: true, text: "Kaulalla patti, todennäköisesti infektio. Kontrolli tarvittaessa." }],
      note: "45-v nainen. Kaulalla oikealla suurentunut imusolmuke, kooltaan 2,5 cm, ollut 5 viikkoa, ei aristava. Yöhikoilua viime viikot ja kutinaa. Ei kuumetta.",
      noteEn: "45-year-old woman. Enlarged lymph node on the right side of the neck, 2.5 cm, present for 5 weeks, not tender. Night sweats in recent weeks and itching. No fever.",
      headline: "Neck lump that hasn't gone away"
    },
    {
      id: "c3", name: "Ritva H.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 74, sex: "F", bmi: 23, education: 1, smoking: { ever: true, current: false, cigsPerDay: 15, years: 35, quitYears: 9 } },
      labs: {},
      history: [],
      note: "74-v nainen, entinen tupakoitsija. Yskinyt verta kahtena aamuna tällä viikolla. Hengenahdistusta portaissa. Ei kuumetta.",
      noteEn: "74-year-old woman, former smoker. Coughed up blood on two mornings this week. Breathless on stairs. No fever.",
      headline: "Blood in the sputum"
    },
    {
      id: "c4", name: "Heikki P.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 59, sex: "M", bmi: 29, education: 4, smoking: { ever: true, current: true, cigsPerDay: 10, years: 30 } },
      labs: {},
      history: [],
      note: "59-v mies. Flunssan jälkeen yskä 2 viikkoa. Yleisvointi hyvä. Ei veriyskää, ei laihtumista, ei hengenahdistusta. Tupakoi 10/pv.",
      noteEn: "59-year-old man. Cough for 2 weeks after a cold. Feels well otherwise. No blood, no weight loss, no breathlessness. Smokes 10 a day.",
      headline: "Cough after a cold"
    },
    {
      id: "c5", name: "Sari L.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 67, sex: "F", smoking: { ever: false } },
      labs: { hb: 98, ferritinLow: true },
      history: [{ daysAgo: 40, related: true, text: "Väsymys. Laboratoriokokeet." }],
      note: "67-v nainen. Väsymystä 3 kuukautta. Hb 98, ferritiini matala. Ei näkyvää verenvuotoa. Suolen toiminnan muutos viime viikkoina.",
      noteEn: "67-year-old woman. Tired for 3 months. Hb 98, low ferritin. No visible bleeding. Change in bowel habit in recent weeks.",
      headline: "Tired, with low iron"
    },
    {
      id: "c6", name: "Jorma V.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 52, sex: "M", smoking: { ever: false } },
      labs: {},
      history: [],
      note: "52-v mies. Selkäkipu nostamisen jälkeen eilen. Ei säteilyä, ei puutumista. Yleisvointi hyvä.",
      noteEn: "52-year-old man. Back pain after lifting yesterday. No radiating pain, no numbness. Feels well otherwise.",
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
      note: "Kontrollikäynti. Yskä edelleen. Keuhkokuva oli normaali. Jatketaan seurantaa.",
      noteEn: "Follow-up visit. Still coughing. Chest X-ray was normal. Continue to monitor.",
      headline: "The note says little — the record says more"
    },
    {
      id: "c8", name: "Aino M.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 58, sex: "F", smoking: { ever: false } },
      labs: {},
      results: [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 36, abnormal: true, followedUp: false, finding: "round shadow in the right upper zone, CT recommended" }],
      history: [],
      note: "Verenpaineen kontrolli. Ei uusia oireita. Lääkitys jatkuu ennallaan.",
      noteEn: "Blood-pressure check. No new symptoms. Medication unchanged.",
      headline: "A result nobody acted on"
    },
    {
      id: "c9", name: "Eero T.", synthetic: true, centre: "Health centre C (suburban)",
      patient: { age: 66, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "fhb", test: "Stool test (F-hHb)", daysAgo: 75, value: 62, followedUp: false }],
      history: [{ daysAgo: 82, related: false, text: "Vatsan toiminta muuttunut, välillä verta ulosteessa. F-hHb pyydetty." }],
      note: "Verenpainelääkityksen uusinta. RR 138/84. Ei muuta.",
      noteEn: "Blood-pressure prescription renewal. BP 138/84. Nothing else.",
      headline: "A positive stool test, never followed up"
    },
    {
      id: "c10", name: "Kalevi N.", synthetic: true, centre: "Health centre A (rural)",
      patient: { age: 63, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8, followedUp: false }],
      history: [{ daysAgo: 128, related: false, text: "Virtsaamisvaivoja. PSA otettu." }],
      note: "Polvikipu portaissa 2 viikkoa. Ei turvotusta.",
      noteEn: "Knee pain on stairs for 2 weeks. No swelling.",
      headline: "A raised PSA that was never repeated"
    },
    {
      id: "c11", name: "Tapio J.", synthetic: true, centre: "Health centre B (urban)",
      patient: { age: 74, sex: "M", smoking: { ever: false } },
      labs: {},
      results: [{ type: "psa", test: "PSA", daysAgo: 140, value: 7.1, followedUp: false }],
      history: [],
      note: "Vuosikontrolli. Vointi hyvä, ei virtsaamisvaivoja.",
      noteEn: "Annual check. Feels well, no urinary symptoms.",
      headline: "Raised PSA at 74 — the agent stays silent"
    }
  ];
})(typeof window !== "undefined" ? window : globalThis);
