/* =====================================================================
   AJOISSA agent engine — deterministic, auditable, explainable.
   Pipeline per primary-care contact:
     1. READ     — extract findings from free-text note (FI + EN lexicon,
                   negation + duration detection), structured labs, history
     2. WEIGH    — Bayesian risk: prior (PLCOm2012 for ever-smokers) × LR+
                   of extracted symptoms (published primary-care LRs)
     3. MATCH    — explicit referral rules (NICE NG12-style criteria, which
                   Finland's roadmap 2.5.2 plans to standardise)
     4. ACT      — propose one concrete action + start a pathway clock
     5. EXPLAIN  — every number in the output carries its source
   No step uses a black-box model. Same input → same output, always.
   ===================================================================== */
(function (global) {
  "use strict";

  /* ---------- 1. Lexicon --------------------------------------------- */
  // Each concept: Finnish + English surface forms (lower-case stems).
  const CONCEPTS = {
    haemoptysis: { label: "Coughing up blood", fi: "veriyskä", forms: ["veriysk", "verisekainen ysk", "veriset yskökset", "verta ysköksissä", "yskii verta", "yskinyt verta", "yskinyt verisiä", "haemoptysis", "hemoptysis", "coughing up blood", "blood-stained sputum", "blood in sputum"] },
    cough:       { label: "Cough", fi: "yskä", forms: ["ysk", "cough"] },
    dyspnoea:    { label: "Shortness of breath", fi: "hengenahdistus", forms: ["hengenahdist", "hengästy", "dyspnoe", "dyspne", "short of breath", "shortness of breath", "breathless"] },
    chestpain:   { label: "Chest pain", fi: "rintakipu", forms: ["rintakipu", "rintakehän kipu", "kylkikipu", "chest pain", "rib pain"] },
    weightloss:  { label: "Weight loss", fi: "laihtuminen", forms: ["laihtun", "laihtumi", "painonlasku", "paino laskenut", "weight loss", "lost weight", "losing weight"] },
    appetite:    { label: "Loss of appetite", fi: "ruokahaluttomuus", forms: ["ruokahaluttom", "ruokahalu huono", "ruokahalu heikentyn", "ei ruokahalua", "appetite loss", "loss of appetite", "poor appetite"] },
    fatigue:     { label: "Fatigue", fi: "väsymys", forms: ["väsymy", "väsynyt", "uupumus", "fatigue", "tired"] },
    hoarseness:  { label: "Hoarse voice", fi: "äänen käheys", forms: ["käheä", "käheys", "ääni käheä", "hoarse"] },
    lymph:       { label: "Enlarged lymph node", fi: "suurentunut imusolmuke", forms: ["imusolmuke suurentun", "suurentunut imusolmuke", "suurentuneet imusolmukkeet", "patti kaula", "patti kainalo", "kyhmy kaula", "lymphadenopathy", "enlarged lymph node", "lump in neck", "neck lump"] },
    nightsweats: { label: "Night sweats", fi: "yöhikoilu", forms: ["yöhikoil", "hikoilee öisin", "night sweat"] },
    fever:       { label: "Unexplained fever", fi: "kuume", forms: ["kuumeil", "lämpöil", "kuume", "fever"] },
    pruritus:    { label: "Itching", fi: "kutina", forms: ["kutin", "kutiaa", "pruritus", "itch"] },
    backpain:    { label: "Back pain", fi: "selkäkipu", forms: ["selkäkipu", "selkä kipeä", "back pain", "lumbago"] },
    rectalbleed: { label: "Rectal bleeding", fi: "peräsuolen verenvuoto", forms: ["veriuloste", "verta ulosteessa", "peräsuolen verenvuoto", "rectal bleeding", "blood in stool"] },
    bowelchange: { label: "Change in bowel habit", fi: "suolen toiminnan muutos", forms: ["suolen toiminnan muutos", "ulostamistottumu", "change in bowel", "bowel habit"] }
  };

  const NEGATORS = ["ei ", "eikä", "ei ole", "kiistää", "kieltää", "negat", "no ", "denies", "without", "not ", "ilman "];
  const STOP = [".", ";", "\n", " mutta ", " but ", " however "];

  // Published positive likelihood ratios in primary care (lung cancer).
  // Source keys resolve in sources.js
  const LUNG_LR = {
    haemoptysis: { lr: 13.2, src: "hamilton2005" },
    weightloss:  { lr: 6.2,  src: "hamilton2005" },
    appetite:    { lr: 4.8,  src: "hamilton2005" },
    dyspnoea:    { lr: 3.6,  src: "hamilton2005" },
    chestpain:   { lr: 3.3,  src: "hamilton2005" },
    cough:       { lr: 2.5,  src: "iyen2013" },
    fatigue:     { lr: 2.3,  src: "hamilton2005" },
    hoarseness:  { lr: 1.9,  src: "iyen2013" }
  };

  const THRESHOLDS = {
    urgent: 0.03,   // NICE NG12: refer when PPV ≥ 3 %
    watch: 0.01     // below: safety-net only
  };

  /* ---------- helpers ------------------------------------------------ */
  function norm(s) { return " " + s.toLowerCase().replace(/\s+/g, " ") + " "; }

  function clauseAround(text, idx) {
    let start = 0, end = text.length;
    for (const s of STOP) {
      const b = text.lastIndexOf(s, idx); if (b >= 0 && b + s.length > start) start = b + s.length;
      const a = text.indexOf(s, idx); if (a >= 0 && a < end) end = a;
    }
    return { start, end, text: text.slice(start, end) };
  }

  function isNegated(text, idx) {
    const c = clauseAround(text, idx);
    const before = text.slice(Math.max(c.start, idx - 28), idx);
    return NEGATORS.some(n => before.includes(n));
  }

  function durationWeeks(clause) {
    const m = clause.match(/(\d+)\s*(viik|vk|week|wk|kuukau|kk|month|päiv|pv|day)/);
    if (!m) return null;
    const n = parseInt(m[1], 10); const u = m[2];
    if (/kuukau|kk|month/.test(u)) return Math.round(n * 4.3);
    if (/päiv|pv|day/.test(u)) return Math.round(n / 7 * 10) / 10;
    return n;
  }

  /* ---------- 1. READ ------------------------------------------------ */
  function extract(note) {
    const t = norm(note);
    const found = [];
    const taken = [];
    // longest forms first so "veriyskä" wins over "yskä"
    const all = [];
    Object.entries(CONCEPTS).forEach(([key, c]) => c.forms.forEach(f => all.push({ key, f })));
    all.sort((a, b) => b.f.length - a.f.length);
    for (const { key, f } of all) {
      let from = 0, idx;
      while ((idx = t.indexOf(f, from)) >= 0) {
        from = idx + f.length;
        if (taken.some(([a, b]) => idx < b && idx + f.length > a)) continue;
        taken.push([idx, idx + f.length]);
        const clause = clauseAround(t, idx);
        found.push({
          concept: key,
          label: CONCEPTS[key].label,
          fi: CONCEPTS[key].fi,
          surface: f,
          index: idx - 1,
          length: f.length,
          negated: isNegated(t, idx),
          weeks: durationWeeks(clause.text)
        });
      }
    }
    // collapse duplicates: keep a positive mention over a negated one
    const byConcept = {};
    for (const x of found) {
      const prev = byConcept[x.concept];
      if (!prev || (prev.negated && !x.negated)) byConcept[x.concept] = x;
      else if (!prev.weeks && x.weeks) prev.weeks = x.weeks;
    }
    return { mentions: found, findings: Object.values(byConcept) };
  }

  /* ---------- 2. WEIGH ----------------------------------------------- */
  // PLCOm2012 (Tammemägi et al., NEJM 2013) — 6-year lung cancer risk, ever-smokers.
  function plcom2012(p) {
    const s = p.smoking || {};
    if (!s.ever) return null;
    const lo = 0.0778868 * (p.age - 62)
      - 0.0812744 * ((p.education ?? 4) - 4)
      - 0.0274194 * ((p.bmi ?? 27) - 27)
      + 0.3553063 * (p.copd ? 1 : 0)
      + 0.4589971 * (p.cancerHistory ? 1 : 0)
      + 0.587185 * (p.familyLungCancer ? 1 : 0)
      + 0.2597431 * (s.current ? 1 : 0)
      - 1.822606 * (10 / Math.max(1, s.cigsPerDay) - 0.4021541613)
      + 0.0317321 * (s.years - 27)
      - 0.0308572 * ((s.current ? 0 : (s.quitYears ?? 0)) - 10)
      - 4.532506;
    return Math.exp(lo) / (1 + Math.exp(lo));
  }

  function lungRisk(patient, findings, history) {
    const pl = plcom2012(patient);
    // PLCOm2012 is a 6-year risk; spread evenly to an approximate 1-year prior (constant-hazard simplification).
    // Never-smokers: illustrative prior from Okoli 2018 worked example (5-year 0.124 % for a 61-y never-smoker) → per year.
    const prior = pl != null ? pl / 6 : 0.00124 / 5;
    const priorSrc = pl != null ? "plcom2012" : "okoli2018";
    // A cough only counts if persistent (≥ 3 weeks) or the patient keeps coming back with it.
    const persistent = f => f.concept !== "cough" || (f.weeks || 0) >= 3 || (history || []).some(h => h.daysAgo <= 90 && h.related);
    const positives = findings.filter(f => !f.negated && LUNG_LR[f.concept] && persistent(f));
    // Independence is not guaranteed → use the two strongest LRs only (conservative, as RAT pairs do)
    const ranked = positives.map(f => ({ ...f, ...LUNG_LR[f.concept] })).sort((a, b) => b.lr - a.lr);
    const used = ranked.slice(0, 2);
    const ignored = ranked.slice(2);
    let odds = prior / (1 - prior);
    const steps = [{ label: pl != null ? "Baseline 1-year risk (PLCOm2012 ÷ 6, smoking history)" : "Baseline 1-year risk (never-smoker)", value: prior, src: priorSrc }];
    for (const u of used) {
      odds *= u.lr;
      steps.push({ label: `× ${u.label} (LR ${u.lr})`, value: odds / (1 + odds), src: u.src });
    }
    const post = odds / (1 + odds);
    return { prior, posterior: post, steps, used, ignored };
  }

  /* ---------- 3. MATCH (explicit rules) ------------------------------ */
  function rules(patient, findings, labs, history) {
    const pos = k => findings.some(f => f.concept === k && !f.negated);
    const wk = k => (findings.find(f => f.concept === k && !f.negated) || {}).weeks || 0;
    const hits = [];
    const age = patient.age;
    if (age >= 40 && pos("haemoptysis")) hits.push({ id: "NG12-lung-1", track: "lung", level: "urgent", text: "Age ≥ 40 with unexplained haemoptysis", src: "nice_ng12" });
    const repeatVisits = (history || []).filter(h => h.daysAgo <= 90 && h.related).length;
    // A cough counts as "unexplained" only if it has lasted ≥ 3 weeks (or keeps bringing the patient back)
    const coughPersistent = pos("cough") && (wk("cough") >= 3 || repeatVisits >= 1);
    const lungSx = ["fatigue", "dyspnoea", "chestpain", "weightloss", "appetite"].filter(pos).concat(coughPersistent ? ["cough"] : []);
    if (age >= 40 && patient.smoking && patient.smoking.ever && lungSx.length >= 1)
      hits.push({ id: "NG12-lung-2", track: "lung", level: "imaging", text: `Age ≥ 40, ever-smoker, ${lungSx.length} unexplained chest/constitutional symptom(s)`, src: "nice_ng12" });
    if (age >= 40 && lungSx.length >= 2)
      hits.push({ id: "NG12-lung-3", track: "lung", level: "imaging", text: "Age ≥ 40 with ≥ 2 unexplained lung-cancer symptoms", src: "nice_ng12" });
    if (labs && labs.plt && labs.plt > 400)
      hits.push({ id: "PLT", track: "any", level: patient.sex === "M" ? "urgent" : "imaging", text: `Platelets ${labs.plt} ×10⁹/L (> 400): 1-year cancer incidence ${patient.sex === "M" ? "11.6 %" : "6.2 %"} in primary-care cohort`, src: "bailey2017" });
    if (pos("lymph") && (wk("lymph") >= 3 || pos("nightsweats") || pos("fever") || pos("pruritus") || pos("weightloss")))
      hits.push({ id: "NG12-lymph", track: "lymphoma", level: "urgent", text: "Unexplained lymphadenopathy" + (wk("lymph") ? ` for ${Math.round(wk("lymph"))} wk` : "") + " with B-symptoms or persistence", src: "nice_ng12" });
    if (labs && labs.hb && labs.hb < (patient.sex === "M" ? 130 : 117) && labs.ferritinLow)
      hits.push({ id: "IDA", track: "colorectal", level: "test", text: `Iron-deficiency anaemia (Hb ${labs.hb} g/L): test faecal haemoglobin (FIT)`, src: "nice_dg56" });
    if (age >= 40 && (pos("rectalbleed") || pos("bowelchange")))
      hits.push({ id: "NG12-crc", track: "colorectal", level: "test", text: "Age ≥ 40 with rectal bleeding or bowel-habit change: FIT", src: "nice_dg56" });
    // Missed-opportunity pattern: repeat consultations for the same unresolved complaint
    const repeat = repeatVisits;
    if (repeat >= 2)
      hits.push({ id: "REPEAT", track: "pattern", level: "imaging", text: `${repeat + 1}${repeat + 1 === 3 ? "rd" : "th"} visit in 90 days for the same unresolved complaint`, src: "lyratzopoulos2012" });
    return hits;
  }

  /* ---------- 4. ACT ------------------------------------------------- */
  const ACTIONS = {
    lung_urgent: { title: "Order thorax CT directly — urgent cancer-suspicion slot", target: 7, clock: ["CT done", "CT reported", "Specialist decision", "Diagnosis", "Treatment start"], why: "Primary-care CT access is the Nordic norm (90–100 % of units) but < 10 % in Finland." },
    lung_imaging: { title: "Order chest imaging now and book a 2-week safety-net review", target: 14, clock: ["Imaging done", "Result reviewed", "Safety-net review"], why: "Persistent symptoms in a high-risk patient: investigate now rather than at the next visit." },
    lymphoma_urgent: { title: "Urgent neck ultrasound + needle biopsy referral (lymphoma suspicion)", target: 7, clock: ["Ultrasound", "Biopsy", "Specialist visit", "Diagnosis", "Treatment start"], why: "DLBCL: the public route reaches treatment ~84 days later than the occupational route; the gap builds up before the specialist." },
    colorectal_test: { title: "Send FIT (faecal haemoglobin) test today", target: 14, clock: ["FIT returned", "Result acted on"], why: "FIT triage is already rolling out in Finland; the agent makes sure the result is acted on." },
    any_urgent: { title: "Raised platelets: review for occult cancer — chest imaging + targeted work-up", target: 14, clock: ["Repeat FBC", "Imaging", "Review"], why: "One-third of patients with thrombocytosis and lung or colorectal cancer had no other symptom." },
    safety_net: { title: "No referral now — automatic safety-net check-in in 3 weeks", target: 21, clock: ["Check-in"], why: "If the cough has not resolved in 3 weeks, the agent re-opens the case." },
    none: { title: "No cancer signal — no action", target: null, clock: [], why: "Specificity matters: the agent stays silent on routine visits." }
  };

  const LEVEL_ORDER = { urgent: 3, imaging: 2, test: 1 };

  function decide(risk, hits, findings) {
    const lungPost = risk.posterior;
    const top = hits.slice().sort((a, b) => (LEVEL_ORDER[b.level] || 0) - (LEVEL_ORDER[a.level] || 0))[0];
    if (hits.some(h => h.track === "lymphoma")) return { key: "lymphoma_urgent", ...ACTIONS.lymphoma_urgent };
    if (lungPost >= THRESHOLDS.urgent || hits.some(h => h.id === "NG12-lung-1")) return { key: "lung_urgent", ...ACTIONS.lung_urgent };
    if (hits.some(h => h.id === "PLT")) return { key: "any_urgent", ...ACTIONS.any_urgent };
    if (hits.some(h => h.track === "lung" || h.track === "pattern") && lungPost >= THRESHOLDS.watch) return { key: "lung_imaging", ...ACTIONS.lung_imaging };
    if (hits.some(h => h.track === "colorectal")) return { key: "colorectal_test", ...ACTIONS.colorectal_test };
    if (findings.some(f => !f.negated && LUNG_LR[f.concept])) return { key: "safety_net", ...ACTIONS.safety_net };
    return { key: "none", ...ACTIONS.none };
  }

  /* ---------- run the full pipeline ---------------------------------- */
  function assess(c) {
    const ex = extract(c.note);
    const risk = lungRisk(c.patient, ex.findings, c.history);
    const hits = rules(c.patient, ex.findings, c.labs, c.history);
    const action = decide(risk, hits, ex.findings);
    const trace = [
      { step: "Read", text: `${ex.findings.length} finding(s) in the note — ${ex.findings.filter(f => f.negated).length} explicitly negated` },
      { step: "Weigh", text: `Lung-cancer probability ${(risk.prior * 100).toFixed(2)} % → ${(risk.posterior * 100).toFixed(1)} %` },
      { step: "Match", text: hits.length ? `${hits.length} referral rule(s) met` : "No referral rule met" },
      { step: "Act", text: action.title }
    ];
    return { extraction: ex, risk, hits, action, trace };
  }

  global.Ajoissa = { CONCEPTS, LUNG_LR, THRESHOLDS, ACTIONS, extract, plcom2012, lungRisk, rules, decide, assess };
})(typeof window !== "undefined" ? window : globalThis);
