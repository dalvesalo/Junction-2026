/* Ajoissa structured-record tests — SYNTHETIC records with the expected
   outcome written from the published definitions (Murphy 2015 windows and
   exclusions, Fimlab thresholds, Käypä hoito PSA advice), not from the code.
   expect: "flag" (result nobody acted on), "pending" (inside the window),
           "silent" (deliberately not flagged), "none". */
(function (g) {
  const M = (age, extra = {}) => ({ age, sex: "M", smoking: { ever: false }, ...extra });
  const F = (age, extra = {}) => ({ age, sex: "F", smoking: { ever: false }, ...extra });
  const rec = (id, patient, results, expect, why, more = {}) => ({ id, patient, results, expect, why, note: more.note || "Kontrollikäynti. Ei uusia oireita.", exclusions: more.exclusions, meds: more.meds, cancer: more.cancer });
  const R = [
    // Lung: suspicious chest imaging, 30-day window, age ≥ 30
    rec("R01", F(58), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 36, abnormal: true, finding: "round shadow" }], "flag", "36 d > 30 d", { cancer: "lung" }),
    rec("R02", F(58), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 12, abnormal: true, finding: "round shadow" }], "pending", "inside 30 d"),
    rec("R03", F(58), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 36, abnormal: true, followedUp: true, finding: "round shadow" }], "none", "followed up"),
    rec("R04", F(58), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 36, abnormal: false, finding: "normal" }], "none", "normal result"),
    rec("R05", M(27), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 50, abnormal: true, finding: "nodule" }], "silent", "age < 30"),
    rec("R06", M(70), [{ type: "chest_imaging", test: "Chest CT", daysAgo: 50, abnormal: true, finding: "nodule" }], "silent", "palliative care", { exclusions: ["palliative"] }),
    rec("R07", M(70), [{ type: "chest_imaging", test: "Chest CT", daysAgo: 50, abnormal: true, finding: "nodule" }], "silent", "known lung cancer", { exclusions: ["prior_lung_cancer"] }),
    rec("R08", M(61), [{ type: "chest_imaging", test: "Chest X-ray", daysAgo: 31, abnormal: true, finding: "mass" }], "flag", "31 d, just past the window", { cancer: "lung" }),
    // Bowel: stool test, 60-day window, age 40–75, Fimlab ≥ 25 positive, 10–<25 borderline if symptoms
    rec("R09", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 62 }], "flag", "positive, 75 d", { cancer: "colorectal" }),
    rec("R10", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 40, value: 62 }], "pending", "positive, inside 60 d"),
    rec("R11", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 6 }], "none", "negative (< 10)"),
    rec("R12", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 18 }], "none", "borderline, no symptoms recorded"),
    rec("R13", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 18 }], "flag", "borderline with bowel symptoms", { note: "Vatsakipuja ja suolen toiminnan muutos edelleen.", cancer: "colorectal" }),
    rec("R14", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 62 }], "silent", "colonoscopy done recently", { exclusions: ["colonoscopy_recent"] }),
    rec("R15", F(81), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 62 }], "silent", "age > 75"),
    rec("R16", F(36), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 62 }], "silent", "age < 40"),
    rec("R17", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 25 }], "flag", "exactly 25 = positive", { cancer: "colorectal" }),
    rec("R18", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 75, value: 62, followedUp: true }], "none", "colonoscopy referral exists"),
    // Bowel: iron-deficiency anaemia (Hb ≤ 110, MCV ≤ 81, no ferritin ≥ 100), 60-day window
    rec("R19", F(69), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 104, mcv: 77, ferritin: 8 }], "flag", "IDA not investigated", { cancer: "colorectal" }),
    rec("R20", F(69), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 104, mcv: 77, ferritin: 160 }], "none", "ferritin ≥ 100 rules out iron deficiency"),
    rec("R21", F(69), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 118, mcv: 77, ferritin: 8 }], "none", "Hb above 110"),
    rec("R22", F(69), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 104, mcv: 90, ferritin: 8 }], "none", "MCV above 81"),
    rec("R23", F(44), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 104, mcv: 77, ferritin: 8 }], "silent", "heavy periods recorded", { exclusions: ["menorrhagia"] }),
    rec("R24", M(58), [{ type: "ida", test: "Blood count", daysAgo: 80, hb: 104, mcv: 77 }], "flag", "no ferritin measured still counts", { cancer: "colorectal" }),
    rec("R25", M(58), [{ type: "ida", test: "Blood count", daysAgo: 30, hb: 104, mcv: 77, ferritin: 8 }], "pending", "inside 60 d"),
    // Prostate: PSA above the Fimlab age limit, 90-day window, age 40–70
    rec("R26", M(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8 }], "flag", "6.8 > 4.5 at 63, never repeated", { cancer: "prostate" }),
    rec("R27", M(63), [{ type: "psa", test: "PSA", daysAgo: 60, value: 6.8 }], "pending", "inside 90 d"),
    rec("R28", M(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 4.2 }], "none", "4.2 < 4.5 at 63"),
    rec("R29", M(55), [{ type: "psa", test: "PSA", daysAgo: 128, value: 4.2 }], "flag", "4.2 > 3.5 at 55", { cancer: "prostate" }),
    rec("R30", M(74), [{ type: "psa", test: "PSA", daysAgo: 140, value: 7.1 }], "silent", "over 70"),
    rec("R31", M(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8 }], "silent", "prostatitis at the time", { exclusions: ["prostatitis_recent"] }),
    rec("R32", M(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8, followedUp: true }], "none", "repeated / referred"),
    rec("R33", M(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 5.0, refHigh: 5.8 }], "none", "lab's own limit wins"),
    rec("R34", M(47), [{ type: "psa", test: "PSA", daysAgo: 128, value: 2.9 }], "flag", "2.9 > 2.5 under 50", { cancer: "prostate" }),
    rec("R35", F(63), [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8 }], "none", "not applicable"),
    rec("R36", M(38), [{ type: "psa", test: "PSA", daysAgo: 128, value: 6.8 }], "silent", "under 40"),
    // Nothing in the record
    rec("R37", M(60), [], "none", "empty record"),
    rec("R38", M(66), [{ type: "fhb", test: "F-hHb", daysAgo: 61, value: 300 }, { type: "psa", test: "PSA", daysAgo: 200, value: 9 }], "flag", "two overdue results; the longest overdue leads", { cancer: "prostate" })
  ];
  // Smoking history read from text: [text, age, expected]
  const S = [
    ["Tupakoi 20 savuketta/pv, 44 vuotta.", 64, { ever: true, current: true, packYears: 44 }],
    ["Tupakoinut askin päivässä 25 vuotta, lopettanut v. 2009.", 60, { ever: true, current: false, packYears: 25, quitYears: 17 }],
    ["Ei tupakoi.", 50, { ever: false }],
    ["Tupakoimaton.", 50, { ever: false }],
    ["Ei koskaan tupakoinut.", 50, { ever: false }],
    ["Never smoked.", 50, { ever: false }],
    ["Non-smoker.", 50, { ever: false }],
    ["Ex-smoker, 10 cigarettes a day for 30 years, quit 5 years ago.", 66, { ever: true, current: false, packYears: 15, quitYears: 5 }],
    ["Smoker.", 55, { ever: true, current: true, missing: 2 }],
    ["30 askivuotta, tupakoi edelleen.", 62, { ever: true, current: true, packYears: 30 }],
    ["Puoli askia päivässä 20 vuotta.", 45, { ever: true, current: true, packYears: 10 }],
    ["Entinen tupakoitsija.", 70, { ever: true, current: false, missing: 3 }],
    ["Smokes a pack a day, 40 years.", 61, { ever: true, current: true, packYears: 40 }],
    ["Yskä 2 viikkoa.", 40, { known: false }],
    ["Polvikipu. RR 130/80.", 40, { known: false }],
    ["Tupakointi alkanut 16-vuotiaana, 15 sav/vrk.", 56, { ever: true, current: true, packYears: 30 }],
    ["Quit smoking in 2015 after 20 pack-years.", 58, { ever: true, current: false, packYears: 20, quitYears: 11 }],
    ["Savuton.", 33, { ever: false }]
  ];
  // A relative's symptom is not the patient's: [note, concept that must NOT be positive]
  const X = [
    ["Isällä keuhkosyöpä, yskinyt verta ennen diagnoosia. Potilas itse oireeton.", "haemoptysis"],
    ["Äidillä laihtumista ja vatsakipuja ennen suolistosyöpää.", "weightloss"],
    ["Family history: brother had rectal bleeding at 50.", "rectalbleed"],
    ["Mother had night sweats before her lymphoma. Patient well.", "nightsweats"],
    ["Suvussa anemiaa.", "anaemia"]
  ];
  g.AJOISSA_RECORD_TESTS = { R, S, X };
})(typeof window !== "undefined" ? window : globalThis);
