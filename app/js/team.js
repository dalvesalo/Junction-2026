/* Team-only page: 2-minute briefing (read aloud, timed) + live analyst. Not part of the demo. */
(function () {
  "use strict";
  const S = window.AJOISSA_SOURCES, D = window.AJOISSA_DATA;
  const $ = q => document.querySelector(q);
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
  const cite = k => S[k] ? `<button class="cite" data-src="${k}">${S[k].short}</button>` : "";
  const drawer = $("#drawer");
  document.addEventListener("click", e => { const b = e.target.closest("[data-src]"); if (!b) return; const s = S[b.dataset.src];
    $("#drawer-body").innerHTML = `<p class="kicker">Source</p><h3>${s.title}</h3><p><b>${s.short}</b> — ${s.where}</p><p><span class="grade ${s.grade}">Evidence: ${s.grade}</span> &nbsp; <span class="grade">Shows: ${s.measure}</span></p>${s.note ? `<p>${s.note}</p>` : ""}${s.url ? `<p><a href="${s.url}" target="_blank" rel="noopener">Open source</a></p>` : ""}`;
    drawer.classList.add("open"); });
  $("#drawer-close").addEventListener("click", () => drawer.classList.remove("open"));

  const BRIEF = [
    { t: "Where the gap is", s: `Lymphoma patients who enter through public primary care wait a median of 127 days from symptom to treatment, versus 76 days through occupational or private care — and the gap opens before they ever see a specialist. The delay is born in primary care.`, c: ["kuitunen2026"] },
    { t: "Why it matters for Goal 3", s: `Finland has the Nordics' lowest lung-cancer survival. The strategy asks for +14 percentage points by 2035, and only 27 % of lung-cancer patients now reach curative treatment.`, c: ["actaonc2025_surv", "strategy2026", "lungreg2026"] },
    { t: "The mechanism", s: `A Finnish GP appointment takes about two weeks, adults are only guaranteed one within three months, and according to a Nordic expert survey few health centres can order a CT directly. Patients come back again and again: service use rises three to four months before a colorectal diagnosis.`, c: ["ihe2026", "careguarantee2025", "hermio2023"] },
    { t: "What we propose", s: `Ajoissa: a safety-net agent that reads the county's own records overnight, puts patients with stalled cancer signals on a named nurse's list with the reason, and runs a clock until they are diagnosed or cleared. A professional decides every action.`, c: ["he159"] },
    { t: "Why we believe it works", s: `In a randomised trial the same pattern — automatic trigger plus human review of abnormal results — cut time to colorectal work-up from 200 to 104 days. And in April 2026 Parliament approved letting counties use their own records to find health problems early.`, c: ["murphy2015", "he159"] },
    { t: "What we ask", s: `Päijät-Häme, where the same list-to-nurse-to-doctor model already runs for kidney disease: three health centres, six months, about 28,000 euros. Track flags acted on within 7 days, days from flag to imaging, and the share of cancers diagnosed from a tracked route. The clocks also produce the step-by-step waiting data the strategy says is missing.`, c: ["strategy2026", "aino2026"] }
  ];
  $("#brief-card").innerHTML = `<p class="kicker">Briefing for: wellbeing services county director · 2 minutes</p>
    <h2>Close the front-door gap in public primary care</h2>
    <ol>${BRIEF.map((b, i) => `<li id="b-${i}"><b>${b.t}.</b> ${b.s} ${b.c.map(cite).join(" ")}</li>`).join("")}</ol>`;
  $("#brief-controls").innerHTML = `<h3>Present it</h3><div class="timer num" id="timer">2:00</div>
    <p style="color:var(--text-2);font-size:.9rem">Reads the briefing aloud and keeps to two minutes. Every sentence comes from the sourced data in the demo.</p>
    <div class="btnrow"><button class="btn" id="speak">Read it aloud</button><button class="btn ghost" id="stop">Stop</button></div>`;
  let tick, speaking = false;
  const mark = i => { document.querySelectorAll(".brief-card li").forEach(li => li.classList.remove("speaking")); const li = $("#b-" + i); if (li) li.classList.add("speaking"); };
  function stopSpeak() { speaking = false; if ("speechSynthesis" in window) speechSynthesis.cancel(); clearInterval(tick); document.querySelectorAll(".brief-card li").forEach(li => li.classList.remove("speaking")); }
  function speak() {
    stopSpeak(); speaking = true; let left = 120; $("#timer").textContent = "2:00";
    tick = setInterval(() => { left--; $("#timer").textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; if (left <= 0) clearInterval(tick); }, 1000);
    if (!("speechSynthesis" in window)) { BRIEF.forEach((_, i) => setTimeout(() => speaking && mark(i), i * 18000)); return; }
    const v = speechSynthesis.getVoices().find(x => /en-GB|en-US/.test(x.lang));
    BRIEF.forEach((b, i) => { const u = new SpeechSynthesisUtterance(`${b.t}. ${b.s}`); if (v) u.voice = v; u.rate = 1.02; u.onstart = () => mark(i); u.onend = () => { if (i === BRIEF.length - 1) stopSpeak(); }; speechSynthesis.speak(u); });
  }
  $("#speak").addEventListener("click", speak); $("#stop").addEventListener("click", stopSpeak);

  // Live analyst (only where the host provides AI)
  const GUARD = "Rules: use ONLY the facts and numbers in the DATA block. Never invent a number, study or name. After each factual sentence put the source key in square brackets, e.g. [murphy2015]. If the data does not answer the question, say so plainly. Plain language for a non-technical decision-maker. No markdown headings.";
  const dataBlock = () => JSON.stringify({ sources: Object.fromEntries(Object.entries(S).map(([k, v]) => [k, `${v.short}: ${v.title}. ${v.note || ""} (evidence ${v.grade}; shows ${v.measure})`])), dlbcl: D.dlbcl, briefing: BRIEF.map(b => b.t + ": " + b.s) });
  const getSample = () => (window.claude && window.claude.use) ? window.claude.use("sample").catch(() => null) : Promise.resolve(null);
  getSample().then(sample => {
    if (!sample) return;
    const box = $("#analyst"); box.hidden = false;
    box.innerHTML = `<h3><span>Ask the analyst</span><span class="model-tag">live AI</span></h3>
      <p style="color:var(--text-2);font-size:.88rem;margin:0 0 .6rem">Answers only from the sourced data, with sources. Try: “Why lung cancer?”, “Why Päijät-Häme?”, “Is this legal?”</p>
      <textarea id="aq" rows="3" placeholder="Ask a question"></textarea><div class="btnrow" style="margin-top:.5rem"><button class="btn" id="ask">Ask</button></div>
      <div id="aout" style="margin-top:.8rem;line-height:1.55;white-space:pre-wrap"></div>`;
    $("#ask").addEventListener("click", async () => {
      const q = $("#aq").value.trim(); if (!q) return; const out = $("#aout"), btn = $("#ask");
      btn.disabled = true; out.textContent = "Thinking…";
      try {
        const r = await sample(`You are the Ajoissa analyst for a Finnish wellbeing services county. ${GUARD}\n\nDATA:\n${dataBlock()}\n\nQUESTION: ${q}\n\nAnswer in at most 120 words.`, { modelTier: "default", cache: false, onText: ({ text }) => { out.textContent = text; } });
        out.innerHTML = esc(r.text).replace(/\[([a-z0-9_]+)\]/gi, (m, k) => S[k] ? cite(k) : m);
      } catch (e) { out.textContent = "The live analyst is not available right now."; }
      btn.disabled = false;
    });
  });
})();
