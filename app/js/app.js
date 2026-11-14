(function () {
  "use strict";
  const S = window.AJOISSA_SOURCES, D = window.AJOISSA_DATA, CASES = window.AJOISSA_CASES, A = window.Ajoissa;
  const C = window.AJOISSA_COUNTY || null;
  const $ = (q, r = document) => r.querySelector(q);
  const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); e.innerHTML = html; return e; };
  const pct = (x, d = 1) => (x * 100).toFixed(d) + " %";
  const cite = k => S[k] ? `<button class="cite" data-src="${k}">${S[k].short}</button>` : "";

  /* ---------------- tabs ---------------- */
  function show(view) {
    document.querySelectorAll("nav.tabs button").forEach(b => b.setAttribute("aria-selected", String(b.dataset.view === view)));
    document.querySelectorAll("section.view").forEach(s => s.classList.toggle("active", s.id === "view-" + view));
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
    window.scrollTo({ top: 0 });
    if (view === "gap") drawRiver(true);
    if (view === "agent") renderRunbar();
  }
  document.querySelectorAll("nav.tabs button").forEach(b => b.addEventListener("click", () => show(b.dataset.view)));

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
    const lanes = [{ key: "occupational", y: 118, color: "#a9b8c6", label: "Occupational / private care" }, { key: "public", y: 222, color: "#d0435a", label: "Public primary care" }];
    let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="DLBCL: days from symptom onset to treatment. Occupational route 123 days, public route 207 days.">`;
    for (let t = 0; t <= maxD; t += 30) svg += `<line x1="${X(t)}" x2="${X(t)}" y1="40" y2="280" stroke="#2f4559" stroke-width="1"/><text x="${X(t)}" y="298" fill="#7d90a3" font-size="12" text-anchor="middle">${t} d</text>`;
    lanes.forEach(L => {
      const v = d[L.key];
      svg += `<text x="${x0}" y="${L.y - 66}" fill="${L.key === "public" ? "#eef2f5" : "#a9b8c6"}" font-size="14" font-weight="600">${L.label}</text>`;
      svg += `<line class="lane" x1="${X(0)}" x2="${X(v[v.length - 1])}" y1="${L.y}" y2="${L.y}" stroke="${L.color}" stroke-width="${L.key === "public" ? 10 : 6}" stroke-linecap="round" pathLength="1"/>`;
      let lastX = -999, row = 0;
      v.forEach((day, i) => {
        if (i === 0) return;
        const big = i === v.length - 1;
        svg += `<circle cx="${X(day)}" cy="${L.y}" r="${big ? 9 : 6}" fill="#13202e" stroke="${L.color}" stroke-width="3"/>`;
        row = (X(day) - lastX < 120) ? row + 1 : 0; lastX = X(day);
        const dir = L.key === "public" ? 1 : -1;
        const ty = big ? L.y + dir * 46 + (dir > 0 ? 8 : 0) : L.y + dir * 18 + dir * row * 15 + (dir > 0 ? 8 : 0);
        svg += `<text x="${X(day)}" y="${ty}" fill="${big ? "#eef2f5" : "#a9b8c6"}" font-size="11.5" font-weight="${big ? 700 : 400}" text-anchor="${big ? "end" : "middle"}" dx="${big ? 8 : 0}">${d.steps[i]} · ${day}</text>`;
      });
    });
    // gap bracket
    const a = X(d.occupational[5]), b = X(d.public[5]);
    svg += `<rect x="${a}" y="${lanes[0].y + 14}" width="${b - a}" height="${lanes[1].y - lanes[0].y - 28}" fill="rgba(208,67,90,.12)" stroke="#d0435a" stroke-dasharray="4 4"/>`;
    // where the gap grows
    const deltas = d.public.map((p, i) => p - d.occupational[i]);
    svg += `<text x="${x0}" y="335" fill="#7d90a3" font-size="12">Gap by step (days):</text>`;
    deltas.forEach((g, i) => { if (!i || i === 5) return; svg += `<text x="${X(d.public[i])}" y="335" fill="${i < 5 ? "#ff9aaa" : "#7d90a3"}" font-size="13" font-weight="700" text-anchor="middle">+${g}</text>`; });
    svg += `</svg>`;
    $("#river").innerHTML = `<div class="river-head">
        <div><div class="gapnum num">+${D.dlbcl.median.public - D.dlbcl.median.occupational} days<small>median, later to treatment on the public route</small></div></div>
        <div style="max-width:44ch;color:var(--frost);font-size:.95rem">Diffuse large B-cell lymphoma, 7 Finnish hospitals, n = 160: median <b style="color:var(--snow)">${D.dlbcl.median.public} vs ${D.dlbcl.median.occupational} days</b> from symptom to treatment (p = 0.027). The chart shows the paper's cumulative step times: the gap is already <b style="color:var(--snow)">+86 days at the specialist</b>; from there both routes take 3–5 days. The delay is born in primary care. <br>${cite("kuitunen2026")} <span class="real-tag">real</span></div>
      </div>${svg}
      <div class="legend"><span><i style="background:#a9b8c6"></i>Occupational / private</span><span><i style="background:#d0435a"></i>Public primary care</span><span>Cumulative step times, Fig. 1 of the paper. A symptom-to-diagnosis interval over 7 weeks is linked to worse progression-free survival ${cite("tokola2025")}</span></div>`;
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
        <p>Five-year survival, all cancers. Less-educated patients are diagnosed later (stage IV odds +10–15 %), operated on less, and die more often <b>even after adjusting for stage, treatment and region</b>. Occupational care covers 92 % of wage earners — not the retired or unemployed.</p>
        <footer>${cite("oecd2025")} ${cite("zai2025")} ${cite("kela2026")} <span class="real-tag">real</span></footer></article>`;
  }

  /* ================= AGENT ================= */
  let ctSlots = 2;                         // CT slots the county gives the agent this week (it never asks for more)
  let assessed = A.rankWorklist(CASES.map(c => ({ c, r: A.assess(c) })), { ctSlots });
  const rank = r => ({ emergency: 6, lung_urgent: 5, lymphoma_urgent: 5, result_followup: 4, any_urgent: 4, lung_imaging: 3, colorectal_test: 2, safety_net: 1, none: 0 })[r.action.key];
  const levelText = x => x.r.action.key === "emergency" ? "Emergency · today" : x.queued ? "Waiting for a CT slot · chest X-ray and review meanwhile" : x.r.action.level === 0 ? `Already due${x.r.action.overdue ? " · " + x.r.action.overdue + " days overdue" : ""}${x.slot ? " · CT slot" : ""}` : x.r.action.level === 2 ? (x.slot ? "CT slot this week" : "Urgent referral") : x.r.action.level === 1 ? "Simple test" : x.r.action.key === "safety_net" ? "Check-in only" : "";
  const tone = r => rank(r) >= 4 ? "urgent" : rank(r) >= 2 ? "watch" : "calm";
  let current = null;
  const started = {};
  const CANCER = { lung: "Lung", colorectal: "Bowel", prostate: "Prostate", lymphoma: "Lymphoma", several: "Several cancers", other: "Other" };
  let cancerFilter = "all";

  function renderRunbar() {
    const flagged = assessed.filter(x => x.r.action.key !== "none").length;
    const urgent = assessed.filter(x => rank(x.r) >= 4).length;
    const stats = [["contacts read", 1284, ""], ["free-text notes parsed", 911, ""], ["lab results checked", 2307, ""], ["signals for review", flagged, "hot"], ["urgent", urgent, "hot"]];
    $("#runbar").innerHTML = stats.map(([l, v, c]) => `<div class="${c}"><b data-to="${v}">0</b><span>${l}</span></div>`).join("") + `<div><span class="synthetic-tag">synthetic night run · Health centres A–C</span></div>`;
    document.querySelectorAll("#runbar b").forEach(b => { const to = +b.dataset.to; let t0 = null; const step = ts => { t0 = t0 || ts; const k = Math.min(1, (ts - t0) / 1200); b.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString("en-US"); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); });
  }
  function renderQueue() {
    const flagged = assessed.filter(x => x.r.action.key !== "none").length;
    $("#queue").innerHTML = `<div class="qhead"><span>Worklist · ${assessed.length} shown</span><span>${flagged} need a decision</span></div>
      <div class="cfilter" role="group" aria-label="Filter by cancer">${["all", "lung", "colorectal", "prostate", "lymphoma"].map(k => { const n = k === "all" ? assessed.length : assessed.filter(x => x.r.cancer === k).length; return `<button class="chip" data-cf="${k}" aria-pressed="${cancerFilter === k}">${k === "all" ? "All" : CANCER[k]} <b>${n}</b></button>`; }).join("")}</div>
      <label class="slots">CT slots free this week <input type="number" id="ct-slots" min="0" max="9" value="${ctSlots}"><small>Follow-ups already due go first, then the strongest signals. The agent never asks for more slots than this.</small></label>` +
      assessed.filter(x => cancerFilter === "all" || x.r.cancer === cancerFilter).map(x => { const { c, r } = x; return `<button class="qcard" aria-pressed="${current === c.id}" data-case="${c.id}">
        <span class="who">${c.name}, ${c.patient.age}${r.cancer ? ` <span class="ctag">${CANCER[r.cancer]}</span>` : ""}</span><span class="flag ${r.action.key === "none" ? "" : tone(r)}" title="${r.action.key}"></span>
        <span class="what">${c.headline}</span>${levelText(x) ? `<span class="lvl${x.queued ? " wait" : ""}">${levelText(x)}</span>` : ""}</button>`; }).join("") +
      `<button class="qcard" aria-pressed="${current === "custom"}" id="trynote" style="border-style:dashed"><span class="who">Try your own note</span><span class="flag"></span><span class="what">Type a visit note in Finnish or English and watch the agent read it</span></button>` +
      `<p style="font-size:.78rem;color:var(--mute);margin-top:.4rem"><span class="synthetic-tag">synthetic</span> patients — no real records.</p>`;
    document.querySelectorAll(".qcard[data-case]").forEach(b => b.addEventListener("click", () => selectCase(b.dataset.case)));
    document.querySelectorAll(".cfilter .chip").forEach(b => b.addEventListener("click", () => { cancerFilter = b.dataset.cf; renderQueue(); }));
    $("#trynote").addEventListener("click", openEditor);
    $("#ct-slots").addEventListener("change", e => { ctSlots = Math.max(0, +e.target.value || 0); assessed = A.rankWorklist(assessed, { ctSlots }); renderQueue(); if (current && current !== "custom") selectCase(current); });
  }

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
  function findingsPanel(r) {
    const fs = r.extraction.findings;
    if (!fs.length) return "";
    const badge = (txt, cls = "") => `<span class="fbadge ${cls}">${txt}</span>`;
    const via = { rules: "", both: badge("rules + AI agree", "ok"), ai: badge("AI-read · please confirm", "warn"), code: badge("from visit code"), measured: badge("from weight records") };
    return `<div class="panel"><h3>What the agent read</h3><ul class="findings">${fs.map(f => `<li class="${f.negated ? "neg" : ""}"><span class="fl">${f.negated ? "No " + f.label.toLowerCase() : f.label}</span>${f.icpc ? badge("ICPC-2 " + f.icpc) : ""}${f.weeks ? badge(Math.round(f.weeks * 10) / 10 + " wk") : ""}${f.persistent ? badge("persistent") : ""}${f.severity ? badge("severe wording", "warn") : ""}${f.typo ? badge("typo: " + esc(f.typo)) : ""}${f.pattern ? badge("phrase pattern") : ""}${via[f.via] || ""}${f.conflict ? badge(f.conflict, "warn") : ""}</li>`).join("")}</ul>
      ${r.signals && r.signals.length ? `<h3 style="margin-top:.9rem">From the record, not the note</h3><ul class="rules">${r.signals.map(s => `<li><span>${esc(s.text)}</span>${cite(s.src)}</li>`).join("")}</ul>` : ""}
      ${r.rejected && r.rejected.length ? `<p class="scale-note">AI suggestions dropped because the quoted words are not in the note: ${r.rejected.map(x => esc(String(x.concept))).join(", ")}.</p>` : ""}
      <div class="live-only btnrow" style="margin-top:.6rem"><button class="btn ghost" id="ai-read">Second reading by AI (quotes checked)</button></div></div>`;
  }
  const esc = s => s.replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[ch]);

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

  function selectCase(id) {
    current = id;
    const { c, r } = assessed.find(x => x.c.id === id);
    renderQueue();
    const p = c.patient;
    const smoke = p.smoking && p.smoking.ever ? (p.smoking.current ? `smokes ${p.smoking.cigsPerDay}/day, ${p.smoking.years} y` : `ex-smoker (quit ${p.smoking.quitYears} y ago)`) : "never smoked";
    const labs = Object.entries(c.labs || {}).filter(([k]) => k !== "ferritinLow").map(([k, v]) => `${k === "plt" ? "Platelets" : k === "hb" ? "Hb" : k} ${v}`).join(" · ") || "no recent labs";
    $("#note-col").innerHTML = `<div class="panel">
        <h3><span>${c.name}</span> <span class="synthetic-tag">synthetic</span></h3>
        <div class="patient-meta"><span>${p.age} y, ${p.sex === "M" ? "male" : "female"}</span><span>${smoke}</span><span>${labs}</span><span>${c.centre}</span></div>
        <div class="note" id="note-text">${highlight(c.note, r.extraction.mentions)}</div>
        <div class="gloss">${c.noteEn}</div>
        <div class="btnrow" style="margin-top:.7rem"><span style="font-size:.78rem;color:var(--mute)">Underlined = finding the agent used · struck through = explicitly negated in the note</span></div>
        ${(c.weights || c.results || c.codes) ? `<div class="patient-meta" style="margin-top:.6rem">${(c.codes || []).length ? `<span>Visit codes: ${c.codes.map(x => `${x.code} (${x.daysAgo ? x.daysAgo + " d ago" : "today"})`).join(", ")}</span>` : ""}${(c.weights || []).length ? `<span>Weight: ${c.weights.slice().sort((a, b) => b.daysAgo - a.daysAgo).map(w => w.kg + " kg").join(" → ")}</span>` : ""}${(c.results || []).map(x => `<span>${esc(x.test)} ${x.daysAgo} d ago: ${esc(x.finding || (x.value != null ? x.value + (x.type === "fhb" ? " µg/g" : x.type === "psa" ? " µg/l" : "") : ""))}${!x.followedUp && (x.abnormal || x.value != null) ? " — no follow-up recorded" : ""}</span>`).join("")}</div>` : ""}
        ${c.history && c.history.length ? `<ul class="history">${c.history.slice().sort((a, b) => b.daysAgo - a.daysAgo).map(h => `<li><span>${h.daysAgo} days ago</span>${esc(h.text)}</li>`).join("")}<li><span>Today</span>Current visit</li></ul>` : ""}
      </div>`;
    renderReasoning(c, r);
    const ef = earliestFlag(c);
    if (ef) $("#note-col").insertAdjacentHTML("beforeend", `<div class="panel compare"><h3>Could this have been caught earlier?</h3><p style="margin:0;color:var(--frost)">Re-running the same rules on ${c.name.split(" ")[0]}'s earlier visits, with only what was known then: the agent would have put ${c.patient.sex === "M" ? "him" : "her"} on the list <b style="color:var(--aurora)">${ef.daysAgo} days ago</b> — at the visit noted "${esc(c.history.find(h => h.daysAgo === ef.daysAgo).text)}" — with the action: <i>${ef.r.action.title.toLowerCase()}</i>.</p>${compareSvg(ef.daysAgo)}</div>`);
  }

  function capacityLine(c, r) {
    const x = assessed.find(y => y.c.id === c.id) || {};
    const L = r.action.level;
    const txt = r.action.key === "emergency" ? "Emergency: outside the slot limit."
      : L === 0 ? `Capacity level 0 — this follow-up was already due${r.action.overdue ? ` ${r.action.overdue} days ago` : ""}. No new demand is created; the agent makes sure it happens.${x.slot ? " It takes the first free CT slot." : ""}`
      : L === 1 ? "Capacity level 1 — a simple, cheap test. No scarce slot is used."
      : L === 2 && x.queued ? `Capacity level 2 — no CT slot is free this week (${ctSlots} given, all taken by cases ranked higher). The agent proposes a chest X-ray and a review now and keeps this patient first in line for the next slot.`
      : L === 2 && x.slot ? `Capacity level 2 — takes one of the ${ctSlots} CT slot(s) the county gave the agent this week, because this is one of the strongest signals on the list.`
      : L === 2 ? "Capacity level 2 — a specialist slot. Ranked by rule strength; a clinician decides." : "";
    return txt ? `<p class="scale-note cap">${txt}</p>` : "";
  }
  function renderReasoning(c, r) {
    const steps = r.risk.steps;
    const maxV = Math.max(0.12, ...steps.map(s => s.value));
    const scale = v => Math.min(100, v / maxV * 100);
    const wf = steps.map((s, i) => `<div class="wf-label"><span>${s.label}</span><span>${cite(s.src)}</span></div>
      <div class="wf-row"><div class="wf-bar"><div class="wf-fill ${s.value >= A.THRESHOLDS.urgent ? "hot" : ""}" style="width:${scale(s.value)}%"></div><div class="wf-thresh" style="left:${scale(A.THRESHOLDS.urgent)}%"></div></div><b class="num">${s.value >= 0.3 ? "> 30 %" : pct(s.value, s.value < 0.01 ? 2 : 1)}</b></div>`).join("");
    const ignored = r.risk.ignored.length ? `<p class="scale-note">Also present but not multiplied in (to avoid double-counting correlated symptoms): ${r.risk.ignored.map(x => x.label.toLowerCase()).join(", ")}.</p>` : "";
    const rules = r.hits.length ? `<ul class="rules">${r.hits.map(h => `<li class="${h.level === "urgent" ? "urgent" : ""}"><span>${h.text}</span>${cite(h.src)}</li>`).join("")}</ul>` : `<p style="color:var(--frost);margin:0">No referral rule met.</p>`;
    const t = tone(r);
    const isStarted = started[c.id];
    $("#reason-col").innerHTML = `
      <div class="panel"><h3>How the agent decided <span class="model-tag">deterministic</span></h3>
        <ol class="trace">${r.trace.map(s => `<li><b>${s.step}</b><span>${s.text}</span></li>`).join("")}</ol></div>
      ${findingsPanel(r)}
      ${(r.risk.used.length || r.action.key.startsWith("lung")) ? `<div class="panel"><h3>Lung-cancer risk estimate</h3>
        <div class="waterfall">${wf}</div>
        <p class="scale-note">Amber line = 3 % referral threshold ${cite("nice_ng12")}. Estimate uses published UK likelihood ratios; needs recalibration on Finnish data before clinical use.</p>${ignored}</div>` : (r.cancer && r.cancer !== "lung" ? `<div class="panel"><h3>Why there is no risk percentage</h3><p style="margin:0;color:var(--frost);font-size:.9rem">This is a ${(CANCER[r.cancer] || "").toLowerCase()} signal. It is decided by an explicit, published rule (the threshold and the follow-up window are shown below), not by a risk score: no risk model for ${(CANCER[r.cancer] || "").toLowerCase()} cancer has been validated for Finnish primary care, so the agent does not invent one.</p></div>` : `<div class="panel"><h3>Lung-cancer risk estimate</h3><p style="margin:0;color:var(--frost);font-size:.9rem">No lung-cancer symptom in this record — the decision rests on the explicit rules below.</p></div>`)}
      <div class="panel"><h3>Rules met</h3>${rules}</div>
      <div class="action ${t === "urgent" ? "" : t}">
        <h4>${(assessed.find(y => y.c.id === c.id) || {}).queued ? "Chest X-ray and review now — first in line for the next CT slot" : r.action.title}</h4>
        <p>${r.action.why}</p>
        ${capacityLine(c, r)}
        ${r.action.also && r.action.also.length ? `<p class="scale-note">Also on this record: ${r.action.also.map(esc).join("; ")}.</p>` : ""}
        ${r.action.target != null ? `<div class="btnrow"><button class="btn" id="approve" ${isStarted ? "disabled" : ""}>${isStarted ? "Approved — clock running" : "Approve and start the clock"}</button><button class="btn ghost" id="dismiss">Dismiss with reason</button></div>
        <div class="clock" id="clock">${r.action.clock.map((s, i) => `<div class="${isStarted ? (i === 0 ? "now" : "") : ""}">${s}</div>`).join("")}</div>
        <p class="scale-note">Target for the first step: ${r.action.target ? r.action.target + " days" : "today"}. If it passes, the case returns to the top of the list.</p>
        <div class="live-only" style="margin-top:.8rem"><button class="btn ghost" id="draft">Draft the referral (AI, Finnish)</button><div id="draft-out" style="margin-top:.6rem;font-family:var(--serif);font-size:.98rem;white-space:pre-wrap"></div></div>` : ""}
      </div>
`;
    // animate trace
    document.querySelectorAll(".trace li").forEach((li, i) => setTimeout(() => li.classList.add("on"), 120 + i * 260));
    const ap = $("#approve");
    if (ap) ap.addEventListener("click", () => { started[c.id] = true; runClock(); ap.disabled = true; ap.textContent = "Approved — clock running"; });
    const dr = $("#draft");
    if (dr) dr.addEventListener("click", () => draftReferral(c, r, $("#draft-out"), dr));
    const ar = $("#ai-read");
    if (ar) ar.addEventListener("click", () => aiRead(c, ar));
    const dm = $("#dismiss");
    if (dm) dm.addEventListener("click", () => { dm.textContent = "Dismissed — reason logged for audit"; dm.disabled = true; });
  }

  const custom = { id: "custom", name: "Your patient", centre: "Your health centre", synthetic: true, history: [], labs: {},
    patient: { age: 58, sex: "F", smoking: { ever: true, current: false, cigsPerDay: 15, years: 30, quitYears: 5 } },
    note: "58-v nainen. Yskä 5 viikkoa, hengenahdistusta rasituksessa. Ei veriyskää. Ei kuumetta.", noteEn: "", headline: "" };
  function openEditor() {
    current = "custom"; renderQueue();
    const p = custom.patient, sm = p.smoking.ever ? (p.smoking.current ? "current" : "ex") : "never";
    $("#note-col").innerHTML = `<div class="panel"><h3><span>Try your own note</span><span class="synthetic-tag">your input stays in this browser</span></h3>
      <div class="patient-meta" style="gap:.8rem">
        <label>Age <input id="e-age" type="number" min="18" max="100" value="${p.age}" style="width:4.5rem"></label>
        <label>Sex <select id="e-sex"><option value="F" ${p.sex === "F" ? "selected" : ""}>F</option><option value="M" ${p.sex === "M" ? "selected" : ""}>M</option></select></label>
        <label>Smoking <select id="e-smk"><option value="never" ${sm === "never" ? "selected" : ""}>never</option><option value="current" ${sm === "current" ? "selected" : ""}>current</option><option value="ex" ${sm === "ex" ? "selected" : ""}>former</option></select></label>
        <label>/day <input id="e-cig" type="number" min="1" max="80" value="${p.smoking.cigsPerDay || 15}" style="width:4rem"></label>
        <label>years <input id="e-yrs" type="number" min="1" max="70" value="${p.smoking.years || 30}" style="width:4rem"></label>
        <label>Platelets <input id="e-plt" type="number" min="50" max="1500" placeholder="–" value="${custom.labs.plt || ""}" style="width:5rem"></label>
        <label>Earlier visits for this (90 d) <input id="e-rep" type="number" min="0" max="6" value="${custom.history.length}" style="width:3.5rem"></label>
      </div>
      <textarea id="e-note" rows="6" style="width:100%;background:var(--night);color:var(--snow);border:1px solid var(--line);border-radius:6px;padding:.8rem;font-family:var(--serif);font-size:1.05rem;line-height:1.6">${esc(custom.note)}</textarea>
      <div class="note" id="e-hl" style="margin-top:.8rem"></div>
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
      renderReasoning(custom, r);
    };
    $("#note-col").querySelectorAll("input,select,textarea").forEach(x => x.addEventListener("input", sync));
    sync();
  }

  function runClock() {
    const cells = document.querySelectorAll("#clock div");
    cells.forEach((cell, i) => setTimeout(() => { cells.forEach(x => x.classList.remove("now")); for (let j = 0; j < i; j++) cells[j].classList.add("done"); cell.classList.add("now"); }, i * 500));
  }

  function compareSvg(daysEarlier) {
    const W = 520, H = 92, x0 = 20, x1 = 500, span = 90;
    const X = d => x0 + ((span - d) / span) * (x1 - x0);
    return `<svg viewBox="0 0 ${W} ${H}" aria-label="Flag ${daysEarlier} days earlier">
      <line x1="${x0}" x2="${x1}" y1="40" y2="40" stroke="#2f4559" stroke-width="2"/>
      <rect x="${X(daysEarlier)}" y="32" width="${X(0) - X(daysEarlier)}" height="16" fill="rgba(95,211,176,.25)"/>
      <circle cx="${X(daysEarlier)}" cy="40" r="7" fill="#5fd3b0"/><text x="${X(daysEarlier)}" y="22" fill="#5fd3b0" font-size="12" text-anchor="middle">Agent flag</text>
      <circle cx="${X(0)}" cy="40" r="7" fill="#d0435a"/><text x="${X(0)}" y="22" fill="#ff9aaa" font-size="12" text-anchor="middle">Today</text>
      <text x="${(X(daysEarlier) + X(0)) / 2}" y="72" fill="#eef2f5" font-size="13" text-anchor="middle" font-weight="700">${daysEarlier} days recovered</text></svg>`;
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
      <p class="scale-note">Green tick = target used in the demo. National cancer-specific waiting-time targets are being defined in roadmap 3.1.2 (2026–2028). ${cite("roadmap2026")}</p>
      <table class="tbl" style="margin-top:.8rem"><thead><tr><th>Health centre</th>${steps.map(s => `<th class="r">${s.s.split(" → ")[1]}</th>`).join("")}</tr></thead>
      <tbody>${data.map((d, di) => `<tr class="clickable ${d === sel ? "sel" : ""}" data-centre="${di}" tabindex="0"><td>${d.c}</td>${d.v.map((v, i) => `<td class="r num" style="color:${v > steps[i].t ? "#ff9aaa" : "var(--snow)"}">${v}</td>`).join("")}</tr>`).join("")}</tbody></table>
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
  const P = { pop: 420000, coverage: 100, sens: 60, cut: 50, interval: 41, slots: 10 };
  const SL = [
    { k: "pop", label: "County population", min: 60000, max: 1700000, step: 10000, fmt: v => v.toLocaleString("en-US"), note: "Default ≈ North Ostrobothnia (Pohde) size." },
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
    { t: "What we ask", s: `One county, three health centres, six months. Track flags acted on within 7 days, days from flag to imaging, and the share of cancers diagnosed from a tracked route. The clocks also produce the step-by-step waiting data the strategy says is missing.`, c: ["strategy2026", "aino2026"] }
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
      else { const nt = $("#note-text"); if (nt) nt.innerHTML = highlight(c.note, r.extraction.mentions); }
      renderReasoning(c, r);
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
      <p style="color:var(--frost);font-size:.88rem;margin:0 0 .6rem">Answers only from the data in this app, with sources. Try: “Why lung cancer?”, “What would we measure in the pilot?”, “Is this legal?”</p>
      <textarea id="aq" rows="3" style="width:100%;background:var(--night);color:var(--snow);border:1px solid var(--line);border-radius:6px;padding:.6rem;font:inherit" placeholder="Ask a question about the gap or the proposal"></textarea>
      <div class="btnrow" style="margin-top:.5rem"><button class="btn" id="ask">Ask</button></div>
      <div id="aout" style="margin-top:.8rem;font-family:var(--serif);font-size:1.02rem;line-height:1.55;white-space:pre-wrap"></div>`);
    $("#brief-controls").after(box);
    $("#ask").addEventListener("click", () => { const q = $("#aq").value.trim(); if (q) askAnalyst(q, $("#aout"), $("#ask")); });
  });

  /* ---------------- boot ---------------- */
  renderEvidence(); renderQueue(); selectCase(assessed[0].c.id); renderCounty(); renderImpact(); renderBrief(); renderSources();
  const start = (location.hash || "#gap").slice(1);
  show(["gap", "agent", "county", "impact", "brief", "sources"].includes(start) ? start : "gap");
})();
