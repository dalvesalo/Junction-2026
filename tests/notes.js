/* Ajoissa reader test set — SYNTHETIC notes, written with their expected
   labels BEFORE the v2 engine was run on them.
   Part A: generated variants (each phrasing × positive / negated / with duration).
   Part B: hand-written hard cases (typos, slang, mixed language, distractors).
   Labels: pos = concepts that must be found as present,
           neg = concepts that must be found as negated,
           action = expected proposed action (only where it is unambiguous).
   Limitation: written by the same team that wrote the lexicon — this
   measures regressions and known traps, not real-world accuracy. */
(function (g) {
  const SMOKER = { age: 62, sex: "M", smoking: { ever: true, current: true, cigsPerDay: 20, years: 40 } };
  const NEVER = { age: 55, sex: "F", smoking: { ever: false } };
  const YOUNG = { age: 32, sex: "M", smoking: { ever: false } };
  const NODETAIL = { age: 66, sex: "M", smoking: { ever: true } };

  // Phrasings per concept: [positive phrases], [negated phrases]
  const BANK = {
    haemoptysis: [["yskinyt verta", "veriyskää", "veriset yskökset", "coughing up blood", "blood in sputum", "haemoptysis", "yskii verisiä yskösiä", "coughed blood this morning"],
                  ["ei veriyskää", "kiistää veriyskän", "no haemoptysis", "denies coughing up blood"]],
    cough: [["yskä", "yskää", "yskinyt", "cough", "coughing"], ["ei yskää", "no cough", "denies cough"]],
    dyspnoea: [["hengenahdistusta", "hengästyy portaissa", "short of breath", "breathless on exertion", "out of breath"], ["ei hengenahdistusta", "no shortness of breath", "not breathless"]],
    chestpain: [["rintakipua", "kylkikipua", "chest pain", "pain in the chest"], ["ei rintakipua", "no chest pain", "denies chest pain"]],
    weightloss: [["laihtunut 5 kg", "painonlaskua", "paino on laskenut", "lost weight", "weight loss of 6 kg"], ["ei laihtumista", "no weight loss", "denies weight loss"]],
    appetite: [["ruokahaluttomuutta", "ruokahalu huono", "poor appetite", "loss of appetite"], ["ruokahalu hyvä", "no loss of appetite"]],
    fatigue: [["väsymystä", "väsynyt", "uupunut", "fatigue", "tired all the time", "exhausted"], ["ei väsymystä", "no fatigue", "not tired"]],
    hoarseness: [["ääni käheä", "käheyttä", "hoarse voice"], ["ei käheyttä", "no hoarseness"]],
    lymph: [["suurentunut imusolmuke kaulalla", "kaulalla patti", "enlarged lymph node in the neck", "lump in the neck", "swollen lymph node"], ["ei suurentuneita imusolmukkeita", "no lymphadenopathy", "no neck lump"]],
    nightsweats: [["yöhikoilua", "hikoilee öisin", "night sweats"], ["ei yöhikoilua", "no night sweats"]],
    fever: [["kuumetta", "kuumeilua", "fever"], ["ei kuumetta", "afebrile, no fever"]],
    pruritus: [["kutinaa", "kutiaa", "itching", "pruritus"], ["ei kutinaa", "no itching"]],
    rectalbleed: [["verta ulosteessa", "veriuloste", "rectal bleeding", "blood in the stool"], ["ei verta ulosteessa", "no rectal bleeding"]],
    bowelchange: [["suolen toiminnan muutos", "change in bowel habit"], ["no change in bowel habit"]]
  };
  // "ruokahalu hyvä" is a normal finding, not a negation of a stated symptom: expect nothing.
  const NOTHING = new Set(["ruokahalu hyvä", "afebrile, no fever"]);

  const A = [];
  for (const [concept, [posList, negList]] of Object.entries(BANK)) {
    posList.forEach((p, i) => {
      A.push({ id: `A-${concept}-p${i}`, note: `Potilas kertoo: ${p}.`, patient: NEVER, pos: [concept], neg: [] });
      A.push({ id: `A-${concept}-d${i}`, note: `${p[0].toUpperCase() + p.slice(1)} for 4 weeks. Otherwise well.`, patient: NEVER, pos: [concept], neg: [], weeksMin: concept === "haemoptysis" ? null : 3 });
    });
    negList.forEach((n, i) => {
      if (NOTHING.has(n)) A.push({ id: `A-${concept}-n${i}`, note: `Status: ${n}.`, patient: NEVER, pos: [], neg: [concept], negOptional: true });
      else A.push({ id: `A-${concept}-n${i}`, note: `Status: ${n}.`, patient: NEVER, pos: [], neg: [concept] });
    });
  }
  // Mixed positive + negated in one note (negation must not leak across the comma)
  A.push({ id: "A-mix-1", note: "Yskä 5 viikkoa, ei veriyskää, laihtunut 3 kg.", patient: SMOKER, pos: ["cough", "weightloss"], neg: ["haemoptysis"], action: "lung_urgent" });
  A.push({ id: "A-mix-2", note: "Cough for six weeks and weight loss, but no fever.", patient: SMOKER, pos: ["cough", "weightloss"], neg: ["fever"], action: "lung_urgent" });
  A.push({ id: "A-mix-3", note: "Ei kuumetta, mutta yöhikoilua ja kaulalla patti 4 viikkoa.", patient: NEVER, pos: ["nightsweats", "lymph"], neg: ["fever"], action: "lymphoma_urgent" });

  // Part B — hand-written hard cases
  const B = [
    { id: "B01", note: "couching blood violently", patient: SMOKER, pos: ["haemoptysis"], severity: "haemoptysis", action: "emergency", why: "typo + severity (the bug that started v2)" },
    { id: "B02", note: "coughing blood violently since last night", patient: SMOKER, pos: ["haemoptysis"], severity: "haemoptysis", action: "emergency" },
    { id: "B03", note: "Yskinyt runsaasti verta eilen illalla, kupillisen verran.", patient: SMOKER, pos: ["haemoptysis"], severity: "haemoptysis", action: "emergency" },
    { id: "B04", note: "Hemoptysis x2 this week, small streaks in sputum.", patient: NEVER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "B05", note: "Heavy smoker, coughing up blood this week.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent", why: "'heavy' describes smoking, not bleeding" },
    { id: "B06", note: "Cough for two weeks after a cold, no blood.", patient: SMOKER, pos: ["cough"], neg: [], action: "safety_net", why: "'no blood' must not create haemoptysis" },
    { id: "B07", note: "Cough without blood for 4 weeks.", patient: SMOKER, pos: ["cough"], action: "lung_imaging" },
    { id: "B08", note: "Yskä 2 vk, ei verta, ei kuumetta.", patient: SMOKER, pos: ["cough"], neg: ["fever"], action: "safety_net" },
    { id: "B09", note: "Retired teacher, sits on the couch most of the day. Knee pain.", patient: NEVER, pos: [], action: "none", why: "retired ≠ tired, couch ≠ cough" },
    { id: "B10", note: "Kitchen renovation, hand cut. Wound care.", patient: NEVER, pos: [], action: "none", why: "kitchen ≠ itch" },
    { id: "B11", note: "Coughng for 5 weeks, smoker.", patient: SMOKER, pos: ["cough"], action: "lung_imaging" },
    { id: "B12", note: "Persistent cough, keeps coming back.", patient: SMOKER, pos: ["cough"], action: "lung_imaging", why: "persistence word without a number" },
    { id: "B13", note: "Yskä jatkunut viisi viikkoa.", patient: SMOKER, pos: ["cough"], weeks: { cough: 5 }, action: "lung_imaging" },
    { id: "B14", note: "Pitkittynyt yskä, toistuvasti vastaanotolla.", patient: SMOKER, pos: ["cough"], action: "lung_imaging" },
    { id: "B15", note: "Breathles on stairs for a month, losing weight.", patient: SMOKER, pos: ["dyspnoea", "weightloss"], action: "lung_urgent", why: "typo breathles" },
    { id: "B16", note: "Väsynyt ja laihtunut, ruokahalu kadonnut.", patient: SMOKER, pos: ["fatigue", "weightloss", "appetite"], action: "lung_urgent" },
    { id: "B17", note: "Ei laihtumista eikä yöhikoilua. Yskä 1 vk.", patient: NEVER, pos: ["cough"], neg: ["weightloss", "nightsweats"], action: "safety_net" },
    { id: "B18", note: "Denies weight loss, fever or night sweats. Neck lump 3 weeks.", patient: NEVER, pos: ["lymph"], neg: ["weightloss"], action: "lymphoma_urgent" },
    { id: "B19", note: "Swollen gland in the neck since August, itching at night.", patient: NEVER, pos: ["lymph", "pruritus"], action: "lymphoma_urgent" },
    { id: "B20", note: "Kaulalla kyhmy, ei aristava. Ollut 6 viikkoa.", patient: YOUNG, pos: ["lymph"], action: "lymphoma_urgent", why: "duration in the next sentence: we accept a miss here only if persistence is lost" },
    { id: "B21", note: "Coughing up blood twice, age 32, non-smoker.", patient: YOUNG, pos: ["haemoptysis"], action: "safety_net", why: "age < 40: NG12 haemoptysis rule does not apply; risk stays low" },
    { id: "B22", note: "Smoker, cough 4 weeks.", patient: NODETAIL, pos: ["cough"], action: "lung_imaging", why: "smoking detail missing: defaults must not crash" },
    { id: "B23", note: "Iron deficiency, Hb low. Blood in the stool on two occasions.", patient: { age: 70, sex: "F", smoking: { ever: false } }, pos: ["rectalbleed"], action: "colorectal_test" },
    { id: "B24", note: "Selkä kipeä nostamisen jälkeen.", patient: NEVER, pos: ["backpain"], action: "none" },
    { id: "B25", note: "Kuumeinen flunssa 3 pv, yskää.", patient: NEVER, pos: ["fever", "cough"], action: "safety_net" },
    { id: "B26", note: "Rintakipu rasituksessa, EKG normaali.", patient: SMOKER, pos: ["chestpain"], action: "lung_imaging" },
    { id: "B27", note: "No cough. No haemoptysis. No dyspnoea.", patient: SMOKER, pos: [], neg: ["cough", "haemoptysis", "dyspnoea"], action: "none" },
    { id: "B28", note: "Ääni kähisee 4 viikkoa, tupakoi.", patient: SMOKER, pos: ["hoarseness"], action: "safety_net", why: "hoarseness is not on the NG12 chest X-ray list" },
    { id: "B29", note: "Patient reports massive bleeding when coughing.", patient: SMOKER, pos: ["haemoptysis"], severity: "haemoptysis", action: "emergency" },
    { id: "B30", note: "Coughs every morning, small amount of clear phlegm, 2 weeks.", patient: SMOKER, pos: ["cough"], action: "safety_net" },
    { id: "B31", note: "Verta yskiessä joka aamu viikon ajan.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "B32", note: "Yskökset verisekaisia, ollut viikon.", patient: NEVER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "B33", note: "Has had a fever and a cough for three days, otherwise healthy.", patient: YOUNG, pos: ["fever", "cough"], action: "safety_net" },
    { id: "B34", note: "Itchy rash on both arms after new detergent.", patient: YOUNG, pos: ["pruritus"], action: "none" },
    { id: "B35", note: "Haemoptyis this morning, small amount.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent", why: "typo haemoptyis" },
    { id: "B36", note: "Lost a lot of weight over the summer, eating less.", patient: SMOKER, pos: ["weightloss"], action: "lung_imaging", why: "label corrected after run 1: weight loss alone gives 2.5 % (< 3 %), so chest imaging is the rule-based action" },
    { id: "B37", note: "Hengästyy, väsyy helposti. Ei yskää.", patient: NEVER, pos: ["dyspnoea"], neg: ["cough"], action: "safety_net" },
    { id: "B38", note: "Never smoked. Cough 6 weeks.", patient: NEVER, pos: ["cough"], action: "safety_net", why: "'never' negates smoking, not the cough" },
    { id: "B39", note: "Kontrolli. Vointi hyvä, ei oireita.", patient: NEVER, pos: [], action: "none" },
    { id: "B40", note: "Couch-surfing student, sore throat.", patient: YOUNG, pos: [], action: "none" }
  ];
  // Part C — held-out notes written after run 1 and NOT used to change the engine.
  // Whatever they score is reported as is.
  const C = [
    { id: "C01", note: "Yskä alkoi kesällä eikä ole hellittänyt, nyt 3 kk. Laihtunut.", patient: SMOKER, pos: ["cough", "weightloss"], action: "lung_urgent" },
    { id: "C02", note: "Bringing up blood-streaked phlegm for a week.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "C03", note: "Pt c/o SOB and fatigue x 6 wks.", patient: SMOKER, pos: ["dyspnoea", "fatigue"], action: "lung_urgent" },
    { id: "C04", note: "Kainalossa patti 4 vk, ei muita oireita.", patient: NEVER, pos: ["lymph"], action: "lymphoma_urgent" },
    { id: "C05", note: "Huono ruokahalu ja painoa lähtenyt 7 kg puolessa vuodessa.", patient: NEVER, pos: ["appetite", "weightloss"], action: "lung_imaging" },
    { id: "C06", note: "Tytär kertoo isän yskivän verta.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "C07", note: "No haemoptysis but productive cough 5 weeks.", patient: SMOKER, pos: ["cough"], neg: ["haemoptysis"], action: "lung_imaging" },
    { id: "C08", note: "Hengenahdistus pahentunut, ei rintakipua.", patient: SMOKER, pos: ["dyspnoea"], neg: ["chestpain"], action: "lung_imaging" },
    { id: "C09", note: "Annual check, BP 132/84. Wants travel vaccines.", patient: NEVER, pos: [], action: "none" },
    { id: "C10", note: "Hikoilee yöllä niin että lakanat kastuvat, kaulalla imusolmuke.", patient: NEVER, pos: ["nightsweats", "lymph"], action: "lymphoma_urgent" },
    { id: "C11", note: "Coughed up a large amount of blood an hour ago.", patient: SMOKER, pos: ["haemoptysis"], severity: "haemoptysis", action: "emergency" },
    { id: "C12", note: "Voice hoarse since flu, 2 weeks.", patient: NEVER, pos: ["hoarseness"], action: "safety_net" },
    { id: "C13", note: "Ulosteessa verta, vatsa toimii eri tavalla kuin ennen.", patient: { age: 64, sex: "M", smoking: { ever: false } }, pos: ["rectalbleed"], action: "colorectal_test" },
    { id: "C14", note: "Tired and run down, works night shifts.", patient: NEVER, pos: ["fatigue"], action: "safety_net" },
    { id: "C15", note: "Kova yskä, välillä verilimaa.", patient: SMOKER, pos: ["haemoptysis"], action: "lung_urgent" },
    { id: "C16", note: "Ei veriyskää eikä laihtumista, yskä 4 viikkoa.", patient: SMOKER, pos: ["cough"], neg: ["haemoptysis", "weightloss"], action: "lung_imaging" },
    { id: "C17", note: "Couched her concerns carefully; worried about her mother.", patient: NEVER, pos: [], action: "none" },
    { id: "C18", note: "Feverish, itchy skin, swollen nodes in groin for a month.", patient: NEVER, pos: ["fever", "pruritus", "lymph"], action: "lymphoma_urgent" },
    { id: "C19", note: "Kylkikipu kaatumisen jälkeen.", patient: NEVER, pos: ["chestpain"], action: "safety_net" },
    { id: "C20", note: "Hengästyy portaissa, tupakoinut 40 v.", patient: SMOKER, pos: ["dyspnoea"], action: "lung_imaging" }
  ];
  g.AJOISSA_TESTS = { A, B, C, patients: { SMOKER, NEVER, YOUNG, NODETAIL } };
})(typeof window !== "undefined" ? window : globalThis);
