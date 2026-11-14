(function () {
  "use strict";
  const S = window.AJOISSA_SOURCES, D = window.AJOISSA_DATA, CASES = window.AJOISSA_CASES, A = window.Ajoissa;
  const C = window.AJOISSA_COUNTY || null;
  const $ = (q, r = document) => r.querySelector(q);
  const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); e.innerHTML = html; return e; };
  const pct = (x, d = 1) => (x * 100).toFixed(d) + " %";
  const cite = k => S[k] ? `<button class="cite" data-src="${k}">${S[k].short}</button>` : "";

  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const VIEWS = ["worklist", "behind", "gap", "county", "impact", "sources", "brief"];

  /* ---------------- views ---------------- */
  function show(view) {
    document.querySelectorAll(".menubar button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === view)));
    document.querySelectorAll("section.view").forEach(s => s.classList.toggle("active", s.id === "view-" + view));
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    window.scrollTo({ top: 0 });
    if (view === "gap") drawRiver(true);
    if (view === "behind") animatePipeline();
  }
  document.querySelectorAll(".menubar button").forEach(b => b.addEventListener("click", () => show(b.dataset.view)));
  document.addEventListener("click", e => { const g = e.target.closest("[data-goto]"); if (g) { e.preventDefault(); show(g.dataset.goto); } const v = e.target.closest("[data-view-link]"); if (v) { e.preventDefault(); show(v.dataset.viewLink); } });


  /* ---------------- source drawer ---------------- */
  const drawer = $("#drawer");
  function openSource(k) {
    const s = S[k]; if (!s) return;
    $("#drawer-body").innerHTML = `<p class="kicker">Source</p><h3>${s.title}</h3>
      <p><b>${s.short}</b> — ${s.where}</p>
      <p><span class="grade ${s.grade}">Evidence: ${s.grade}</span> &nbsp; <span class="grade">Shows: ${s.measure}</span></p>
      ${s.note ? `<p>${s.note}</p>` : ""}
      ${s.url ? `<p><a href="${s.url}" target="_blank" rel="noopener">Open source</a></p>` : ""}`;
    drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); $("#drawer-close").focus();
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-src]"); if (b) { e.preventDefault(); openSource(b.dataset.src); } });
  $("#drawer-close").addEventListener("click", () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") $("#drawer-close").click(); });

  /* ================= THE GAP ================= */
  let riverDrawn = false;
  function drawRiver(animate) {
    const d = D.dlbcl, W = 1000, H = 360, x0 = 40, x1 = 930, maxD = 220;
    const X = v => x0 + (v / maxD) * (x1 - x0);
    const lanes = [{ key: "occupational", y: 118, color: "var(--route-a)", label: "Occupational / private care" }, { key: "public", y: 222, color: "var(--alert)", label: "Public primary care" }];
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="DLBCL: days from symptom onset to treatment. Occupational route 123 days, public route 207 days.">`;
    for (let t = 0; t <= maxD; t += 30) svg += `<line x1="${X(t)}" x2="${X(t)}" y1="40" y2="280" stroke="var(--grid)" stroke-width="1"/><text x="${X(t)}" y="298" fill="var(--mute)" font-size="12" text-anchor="middle">${t} d</text>`;
    lanes.forEach(L => {
      const v = d[L.key];
      svg += `<text x="${x0}" y="${L.y - 66}" fill="${L.key === "public" ? "var(--snow)" : "var(--route-a)"}" font-size="14" font-weight="600">${L.label}</text>`;
      svg += `<line class="lane" x1="${X(0)}" x2="${X(v[v.length - 1])}" y1="${L.y}" y2="${L.y}" stroke="${L.color}" stroke-width="${L.key === "public" ? 10 : 6}" stroke-linecap="round" pathLength="1"/>`;
      let lastX = -999, row = 0;
      v.forEach((day, i) => {
        if (i === 0) return;
        const big = i === v.length - 1;
        svg += `<circle cx="${X(day)}" cy="${L.y}" r="${big ? 9 : 6}" fill="var(--dot-fill)" stroke="${L.color}" stroke-width="3"/>`;
        row = (X(day) - lastX < 120) ? row + 1 : 0; lastX = X(day);
        const dir = L.key === "public" ? 1 : -1;
        const ty = big ? L.y + dir * 46 + (dir > 0 ? 8 : 0) : L.y + dir * 18 + dir * row * 15 + (dir > 0 ? 8 : 0);
        svg += `<text x="${X(day)}" y="${ty}" fill="${big ? "var(--snow)" : "var(--route-a)"}" font-size="11.5" font-weight="${big ? 700 : 400}" text-anchor="${big ? "end" : "middle"}" dx="${big ? 8 : 0}">${d.steps[i]} · ${day}</text>`;
      });
    });
    // gap bracket
    const a = X(d.occupational[5]), b = X(d.public[5]);
    svg += `<rect x="${a}" y="${lanes[0].y + 14}" width="${b - a}" height="${lanes[1].y - lanes[0].y - 28}" fill="var(--alert-soft)" stroke="var(--alert)" stroke-dasharray="4 4"/>`;
    // where the gap grows
    const deltas = d.public.map((p, i) => p - d.occupational[i]);
    svg += `<text x="${x0}" y="335" fill="var(--mute)" font-size="12">Gap by step (days):</text>`;
    deltas.forEach((g, i) => { if (!i || i === 5) return; svg += `<text x="${X(d.public[i])}" y="335" fill="${i < 5 ? "var(--alert-text)" : "var(--mute)"}" font-size="13" font-weight="700" text-anchor="middle">+${g}</text>`; });
    svg += `</svg>`;
    $("#river").innerHTML = `<div class="river-head">
        <div><div class="gapnum num">+${D.dlbcl.median.public - D.dlbcl.median.occupational} days<small>median, later to treatment on the public route</small></div></div>
        <div style="max-width:44ch;color:var(--frost);font-size:.95rem">Diffuse large B-cell lymphoma, 7 Finnish hospitals, n = 160: median <b style="color:var(--snow)">${D.dlbcl.median.public} vs ${D.dlbcl.median.occupational} days</b> from symptom to treatment (p = 0.027). The chart shows the paper's cumulative step times: the gap is already <b style="color:var(--snow)">+86 days at the specialist</b>; from there both routes take 3–5 days. The delay is born in primary care. <br>${cite("kuitunen2026")} <span class="real-tag">real</span></div>
      </div>${svg}
      <div class="legend"><span><i style="background:var(--route-a)"></i>Occupational / private</span><span><i style="background:var(--alert)"></i>Public primary care</span><span>Cumulative step times, Fig. 1 of the paper. A symptom-to-diagnosis interval over 7 weeks is linked to worse progression-free survival ${cite("tokola2025")}</span></div>`;
    if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("#river .lane").forEach((l, i) => {
        l.style.strokeDasharray = "1"; l.style.strokeDashoffset = "1";
        l.getBoundingClientRect();
        l.style.transition = `stroke-dashoffset ${1.4 + i * .6}s cubic-bezier(.3,.7,.3,1) ${i * .2}s`;
        requestAnimationFrame(() => { l.style.strokeDashoffset = "0"; });
      });
    }
    riverDrawn = true;
  }

  function renderEvidence() {
    const ls = D.lungSurvival;
    const surv = ls.rows.map(r => `<div class="bar ${r.hl ? "hl" : ""}"><span>${r.country} · men</span><span class="track"><span class="fill" style="width:${r.men / 40 * 100}%"></span></span><span class="num">${r.men}%</span></div>
      <div class="bar ${r.hl ? "hl" : ""}"><span>${r.country} · women</span><span class="track"><span class="fill" style="width:${r.women / 40 * 100}%"></span></span><span class="num">${r.women}%</span></div>`).join("");
    const surg = D.lungSurgery.rows.map(r => `<div class="bar ${r.hl ? "hl" : ""}"><span>${r.area}</span><span class="track"><span class="fill" style="width:${r.value / 20 * 100}%"></span></span><span class="num">≈${r.value}%</span></div>`).join("");
    $("#evidence").innerHTML = `
      <article class="ev"><h3>Lung cancer: lowest survival in the Nordics</h3>
        <div class="bars">${surv}</div>
        <p>Five-year relative survival. Goal 3 asks for <b>+14 percentage points</b>. It is fixable: Denmark's men went from <b>${D.denmark.dk[0]} %</b> (below Finland) to <b>${D.denmark.dk[1]} %</b> in 20 years; Finland reached ${D.denmark.fi[1]} %.</p>
        <footer>${cite("actaonc2025_surv")} ${cite("khalife2025")} ${cite("strategy2026")} <span class="real-tag">real</span></footer></article>
      <article class="ev"><h3>The front door is narrower in Finland</h3>
        <div class="big num">${D.frontDoor.ctOrderingFinland}</div>
        <p>of Finnish primary-care units can order a CT directly, according to a Nordic expert survey — versus <b>${D.frontDoor.ctOrderingNordics}</b> elsewhere. A GP appointment takes about <b>${D.frontDoor.gpWaitFinland} days</b> here, ${D.frontDoor.gpWaitNordics} days there. And since 2025, adults are only guaranteed non-urgent primary care within <b>3 months</b>.</p>
        <footer>${cite("ihe2026")} ${cite("careguarantee2025")} <span class="real-tag">expert survey · weak–moderate</span></footer></article>
      <article class="ev"><h3>Who you are changes your odds</h3>
        <div class="bars">
          <div class="bar hl"><span>Basic education · men</span><span class="track"><span class="fill" style="width:${D.ses.men[0]}%"></span></span><span class="num">${D.ses.men[0]}%</span></div>
          <div class="bar"><span>Higher education · men</span><span class="track"><span class="fill" style="width:${D.ses.men[1]}%"></span></span><span class="num">${D.ses.men[1]}%</span></div>
          <div class="bar hl"><span>Basic · women</span><span class="track"><span class="fill" style="width:${D.ses.women[0]}%"></span></span><span class="num">${D.ses.women[0]}%</span></div>
          <div class="bar"><span>Higher · women</span><span class="track"><span class="fill" style="width:${D.ses.women[1]}%"></span></span><span class="num">${D.ses.women[1]}%</span></div></div>
        <p>Five-year survival, all cancers. Less-educated patients are diagnosed later (stage IV odds +10–15 %), operated on less, and have higher cancer mortality in a national register study. Occupational care covers 92 % of wage earners — not the retired or unemployed.</p>
        <footer>${cite("oecd2025")} ${cite("zai2025")} ${cite("kela2026")} <span class="real-tag">real</span></footer></article>`;
  }

  /* ================= DEMO · 1 WORKLIST  ·  2 BEHIND THE FLAG =================
     Display only. Every decision, number and rule comes from engine.js (window.Ajoissa). */
  let ctSlots = 2;                         // CT slots the county gives the agent this week (it never asks for more)
  let assessed = A.rankWorklist(CASES.map(c => ({ c, r: A.assess(c) })), { ctSlots });
  const rank = r => ({ emergency: 6, lung_urgent: 5, lymphoma_urgent: 5, result_followup: 4, any_urgent: 4, lung_imaging: 3, colorectal_test: 2, safety_net: 1, none: 0 })[r.action.key];
  const colour = r => r.action.key === "none" ? "green" : rank(r) >= 4 ? "red" : "amber";
  const STATUS = { red: "Act now", amber: "Check soon", green: "No action" };
  const CANCER = { lung: "Lung", colorectal: "Bowel", prostate: "Prostate", lymphoma: "Lymphoma", several: "Several", other: "Other" };
  const levelText = x => x.r.action.key === "emergency" ? "Emergency · today" : x.queued ? "No CT slot free · X-ray now, CT next week" : x.r.action.level === 0 ? `Already due${x.r.action.overdue ? " · " + x.r.action.overdue + " d overdue" : ""}` : x.r.action.level === 2 ? (x.slot ? "Urgent · CT slot this week" : "Urgent referral") : x.r.action.level === 1 ? "Simple test" : x.r.action.key === "safety_net" ? "Check-in in 3 weeks" : "Checked · agent stays silent";
  let current = null, cancerFilter = "all";
  const orders = {};                       // per patient: { status: "draft" | "sent" | "review" | "dismissed", reason }
  const find = id => assessed.find(x => x.c.id === id);
  const pctS = p => p >= 0.3 ? "> 30 %" : pct(p, p < 0.01 ? 2 : 1);

  /* ---------- per-cancer signal rows (value vs the engine's own threshold) ---------- */
  function cancerRows(c, r) {
    const p = c.patient, res = t => (c.results || []).find(x => x.type === t);
    const hit = (pred) => r.hits.find(pred);
    const rows = [];
    // Lung
    const lungRes = hit(h => h.id === "UNFOLLOWED" && h.cancer === "lung");
    const lungHits = r.hits.filter(h => h.track === "lung" || h.track === "emergency");
    if (lungRes) { const x = res("chest_imaging"); rows.push({ cn: "Lung", cls: "red", val: "Result", sub: "no % — explicit rule", ratio: x.daysAgo / A.TRIGGERS.chest_imaging.window, what: `${x.test} ${x.daysAgo} d ago: ${x.finding}. No follow-up within ${A.TRIGGERS.chest_imaging.window} days.`, gauge: `${x.daysAgo} of ${A.TRIGGERS.chest_imaging.window} days` }); }
    else if (r.lungRelevant || lungHits.length) {
      const v = r.risk.posterior, over = v >= A.THRESHOLDS.urgent || lungHits.some(h => h.level === "urgent");
      rows.push({ cn: "Lung", cls: over ? "red" : "amber", val: pctS(v), sub: "risk estimate · threshold 3 %", ratio: v / A.THRESHOLDS.urgent, what: v >= A.THRESHOLDS.urgent ? `${(v / A.THRESHOLDS.urgent).toFixed(1)} × the referral threshold` : over ? "Below 3 %, but an urgent rule is met (coughing up blood)" : "Below the referral threshold — watch" });
    } else rows.push({ cn: "Lung", cls: "green", val: "—", sub: "", ratio: 0, what: "No lung symptom or result" });
    // Bowel
    const fhb = res("fhb"), bowelRes = hit(h => h.id === "UNFOLLOWED" && h.cancer === "colorectal"), ida = hit(h => h.id === "IDA"), dg = hit(h => h.track === "colorectal");
    if (fhb) rows.push({ cn: "Bowel", cls: bowelRes ? "red" : fhb.value >= A.TRIGGERS.fhb.positive ? "amber" : "green", val: `${fhb.value}`, sub: `F-hHb µg/g · limit ${A.TRIGGERS.fhb.positive}`, ratio: fhb.value / A.TRIGGERS.fhb.positive, what: bowelRes ? `Positive stool test ${fhb.daysAgo} d ago — no colonoscopy within ${A.TRIGGERS.fhb.window} days` : "Stool test result" });
    else if (ida) rows.push({ cn: "Bowel", cls: "amber", val: `${c.labs.hb}`, sub: `Hb g/l · limit ≤ ${A.TRIGGERS.ida.hbMax} + low ferritin`, ratio: A.TRIGGERS.ida.hbMax / c.labs.hb, what: "Iron-deficiency anaemia" + (dg && dg !== ida ? " and a change in bowel habit" : "") + " → stool test first" });
    else if (dg) rows.push({ cn: "Bowel", cls: "amber", val: "Rule", sub: "no % — explicit rule", ratio: 1, what: dg.text });
    else rows.push({ cn: "Bowel", cls: "green", val: "—", sub: "", ratio: 0, what: "No bowel symptom or result" });
    // Prostate
    const psa = res("psa");
    if (p.sex !== "M") rows.push({ cn: "Prostate", cls: "grey", val: "n/a", sub: "", ratio: 0, what: "Not applicable" });
    else if (psa) {
      const lim = A.PSA_REF.find(([a]) => p.age < a)[1], unf = hit(h => h.id === "UNFOLLOWED" && h.cancer === "prostate"), nf = r.signals.find(s => s.id === "NOT_FLAGGED" && s.cancer === "prostate");
      rows.push({ cn: "Prostate", cls: unf ? "red" : nf ? "grey" : psa.value > lim ? "amber" : "green", val: `${psa.value}`, sub: `PSA µg/l · age limit ${lim}`, ratio: psa.value / lim, what: unf ? `Raised ${psa.daysAgo} d ago — never repeated (window ${A.TRIGGERS.psa.window} days)` : nf ? `Above the limit, but not flagged: age ${p.age} is over 70 (Käypä hoito)` : "PSA result" });
    } else rows.push({ cn: "Prostate", cls: "green", val: "—", sub: "", ratio: 0, what: "No PSA result or symptom" });
    // Lymphoma
    const ly = hit(h => h.track === "lymphoma"), lf = r.extraction.findings.find(f => f.concept === "lymph" && !f.negated);
    rows.push(ly ? { cn: "Lymphoma", cls: "red", val: "Rule", sub: "no % — explicit rule", ratio: 1.5, what: ly.text } : lf ? { cn: "Lymphoma", cls: "amber", val: "Watch", sub: "", ratio: .6, what: "Lymph-node finding, rule not met" } : { cn: "Lymphoma", cls: "green", val: "—", sub: "", ratio: 0, what: "No lymph-node finding" });
    // Any cancer: raised platelets
    const plt = hit(h => h.id === "PLT" || h.id === "PLT2");
    if (plt) rows.push({ cn: "Any cancer", cls: "red", val: `${c.labs.plt}`, sub: "platelets ×10⁹/l · limit 400", ratio: c.labs.plt / 400, what: "Raised platelets: occult cancer to be considered" });
    return rows;
  }
  function signalTable(c, r) {
    const rows = cancerRows(c, r);
    return `<table class="sig"><thead><tr><th>Cancer</th><th>Value</th><th style="width:28%">vs threshold</th><th>Meaning</th></tr></thead><tbody>
      ${rows.map(x => `<tr class="${x.cls}"><td class="cn">${x.cn}</td><td class="val">${x.val}${x.sub ? `<small>${x.sub}</small>` : ""}</td>
        <td>${x.ratio ? `<div class="gauge ${x.cls}"><span style="width:${Math.min(100, x.ratio * 50)}%"></span><i></i></div>` : ""}</td>
        <td class="what">${esc(x.what)}</td></tr>`).join("")}</tbody></table>
      <p class="gauge-legend">Black line = the referral threshold. A percentage is shown only for lung cancer, where a published risk model exists; the other cancers are decided by explicit, published rules (lab limit + follow-up window).</p>`;
  }

  /* ---------- left: the list ---------- */
  function renderList() {
    const vis = assessed.filter(x => cancerFilter === "all" || x.r.cancer === cancerFilter);
    const grp = col => vis.filter(x => colour(x.r) === col);
    const row = x => { const { c, r } = x, o = orders[c.id] || {}, col = colour(r);
      const lvl = o.status === "sent" ? `<span class="lvl sent">✓ Sent · clock running</span>` : o.status === "review" ? `<span class="lvl sent">✓ Review booked</span>` : o.status === "dismissed" ? `<span class="lvl">Dismissed · archived</span>` : `<span class="lvl${x.queued ? " wait" : ""}">${levelText(x)}</span>`;
      return `<button class="prow" aria-pressed="${current === c.id}" data-case="${c.id}"><span class="sbar ${col}"></span><span class="pc">
        <span class="who"><span>${c.name}</span><small>${c.patient.age} ${c.patient.sex === "M" ? "M" : "F"}${r.cancer ? ` · <span class="ctag">${CANCER[r.cancer]}</span>` : ""}</small></span>
        <span class="why">${esc(c.headline)}</span>${lvl}</span></button>`; };
    const section = (col, label) => { const xs = grp(col); return xs.length ? `<div class="pgrp"><span class="st ${col}"></span>${label}<span class="n">${xs.length}</span></div>${xs.map(row).join("")}` : ""; };
    const flagged = assessed.filter(x => x.r.action.key !== "none").length;
    $("#plist").innerHTML = `<h3><span>Flagged patients</span><span>${flagged} of ${assessed.length}</span></h3>
      <div class="cfilter" role="group" aria-label="Filter by cancer">${["all", "lung", "colorectal", "prostate", "lymphoma"].map(k => { const n = k === "all" ? assessed.length : assessed.filter(x => x.r.cancer === k).length; return `<button class="chip" data-cf="${k}" aria-pressed="${cancerFilter === k}">${k === "all" ? "All" : CANCER[k]} <b>${n}</b></button>`; }).join("")}</div>
      ${section("red", "Act now")}${section("amber", "Check soon")}${section("green", "Checked, not flagged")}
      <label class="slots">CT slots free this week <input type="number" id="ct-slots" min="0" max="9" value="${ctSlots}"><small>Set by the county. Follow-ups already due go first, then the strongest signals; the agent never asks for more.</small></label>`;
    document.querySelectorAll(".prow").forEach(b => b.addEventListener("click", () => selectCase(b.dataset.case)));
    document.querySelectorAll(".cfilter .chip").forEach(b => b.addEventListener("click", () => { cancerFilter = b.dataset.cf; renderList(); }));
    $("#ct-slots").addEventListener("change", e => { ctSlots = Math.max(0, +e.target.value || 0); assessed = A.rankWorklist(assessed, { ctSlots }); renderList(); if (current) selectCase(current); });
  }

  /* ---------- middle: the patient ---------- */
  const smokeText = p => p.smoking && p.smoking.ever ? (p.smoking.current ? `Smokes ${p.smoking.cigsPerDay}/day, ${p.smoking.years} y` : `Ex-smoker, quit ${p.smoking.quitYears} y ago`) : p.smoking ? "Never smoked" : "Smoking not recorded";
  function recordRows(c) {
    const rows = [];
    (c.results || []).forEach(x => rows.push([x.daysAgo, `${esc(x.test)}: ${esc(x.finding || (x.value != null ? x.value + (x.type === "fhb" ? " µg/g" : x.type === "psa" ? " µg/l" : "") : ""))}`, !x.followedUp && (x.abnormal || x.value != null) ? "No follow-up recorded" : ""]));
    Object.entries(c.labs || {}).filter(([k]) => k !== "ferritinLow").forEach(([k, v]) => rows.push([0, `${k === "plt" ? "Platelets" : k === "hb" ? "Haemoglobin" : k} ${v}${k === "plt" ? " ×10⁹/l" : " g/l"}`, k === "plt" && v > 400 ? "Above 400" : k === "hb" && v <= 110 ? "Low" : ""]));
    if (c.labs && c.labs.ferritinLow) rows.push([0, "Ferritin low", "Low"]);
    if ((c.weights || []).length > 1) { const w = c.weights.slice().sort((a, b) => b.daysAgo - a.daysAgo); rows.push([w[0].daysAgo, `Weight ${w.map(x => x.kg + " kg").join(" → ")}`, ((w[0].kg - w[w.length - 1].kg) / w[0].kg) > .05 ? "> 5 % loss" : ""]); }
    (c.history || []).forEach(h => rows.push([h.daysAgo, `Visit: ${esc(h.text)}`, ""]));
    (c.codes || []).filter(x => x.daysAgo > 0).forEach(x => rows.push([x.daysAgo, `Visit code ${x.code}`, ""]));
    return rows.sort((a, b) => b[0] - a[0]);
  }
  function renderMid(c, r) {
    const col = colour(r), p = c.patient;
    const why = r.hits.length ? `<ul class="reason-list">${r.hits.map(h => `<li>${esc(h.text)} ${cite(h.src)}</li>`).join("")}</ul>`
      : r.signals.filter(s => s.id === "NOT_FLAGGED").map(s => `<p class="reason" style="font-size:.92rem">${esc(s.text)} ${cite(s.src)}</p>`).join("") || `<p class="reason" style="font-size:.92rem">${r.action.key === "safety_net" ? "A symptom worth watching, but no referral rule is met yet." : "Nothing in the note or the record crosses a cancer threshold."}</p>`;
    const rec = recordRows(c);
    $("#pmid").innerHTML = `
      <div class="pt-head"><span class="sbar ${col}"></span>
        <div class="ptm"><div class="nm">${c.name} <span class="synthetic-tag">synthetic</span></div>
          <div class="meta"><span>${p.age} y, ${p.sex === "M" ? "male" : "female"}</span><span>${smokeText(p)}</span><span>${c.centre}</span></div></div>
        <div class="stat"><span class="pill ${col}">${STATUS[col]}</span>${r.cancer ? `<span class="ctag">${CANCER[r.cancer]}</span>` : ""}</div></div>
      <div class="panel"><h3><span>Why ${p.sex === "M" ? "he" : "she"} is on your list</span></h3>
        <p class="reason"><b>${esc(c.headline)}.</b>${r.action.key === "none" ? " The agent checked this record and did not flag it." : r.action.key === "result_followup" ? " This follow-up was already due and nobody booked it." : ""}</p>${why}</div>
      <div class="panel"><h3><span>Cancer signals vs referral thresholds</span><span class="model-tag">deterministic</span></h3>${signalTable(c, r)}</div>
      <div class="panel"><h3><span>Today's visit note</span><span>${c.centre}</span></h3><div class="note">${esc(c.note)}</div><div class="gloss">${esc(c.noteEn)}</div></div>
      ${rec.length ? `<div class="panel"><h3><span>From the record</span></h3><table class="tbl"><thead><tr><th style="width:6.5rem">When</th><th>Entry</th><th>Note</th></tr></thead><tbody>
        ${rec.map(([d, t, f]) => `<tr><td class="num">${d ? d + " days ago" : "Today"}</td><td>${t}</td><td class="flag-cell">${f}</td></tr>`).join("")}</tbody></table></div>` : ""}`;
  }

  /* ---------- right: the drafted order ---------- */
  const ORDER = {
    lung_urgent: { exam: "Thorax CT", to: "Radiology, central hospital", q: "Lung cancer suspected — please image and report urgently." },
    emergency: { exam: "Same-day assessment", to: "Health-centre doctor today; emergency department if bleeding is heavy", q: "Coughing up blood: assess today, then the urgent CT pathway." },
    lymphoma_urgent: { exam: "Neck ultrasound + needle biopsy", to: "Radiology, central hospital", q: "Persistent enlarged lymph node with B-symptoms — lymphoma to be excluded." },
    any_urgent: { exam: "Repeat blood count + chest X-ray", to: "Laboratory and radiology", q: "Raised platelets — occult cancer to be considered." },
    lung_imaging: { exam: "Chest X-ray + review in 2 weeks", to: "Radiology; nurse books the review", q: "Persistent chest symptoms in a high-risk patient." },
    colorectal_test: { exam: "Stool test (F-hHb / FIT)", to: "Laboratory · home sample kit", q: "Iron-deficiency anaemia / change in bowel habit — triage for colonoscopy." },
    safety_net: { exam: "Safety-net check-in in 3 weeks", to: "Nurse phone call", q: "Has the symptom resolved? If not, the case re-opens." },
    result_followup: {
      lung: { exam: "Thorax CT", to: "Radiology, central hospital", q: "Follow-up recommended by the radiologist was never booked." },
      colorectal: { exam: "Colonoscopy referral", to: "Endoscopy unit, central hospital", q: "Positive stool test never investigated — colorectal cancer to be excluded." },
      prostate: { exam: "Repeat P-PSA (lab order)", to: "Laboratory; urology referral if still raised", q: "Raised PSA was never repeated (Käypä hoito: repeat after 1–2 months)." }
    }
  };
  function orderFor(x) {
    const { r } = x, k = r.action.key;
    if (k === "none") return null;
    let o = ORDER[k]; if (k === "result_followup") o = o[r.action.cancer] || { exam: "Follow-up of abnormal result", to: "—", q: r.action.title };
    if (x.queued) o = { exam: "Chest X-ray now · CT next week", to: "Radiology, central hospital", q: o.q + " No CT slot is free this week: X-ray and review now, first in line for the next CT slot." };
    return o;
  }
  function capLine(x) {
    const L = x.r.action.level;
    return x.r.action.key === "emergency" ? "Emergency — outside the slot limit." : L === 0 ? "Level 0 · this follow-up was already due. No new demand; the agent makes sure it happens." + (x.slot ? " Uses a CT slot." : "")
      : L === 1 ? "Level 1 · a simple, cheap test. No scarce slot used." : L === 2 && x.queued ? `Level 2 · all ${ctSlots} CT slot(s) this week are taken by higher-ranked patients.` : L === 2 && x.slot ? `Level 2 · uses 1 of the ${ctSlots} CT slot(s) the county gave the agent this week.` : L === 2 ? "Level 2 · specialist slot, ranked by rule strength." : "No slot needed.";
  }
  function renderRight(c, r) {
    const x = find(c.id), o = orderFor(x), st = (orders[c.id] = orders[c.id] || { status: "draft" });
    const toBehind = `<button class="tobehind" data-goto="behind">How did Ajoissa decide this? → <small>Step 2 of the demo: what ran overnight to produce this flag.</small></button>`;
    if (!o) { $("#pright").innerHTML = `<div class="order"><div class="ohead"><span>Draft order</span><span class="ostamp off">none</span></div>
        <div class="silent"><b>No order drafted.</b> The agent read this record and stays silent: specificity matters, so routine visits do not reach the nurse's list.</div></div>${toBehind}`; return; }
    const stamp = st.status === "sent" ? `<span class="ostamp sent">signed · sent</span>` : st.status === "review" ? `<span class="ostamp sent">review booked</span>` : st.status === "dismissed" ? `<span class="ostamp off">dismissed</span>` : `<span class="ostamp">draft · not sent</span>`;
    const urg = x.r.action.target === 0 ? "Today" : `Urgent · first step within ${x.r.action.target} days`;
    const details = (r.hits.map(h => h.text.replace(/\.\s*$/, "")).join(". ") || r.action.why.replace(/\.\s*$/, ""));
    const open = st.status === "draft";
    $("#pright").innerHTML = `<div class="order">
      <div class="ohead"><span>Drafted order</span>${stamp}</div>
      <div class="exam"><div class="k">Examination</div><div class="v">${o.exam}</div><div class="u"><span class="pill ${colour(r)}">${x.r.action.level === 0 ? `Overdue follow-up · book within ${x.r.action.target} days` : colour(r) === "red" ? urg : x.r.action.target ? `Within ${x.r.action.target} days` : "Routine"}</span></div></div>
      <div class="ofields">
        <div>To</div><div>${o.to}</div>
        <div>Question</div><div>${esc(o.q)}</div>
        <div>Clinical details</div><div id="o-details">${esc(details)}.</div>
        <div>Capacity</div><div>${capLine(x)}</div>
        <div>Drafted by</div><div>Ajoissa · overnight run 03:12</div>
        <div>Signed by</div><div>${st.status === "sent" ? "Dr. A. Virtanen · today 08:14" : "— (a clinician signs before anything is sent)"}</div>
      </div>
      ${open ? `<div class="oacts">
        <button class="btn" id="o-sign">Sign and send</button>
        <div class="row2"><button class="btn ghost" id="o-edit">Edit details</button><button class="btn ghost" id="o-review">Book review instead</button></div>
        <button class="btn ghost danger" id="o-dismiss">Dismiss with reason</button>
        <div class="live-only"><button class="btn ghost" id="o-draft" style="width:100%;justify-content:center">Write the referral in Finnish (AI draft)</button><div id="draft-out" style="margin-top:.5rem;white-space:pre-wrap;font-size:.9rem"></div></div>
      </div><div id="o-dbox"></div>`
      : `<div class="olog ${st.status === "dismissed" ? "grey" : ""}">${st.status === "sent" ? "Sent. The pathway clock is running; if the first step is late, the patient returns to the top of the list." : st.status === "review" ? "Review booked in 14 days. If it is missed, the patient returns to the top of the list." : `Dismissed: ${esc(st.reason || "")}. Archived — the patient comes back if there is a new visit or result.`}</div>
        <div class="oacts"><button class="btn ghost" id="o-undo">Undo (demo)</button></div>`}
      ${r.action.clock.length ? `<div class="clock" id="clock">${r.action.clock.map((s, i) => `<div class="${st.status === "sent" ? (i === 0 ? "now" : "") : ""}">${s}</div>`).join("")}</div>
      <div class="clockcap">Pathway clock · target for the first step: ${x.r.action.target ? x.r.action.target + " days" : "today"}${st.status === "sent" ? " · started" : " · starts when signed"}</div>` : ""}
    </div>${toBehind}`;
    const set = (s, reason) => { orders[c.id] = { status: s, reason }; renderRight(c, r); renderList(); };
    const b = id => $("#" + id);
    if (b("o-sign")) b("o-sign").addEventListener("click", () => set("sent"));
    if (b("o-review")) b("o-review").addEventListener("click", () => set("review"));
    if (b("o-undo")) b("o-undo").addEventListener("click", () => set("draft"));
    if (b("o-edit")) b("o-edit").addEventListener("click", e => { const d = b("o-details"), on = d.getAttribute("contenteditable") !== "true"; d.setAttribute("contenteditable", String(on)); e.target.textContent = on ? "Done editing" : "Edit details"; if (on) d.focus(); });
    if (b("o-dismiss")) b("o-dismiss").addEventListener("click", () => {
      b("o-dbox").innerHTML = `<div class="dismissbox"><label>Reason <select id="o-reason"><option>Already investigated elsewhere (private or occupational care)</option><option>Clinically explained — not a cancer concern</option><option>Patient declined</option><option>Patient has moved or died</option><option>Other</option></select></label><div class="btnrow"><button class="btn" id="o-dok">Dismiss</button><button class="btn ghost" id="o-dcancel">Cancel</button></div></div>`;
      b("o-dok").addEventListener("click", () => set("dismissed", b("o-reason").value)); b("o-dcancel").addEventListener("click", () => { b("o-dbox").innerHTML = ""; });
    });
    if (b("o-draft")) b("o-draft").addEventListener("click", () => draftReferral(c, r, b("draft-out"), b("o-draft")));
  }
  function runClock() {
    const cells = document.querySelectorAll("#clock div");
    cells.forEach((cell, i) => setTimeout(() => { cells.forEach(x => x.classList.remove("now")); for (let j = 0; j < i; j++) cells[j].classList.add("done"); cell.classList.add("now"); }, i * 450));
    setTimeout(() => { cells.forEach(x => x.classList.remove("now", "done")); if (cells[0]) cells[0].classList.add("now"); }, cells.length * 450 + 600);
  }

  function selectCase(id) {
    current = id;
    const { c, r } = find(id);
    renderList(); renderMid(c, r); renderRight(c, r); renderBehind(c, r);
  }

  /* ---------- page 2: behind the flag ---------- */
  function highlight(note, mentions) {
    const t = note; const ms = mentions.filter(m => m.start >= 0).slice().sort((a, b) => a.start - b.start);
    let out = "", pos = 0;
    for (const m of ms) {
      const i = m.start, j = Math.min(t.length, m.end);
      if (i < pos || j <= i) continue;
      const tip = [m.label + (m.icpc ? ` (ICPC-2 ${m.icpc})` : ""), m.negated && "negated", m.typo && `typo read as ${m.typo.split(" → ")[1]}`, m.pattern, m.severity && "described as severe", m.via === "ai" && "AI-read — please confirm"].filter(Boolean).join(" · ");
      out += esc(t.slice(pos, i)) + `<mark class="${m.negated ? "neg" : (A.LUNG_LR[m.concept] || ["lymph", "nightsweats", "pruritus", "bowelchange", "rectalbleed"].includes(m.concept) ? "" : "calm")}${m.via === "ai" ? " ai" : ""}" title="${tip}">${esc(t.slice(i, j))}</mark>`;
      pos = j;
    }
    return out + esc(t.slice(pos));
  }
  function earliestFlag(c) {
    // Re-run the same engine on each earlier visit, with only the history known at that time.
    const visits = (c.history || []).slice().sort((a, b) => b.daysAgo - a.daysAgo);
    for (let i = 0; i < visits.length; i++) {
      const v = visits[i];
      const past = visits.slice(0, i).map(h => ({ ...h, daysAgo: h.daysAgo - v.daysAgo }));
      const shift = xs => (xs || []).filter(x => x.daysAgo >= v.daysAgo).map(x => ({ ...x, daysAgo: x.daysAgo - v.daysAgo }));
      const r = A.assess({ ...c, note: v.text, history: past, labs: {}, codes: shift(c.codes).filter(x => x.daysAgo > 0), weights: shift(c.weights), results: (c.results || []).filter(x => x.daysAgo > v.daysAgo).map(x => ({ ...x, daysAgo: x.daysAgo - v.daysAgo })) });
      if (!["none", "safety_net"].includes(r.action.key)) return { daysAgo: v.daysAgo, r };
    }
    return null;
  }
  function chipsFor(r) {
    const fs = r.extraction.findings;
    const f = fs.map(x => `<span class="chip-f ${x.negated ? "neg" : (A.LUNG_LR[x.concept] || ["lymph", "nightsweats", "pruritus", "bowelchange", "rectalbleed", "anaemia"].includes(x.concept) ? "" : "calm")}">${x.label}${x.weeks ? ` · ${Math.round(x.weeks * 10) / 10} wk` : ""}${x.via === "ai" ? " · AI, confirm" : ""}</span>`).join("");
    const s = (r.signals || []).filter(x => x.id !== "NOT_FLAGGED").map(x => `<span class="chip-f data" title="${esc(x.text)}">${esc((x.text.includes(":") ? x.text.split(":")[0] : x.text.split(/ \(|;| — /)[0]))}</span>`).join("");
    return `<div class="chips">${f || `<span class="chip-f calm">No symptom words found</span>`}</div>${s ? `<div class="chips">${s}</div>` : ""}
      <p class="legend-s">Red = cancer symptom used · struck through = negated in the note ("ei veriyskää" = no blood) · blue = read from the record, not the note.</p>`;
  }
  function calcView(c, r) {
    const steps = r.risk.steps, lungish = r.lungRelevant && steps.length > 1;
    let html = "";
    if (lungish) {
      const pos = v => Math.max(0, Math.min(100, (Math.log10(Math.max(v, 1e-4) * 100) + 2) / 4 * 100));   // log scale 0.01 % … 100 %
      const th = pos(A.THRESHOLDS.urgent);
      const lr = s => { const m = s.label.match(/LR ([\d.]+)/); return m ? m[1] : null; };
      html += `<div class="calc">${steps.map((s, i) => `<div class="calc-row ${i === steps.length - 1 ? "final" : ""}"><div class="lab">${lr(s) ? `<span class="mult">× ${lr(s)}</span>` : ""}${i === 0 ? "<b>Starting risk</b> (age, smoking)" : `<b>${esc(s.label.replace(/^× /, "").replace(/ \(LR [\d.]+\)/, ""))}</b>`} ${cite(s.src)}</div>
          <div class="bar"><span class="${s.value >= A.THRESHOLDS.urgent ? "hot" : ""}" style="width:${pos(s.value)}%"></span><i style="left:${th}%"></i></div><div class="v">${pctS(s.value)}</div></div>`).join("")}
        <div class="calc-axis"><div></div><div><span>0.01 %</span><span>0.1 %</span><span>1 %</span><span>10 %</span><span>100 %</span></div><div></div></div></div>
        <div class="formula">${pctS(steps[0].value)} as odds${steps.slice(1).map(s => " × " + (lr(s) || "?")).join("")} = ${pctS(r.risk.posterior)} &nbsp;·&nbsp; Bayes with published likelihood ratios · black line = 3 % referral threshold ${cite("nice_ng12")}</div>
        ${r.risk.ignored.length ? `<p class="scale-note">Also present, not multiplied in (correlated symptoms are not double-counted): ${r.risk.ignored.map(x => x.label.toLowerCase()).join(", ")}. Likelihood ratios are UK-derived; recalibration on Finnish data is needed.</p>` : `<p class="scale-note">Likelihood ratios are UK-derived; recalibration on Finnish data is needed.</p>`}`;
    } else {
      const all = cancerRows(c, r).filter(x => x.cls !== "green" && x.cls !== "grey" || /not flagged/.test(x.what)), rows = all.filter(x => x.val !== "Rule" && x.val !== "Watch"), ruleOnly = all.filter(x => x.val === "Rule" || x.val === "Watch");
      html += ruleOnly.map(x => `<div class="verdict grey"><b>${x.cn}: nothing to calculate.</b> Decided by an explicit published rule — see step 4.</div>`).join("");
      html += rows.length ? `<div class="calc">${rows.map(x => `<div class="calc-row"><div class="lab"><b>${x.cn}</b> ${x.sub ? `· ${x.sub}` : ""}</div><div class="bar"><span class="${x.cls === "red" ? "hot" : ""}" style="width:${Math.min(100, x.ratio * 50)}%"></span><i style="left:50%"></i></div><div class="v">${x.val}</div></div>`).join("")}</div>` : "";
      (c.results || []).forEach(res => { const T = A.TRIGGERS[res.type]; if (!T) return; const ratio = res.daysAgo / T.window;
        html += `<div class="calc" style="margin-top:.5rem"><div class="calc-row"><div class="lab"><b>Time since ${esc(res.test.split(" (")[0])}</b> · follow-up window ${T.window} d ${cite(T.src)}</div><div class="bar"><span class="${ratio > 1 && !/not flagged/i.test(JSON.stringify(r.signals)) ? "hot" : ""}" style="width:${Math.min(100, ratio * 50)}%"></span><i style="left:50%"></i></div><div class="v">${res.daysAgo} d</div></div></div>`; });
      html += `<p class="scale-note">${r.cancer && r.cancer !== "lung" ? `No risk percentage for ${(CANCER[r.cancer] || "").toLowerCase()}: no risk model is validated for Finnish primary care, so the agent uses the published rule instead of inventing one.` : "Black line = the threshold or the end of the follow-up window."} ${(c.results || []).length ? `Follow-up windows are those of the randomised trial this design copies ${cite("murphy2015")}.` : ""}</p>`;
    }
    const col = colour(r);
    const rules = r.hits.length ? `<h3>4 · Rules met</h3><ul class="rules">${r.hits.map(h => `<li class="${h.level === "urgent" ? "urgent" : ""}"><span>${esc(h.text)}</span>${cite(h.src)}</li>`).join("")}</ul>` : "";
    const x = find(c.id) || { r, c };
    return html + rules + `<h3>5 · Proposed to the nurse</h3><div class="verdict ${col}"><b>${esc(r.action.title)}</b>${r.action.key !== "none" && x.c.id !== "custom" ? `<br><span style="font-size:.84rem">${capLine(x)}</span>` : ""}</div>`;
  }
  function pipelineHtml(c, r) {
    const fs = r.extraction.findings, neg = fs.filter(f => f.negated).length, sig = (r.signals || []).length;
    const calc = r.lungRelevant && r.risk.steps.length > 1 ? `Lung risk ${pctS(r.risk.prior)} → ${pctS(r.risk.posterior)}` : r.cancer === "lymphoma" ? "Nothing to calculate — explicit rule" : r.cancer && r.cancer !== "lung" ? "Value vs published limit" : "Nothing to weigh";
    const items = [["Read the note", `${fs.length - neg} finding(s), ${neg} negated`], ["Check the record", sig ? `${sig} signal(s) from results, codes, weights` : "Nothing in results, codes or weights"], ["Calculate", calc], ["Match rules", r.hits.length ? `${r.hits.length} rule(s) met` : "No rule met"], ["Propose", r.action.key === "none" ? "Stay silent" : (orderFor(find(c.id) || { r }) || {}).exam || r.action.title]];
    const hitI = r.action.key === "none" ? -1 : r.action.key === "result_followup" ? 1 : r.lungRelevant && r.risk.posterior >= A.THRESHOLDS.urgent ? 2 : 3;
    return `<div class="pipeline">${items.map(([t, d], i) => `<div data-i="${i}" class="${i === hitI ? "hit" : ""}"><div class="n">Step ${i + 1}</div><div class="t">${t}</div><div class="d">${esc(d)}</div></div>`).join("")}</div>`;
  }
  function renderBehind(c, r) {
    const custom = c.id === "custom";
    $("#behindbar").innerHTML = `<div><h2>Behind the flag — ${custom ? "your own note" : c.name}</h2><p>${custom ? "Type a note and watch the same rules run live." : `This is what ran overnight to produce the flag for ${c.name} on the nurse's worklist (step 1).`} The nurse never needs this page; it exists so anyone can check the reasoning. Same record in → same result out.</p></div>
      <div class="ctl"><select id="bh-pick" aria-label="Patient">${assessed.map(x => `<option value="${x.c.id}" ${x.c.id === c.id ? "selected" : ""}>${x.c.name} — ${STATUS[colour(x.r)]}</option>`).join("")}<option value="custom" ${custom ? "selected" : ""}>Try your own note…</option></select>
        <button class="btn ghost" data-goto="worklist">← Back to worklist</button></div>`;
    $("#bh-pick").addEventListener("change", e => { if (e.target.value === "custom") openEditor(); else selectCase(e.target.value); });
    $("#pipeline").innerHTML = pipelineHtml(c, r);
    if (!custom) $("#bh-left").innerHTML = `<div class="panel"><h3><span>1 · What it read · 2 · what the record added</span><span class="synthetic-tag">synthetic</span></h3>
        <div class="note" id="note-text">${highlight(c.note, r.extraction.mentions)}</div><div class="gloss">${esc(c.noteEn)}</div>${chipsFor(r)}
        <div class="live-only" style="margin-top:.6rem"><button class="btn ghost" id="ai-read">Second reading by AI (quotes checked)</button></div></div>`;
    $("#bh-right").innerHTML = `<div class="panel"><h3><span>3 · The calculation</span><span class="model-tag">deterministic</span></h3>${calcView(c, r)}</div>`;
    const ef = custom ? null : earliestFlag(c);
    $("#bh-earlier").innerHTML = ef ? `<div class="panel compare"><h3><span>Could this have been caught earlier?</span></h3><p>Re-running the same rules on ${c.name.split(" ")[0]}'s earlier visits, with only what was known then: the agent would have flagged ${c.patient.sex === "M" ? "him" : "her"} <b>${ef.daysAgo} days ago</b>, at the visit noted "${esc(c.history.find(h => h.daysAgo === ef.daysAgo).text)}".</p>${compareSvg(ef.daysAgo)}</div>` : "";
    const ar = $("#ai-read"); if (ar) ar.addEventListener("click", () => aiRead(c, ar));
    if ($("#view-behind").classList.contains("active")) animatePipeline();
  }
  function animatePipeline() {
    const els = document.querySelectorAll(".pipeline > div");
    els.forEach(d => d.classList.remove("on"));
    els.forEach((d, i) => setTimeout(() => d.classList.add("on"), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 150 + i * 280));
  }

  const custom = { id: "custom", name: "Your patient", centre: "Your health centre", synthetic: true, history: [], labs: {},
    patient: { age: 58, sex: "F", smoking: { ever: true, current: false, cigsPerDay: 15, years: 30, quitYears: 5 } },
    note: "58-v nainen. Yskä 5 viikkoa, hengenahdistusta rasituksessa. Ei veriyskää. Ei kuumetta.", noteEn: "", headline: "" };
  function openEditor() {
    const p = custom.patient, sm = p.smoking.ever ? (p.smoking.current ? "current" : "ex") : "never";
    $("#bh-left").innerHTML = `<div class="panel"><h3><span>Try your own note</span><span class="synthetic-tag">stays in this browser</span></h3>
      <div class="patient-meta">
        <label>Age <input id="e-age" type="number" min="18" max="100" value="${p.age}" style="width:4rem"></label>
        <label>Sex <select id="e-sex"><option value="F" ${p.sex === "F" ? "selected" : ""}>F</option><option value="M" ${p.sex === "M" ? "selected" : ""}>M</option></select></label>
        <label>Smoking <select id="e-smk"><option value="never" ${sm === "never" ? "selected" : ""}>never</option><option value="current" ${sm === "current" ? "selected" : ""}>current</option><option value="ex" ${sm === "ex" ? "selected" : ""}>former</option></select></label>
        <label>/day <input id="e-cig" type="number" min="1" max="80" value="${p.smoking.cigsPerDay || 15}" style="width:3.6rem"></label>
        <label>years <input id="e-yrs" type="number" min="1" max="70" value="${p.smoking.years || 30}" style="width:3.6rem"></label>
        <label>Platelets <input id="e-plt" type="number" min="50" max="1500" placeholder="–" value="${custom.labs.plt || ""}" style="width:4.6rem"></label>
        <label>Earlier visits (90 d) <input id="e-rep" type="number" min="0" max="6" value="${custom.history.length}" style="width:3.2rem"></label>
      </div>
      <textarea id="e-note" rows="5">${esc(custom.note)}</textarea>
      <div class="note" id="e-hl" style="margin-top:.6rem"></div><div id="e-chips"></div>
      <p class="scale-note">Examples: “couching blood violently”, “Yskinyt verta”, “laihtunut 6 kg”, “ei laihtumista”, “neck lump for 4 weeks, night sweats”, “kiistää veriyskän”.</p></div>`;
    const sync = () => {
      const smk = $("#e-smk").value;
      custom.patient = { age: +$("#e-age").value || 50, sex: $("#e-sex").value, smoking: smk === "never" ? { ever: false } : { ever: true, current: smk === "current", cigsPerDay: +$("#e-cig").value || 10, years: +$("#e-yrs").value || 20, quitYears: smk === "ex" ? 5 : 0 } };
      custom.labs = $("#e-plt").value ? { plt: +$("#e-plt").value } : {};
      const n = +$("#e-rep").value || 0; custom.history = Array.from({ length: n }, (_, i) => ({ daysAgo: 20 + i * 25, related: true, text: "(earlier visit for the same complaint)" }));
      custom.note = $("#e-note").value;
      const am = custom.note.match(/(\d{2})\s*-?\s*(v\b|v\.|vuotias|year|y\/o|yo\b)/i);
      if (am && document.activeElement && document.activeElement.id === "e-note") { $("#e-age").value = am[1]; custom.patient.age = +am[1]; }
      const r = A.assess(custom);
      $("#e-hl").innerHTML = highlight(custom.note, r.extraction.mentions);
      $("#e-chips").innerHTML = chipsFor(r);
      renderBehind(custom, r);
    };
    $("#bh-left").querySelectorAll("input,select,textarea").forEach(x => x.addEventListener("input", sync));
    sync();
  }

  function compareSvg(daysEarlier) {
    const W = 520, H = 80, x0 = 20, x1 = 500, span = 90;
    const X = d => x0 + ((span - d) / span) * (x1 - x0);
    return `<svg viewBox="0 0 ${W} ${H}" aria-label="Flag ${daysEarlier} days earlier">
      <line x1="${x0}" x2="${x1}" y1="40" y2="40" stroke="var(--line)" stroke-width="2"/>
      <rect x="${X(daysEarlier)}" y="33" width="${X(0) - X(daysEarlier)}" height="14" fill="var(--green-soft)" stroke="var(--green-line)"/>
      <rect x="${X(daysEarlier) - 6}" y="34" width="12" height="12" fill="var(--green)"/><text x="${X(daysEarlier)}" y="24" fill="var(--green)" font-size="12" font-weight="700" text-anchor="middle">Agent flag</text>
      <rect x="${X(0) - 6}" y="34" width="12" height="12" fill="var(--red)"/><text x="${X(0)}" y="24" fill="var(--red)" font-size="12" font-weight="700" text-anchor="middle">Today</text>
      <text x="${(X(daysEarlier) + X(0)) / 2}" y="68" fill="var(--text)" font-size="13" text-anchor="middle" font-weight="700">${daysEarlier} days earlier</text></svg>`;
  }

  /* ---------- evidence: key numbers + how it plugs in ---------- */
  function renderKeynums() {
    const k = [
      ["27 %", "of Finnish lung-cancer patients reach curative treatment (2019–2023)", "lungreg2026", ""],
      ["65 %", "of hospital stays before a colorectal diagnosis start as emergencies", "hermio2023", ""],
      ["67 %", "of municipal survival variation lies inside hospital districts — act per health centre", "seppa2020", ""],
      ["200 → 104 d", "time to colorectal work-up when abnormal results trigger a human review (RCT)", "murphy2015", "ok"]
    ];
    $("#keynums").innerHTML = k.map(([v, l, s, cl]) => `<div><span class="k ${cl}">${v}</span><span class="l">${l}</span><span class="s">${cite(s)}</span></div>`).join("");
    $("#ehr-flow").innerHTML = [
      ["1 · The county's own records", "Ajoissa reads a nightly copy of the county's records. Päijät-Häme runs one shared record system (Harjun terveys included), so \"was the follow-up done?\" is checked in one place. No new data collection."],
      ["2 · Engine on county servers", "Rules run inside Päijät-Häme's own environment: its own data, its own patients, every access logged (HE 159/2025)."],
      ["3 · Worklist page", "The nurse opens one page with single sign-on: the worklist in step 1 of the demo. The same list → nurse → doctor routine AINO already runs for kidney disease."],
      ["4 · Normal record system", "The nurse or GP books the follow-up in the record system they already use. Nothing goes to the patient automatically."],
      ["5 · Next night closes the clock", "The next run sees the booking or result and moves the clock on. The timestamps feed this county view."]
    ].map(([h, t]) => `<div><b>${h}</b><p>${t}</p></div>`).join("");
  }

  /* ================= COUNTY ================= */
  // Seeded RNG so the synthetic numbers are identical on every run
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function renderCounty() {
    if (C && C.rows && C.rows.length) {
      const rows = C.rows.slice().sort((a, b) => (a[C.sortKey] ?? 999) - (b[C.sortKey] ?? 999));
      const max = Math.max(...rows.map(r => r[C.barKey] || 0));
      $("#county-table").innerHTML = `<h3><span>${C.title}</span><span class="real-tag">real</span></h3>
        <p style="margin:-.3rem 0 .8rem;color:var(--frost);font-size:.88rem">${C.subtitle} ${cite(C.src)}</p>
        <table class="tbl"><thead><tr><th>Wellbeing services county</th>${C.cols.map(c => `<th class="r">${c.label}</th>`).join("")}<th></th></tr></thead><tbody>
        ${rows.map(r => `<tr class="${r.highlight ? "sel" : ""}"><td>${r.name}</td>${C.cols.map(c => `<td class="r num">${r[c.key] == null ? "–" : r[c.key] + (c.unit || "")}</td>`).join("")}<td style="width:28%"><span class="cell-bar ${r[C.barKey] >= C.badAt ? "bad" : r[C.barKey] <= C.goodAt ? "ok" : ""}" style="width:${(r[C.barKey] || 0) / max * 100}%"></span></td></tr>`).join("")}
        </tbody></table><p class="scale-note">${C.footnote || ""}</p>`;
    } else {
      $("#county-table").innerHTML = `<h3>Primary-care access by county</h3><p style="color:var(--frost)">County data loading…</p>`;
    }
    // synthetic per health centre step times
    const r = rng(42);
    const centres = ["Health centre A (rural)", "Health centre B (urban)", "Health centre C (suburban)", "Health centre D (rural)", "Health centre E (urban)", "Health centre F (rural)"];
    const steps = [{ s: "Symptom flag → imaging", t: 7 }, { s: "Imaging → result acted on", t: 3 }, { s: "Referral → specialist", t: 14 }, { s: "Specialist → diagnosis", t: 14 }];
    const data = centres.map((c, i) => ({ c, v: steps.map(st => Math.round(st.t * (0.6 + r() * (i === 0 || i === 3 ? 2.6 : 1.2)))) }));
    const maxv = Math.max(...data.flatMap(d => d.v));
    const drawCentre = idx => { const sel = data[idx];
    $("#centre-steps").innerHTML = `<h3><span>${sel.c}: median days per step</span><span class="synthetic-tag">synthetic</span></h3>
      <div class="stepbars">${steps.map((st, i) => `<div class="stepbar"><span>${st.s}</span><span class="t"><span class="${sel.v[i] > st.t ? "slow" : ""}" style="width:${sel.v[i] / maxv * 100}%"></span><i style="left:${st.t / maxv * 100}%" title="target ${st.t} d"></i></span><b class="num">${sel.v[i]} d</b></div>`).join("")}</div>
      <p class="scale-note"><b style="color:var(--snow)">Why per health centre?</b> Two-thirds of the variation in Finnish cancer survival between municipalities lies <i>inside</i> hospital districts — at the local level a county can act on. ${cite("seppa2020")}</p>
      <p class="scale-note">Black line = target used in the demo. National cancer-specific waiting-time targets are being defined in roadmap 3.1.2 (2026–2028). ${cite("roadmap2026")}</p>
      <table class="tbl" style="margin-top:.8rem"><thead><tr><th>Health centre</th>${steps.map(s => `<th class="r">${s.s.split(" → ")[1]}</th>`).join("")}</tr></thead>
      <tbody>${data.map((d, di) => `<tr class="clickable ${d === sel ? "sel" : ""}" data-centre="${di}" tabindex="0"><td>${d.c}</td>${d.v.map((v, i) => `<td class="r num" style="color:${v > steps[i].t ? "var(--alert-text)" : "var(--snow)"}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
      <p class="scale-note">Click a health centre to see its steps.</p>`;
    document.querySelectorAll("[data-centre]").forEach(tr => { const go = () => drawCentre(+tr.dataset.centre); tr.addEventListener("click", go); tr.addEventListener("keydown", e => { if (e.key === "Enter") go(); }); });
    };
    drawCentre(0);
    const flagged = assessed.filter(x => x.r.action.target);
    $("#clocks").innerHTML = `<h3><span>Open pathway clocks</span><span class="synthetic-tag">synthetic</span></h3>
      <table class="tbl"><thead><tr><th>Patient</th><th>Next step</th><th class="r">Day</th><th class="r">Target</th><th>Status</th></tr></thead><tbody>
      ${flagged.map((x, i) => { const day = [9, 2, 4, 16, 1][i % 5]; const over = day > x.r.action.target; return `<tr><td>${x.c.name}</td><td>${x.r.action.clock[0]}</td><td class="r num">${day}</td><td class="r num">${x.r.action.target}</td><td><span class="pill ${over ? "over" : day > x.r.action.target * .7 ? "risk" : "ontime"}">${over ? "overdue — escalated" : day > x.r.action.target * .7 ? "at risk" : "on time"}</span></td></tr>`; }).join("")}
      </tbody></table>`;
  }

  /* ================= IMPACT ================= */
  const P = { pop: 205000, coverage: 100, sens: 60, cut: 50, interval: 41, slots: 10 };
  const SL = [
    { k: "pop", label: "County population", min: 60000, max: 1700000, step: 10000, fmt: v => v.toLocaleString("en-US"), note: "Default = Päijät-Häme, the proposed pilot county (204,676 residents in 2024)." },
    { k: "coverage", label: "Health centres using Ajoissa", min: 10, max: 100, step: 5, fmt: v => v + " %", note: "Start with 3 pilot centres, then scale." },
    { k: "sens", label: "Share of lung cancers the agent flags", min: 30, max: 80, step: 5, fmt: v => v + " %", note: "Schut 2025: ≈ 62 % flagged at 3 % PPV (moderate evidence)." },
    { k: "cut", label: "Primary-care interval cut for flagged patients", min: 20, max: 60, step: 5, fmt: v => v + " %", note: "Murphy 2015 RCT: trigger + review roughly halved time to work-up (colorectal)." },
    { k: "slots", label: "Imaging slots a week the county gives the agent", min: 0, max: 100, step: 1, fmt: v => v + " / wk", note: "The agent ranks patients and fills only these. 0 = Level 0 only: chase follow-ups that are already due." },
    { k: "interval", label: "Current primary-care interval (days)", min: 14, max: 90, step: 1, fmt: v => v + " d", note: "41 d in an unpublished Finnish lung study (weak) — replace with the county's own data." }
  ];
  function renderImpact() {
    $("#sliders").innerHTML = `<h3>Assumptions you can change</h3>` + SL.map(s => `<div class="slider"><label for="s-${s.k}"><span>${s.label}</span><b class="num" id="v-${s.k}">${s.fmt(P[s.k])}</b></label><input type="range" id="s-${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${P[s.k]}"><small>${s.note}</small></div>`).join("");
    SL.forEach(s => $("#s-" + s.k).addEventListener("input", e => { P[s.k] = +e.target.value; $("#v-" + s.k).textContent = s.fmt(P[s.k]); computeImpact(); }));
    computeImpact();
  }
  function computeImpact() {
    // Lung-cancer incidence ≈ 3,000 / 5.6 M per year (Finnish Cancer Registry, rounded)
    const cases = P.pop * 3000 / 5600000;
    let flagged = cases * (P.coverage / 100) * (P.sens / 100);
    const daysEach = P.interval * (P.cut / 100);
    const daysTotal = flagged * daysEach;
    const workupsAll = flagged * 33; // Schut 2025: ≈ 33 evaluated per earlier diagnosis
    const share = workupsAll > 0 ? Math.min(1, P.slots * 52 / workupsAll) : 0;   // proportional: ranking is not credited with any extra yield
    const workups = workupsAll * share;
    flagged = flagged * share;
    const lo = v => Math.round(v * 0.6), hi = v => Math.round(v * 1.3);
    $("#outcomes").innerHTML = `
      <div class="panel outcome"><div class="v num">${Math.round(flagged)}</div><div class="lbl">lung-cancer patients a year diagnosed through a tracked, faster route</div><div class="range">range ${lo(flagged)}–${hi(flagged)} · of ≈ ${Math.round(cases)} cases in the county <span class="model-tag">model</span></div></div>
      <div class="panel outcome"><div class="v num">${Math.round(daysEach)} d</div><div class="lbl">earlier to diagnostic imaging, per flagged patient</div><div class="range">${Math.round(daysTotal).toLocaleString("en-US")} patient-days recovered a year <span class="model-tag">model</span></div></div>
      <div class="panel outcome"><div class="v num" style="color:var(--amber)">${Math.round(workups / 52)} / wk</div><div class="lbl">imaging slots used for symptom flags — capped by the county, not by the agent</div><div class="range">uncapped, the model would ask for ≈ ${Math.round(workupsAll / 52)} a week; ${Math.round(share * 100)} % of flags get a slot <span class="model-tag">model</span></div></div>
      <div class="panel outcome" style="grid-column:1/-1"><div class="lbl" style="font-size:1rem;color:var(--snow)"><b>Level 0 needs none of these slots.</b> Chasing results that were already abnormal and never followed up creates no new demand. In the trial this design copies, one part-time reviewer spent about 4 hours a week on chart review and 1–2 hours on messages, for 72 primary-care clinicians; 6 in 10 flags were real delays. ${cite("murphy2015")} <span class="real-tag">published</span></div></div>`;
    $("#assumptions").innerHTML = `<h3>What this model does and does not claim</h3><ul class="assume">
      <li>Cases: county population × Finland's ≈ 3,000 lung cancers a year (14,926 in 2019–2023, Finnish Cancer Registry) / 5.6 M people. National rate, not the county's own incidence.</li>
      <li>Flag rate and work-up burden from a retrospective Dutch study ${cite("schut2025")}; speed-up from a US cluster RCT on colorectal and prostate red flags ${cite("murphy2015")}. Neither is Finnish.</li>
      <li><b>No stage shift or survival gain is claimed.</b> The UK trial designed to test that (ERICA) has not reported. The county pilot is how we find out — with the pathway clocks as the measuring instrument.</li>
      <li>Work-ups are the honest cost. The county sets the number of slots; the agent only decides who is proposed for them, so a lower-risk patient waits longer. With fewer slots than flags, the model scales the benefit down in proportion and gives ranking no extra credit.</li>
      <li>Ranges shown are ±30–40 % of the point estimate to signal uncertainty; they are not statistical confidence intervals.</li></ul>`;
    renderSurvival(flagged, daysEach);
  }

  /* ---- Highly experimental: what faster diagnosis MIGHT mean for 5-year survival ----
     Proportional hazards: S_new = S ^ (1 / h^(days/28)), h = hazard ratio per 4 weeks of delay (Hanna 2020).
     Every input is shown; prostate is left out (not in Hanna 2020; high survival; overdiagnosis risk). */
  const SV = { h: 1.06, bowelShare: 10, bowelDays: 96 };
  function renderSurvival(lungFlagged, lungDays) {
    const el = $("#survival-exp"); if (!el) return;
    const gain = (n, S, d) => { const f = Math.pow(SV.h, d / 28); return n * (Math.pow(S, 1 / f) - S); };
    const lungS = 0.20;                                   // between men 16.4 % and women 25.5 % (Tichanek 2023)
    const bowelS = 0.61;                                  // 2006–2015, Olenius 2022
    const bowelCases = P.pop * 4153 / 5600000 * (P.coverage / 100);   // 4,153 new colorectal cancers in 2024 (Cancer Registry, Syöpä 2024)
    const bowelN = bowelCases * SV.bowelShare / 100;
    const gl = gain(lungFlagged, lungS, lungDays), gb = gain(bowelN, bowelS, SV.bowelDays);
    const f1 = v => v < 0.05 ? "≈ 0" : v.toFixed(1);
    el.innerHTML = `<h3><span>What it might mean for survival</span><span class="model-tag" style="background:var(--alert);color:#fff">highly experimental</span></h3>
      <p style="color:var(--frost);font-size:.92rem;margin:.2rem 0 .8rem">Not a claim. A transparent what-if: if diagnosis comes earlier, and if earlier helps as much as published data on <i>treatment</i> delay suggests, how many more people would be alive at 5 years? Every input below is visible and changeable.</p>
      <div class="slider"><label for="sv-h"><span>Extra risk of death per 4 weeks of delay</span><b class="num" id="sv-hv">${Math.round((SV.h - 1) * 100)} %</b></label><input type="range" id="sv-h" min="1" max="1.08" step="0.01" value="${SV.h}"><small>0 % = earlier diagnosis changes nothing (possible: the sickest are often diagnosed fastest). 6–8 % = surgery in Hanna 2020 ${cite("hanna2020")}, which measured delay <i>after</i> diagnosis.</small></div>
      <div class="slider"><label for="sv-bs"><span>Bowel cancers found through an unfollowed result</span><b class="num" id="sv-bsv">${SV.bowelShare} %</b></label><input type="range" id="sv-bs" min="0" max="30" step="1" value="${SV.bowelShare}"><small>Assumption with no source: the share of the county's bowel cancers that had an abnormal stool test or anaemia nobody acted on. The pilot would measure it.</small></div>
      <div class="slider"><label for="sv-bd"><span>Days earlier for those bowel cancers</span><b class="num" id="sv-bdv">${SV.bowelDays} d</b></label><input type="range" id="sv-bd" min="0" max="120" step="1" value="${SV.bowelDays}"><small>96 d = the trial's median difference in time to work-up (200 vs 104 days) ${cite("murphy2015")}.</small></div>
      <table class="tbl" style="margin-top:.8rem"><thead><tr><th>Cancer</th><th class="r">Patients a year</th><th class="r">Days earlier</th><th class="r">5-year survival now</th><th class="r">Extra 5-year survivors a year</th></tr></thead><tbody>
      <tr><td>Lung (symptom flags, slots as set above)</td><td class="r num">${Math.round(lungFlagged)}</td><td class="r num">${Math.round(lungDays)}</td><td class="r num">≈ 20 % ${cite("actaonc2025_surv")}</td><td class="r num"><b>${f1(gl)}</b></td></tr>
      <tr><td>Bowel (Level 0: results nobody followed up)</td><td class="r num">${Math.round(bowelN)}</td><td class="r num">${SV.bowelDays}</td><td class="r num">≈ 61 % ${cite("olenius2022")}</td><td class="r num"><b>${f1(gb)}</b></td></tr>
      <tr><td>Prostate</td><td class="r">–</td><td class="r">–</td><td class="r">–</td><td class="r">left out</td></tr></tbody></table>
      <ul class="assume" style="margin-top:.8rem">
      <li><b>Why this is highly experimental.</b> The hazard ratio comes from delay between diagnosis and treatment, not from delay before diagnosis. Earlier diagnosis can also look like longer survival just because the clock starts sooner (lead-time bias). No trial has shown a survival effect for this kind of tool.</li>
      <li>Method: proportional hazards, S<sub>new</sub> = S<sup>1/h<sup>days/28</sup></sup>. Bowel cases: county population × 4,153 new cases in Finland in 2024 ${cite("syopa2024_crc")} / 5.6 M people.</li>
      <li>Sanity check from real data: after Denmark introduced cancer pathways, 3-year survival of patients diagnosed via primary care rose from 45 % to 54 %, with the same lead-time caveat ${cite("jensen2017")}.</li>
      <li>Prostate is left out: it is not in the hazard-ratio review, survival is already high, and faster diagnosis there risks overdiagnosis.</li></ul>`;
    [["sv-h", "h", v => Math.round((v - 1) * 100) + " %", "sv-hv"], ["sv-bs", "bowelShare", v => v + " %", "sv-bsv"], ["sv-bd", "bowelDays", v => v + " d", "sv-bdv"]].forEach(([id, k]) =>
      $("#" + id).addEventListener("change", e => { SV[k] = +e.target.value; computeImpact(); }));
  }

  /* ================= BRIEFING ================= */
  const BRIEF = [
    { t: "Where the gap is", s: `Lymphoma patients who enter through public primary care wait a median of 127 days from symptom to treatment, versus 76 days through occupational or private care — and the gap opens before they ever see a specialist. The delay is born in primary care.`, c: ["kuitunen2026"] },
    { t: "Why it matters for Goal 3", s: `Finland has the Nordics' lowest lung-cancer survival. The strategy asks for +14 percentage points by 2035, and only 27 % of lung-cancer patients now reach curative treatment.`, c: ["actaonc2025_surv", "strategy2026", "lungreg2026"] },
    { t: "The mechanism", s: `A Finnish GP appointment takes about two weeks, adults are only guaranteed one within three months, and according to a Nordic expert survey few health centres can order a CT directly. Patients come back again and again: service use rises three to four months before a colorectal diagnosis.`, c: ["ihe2026", "careguarantee2025", "hermio2023"] },
    { t: "What we propose", s: `Ajoissa: a safety-net agent that reads the county's own records overnight, puts patients with stalled cancer signals on a named nurse's list with the reason, and runs a clock until they are diagnosed or cleared. A professional decides every action.`, c: ["he159"] },
    { t: "Why we believe it works", s: `In a randomised trial the same pattern — automatic trigger plus human review of abnormal results — cut time to colorectal work-up from 200 to 104 days. And in April 2026 Parliament approved letting counties use their own records to find health problems early.`, c: ["murphy2015", "he159"] },
    { t: "What we ask", s: `Päijät-Häme, where the same list-to-nurse-to-doctor model already runs for kidney disease: three health centres, six months, about 28,000 euros. Track flags acted on within 7 days, days from flag to imaging, and the share of cancers diagnosed from a tracked route. The clocks also produce the step-by-step waiting data the strategy says is missing.`, c: ["strategy2026", "aino2026"] }
  ];
  let speaking = false;
  function renderBrief() {
    $("#brief-card").innerHTML = `<p class="kicker">Briefing for: wellbeing services county director · 2 minutes</p>
      <h2>Close the front-door gap in public primary care</h2>
      <ol>${BRIEF.map((b, i) => `<li id="b-${i}"><b>${b.t}.</b> ${b.s} ${b.c.map(cite).join(" ")}</li>`).join("")}</ol>`;
    $("#brief-controls").innerHTML = `<h3>Present it</h3><div class="timer num" id="timer">2:00</div>
      <p style="color:var(--frost);font-size:.9rem">The analyst reads the briefing aloud and keeps to two minutes. Text is generated from the same data shown in the other views — nothing extra is invented.</p>
      <div class="btnrow"><button class="btn" id="speak">Read it aloud</button><button class="btn ghost" id="stop">Stop</button></div>`;
    $("#speak").addEventListener("click", speak); $("#stop").addEventListener("click", stopSpeak);
  }
  let tick;
  function speak() {
    stopSpeak(); speaking = true;
    let left = 120; $("#timer").textContent = "2:00";
    tick = setInterval(() => { left--; $("#timer").textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; if (left <= 0) clearInterval(tick); }, 1000);
    if (!("speechSynthesis" in window)) { stepThrough(); return; }
    const voices = speechSynthesis.getVoices(); const v = voices.find(x => /en-GB|en-US/.test(x.lang));
    BRIEF.forEach((b, i) => { const u = new SpeechSynthesisUtterance(`${b.t}. ${b.s}`); if (v) u.voice = v; u.rate = 1.02; u.onstart = () => mark(i); u.onend = () => { if (i === BRIEF.length - 1) stopSpeak(); }; speechSynthesis.speak(u); });
  }
  function stepThrough() { BRIEF.forEach((_, i) => setTimeout(() => speaking && mark(i), i * 18000)); }
  function mark(i) { document.querySelectorAll(".brief-card li").forEach(li => li.classList.remove("speaking")); const li = $("#b-" + i); if (li) li.classList.add("speaking"); }
  function stopSpeak() { speaking = false; if ("speechSynthesis" in window) speechSynthesis.cancel(); clearInterval(tick); document.querySelectorAll(".brief-card li").forEach(li => li.classList.remove("speaking")); }

  /* ================= SOURCES ================= */
  function renderTests() {
    const T = window.AJOISSA_TEST_RESULTS; if (!T) return "";
    const p = x => x == null ? "–" : Math.round(x * 100) + " %";
    const row = (n, s) => `<tr><td>${n}</td><td class="num">${s.notesFullyCorrect}/${s.notes}</td><td class="num">${p(s.precision)}</td><td class="num">${p(s.recall)}</td><td class="num">${s.negN === "" ? "–" : s.negOK + "/" + s.negN}</td><td class="num">${s.actN === "" ? "–" : s.actOK + "/" + s.actN}</td></tr>`;
    return `<h3>How well the agent reads notes <span class="synthetic-tag">synthetic test notes</span></h3>
      <table class="tbl"><thead><tr><th>Test set</th><th>Notes fully right</th><th>Precision</th><th>Recall</th><th>Negations</th><th>Right action</th></tr></thead><tbody>
      ${row("Development set, first run", { notesFullyCorrect: T.firstRun.fullyCorrect, notes: T.firstRun.notes, precision: T.firstRun.precision, recall: T.firstRun.recall, negOK: "", negN: "", actOK: "", actN: "" })}
      ${row("Development set, after fixes", T.dev)}
      ${row("Held-out set, first run", { notesFullyCorrect: T.heldFirst.fullyCorrect, notes: T.heldFirst.notes, precision: T.heldFirst.precision, recall: T.heldFirst.recall, negOK: "", negN: "", actOK: "", actN: "" })}
      ${row("Held-out set, now", T.heldout)}</tbody></table>
      ${T.records ? `<table class="tbl" style="margin-top:.8rem"><thead><tr><th>Record tests (no free text needed)</th><th>Right</th></tr></thead><tbody>
      <tr><td>Result nobody acted on: flag, wait, or stay silent — lung imaging, stool test, iron-deficiency anaemia, PSA</td><td class="num">${T.records.ok}/${T.records.n}</td></tr>
      <tr><td>Smoking history read from the note and turned into pack-years</td><td class="num">${T.smoking.ok}/${T.smoking.n}</td></tr>
      <tr><td>A relative's symptom not mistaken for the patient's</td><td class="num">${T.relatives.ok}/${T.relatives.n}</td></tr></tbody></table>
      <p class="scale-note">Record tests use the time windows and exclusions of the randomised trial (lung 30, bowel 60, prostate 90 days) ${cite("murphy2015")}, Finnish laboratory limits ${cite("fimlab_fhb")} ${cite("fimlab_psa")} and Käypä hoito ${cite("kh_psa")}. Synthetic records.</p>` : ""}
      <p class="scale-note">Development notes (200: 160 generated variants, 40 hand-written traps such as “couching blood violently”, “retired”, “couch”) were used while building the reader. Held-out notes were written afterwards and only one bug they exposed was fixed. Words the reader still misses on held-out notes: ${T.heldout.failures.map(f => "“" + esc(f.note) + "”").slice(0, 4).join(", ")}… — this is why the optional AI reading exists, with every suggestion quoting the note and confirmed by the clinician. All notes were written by the team, so these are not real-world accuracy figures.</p>`;
  }
  function renderSources() {
    $("#test-results").innerHTML = renderTests();
    $("#source-table").innerHTML = `<table class="tbl src-table"><thead><tr><th>Source</th><th>What it shows</th><th>Evidence</th><th>Outcome type</th></tr></thead><tbody>
      ${Object.entries(S).map(([k, s]) => `<tr><td><button class="cite" data-src="${k}">${s.short}</button></td><td>${s.title}<br><span style="color:var(--mute);font-size:.82rem">${s.where}</span></td><td><span class="grade ${s.grade}">${s.grade}</span></td><td>${s.measure}</td></tr>`).join("")}
      </tbody></table>`;
  }

  /* ================= LIVE AI (optional, only where the host provides it) ================= */
  let samplePromise = null;
  function getSample() {
    if (!samplePromise) samplePromise = (window.claude && window.claude.use) ? window.claude.use("sample").catch(() => null) : Promise.resolve(null);
    return samplePromise;
  }
  const GUARD = "Rules: use ONLY the facts and numbers in the DATA block. Never invent a number, study or name. After each factual sentence put the source key in square brackets, e.g. [murphy2015]. If the data does not answer the question, say so plainly. Plain language for a non-technical decision-maker. No markdown headings.";
  function dataBlock() {
    const src = Object.fromEntries(Object.entries(S).map(([k, v]) => [k, `${v.short}: ${v.title}. ${v.note || ""} (evidence ${v.grade}; shows ${v.measure})`]));
    const cases = assessed.map(({ c, r }) => ({ name: c.name, synthetic: true, age: c.patient.age, headline: c.headline, risk_prior_pct: +(r.risk.prior * 100).toFixed(2), risk_post_pct: +(r.risk.posterior * 100).toFixed(1), rules: r.hits.map(h => h.text), action: r.action.title }));
    return JSON.stringify({ sources: src, dlbcl: D.dlbcl, impact_defaults: P, synthetic_cases: cases, briefing: BRIEF.map(b => b.t + ": " + b.s) });
  }
  async function askAnalyst(q, out, btn) {
    const sample = await getSample(); if (!sample) return;
    btn.disabled = true; out.textContent = "Thinking…";
    try {
      const prompt = `You are the Ajoissa analyst for a Finnish wellbeing services county. ${GUARD}\n\nDATA:\n${dataBlock()}\n\nQUESTION: ${q}\n\nAnswer in at most 120 words.`;
      const r = await sample(prompt, { modelTier: "default", cache: false, onText: ({ text }) => { out.textContent = text; } });
      out.innerHTML = esc(r.text).replace(/\[([a-z0-9_]+)\]/gi, (m, k) => S[k] ? `<button class="cite" data-src="${k}">${S[k].short}</button>` : m);
    } catch (e) { out.textContent = e && e.code === "rate_limited" ? "The analyst is busy — try again in a minute." : "The live analyst is not available here. The briefing on the left is generated from the same data."; }
    btn.disabled = false;
  }
  async function aiRead(c, btn) {
    const sample = await getSample(); if (!sample) return;
    btn.disabled = true; btn.textContent = "Reading…";
    try {
      const res = await sample(A.aiPrompt(c.note), { modelTier: "default", cache: false });
      const r = A.assess(c, { ai: res.text });
      if (c.id === "custom") { $("#e-hl").innerHTML = highlight(c.note, r.extraction.mentions); }
      renderBehind(c, r);
      const b2 = $("#ai-read"); if (b2) { b2.disabled = true; b2.textContent = "AI reading added — rules still decide"; }
    } catch (e) { btn.textContent = "AI reading not available here"; }
  }
  async function draftReferral(c, r, out, btn) {
    const sample = await getSample(); if (!sample) return;
    btn.disabled = true; out.textContent = "Drafting…";
    const facts = { patient: c.name + " (SYNTHETIC)", age: c.patient.age, sex: c.patient.sex, note_fi: c.note, history: c.history, labs: c.labs, findings: r.extraction.findings.map(f => (f.negated ? "NEGATED: " : "") + f.label + (f.weeks ? ` (${f.weeks} wk)` : "")), risk_estimate_pct: +(r.risk.posterior * 100).toFixed(1), rules_met: r.hits.map(h => h.text), proposed_action: r.action.title };
    const prompt = `Draft a short Finnish-language referral (lähete) from a health-centre GP for the proposed action below. Use ONLY these facts; do not add findings, diagnoses or numbers. Mark it clearly as a DRAFT for the clinician to check. Max 110 words, plain text, start with "LUONNOS –".\n\nFACTS:\n${JSON.stringify(facts)}`;
    try { const res = await sample(prompt, { modelTier: "default", cache: false, onText: ({ text }) => { out.textContent = text; } }); out.textContent = res.text; }
    catch (e) { out.textContent = "Drafting is not available in this view."; }
    btn.disabled = false;
  }

  getSample().then(sample => {
    if (!sample) return;
    document.body.classList.add("live-ai");
    const box = el("div", { class: "panel", id: "analyst" }, `<h3><span>Ask the analyst</span><span class="model-tag">live AI</span></h3>
      <p style="color:var(--text-2);font-size:.88rem;margin:0 0 .6rem">Answers only from the data in this app, with sources. Try: “Why lung cancer?”, “What would we measure in the pilot?”, “Is this legal?”</p>
      <textarea id="aq" rows="3" placeholder="Ask a question about the gap or the proposal"></textarea>
      <div class="btnrow" style="margin-top:.5rem"><button class="btn" id="ask">Ask</button></div>
      <div id="aout" style="margin-top:.8rem;font-size:1rem;line-height:1.55;white-space:pre-wrap"></div>`);
    $("#brief-controls").after(box);
    $("#ask").addEventListener("click", () => { const q = $("#aq").value.trim(); if (q) askAnalyst(q, $("#aout"), $("#ask")); });
  });

  /* ---------------- palette (preview only) ---------------- */
  const pal = $("#palette");
  if (pal) {
    pal.value = document.documentElement.dataset.palette || "a";
    pal.addEventListener("change", () => { document.documentElement.dataset.palette = pal.value; try { localStorage.setItem("ajoissa-palette", pal.value); } catch (e) {} if ($("#view-gap").classList.contains("active")) drawRiver(false); });
  }

  /* ---------------- boot ---------------- */
  const flaggedN = assessed.filter(x => x.r.action.key !== "none").length;
  $("#runstat").innerHTML = `Last overnight run 03:12 · 1,284 contacts · 911 notes · 2,307 lab results read · ${flaggedN} flagged <span class="synthetic-tag">synthetic</span>`;
  renderEvidence(); renderKeynums(); selectCase(assessed[0].c.id); renderCounty(); renderImpact(); renderBrief(); renderSources();
  const start = (location.hash || "#worklist").slice(1);
  show(VIEWS.includes(start) ? start : "worklist");
})();
