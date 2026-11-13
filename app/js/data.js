/* REAL public data used in the app. Each block names its source key.
   County-level primary-care access is filled from THL data (see overnight/research/B_waiting_times.md). */
(function (g) {
  g.AJOISSA_DATA = {
    // Kuitunen et al. 2026 — DLBCL, days from symptom onset (read from keynote slide)
    dlbcl: {
      src: "kuitunen2026",
      steps: ["Symptom onset", "First contact", "Physician visit", "Referral", "Specialist visit", "Treatment start"],
      occupational: [0, 42, 43, 77, 118, 123],
      public: [0, 72, 94, 147, 204, 207]
    },
    // Acta Oncol 2025 — lung cancer 5-yr relative survival (%)
    lungSurvival: {
      src: "actaonc2025_surv",
      rows: [
        { country: "Norway", men: 26.6, women: 33.2 },
        { country: "Finland", men: 16.4, women: 25.5, hl: true }
      ]
    },
    frontDoor: {
      src: "ihe2026",
      ctOrderingFinland: "< 10 %", ctOrderingNordics: "90–100 %",
      gpWaitFinland: 14, gpWaitNordics: "2–7"
    },
    ses: { src: "oecd2025", men: [64, 77], women: [65, 78] },
    denmark: { src: "khalife2025", dk: [8.9, 26.2], fi: [9.7, 16.7] },
    lungSurgery: {
      src: "lungreg2024",
      rows: [
        { area: "Sisä-Suomi", value: 16, approx: true },
        { area: "Länsi-Suomi", value: 10, approx: true, hl: true },
        { area: "Pohjois-Suomi", value: 10, approx: true, hl: true }
      ]
    },
    curativeShare: { value: 27, src: "lungreg2026" },
    stageMissing: { national: 42, best: 60, src: "syopa2024" },
    counties: [] // filled by county-data.js when available
  };
})(typeof window !== "undefined" ? window : globalThis);
