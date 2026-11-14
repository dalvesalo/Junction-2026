/* =====================================================================
   AJOISSA agent engine v2 — deterministic, auditable, explainable.
   Pipeline per primary-care contact:
     1. READ   — (A) rule reader: Finnish/English lexicon mapped to ICPC-2
                 codes; word-start matching (Finnish endings); one-letter
                 typo correction only next to medical words; phrase patterns
                 ("cough … blood" = coughing up blood); negation scope;
                 duration; severity and persistence words.
                 (B) optional AI reader: fixed concept list, must quote the
                 note word for word; reconcile() drops anything it cannot
                 find in the note and marks AI-only findings "to confirm".
     2. DATA   — structured signals: ICPC-2 visit codes, measured weight
                 loss (> 5 % within 12 months), repeat raised platelets,
                 abnormal results with no follow-up, recent normal chest X-ray,
                 repeat antibiotic courses.
     3. WEIGH  — Bayesian lung-cancer risk: PLCOm2012 prior (÷ 6 → 1 year) ×
                 the two strongest published primary-care LR+.
     4. MATCH  — explicit referral rules (NICE NG12 style). Severity words
                 change urgency only — never the risk number.
     5. ACT    — one proposed action + a pathway clock. A human decides.
   Same input → same output. No step is a black box.
   ===================================================================== */
(function (global) {
  "use strict";

  /* ---------- 1. Lexicon ---------------------------------------------
     forms: lower-case stems, matched at the start of a word.
     icpc:  ICPC-2 code used in Finnish primary care (THL code service).
     typo:  whole words eligible for one-letter typo correction.           */
  const CONCEPTS = {
    haemoptysis: { label: "Coughing up blood", fi: "veriyskä", icpc: "R24",
      forms: ["veriysk", "verisekainen ysk", "verisekaisia ysk", "veriset yskökset", "verisiä yskösiä", "verta ysköksissä", "verta yskiessä", "yskii verta", "yskinyt verta", "yskinyt verisiä", "yskii verisiä", "haemoptysis", "hemoptysis", "coughing up blood", "coughed up blood", "coughs up blood", "coughing blood", "coughed blood", "blood-stained sputum", "blood stained sputum", "bloody sputum", "blood in sputum", "blood in the sputum", "blood in phlegm"],
      typo: ["haemoptysis", "hemoptysis", "veriyskä"] },
    cough: { label: "Cough", fi: "yskä", icpc: "R05", forms: ["ysk", "cough"], typo: ["coughing", "coughed", "cough", "yskää", "yskinyt"] },
    dyspnoea: { label: "Shortness of breath", fi: "hengenahdistus", icpc: "R02",
      forms: ["hengenahdist", "hengästy", "hengen ahdist", "hengitysvaikeu", "dyspnoe", "dyspne", "short of breath", "shortness of breath", "breathless", "out of breath"],
      typo: ["hengenahdistus", "hengenahdistusta", "breathless", "breathlessness", "dyspnoea", "dyspnea"] },
    chestpain: { label: "Chest pain", fi: "rintakipu", icpc: "A11", forms: ["rintakipu", "rintakehän kipu", "kylkikipu", "chest pain", "rib pain", "pain in the chest", "pain in chest"], typo: ["rintakipu", "rintakipua"] },
    weightloss: { label: "Weight loss", fi: "laihtuminen", icpc: "T08",
      forms: ["laihtun", "laihtumi", "laihtuu", "painonlasku", "paino laskenut", "paino on laskenut", "painoa lähtenyt", "weight loss", "lost weight", "losing weight", "lost some weight", "lost a lot of weight"],
      typo: ["laihtunut", "laihtuminen", "painonlasku"] },
    appetite: { label: "Loss of appetite", fi: "ruokahaluttomuus", icpc: "T03", forms: ["ruokahaluttom", "ruokahalu huono", "ruokahalu heikentyn", "ruokahalu kadonnut", "ei ruokahalua", "appetite loss", "loss of appetite", "poor appetite", "no appetite", "off food"], typo: ["ruokahaluttomuus", "appetite"] },
    fatigue: { label: "Fatigue", fi: "väsymys", icpc: "A04", forms: ["väsymy", "väsynyt", "uupumus", "uupunut", "voimattom", "fatigue", "tired", "exhausted", "worn out"], typo: ["väsymys", "väsymystä", "fatigue", "exhausted"] },
    hoarseness: { label: "Hoarse voice", fi: "äänen käheys", icpc: "R23", forms: ["käheä", "käheys", "kähey", "ääni kähisee", "hoarse"], typo: ["käheys", "hoarse", "hoarseness"] },
    lymph: { label: "Enlarged lymph node", fi: "suurentunut imusolmuke", icpc: "B02",
      forms: ["imusolmuke suurentun", "suurentunut imusolmuke", "suurentuneet imusolmukkeet", "suurentuneita imusolmuk", "suurentuneet imusolmuk", "imusolmukkeet suurentun", "imusolmukesuurentum", "patti kaula", "patti kainalo", "kyhmy kaula", "kaulalla patti", "kaulalla kyhmy", "lymphadenopathy", "enlarged lymph node", "swollen lymph node", "swollen gland", "lump in neck", "lump in the neck", "neck lump"],
      typo: ["lymphadenopathy", "imusolmuke"] },
    nightsweats: { label: "Night sweats", fi: "yöhikoilu", icpc: "A09", forms: ["yöhikoil", "hikoilee öisin", "hikoillut öisin", "night sweat", "sweating at night"], typo: ["yöhikoilu", "yöhikoilua"] },
    fever: { label: "Unexplained fever", fi: "kuume", icpc: "A03", forms: ["kuumeil", "lämpöil", "kuume", "fever", "febrile"], typo: ["kuumetta"] },
    pruritus: { label: "Itching", fi: "kutina", icpc: "S02", forms: ["kutin", "kutiaa", "pruritus", "itch"], typo: ["kutinaa", "pruritus", "itching"] },
    backpain: { label: "Back pain", fi: "selkäkipu", icpc: "L02", forms: ["selkäkipu", "selkä kipeä", "back pain", "lumbago"], typo: ["selkäkipu"] },
    rectalbleed: { label: "Rectal bleeding", fi: "peräsuolen verenvuoto", icpc: "D16", forms: ["veriuloste", "verta ulosteessa", "verta ulosteen", "ulosteessa verta", "veristä ulostetta", "verisiä ulosteita", "peräsuolen verenvuoto", "hematokez", "melena", "melaena", "mustat ulosteet", "tervamaiset ulosteet", "rectal bleeding", "blood in stool", "blood in the stool", "blood in stools", "bleeding from the bottom", "black stool", "tarry stool"], typo: ["veriuloste"] },
    bowelchange: { label: "Change in bowel habit", fi: "suolen toiminnan muutos", icpc: "D18", forms: ["suolen toiminnan muutos", "suolen toiminta muuttun", "ulostamistottumu", "ulosteen muutos", "vaihteleva ripuli ja ummetus", "ohut uloste", "ulosteen kaliiperi", "tenesmus", "change in bowel", "bowel habit", "altered bowel"], typo: [] },
    loosebowel: { label: "Diarrhoea or constipation", fi: "ripuli tai ummetus", icpc: "D11", forms: ["ripuli", "ummetu", "diarrh", "constipat", "loose stool"], typo: ["diarrhoea", "diarrhea", "constipation"] },
    abdopain: { label: "Abdominal pain", fi: "vatsakipu", icpc: "D01", forms: ["vatsakip", "vatsakiv", "vatsakramp", "vatsa kipeä", "abdominal pain", "stomach pain", "tummy pain", "belly pain", "stomach ache", "stomach cramps"], typo: ["vatsakipu", "vatsakipua"] },
    anaemia: { label: "Anaemia or iron deficiency (stated)", fi: "anemia / rautavaje", icpc: "B82", forms: ["anemi", "anaemi", "hb matala", "hb laskenut", "matala hb", "rautavaje", "raudanpuu", "iron deficiency", "iron-deficiency", "low haemoglobin", "low hemoglobin"], typo: [] }
  };
  const ICPC_TO_CONCEPT = Object.fromEntries(Object.entries(CONCEPTS).map(([k, c]) => [c.icpc, k]));

  const NEGATORS = [" ei ", " eikä ", " eivät ", "kiistää", "kieltää", " kielt.", "poissuljettu", " no ", "denies", "denied", "without", " not ", " ilman ", " never ", "negative for"];
  const STOP = [".", ";", "\n", " mutta ", " but ", " however "];
  const CLAUSE = STOP.concat([",", " ja ", " and ", " reports ", " kertoo "]);
  const BLOOD = ["veri", "verta", "verinen", "verisi", "veris", "veren", "blood", "bloody", "bleeding"];
  // Severity words (urgency only). Not counted when they describe smoking or a diagnosis.
  const SEVERE = ["violent", "massive", "massiivi", "runsa", "paljon", "a lot", "lots of", "large amount", "huge", "valtava", "kupillinen", "cupful", "profuse", "heavy", "heavily", "kova", "voimakas"];
  const NOT_SEVERE_CTX = /smok|tupak|copd|keuhkoahtaum|astma|drink|alkoh/;
  const PERSIST = ["jatkuv", "pitkittyn", "persistent", "persisting", "ongoing", "toistuv", "recurrent", "recurring", "keeps coming back", "constant", "uusiutuv"];
  const FREQUENT = ["every day", "daily", "joka päivä", "päivittäin", "every morning", "joka aamu", "aamuisin"];
  // A typo is corrected only if one of these medical words is within 4 words
  const CONTEXT = ["blood", "veri", "verta", "week", "viik", "month", "kuukau", "days", "päiv", "pain", "kipu", "sputum", "lima", "yskö", "fever", "kuume", "weight", "paino", "kg", "night", "yö", "lung", "keuhk", "chest", "rinta", "breath", "heng", "smok", "tupak", "since", "ollut", "persist", "jatku"];
  // Ordinary words one letter away from a medical word: never "corrected"
  const COMMON = new Set(["couch", "couches", "touching", "vouching", "slouching", "crouching", "fewer", "fiber", "fibre", "lever", "never", "hoarde", "kuumeen", "laihtua"]);

  // Published positive likelihood ratios in primary care (lung cancer)
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
  const THRESHOLDS = { urgent: 0.03, watch: 0.01 };   // NICE NG12: refer at PPV ≥ 3 %

  /* ---------- helpers ------------------------------------------------ */
  const LETTER = /[a-zåäöéü0-9]/;
  function clauseAround(text, idx, stops = STOP) {
    let start = 0, end = text.length;
    for (const s of stops) {
      const b = text.lastIndexOf(s, idx); if (b >= 0 && b + s.length > start) start = b + s.length;
      const a = text.indexOf(s, idx); if (a >= 0 && a < end) end = a;
    }
    return { start, end, text: text.slice(start, end) };
  }
  function isNegated(text, idx) {
    const c = clauseAround(text, idx, CLAUSE);
    const before = " " + text.slice(Math.max(c.start, idx - 30), idx);
    if (NEGATORS.some(n => before.includes(n))) return true;
    // Negated list closed by "or / tai / nor / eikä": "denies weight loss, fever or night sweats"
    const s = clauseAround(text, idx, STOP);
    const sentence = text.slice(s.start, s.end);
    if (!/ (or|tai|nor|eikä|eli) /.test(sentence)) return false;
    const pieces = text.slice(s.start, idx).split(",");
    // the finding must sit in the list itself: its own comma-piece carries the "or / tai / eikä"
    const pieceEnd = (() => { const k = text.indexOf(",", idx); return k < 0 || k > s.end ? s.end : k; })();
    const ownPiece = " " + pieces[pieces.length - 1] + text.slice(idx, pieceEnd) + " ";
    if (!/ (or|tai|nor|eikä) /.test(ownPiece)) return false;
    if (pieces.some(p => p.trim().split(/\s+/).length > 5)) return false;
    const first = " " + pieces[0].trim().split(/\s+/).slice(0, 2).join(" ") + " ";
    return NEGATORS.some(n => first.includes(n)) || /^ (no|ei|denies|denied|kiistää|kieltää) /.test(first);
  }
  // Experiencer: a symptom said of a relative is family history, not the patient's finding
  const RELATIVE = /(^|[^a-zåäö])(äidillä|isällä|siskolla|sisarella|veljellä|tädillä|sedällä|enolla|isoäidillä|isoisällä|serkulla|sukulaisella|vaimolla|puolisolla|suvussa|sukuanamnee[a-zåäö]*|sa:|mother|father|brother|sister|wife|husband|family history)([^a-zåäö]|$)/;
  function isRelative(text, idx) {
    const s = clauseAround(text, idx, STOP);
    return RELATIVE.test(text.slice(s.start, idx));
  }
  const WORDNUM = { yksi: 1, yhden: 1, kaksi: 2, kahden: 2, kahdessa: 2, kolme: 3, kolmen: 3, neljä: 4, neljän: 4, viisi: 5, viiden: 5, kuusi: 6, kuuden: 6, kahdeksan: 8, kymmenen: 10, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, eight: 8, ten: 10, "couple of": 2, several: 3, muutama: 3, muutaman: 3 };
  function durationWeeks(clause) {
    const m = clause.match(/(\d+(?:[.,]\d+)?|yksi|yhden|kaksi|kahden|kahdessa|kolme|kolmen|neljä|neljän|viisi|viiden|kuusi|kuuden|kahdeksan|kymmenen|one|two|three|four|five|six|eight|ten|couple of|several|muutama|muutaman)\s*(viik|vk|week|wk|kuukau|kk|month|päiv|pv|day|vuo|year)/);
    if (!m) return null;
    const n = /\d/.test(m[1]) ? parseFloat(m[1].replace(",", ".")) : WORDNUM[m[1]]; const u = m[2];
    if (/vuo|year/.test(u)) return n * 52;
    if (/kuukau|kk|month/.test(u)) return Math.round(n * 4.3);
    if (/päiv|pv|day/.test(u)) return Math.round(n / 7 * 10) / 10;
    return n;
  }
  function damerau(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[a.length][b.length];
  }
  const ALL_FORMS = [];
  Object.entries(CONCEPTS).forEach(([key, c]) => c.forms.forEach(f => ALL_FORMS.push({ key, f })));
  ALL_FORMS.sort((a, b) => b.f.length - a.f.length);
  const TYPO_TARGETS = [];
  Object.entries(CONCEPTS).forEach(([key, c]) => (c.typo || []).forEach(w => TYPO_TARGETS.push({ key, w })));
  const SINGLE_FORMS = ALL_FORMS.filter(x => !x.f.includes(" ")).map(x => x.f);
  const startsKnown = w => SINGLE_FORMS.some(f => w.startsWith(f)) || BLOOD.some(b => w.startsWith(b));

  /* ---------- 1A. Rule reader --------------------------------------- */
  function correctTypos(lower) {
    const tokens = [...lower.matchAll(/[a-zåäöéü]+/g)].map(m => ({ w: m[0], s: m.index, e: m.index + m[0].length }));
    const fixes = [];
    tokens.forEach((t, i) => {
      if (t.w.length < 5 || COMMON.has(t.w) || startsKnown(t.w)) return;
      const hit = TYPO_TARGETS.find(({ w }) => damerau(t.w, w) === 1);
      if (!hit) return;
      const near = tokens.slice(Math.max(0, i - 4), i + 5).filter(x => x !== t).map(x => x.w).join(" ");
      // Long words (≥ 9 letters) one edit from a medical term are unambiguous; shorter ones need a medical word nearby
      if (t.w.length < 9 && !CONTEXT.some(c => near.includes(c))) return;
      fixes.push({ from: t.w, to: hit.w, concept: hit.key, s: t.s, e: t.e });
    });
    let out = "", pos = 0; const map = [];
    for (const f of fixes) {
      for (let k = pos; k < f.s; k++) { out += lower[k]; map.push(k); }
      for (let k = 0; k < f.to.length; k++) { out += f.to[k]; map.push(f.s + Math.min(k, f.e - f.s - 1)); }
      pos = f.e;
    }
    for (let k = pos; k < lower.length; k++) { out += lower[k]; map.push(k); }
    map.push(lower.length);
    return { text: out, map, fixes };
  }

  function severityIn(win) {
    for (const w of SEVERE) {
      let i = win.indexOf(w);
      while (i >= 0) {
        if (!LETTER.test(win[i - 1] || " ") && !NOT_SEVERE_CTX.test(win.slice(Math.max(0, i - 14), i + w.length + 14))) return true;
        i = win.indexOf(w, i + 1);
      }
    }
    return false;
  }
  function modifiersNear(t, idx, len) {
    const c = clauseAround(t, idx, CLAUSE);
    const win = t.slice(Math.max(c.start, idx - 40), Math.min(c.end, idx + len + 40));
    const sent = clauseAround(t, idx, STOP).text;
    return { severity: severityIn(win) ? "high" : null, persistent: PERSIST.some(w => sent.includes(w)), frequent: FREQUENT.some(w => sent.includes(w)) };
  }
  // Blood word in the same clause that is not itself negated ("cough, no blood" / "without blood")
  function bloodInClause(t, idx) {
    const c = clauseAround(t, idx, CLAUSE);
    for (const b of BLOOD) {
      let i = t.indexOf(b, c.start);
      while (i >= 0 && i < c.end) {
        if (!LETTER.test(t[i - 1] || " ")) {
          const before = " " + t.slice(Math.max(c.start, i - 14), i);
          if (!NEGATORS.some(n => before.includes(n))) return true;
        }
        i = t.indexOf(b, i + 1);
      }
    }
    return false;
  }

  // "Kaulalla kyhmy. Ollut 6 viikkoa." — a follow-on sentence with a duration and no symptom of its own
  function nextSentenceDuration(t, idx) {
    const s = clauseAround(t, idx, STOP);
    const n = clauseAround(t, Math.min(t.length - 1, s.end + 2), STOP);
    if (n.start <= s.start) return null;
    const txt = " " + n.text.trim() + " ";
    if (!/^ (ollut|on ollut|kestänyt|jatkunut|has been|present|lasting|for) /.test(txt)) return null;
    if (ALL_FORMS.some(({ f }) => txt.includes(" " + f))) return null;
    return durationWeeks(n.text);
  }

  function extract(note) {
    const lower = (note || "").toLowerCase();
    const { text: corr, map, fixes } = correctTypos(lower);
    const t = " " + corr + " ";                          // t index i ↔ corr index i-1
    const O = i => map[Math.max(0, Math.min(map.length - 1, i - 1))];
    const found = [], taken = [];
    for (const { key, f } of ALL_FORMS) {
      let from = 0, idx;
      while ((idx = t.indexOf(f, from)) >= 0) {
        from = idx + f.length;
        if (LETTER.test(t[idx - 1] || " ")) continue;    // must start a word ("retired" is not "tired")
        if (taken.some(([a, b]) => idx < b && idx + f.length > a)) continue;
        taken.push([idx, idx + f.length]);
        let end = idx + f.length; while (end < t.length - 1 && LETTER.test(t[end])) end++;
        const fix = fixes.find(x => x.s >= O(idx) && x.s < O(end - 1) + 1);
        let concept = key, pattern = null;
        if (key === "cough" && bloodInClause(t, idx)) { concept = "haemoptysis"; pattern = "cough + blood in the same clause"; }
        found.push({ concept, label: CONCEPTS[concept].label, fi: CONCEPTS[concept].fi, icpc: CONCEPTS[concept].icpc, surface: f,
          start: O(idx), end: O(end - 1) + 1, index: O(idx), length: O(end - 1) + 1 - O(idx),
          negated: isNegated(t, idx) || isRelative(t, idx), relative: isRelative(t, idx), weeks: durationWeeks(clauseAround(t, idx, STOP).text) ?? nextSentenceDuration(t, idx), ...modifiersNear(t, idx, f.length),
          typo: fix ? `${fix.from} → ${fix.to}` : null, pattern, via: "rules" });
      }
    }
    found.sort((a, b) => a.start - b.start);
    const byConcept = {};
    for (const x of found) {
      const prev = byConcept[x.concept];
      if (!prev || (prev.negated && !x.negated)) { byConcept[x.concept] = { ...x }; continue; }
      if (x.negated) continue;
      if (!prev.weeks && x.weeks) prev.weeks = x.weeks;
      if (x.severity) prev.severity = x.severity;
      prev.persistent = prev.persistent || x.persistent; prev.frequent = prev.frequent || x.frequent;
    }
    return { mentions: found, findings: Object.values(byConcept), typos: fixes };
  }

  /* ---------- 1B. AI reader: prompt + strict reconciliation ---------- */
  function aiPrompt(note) {
    const list = Object.entries(CONCEPTS).map(([k, c]) => `${k} = ICPC-2 ${c.icpc} ${c.label}`).join("; ");
    return `You read one primary-care visit note (Finnish or English; it may contain typos and abbreviations). ` +
      `Return ONLY a JSON array, no prose. One item per symptom the note states: ` +
      `{"concept": <one of the keys below>, "quote": <the exact words from the note, copied character for character>, "negated": true|false, "weeks": <duration in weeks or null>, "severity": "high" if described as large, violent or massive, else null}. ` +
      `Keys: ${list}. Do not add diagnoses, advice or symptoms the note does not state.\n\nNOTE:\n${note}`;
  }
  function parseAi(text) {
    if (Array.isArray(text)) return text;
    try { const m = String(text).match(/\[[\s\S]*\]/); return m ? JSON.parse(m[0]) : []; } catch (e) { return []; }
  }
  const normQ = s => String(s).toLowerCase().replace(/\s+/g, " ").trim();
  function reconcile(ruleEx, aiItems, note) {
    const n = normQ(note);
    const findings = ruleEx.findings.map(f => ({ ...f }));
    const mentions = ruleEx.mentions.slice();
    const rejected = [];
    for (const a of parseAi(aiItems)) {
      if (!a || !CONCEPTS[a.concept] || typeof a.quote !== "string" || !a.quote.trim()) { rejected.push({ ...a, why: "unknown concept or empty quote" }); continue; }
      const q = normQ(a.quote), at = n.indexOf(q);
      if (at < 0) { rejected.push({ ...a, why: "quote not found in the note" }); continue; }
      const same = findings.find(f => f.concept === a.concept);
      if (same) {
        same.via = "both";
        if (!!same.negated !== !!a.negated) { same.conflict = "AI reader and rules disagree on negation — check the note"; same.needsConfirm = true; }
        if (!same.weeks && Number.isFinite(a.weeks)) same.weeks = a.weeks;
        continue;
      }
      const c = CONCEPTS[a.concept];
      // Locate the quote in the original note for highlighting (whitespace-insensitive search)
      const start = note.toLowerCase().indexOf(a.quote.toLowerCase());
      const f = { concept: a.concept, label: c.label, fi: c.fi, icpc: c.icpc, surface: a.quote, start, end: start >= 0 ? start + a.quote.length : -1, index: start, length: a.quote.length,
        negated: !!a.negated, weeks: Number.isFinite(a.weeks) ? a.weeks : null, severity: a.severity === "high" ? "high" : null, via: "ai", needsConfirm: true };
      findings.push(f); if (start >= 0) mentions.push(f);
    }
    return { ...ruleEx, findings, mentions, rejected };
  }

  /* ---------- 2a. Results nobody acted on (Level 0) ---------------------
     Trigger definitions, time windows and exclusions follow the only
     randomised trial of this design (Murphy et al., J Clin Oncol 2015):
     lung 30 days, colorectal 60 days, prostate 90 days. Thresholds are the
     Finnish laboratory's own (Fimlab) where they exist; a reference limit
     sent with the result (r.refHigh) always wins. All values are config. */
  const PSA_REF = [[50, 2.5], [60, 3.5], [70, 4.5], [200, 6.5]];             // Fimlab P-PSA, µg/l, upper limit by age
  const psaLimit = age => PSA_REF.find(([a]) => age < a)[1];
  const TRIGGERS = {
    chest_imaging: { cancer: "lung", window: 30, minAge: 30, maxAge: 200, src: "murphy2015",
      exclude: { prior_lung_cancer: "lung cancer already diagnosed", palliative: "palliative care", pulmonary_review: "lung clinic review within the last 6 months" },
      followUp: "CT, lung clinic referral or repeat imaging" },
    fhb: { cancer: "colorectal", window: 60, minAge: 40, maxAge: 75, src: "fimlab_fhb", positive: 25, borderline: 10,
      exclude: { prior_crc: "colorectal cancer already diagnosed", colonoscopy_recent: "colonoscopy within the last 5 years", palliative: "palliative care" },
      followUp: "colonoscopy" },
    ida: { cancer: "colorectal", window: 60, minAge: 40, maxAge: 75, src: "murphy2015", hbMax: 110, mcvMax: 81, ferritinExcl: 100,
      exclude: { prior_crc: "colorectal cancer already diagnosed", colonoscopy_recent: "colonoscopy within the last 3 years", menorrhagia: "heavy periods recorded", pregnancy: "pregnancy", other_bleeding: "another source of bleeding recorded", palliative: "palliative care" },
      followUp: "colonoscopy" },
    psa: { cancer: "prostate", window: 90, minAge: 40, maxAge: 70, src: "kh_psa",
      exclude: { prior_prostate_cancer: "prostate cancer already diagnosed", prostate_biopsy_recent: "prostate biopsy within the last 2 years", prostatitis_recent: "prostatitis or urinary infection around the test", palliative: "palliative care" },
      followUp: "repeat PSA, urology referral or biopsy" }
  };
  function resultType(r) {
    if (r.type) return r.type;
    const t = (r.test || "").toLowerCase();
    if (/psa/.test(t)) return "psa";
    if (/f-hhb|fit|faecal|fecal|ulosteen/.test(t)) return "fhb";
    if (/x-ray|ct|keuhkokuva|thorax|tt /.test(t)) return "chest_imaging";
    if (/blood count|pvk|verenkuva|hb/.test(t)) return "ida";
    return "other";
  }
  function resultTriggers(c, findings) {
    const out = [], p = c.patient || {}, age = Number.isFinite(p.age) ? p.age : 0, excl = c.exclusions || [];
    const bowelSx = (findings || []).some(f => !f.negated && ["rectalbleed", "bowelchange", "abdopain", "weightloss", "anaemia"].includes(f.concept));
    for (const r of (c.results || [])) {
      const type = resultType(r), T = TRIGGERS[type];
      let abnormal = !!r.abnormal, what = r.finding || "abnormal", extra = "";
      if (type === "fhb" && Number.isFinite(r.value)) {
        abnormal = r.value >= T.positive || (r.value >= T.borderline && bowelSx);
        what = r.value >= T.positive ? `F-hHb ${r.value} µg/g, positive (≥ ${T.positive})` : `F-hHb ${r.value} µg/g, borderline (${T.borderline}–${T.positive}) in a patient with bowel symptoms`;
      }
      if (type === "ida") {
        abnormal = Number.isFinite(r.hb) && r.hb <= T.hbMax && Number.isFinite(r.mcv) && r.mcv <= T.mcvMax && !(r.ferritin >= T.ferritinExcl);
        what = `iron-deficiency anaemia: Hb ${r.hb} g/l, MCV ${r.mcv} fl${Number.isFinite(r.ferritin) ? `, ferritin ${r.ferritin} µg/l` : ""}`;
      }
      if (type === "psa" && Number.isFinite(r.value)) {
        const lim = Number.isFinite(r.refHigh) ? r.refHigh : psaLimit(age);
        abnormal = p.sex === "M" && r.value > lim;
        what = `PSA ${r.value} µg/l, above the age limit of ${lim}`;
        if ((c.meds || []).some(m => /finaster|dutaster/i.test(m))) extra = " Finasteride/dutasteride lowers PSA, so the true value is higher.";
      }
      if (!abnormal) continue;
      const name = r.test || type;
      if (!T) {                                          // untyped abnormal result: generic 30-day rule
        if (!r.followedUp && r.daysAgo > 30) out.push({ id: "UNFOLLOWED", cancer: "other", overdue: r.daysAgo - 30, text: `${name} ${r.daysAgo} days ago was abnormal (${what}) and no follow-up is recorded`, src: "murphy2015" });
        continue;
      }
      const why = excl.map(e => T.exclude[e]).find(Boolean);
      if (age < T.minAge || age > T.maxAge) { out.push({ id: "NOT_FLAGGED", cancer: T.cancer, text: `${name}: ${what}. Not flagged: age ${age} is outside the range where follow-up is recommended (${T.minAge}–${T.maxAge})${type === "psa" ? "; PSA testing is not advised for symptom-free men over 70" : ""}`, src: type === "psa" ? "kh_psa" : "murphy2015" }); continue; }
      if (why) { out.push({ id: "NOT_FLAGGED", cancer: T.cancer, text: `${name}: ${what}. Not flagged: ${why}`, src: "murphy2015" }); continue; }
      if (r.followedUp) continue;
      if (r.daysAgo > T.window) out.push({ id: "UNFOLLOWED", cancer: T.cancer, type, overdue: r.daysAgo - T.window, text: `${name} ${r.daysAgo} days ago: ${what}. No ${T.followUp} recorded within ${T.window} days.${extra}`, src: T.src });
      else out.push({ id: "PENDING", cancer: T.cancer, type, dueIn: T.window - r.daysAgo, text: `${name} ${r.daysAgo} days ago: ${what}. Follow-up (${T.followUp}) is due within ${T.window - r.daysAgo} more days — the clock is running.${extra}`, src: T.src });
    }
    return out;
  }

  /* ---------- 2b. Smoking history from free text ------------------------
     Pack-years = (cigarettes per day ÷ 20) × years smoked. Always shows the
     sum; anything missing is listed so the professional can ask. */
  function parseSmoking(text, age) {
    const t = " " + String(text || "").toLowerCase().replace(/\s+/g, " ") + " ";
    const num = x => parseFloat(String(x).replace(",", "."));
    const never = /(ei tupakoi|tupakoimaton|ei koskaan tupakoinut|ei ole koskaan tupakoinut|ei polta|savuton|never smoked|never-smoker|never smoker|non-smoker|nonsmoker|does not smoke|doesn't smoke)/.test(t);
    const former = /(entinen tupakoi|ent\. tupakoi|ex-tupakoi|ex-tup|lopettanut tupakoin|tupakoinnin lopet|tupakoinut aiemmin|former smoker|ex-smoker|ex smoker|quit smoking|stopped smoking|gave up smoking|lopettanut v|lopetti tupakoin)/.test(t);
    const any = /(tupakoi|tupakoin|tupakoitsija|polttaa|polttanut|[^a-z]tup\.|smok|aski|sav\/|savuket|cigarette|pack-year|pack year|askivuo|pakkavuo)/.test(t);
    if (never && !former) return { known: true, ever: false, text: "Non-smoker (stated in the note)" };
    if (!any) return { known: false };
    const out = { known: true, ever: true, current: !former, missing: [] };
    let m;
    if ((m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:askivuotta|pakkavuotta|pack[- ]years?|py\b)/))) out.packYears = num(m[1]);
    if ((m = t.match(/(\d+)\s*(?:savuketta|sav\b|sav\/|cigarettes?|cigs?|\/\s*pv|\/\s*vrk|kpl\/)/))) out.cigsPerDay = num(m[1]);
    else if ((m = t.match(/(puoli|½|0[.,]5|\d+(?:[.,]\d+)?)\s*(?:aski|askia|packs?)\b/)) || (m = t.match(/\b(a|an|one|half a)\s+pack\b/))) out.cigsPerDay = (/puoli|½|half/.test(m[1]) ? 0.5 : /^(a|an|one)$/.test(m[1]) ? 1 : num(m[1])) * 20;
    if ((m = t.match(/(\d+)\s*(?:vuotta|vuoden|v\b|v\.|years|yrs)/))) out.years = num(m[1]);
    else if ((m = t.match(/(?:alkanut|aloittanut|since age|from age)\s*(\d+)/)) && Number.isFinite(age)) out.years = Math.max(1, age - num(m[1]));
    if (!out.cigsPerDay && /(^|[^a-zåäö])aski(n)?\s*(\/|päivässä|vrk|per)/.test(t)) out.cigsPerDay = 20;
    if (former) {
      if ((m = t.match(/(?:lopettanut|lopetti|quit|stopped|gave up)(?:\s+(?:tupakoinnin|smoking))?(?:\s+(?:v\.?|vuonna|in))?\s*((?:19|20)\d\d)/))) out.quitYears = Math.max(0, new Date().getFullYear() - num(m[1]));
      else if ((m = t.match(/(?:lopettanut|lopetti|quit|stopped|gave up)[^.;]{0,25}?(\d+)\s*(?:vuotta|v\b|years|yrs)\s*(?:sitten|ago)/))) { out.quitYears = num(m[1]); if (out.years === out.quitYears) delete out.years; }
      else out.missing.push("when they stopped");
    }
    if (out.cigsPerDay && out.years && !out.packYears) { out.packYears = Math.round(out.cigsPerDay / 20 * out.years * 10) / 10; out.calc = `${out.cigsPerDay} a day ÷ 20 × ${out.years} years = ${out.packYears} pack-years`; }
    if (!out.cigsPerDay && !out.packYears) out.missing.push("how much");
    if (!out.years && !out.packYears) out.missing.push("for how many years");
    out.text = `${out.current ? "Current smoker" : "Former smoker"}${out.calc ? ": " + out.calc : out.packYears ? `: ${out.packYears} pack-years` : ""}${out.missing.length ? ` — not stated: ${out.missing.join(", ")}` : ""}`;
    return out;
  }

  /* ---------- 2. Structured data -------------------------------------- */
  const ABX = /antibiot|amoksis|doksisyk|kefalek|atsitro|amoxic|doxycyc|penisill|penicill/i;
  function structured(c, findings) {
    const added = [], signals = [];
    const has = k => findings.some(f => f.concept === k && !f.negated) || added.some(a => a.concept === k);
    for (const code of (c.codes || [])) {
      const k = ICPC_TO_CONCEPT[code.code];
      if (!k || code.daysAgo > 90 || has(k)) continue;
      added.push({ concept: k, label: CONCEPTS[k].label, fi: CONCEPTS[k].fi, icpc: code.code, negated: false, weeks: null, via: "code", surface: `ICPC-2 ${code.code}` });
      signals.push({ id: "CODE", text: `Visit code ICPC-2 ${code.code} (${CONCEPTS[k].label.toLowerCase()}) recorded ${code.daysAgo} days ago`, src: "icpc2" });
    }
    const w = (c.weights || []).filter(x => x.daysAgo <= 365).sort((a, b) => b.daysAgo - a.daysAgo);
    if (w.length >= 2) {
      const first = w[0], last = w[w.length - 1];
      const loss = (first.kg - last.kg) / first.kg;
      if (loss > 0.05) {
        signals.push({ id: "WEIGHT", text: `Measured weight ${first.kg} → ${last.kg} kg (−${(loss * 100).toFixed(1)} % in ${first.daysAgo - last.daysAgo} days; > 5 % in 6–12 months counts as unintentional weight loss)`, src: "aafp2014" });
        if (!has("weightloss")) added.push({ concept: "weightloss", label: CONCEPTS.weightloss.label, fi: CONCEPTS.weightloss.fi, icpc: "T08", negated: false, weeks: null, via: "measured", surface: "weight records" });
      }
    }
    for (const s of resultTriggers(c, findings)) signals.push(s);
    for (const r of (c.results || [])) {
      if (/chest x-ray|thorax x-ray|keuhkokuva|thoraxkuva/i.test(r.test) && !r.abnormal && r.daysAgo <= 90) signals.push({ id: "CXR_NORMAL", text: `Normal chest X-ray ${r.daysAgo} days ago — about 1 in 5 lung cancers have a normal X-ray, so persistent symptoms still count`, src: "okoli2018" });
    }
    const p = c.patient || {};
    if (!p.smoking && (p.age || 0) >= 40 && findings.some(f => !f.negated && LUNG_LR[f.concept])) signals.push({ id: "ASK_SMOKING", text: "Smoking history is not recorded — ask at this visit (years smoked, amount, when stopped); the risk estimate assumes a never-smoker until then", src: "plcom2012" });
    const abx = (c.history || []).filter(h => h.daysAgo <= 90 && ABX.test(h.text || "")).length;
    if (abx >= 1) signals.push({ id: "ABX", text: `${abx} antibiotic course(s) in the last 90 days`, src: "lyratzopoulos2012" });
    if (c.labs && c.labs.plt > 400 && c.labs.pltPrev > 400) signals.push({ id: "PLT2", text: `Platelets raised on two tests (${c.labs.pltPrev} → ${c.labs.plt})`, src: "bailey2017" });
    return { added, signals };
  }

  /* ---------- 3. WEIGH ------------------------------------------------ */
  // PLCOm2012 (Tammemägi et al., NEJM 2013) — 6-year lung cancer risk, ever-smokers.
  function plcom2012(p) {
    const s0 = p.smoking || {};
    if (!s0.ever) return null;
    const age = Number.isFinite(p.age) ? p.age : 60;
    const s = { ...s0, cigsPerDay: Number.isFinite(s0.cigsPerDay) && s0.cigsPerDay > 0 ? s0.cigsPerDay : 10, years: Number.isFinite(s0.years) ? s0.years : Math.max(1, Math.min(40, age - 18)), quitYears: Number.isFinite(s0.quitYears) ? s0.quitYears : 0 };
    const lo = 0.0778868 * (age - 62)
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
  const relatedVisits = h => (h || []).filter(x => x.daysAgo <= 90 && (x.related || ABX.test(x.text || ""))).length;
  // A cough counts only if ≥ 3 weeks, described as persistent/recurrent, or the patient keeps coming back
  const coughCounts = (f, history) => (f.weeks || 0) >= 3 || !!f.persistent || relatedVisits(history) >= 1;

  function lungRisk(patient, findings, history) {
    const pl = plcom2012(patient);
    const prior = pl != null ? pl / 6 : 0.00124 / 5;
    const priorSrc = pl != null ? "plcom2012" : "okoli2018";
    const positives = findings.filter(f => !f.negated && LUNG_LR[f.concept] && (f.concept !== "cough" || coughCounts(f, history)));
    const ranked = positives.map(f => ({ ...f, ...LUNG_LR[f.concept] })).sort((a, b) => b.lr - a.lr);
    const used = ranked.slice(0, 2), ignored = ranked.slice(2);
    let odds = prior / (1 - prior);
    const steps = [{ label: pl != null ? "Baseline 1-year risk (PLCOm2012 ÷ 6, smoking history)" : "Baseline 1-year risk (never-smoker)", value: prior, src: priorSrc }];
    for (const u of used) { odds *= u.lr; steps.push({ label: `× ${u.label} (LR ${u.lr})`, value: odds / (1 + odds), src: u.src }); }
    return { prior, posterior: odds / (1 + odds), steps, used, ignored };
  }

  /* ---------- 4. MATCH ------------------------------------------------ */
  function rules(patient, findings, labs, history, signals = []) {
    const P = k => findings.find(f => f.concept === k && !f.negated);
    const pos = k => !!P(k);
    const wk = k => (P(k) || {}).weeks || 0;
    const sig = id => signals.find(s => s.id === id);
    const hits = [];
    const age = Number.isFinite(patient.age) ? patient.age : 0;
    const hae = P("haemoptysis");
    if (hae && hae.severity === "high") hits.push({ id: "HAEM-LARGE", track: "emergency", level: "emergency", text: "Coughing up blood described as large or violent — assess today for massive haemoptysis (a medical emergency)", src: "massive_haem" });
    if (age >= 40 && hae) hits.push({ id: "NG12-lung-1", track: "lung", level: "urgent", text: "Age ≥ 40 with unexplained haemoptysis", src: "nice_ng12" });
    const cough = P("cough");
    const coughOK = cough && coughCounts(cough, history);
    const lungSx = ["fatigue", "dyspnoea", "chestpain", "weightloss", "appetite"].filter(pos).concat(coughOK ? ["cough"] : []);
    if (age >= 40 && patient.smoking && patient.smoking.ever && lungSx.length >= 1)
      hits.push({ id: "NG12-lung-2", track: "lung", level: "imaging", text: `Age ≥ 40, ever-smoker, ${lungSx.length} unexplained chest/constitutional symptom(s)`, src: "nice_ng12" });
    if (age >= 40 && lungSx.length >= 2)
      hits.push({ id: "NG12-lung-3", track: "lung", level: "imaging", text: "Age ≥ 40 with ≥ 2 unexplained lung-cancer symptoms", src: "nice_ng12" });
    if (labs && labs.plt && labs.plt > 400) {
      const m = patient.sex === "M", twice = !!sig("PLT2");
      hits.push({ id: twice ? "PLT2" : "PLT", track: "any", level: m || twice ? "urgent" : "imaging",
        text: twice ? `Platelets raised on two tests (${labs.pltPrev} → ${labs.plt}): 1-year cancer incidence ${m ? "18.1 %" : "10.1 %"} in primary-care cohort`
                    : `Platelets ${labs.plt} ×10⁹/L (> 400): 1-year cancer incidence ${m ? "11.6 %" : "6.2 %"} in primary-care cohort`, src: "bailey2017" });
    }
    if (pos("lymph") && (wk("lymph") >= 3 || P("lymph").persistent || pos("nightsweats") || pos("fever") || pos("pruritus") || pos("weightloss")))
      hits.push({ id: "NG12-lymph", track: "lymphoma", level: "urgent", text: "Unexplained lymphadenopathy" + (wk("lymph") ? ` for ${Math.round(wk("lymph"))} wk` : "") + " with B-symptoms or persistence", src: "nice_ng12" });
    if (labs && labs.hb && labs.hb < (patient.sex === "M" ? 130 : 117) && labs.ferritinLow)
      hits.push({ id: "IDA", track: "colorectal", level: "test", text: `Iron-deficiency anaemia (Hb ${labs.hb} g/L): test faecal haemoglobin (FIT)`, src: "nice_dg56" });
    // NICE DG56 (2023): who should be offered a stool test (FIT) in primary care
    const habit = pos("bowelchange") || (pos("loosebowel") && (wk("loosebowel") >= 6 || P("loosebowel").persistent));
    const fit = habit ? "change in bowel habit"
      : (age >= 40 && pos("weightloss") && pos("abdopain")) ? "age ≥ 40 with weight loss and abdominal pain"
      : (age >= 50 && pos("rectalbleed")) ? "age ≥ 50 with rectal bleeding"
      : (age < 50 && pos("rectalbleed") && (pos("abdopain") || pos("weightloss"))) ? "rectal bleeding with abdominal pain or weight loss"
      : (age >= 50 && pos("abdopain")) ? "age ≥ 50 with unexplained abdominal pain"
      : (age >= 60 && pos("anaemia")) ? "age ≥ 60 with anaemia"
      : null;
    if (fit && !signals.some(s => s.type === "fhb"))
      hits.push({ id: "DG56-fit", track: "colorectal", level: "test", text: `Stool test (FIT) advised: ${fit}`, src: "nice_dg56" });
    const repeat = relatedVisits(history);
    if (repeat >= 2) hits.push({ id: "REPEAT", track: "pattern", level: "imaging", text: `${repeat + 1}${repeat + 1 === 3 ? "rd" : "th"} visit in 90 days for the same unresolved complaint`, src: "lyratzopoulos2012" });
    for (const s of signals.filter(s => s.id === "UNFOLLOWED")) hits.push({ id: "UNFOLLOWED", track: "result", cancer: s.cancer, type: s.type, overdue: s.overdue, level: "urgent", text: s.text, src: s.src });
    if (sig("CXR_NORMAL") && lungSx.length >= 1) hits.push({ id: "CXR-NEG", track: "lung", level: "imaging", text: "Symptoms continue after a normal chest X-ray — X-ray does not rule out lung cancer", src: "nice_ng12" });
    return hits;
  }

  /* ---------- 5. ACT -------------------------------------------------- */
  const ACTIONS = {
    emergency: { title: "Assess today for large-volume bleeding (emergency department if heavy) — then the urgent CT pathway", target: 0, clock: ["Seen today", "CT done", "Specialist decision", "Diagnosis", "Treatment start"], why: "Coughing up a large amount of blood is a medical emergency; the cancer work-up follows once the patient is stable." },
    lung_urgent: { title: "Order thorax CT directly — urgent cancer-suspicion slot", target: 7, clock: ["CT done", "CT reported", "Specialist decision", "Diagnosis", "Treatment start"], why: "Direct CT from primary care is routine elsewhere in the Nordics but rare in Finland (expert survey) — reserved urgent slots close that gap." },
    result_followup: { title: "Act on the abnormal result: book the recommended follow-up today", target: 7, clock: ["Follow-up booked", "Follow-up done", "Result reviewed"], why: "This follow-up was already due. In a randomised trial, a weekly review of results like this cut the wait for colorectal work-up from 200 to 104 days." },
    lymphoma_urgent: { title: "Urgent neck ultrasound + needle biopsy referral (lymphoma suspicion)", target: 7, clock: ["Ultrasound", "Biopsy", "Specialist visit", "Diagnosis", "Treatment start"], why: "DLBCL in Finland: median 127 days from symptom to treatment via public primary care vs 76 via private/occupational care — the gap builds up before the specialist." },
    any_urgent: { title: "Raised platelets: review for occult cancer — chest imaging + targeted work-up", target: 14, clock: ["Repeat FBC", "Imaging", "Review"], why: "One-third of patients with thrombocytosis and lung or colorectal cancer had no other symptom." },
    lung_imaging: { title: "Order chest imaging now and book a 2-week safety-net review", target: 14, clock: ["Imaging done", "Result reviewed", "Safety-net review"], why: "Persistent symptoms in a high-risk patient: investigate now rather than at the next visit." },
    colorectal_test: { title: "Send FIT (faecal haemoglobin) test today", target: 14, clock: ["FIT returned", "Result acted on"], why: "FIT triage is already rolling out in Finland; the agent makes sure the result is acted on." },
    safety_net: { title: "No referral now — automatic safety-net check-in in 3 weeks", target: 21, clock: ["Check-in"], why: "If the symptom has not resolved in 3 weeks, the agent re-opens the case." },
    none: { title: "No cancer signal — no action", target: null, clock: [], why: "Specificity matters: the agent stays silent on routine visits." }
  };
  // Capacity level: 0 = follow-up that was already due (no new demand), 1 = cheap test, 2 = scarce slot (CT, ultrasound + biopsy)
  const LEVEL = { emergency: null, result_followup: 0, colorectal_test: 1, any_urgent: 1, lung_imaging: 1, lung_urgent: 2, lymphoma_urgent: 2, safety_net: null, none: null };
  const NEEDS_CT = { lung_urgent: true };
  const FOLLOWUP = {
    lung: { title: "Book the follow-up the radiologist recommended: CT or lung clinic referral", clock: ["CT booked", "CT done", "Specialist decision", "Diagnosis", "Treatment start"], ct: true },
    colorectal: { title: "Refer for colonoscopy — the abnormal result has not been investigated", clock: ["Referral sent", "Colonoscopy done", "Result reviewed"] },
    prostate: { title: "Repeat the PSA now; refer to urology if it is still raised", clock: ["PSA repeated", "Result reviewed", "Urology referral if raised"], why: "Käypä hoito: an abnormal PSA should be repeated after 1–2 months. This one never was. No new testing is started for symptom-free men over 70." },
    other: {}
  };
  function decideWithLevel(risk, hits, findings) {
    const a = decide(risk, hits, findings);
    if (a.key === "result_followup") {
      const h = hits.filter(x => x.id === "UNFOLLOWED").sort((x, y) => (y.overdue || 0) - (x.overdue || 0))[0];
      Object.assign(a, FOLLOWUP[h.cancer] || {}, { cancer: h.cancer, overdue: h.overdue });
    }
    a.level = LEVEL[a.key];
    a.needsCt = !!(NEEDS_CT[a.key] || a.ct);
    // other things the same record calls for, so nothing is lost behind the main action
    const also = [];
    if (a.key !== "result_followup") for (const h of hits.filter(x => x.id === "UNFOLLOWED")) also.push((FOLLOWUP[h.cancer] || {}).title || ACTIONS.result_followup.title);
    if (a.key !== "colorectal_test" && hits.some(h => h.track === "colorectal")) also.push(ACTIONS.colorectal_test.title);
    a.also = also;
    return a;
  }
  /* Worklist order for the capacity the county already has.
     1 emergency · 2 follow-up already due (longest overdue first) · 3 urgent rule met ·
     4 risk ≥ 3 % only · 5 cheap tests · 6 safety net. CT slots are handed out in that order;
     when they run out, the patient gets chest imaging and a safety-net date instead, and
     keeps their place for next week. A clinician can always override. */
  function rankWorklist(items, opts = {}) {
    const tier = r => r.action.key === "emergency" ? 0 : r.action.level === 0 ? 1
      : r.action.level === 2 ? (r.hits.some(h => h.level === "urgent" || h.level === "emergency") ? 2 : 3)
      : r.action.level === 1 ? 4 : r.action.key === "safety_net" ? 5 : 6;
    const sorted = items.slice().sort((a, b) => tier(a.r) - tier(b.r) || (b.r.action.overdue || 0) - (a.r.action.overdue || 0) || b.r.risk.posterior - a.r.risk.posterior);
    let slots = Number.isFinite(opts.ctSlots) ? opts.ctSlots : Infinity;
    return sorted.map(x => {
      const out = { ...x, tier: tier(x.r), queued: false };
      if (x.r.action.needsCt && x.r.action.key !== "emergency") { if (slots > 0) { slots--; out.slot = true; } else out.queued = true; }
      return out;
    });
  }
  function decide(risk, hits, findings) {
    if (hits.some(h => h.track === "emergency")) return { key: "emergency", ...ACTIONS.emergency };
    if (hits.some(h => h.track === "lymphoma")) return { key: "lymphoma_urgent", ...ACTIONS.lymphoma_urgent };
    if (risk.posterior >= THRESHOLDS.urgent || hits.some(h => h.id === "NG12-lung-1")) return { key: "lung_urgent", ...ACTIONS.lung_urgent };
    if (hits.some(h => h.id === "UNFOLLOWED")) return { key: "result_followup", ...ACTIONS.result_followup };
    if (hits.some(h => h.id === "PLT" || h.id === "PLT2")) return { key: "any_urgent", ...ACTIONS.any_urgent };
    // Explicit rules always lead to at least chest imaging; the risk score can only escalate, never veto.
    if (hits.some(h => h.track === "lung" || h.track === "pattern")) return { key: "lung_imaging", ...ACTIONS.lung_imaging };
    if (hits.some(h => h.track === "colorectal")) return { key: "colorectal_test", ...ACTIONS.colorectal_test };
    if (findings.some(f => !f.negated && (LUNG_LR[f.concept] || f.concept === "lymph"))) return { key: "safety_net", ...ACTIONS.safety_net };
    return { key: "none", ...ACTIONS.none };
  }

  /* ---------- run the full pipeline ----------------------------------- */
  function assess(c, opts = {}) {
    let ex = extract(c.note || "");
    if (opts.ai) ex = reconcile(ex, opts.ai, c.note || "");
    let patient = c.patient || {}, smokingRead = null;
    if (!patient.smoking) {
      const sm = parseSmoking([c.note].concat((c.history || []).map(h => h.text)).join(". "), patient.age);
      if (sm.known) { smokingRead = sm; patient = { ...patient, smoking: sm.ever ? { ever: true, current: sm.current, cigsPerDay: sm.cigsPerDay || (sm.packYears && sm.years ? sm.packYears / sm.years * 20 : undefined), years: sm.years, quitYears: sm.quitYears } : { ever: false } }; }
    }
    const st = structured({ ...c, patient }, ex.findings);
    if (smokingRead) st.signals.push({ id: "SMOKING_READ", text: `Smoking history read from the notes — ${smokingRead.text}`, src: "plcom2012" });
    const findings = ex.findings.concat(st.added);
    const risk = lungRisk(patient, findings, c.history);
    const hits = rules(patient, findings, c.labs, c.history, st.signals);
    const action = decideWithLevel(risk, hits, findings);
    const n = k => findings.filter(k).length;
    const sev = findings.filter(f => f.severity && !f.negated).map(f => f.label.toLowerCase());
    const readBits = [`${findings.length} finding(s)`, `${n(f => f.negated)} negated`];
    if (ex.typos.length) readBits.push(`${ex.typos.length} typo(s) corrected (${ex.typos.map(x => `${x.from} → ${x.to}`).join(", ")})`);
    if (n(f => f.pattern)) readBits.push("phrase pattern used");
    if (n(f => f.via === "ai")) readBits.push(`${n(f => f.via === "ai")} AI-read — please confirm`);
    if (sev.length) readBits.push(`severity: ${sev.join(", ")}`);
    const trace = [
      { step: "Read", text: readBits.join(" · ") },
      { step: "Data", text: st.signals.length ? st.signals.map(s => s.text).join(" · ") : "No structured signals (codes, weights, results)" },
      { step: "Weigh", text: `Lung-cancer probability ${(risk.prior * 100).toFixed(2)} % → ${(risk.posterior * 100).toFixed(1)} %` },
      { step: "Match", text: hits.length ? `${hits.length} referral rule(s) met` : "No referral rule met" },
      { step: "Act", text: action.title }
    ];
    return { extraction: { ...ex, findings }, signals: st.signals, rejected: ex.rejected || [], risk, hits, action, trace };
  }

  global.Ajoissa = { VERSION: "3.0", TRIGGERS, PSA_REF, LEVEL, parseSmoking, resultTriggers, rankWorklist, CONCEPTS, LUNG_LR, THRESHOLDS, ACTIONS, extract, correctTypos, aiPrompt, parseAi, reconcile, structured, plcom2012, lungRisk, rules, decide, assess, damerau };
})(typeof window !== "undefined" ? window : globalThis);
