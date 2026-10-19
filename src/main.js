/* =====================================================================
   PHILOQUEST — MOTOR
   ===================================================================== */
/* ---------------- PARTIDAS (guardado local) ----------------
   Varias partidas por navegador (localStorage) + copia de seguridad en archivo .json.
   Los ajustes (idioma, voz, música) son comunes a todas las partidas. */
const STORE_KEY = "philoquest.v3.store", SET_KEY = "philoquest.v3.settings", OLD_KEY = "philoquest.v3";
const MAX_SLOTS = 4;
const SETTING_FIELDS = ["lang", "narr", "musicOn", "sfxOn", "music", "sfx"];
const SLOT_DEFAULTS = { id: "", name: "", level: "apr", seenPrologue: false, done: {}, resume: null, created: 0, updated: 0 };
const DEFAULTS = Object.assign({ lang: "es", narr: true, musicOn: true, sfxOn: true, music: 0.6, sfx: 0.8 }, SLOT_DEFAULTS);
const clone = o => JSON.parse(JSON.stringify(o));
const pick = (o, keys) => { const r = {}; keys.forEach(k => { if (o && o[k] !== undefined) r[k] = o[k]; }); return r; };
let S = clone(DEFAULTS);
let STORE = { active: null, slots: {} };
let storageOk = true;
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { storageOk = false; return false; } }
function newId() { return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function slotFrom(o, id) {
  const r = Object.assign(clone(SLOT_DEFAULTS), clone(pick(o, Object.keys(SLOT_DEFAULTS))));
  r.id = id; r.done = r.done && typeof r.done === "object" ? r.done : {};
  r.level = r.level === "phi" ? "phi" : "apr"; r.name = String(r.name || "").slice(0, 14);
  r.created = r.created || Date.now(); return r;
}
function loadSave() {
  try { localStorage.setItem("pq.test", "1"); localStorage.removeItem("pq.test"); } catch (e) { storageOk = false; }
  const set = lsGet(SET_KEY) || {};
  STORE = lsGet(STORE_KEY) || { active: null, slots: {} };
  if (!STORE.slots || typeof STORE.slots !== "object") STORE = { active: null, slots: {} };
  const old = lsGet(OLD_KEY);
  if (old && !Object.keys(STORE.slots).length && (old.seenPrologue || Object.keys(old.done || {}).length)) {
    const id = newId(); STORE.slots[id] = slotFrom(old, id); STORE.active = id;
    SETTING_FIELDS.forEach(f => { if (old[f] !== undefined && set[f] === undefined) set[f] = old[f]; });
    lsSet(STORE_KEY, STORE); lsSet(SET_KEY, set);
  }
  S = Object.assign(clone(DEFAULTS), pick(set, SETTING_FIELDS));
  if (STORE.active && STORE.slots[STORE.active]) Object.assign(S, clone(STORE.slots[STORE.active]));
}
function save() {
  lsSet(SET_KEY, pick(S, SETTING_FIELDS));
  if (S.id) { S.updated = Date.now(); STORE.slots[S.id] = slotFrom(S, S.id); STORE.active = S.id; lsSet(STORE_KEY, STORE); }
}
function slotList() { return Object.values(STORE.slots).sort((a, b) => (b.updated || 0) - (a.updated || 0)); }
function loadSlot(id) { const set = pick(S, SETTING_FIELDS); S = Object.assign(clone(DEFAULTS), set, clone(STORE.slots[id])); STORE.active = id; lsSet(STORE_KEY, STORE); }
function newSlot(name, level) { const set = pick(S, SETTING_FIELDS); S = Object.assign(clone(DEFAULTS), set, { id: newId(), name, level, created: Date.now() }); save(); }
function deleteSlot(id) {
  delete STORE.slots[id]; if (STORE.active === id) STORE.active = null; lsSet(STORE_KEY, STORE);
  if (S.id === id) S = Object.assign(clone(DEFAULTS), pick(S, SETTING_FIELDS));
}
function exportSaves() {
  const data = { app: "philoquest", v: 3, exported: new Date().toISOString(), slots: slotList() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `philoquest-copia-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
function importSaves(file, cb) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      const list = d && d.app === "philoquest" ? (Array.isArray(d.slots) ? d.slots : d.slot ? [d.slot] : null) : null;
      if (!list || !list.length) throw new Error("bad");
      let n = 0, full = 0;
      for (const sl of list) {
        const id = sl.id || newId(), cur = STORE.slots[id];
        if (cur) { if ((sl.updated || 0) >= (cur.updated || 0)) { STORE.slots[id] = slotFrom(sl, id); n++; } continue; }
        if (Object.keys(STORE.slots).length >= MAX_SLOTS) { full++; continue; }
        STORE.slots[id] = slotFrom(sl, id); n++;
      }
      lsSet(STORE_KEY, STORE);
      if (S.id && STORE.slots[S.id]) loadSlot(S.id);
      cb(true, n, full);
    } catch (e) { cb(false, 0, 0); }
  };
  r.onerror = () => cb(false, 0, 0);
  r.readAsText(file);
}
function savedFlash() {
  const hud = $("#hud"); if (!hud || hud.hidden) return;
  let f = hud.querySelector(".saved"); if (f) f.remove();
  f = document.createElement("span"); f.className = "saved"; f.textContent = "✓ " + U("saved");
  hud.querySelector(".spacer")?.after(f);
  setTimeout(() => f.remove(), 1800);
}

UI.doxaBtn = { es: "¡Eso habrá que pensarlo!", fr: "Ça se discute !" };
LOOKS.criton = { hair: "cap", beard: "short", nose: "straight" };
LOOKS.laques = { hair: "cap", beard: "short", nose: "straight", helmet: true };

const $ = s => document.querySelector(s);
const T = o => (o == null ? "" : typeof o === "string" ? o : Array.isArray(o) ? o : (o[S.lang] ?? o.es));
const U = k => T(UI[k]);
const isPhi = () => S.level === "phi";
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ICON = {
  speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9h4l5-4v14l-5-4h-4z" fill="currentColor"/><path class="wave" d="M15.5 8.5c1.6 1.6 1.6 5.4 0 7M18 6c3 3 3 9 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="16.5" cy="16" r="2.6" fill="currentColor"/></svg>',
  map: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z M9 4v14 M15 6v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  coins: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 6.5a6 6 0 1 1-8 8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="9" r="2" fill="currentColor"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z M20 4h-5a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="1.5" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  hint: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17h6M10 20h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>',
  save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 19h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 19h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
const starSvg = on => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="${on ? P.goldHi : "#3d2c20"}" stroke="${on ? P.goldLo : "#55402f"}" stroke-width="1"/></svg>`;
const starsHtml = n => [0, 1, 2].map(i => `<span class="s" style="animation-delay:${0.5 + i * 0.25}s">${starSvg(i < n)}</span>`).join("");
function starsFromMistakes(m) { return m <= 1 ? 3 : m <= 3 ? 2 : 1; }

/* ---------------- FLOW CONTROL ---------------- */
class Abort extends Error {}
let pend = null, keyH = null, rerender = null, rafId = 0;
const timers = new Set();
function later(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; }
function ask(setup) {
  return new Promise((res, rej) => {
    pend = rej;
    setup(v => { if (pend === rej) pend = null; res(v); });
  });
}
const sleep = ms => ask(done => later(done, ms));
const cleanups = new Set();
function addCleanup(fn) { cleanups.add(fn); }
function abortFlow() {
  timers.forEach(clearTimeout); timers.clear(); cancelAnimationFrame(rafId);
  cleanups.forEach(fn => { try { fn(); } catch (e) {} }); cleanups.clear();
  keyH = null; rerender = null; Voice.stop();
  if (pend) { const p = pend; pend = null; p(new Abort()); }
}
document.addEventListener("keydown", e => {
  if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
  if (e.key === "Escape" && closeModal()) return;
  if ($(".modal")) return;
  if (keyH) keyH(e);
});

/* ---------------- STAGE ---------------- */
let mode = "title";
function setMode(m) { mode = m; $("#main").classList.toggle("cine", m === "cine"); }
function fitSvg(svg) {
  if (!svg) return;
  const bg = $("#bg"); const r = bg.clientWidth / Math.max(1, bg.clientHeight);
  const crop = mode === "cine" && r >= 1.05;
  svg.setAttribute("viewBox", crop ? "0 100 1600 740" : "0 0 1600 900");
  svg.setAttribute("preserveAspectRatio", r < 1.05 ? "xMidYMid meet" : "xMidYMid slice");
}
function setScene(name, opts = {}) {
  const bg = $("#bg");
  const layer = document.createElement("div");
  layer.className = "scene-layer" + (opts.cam ? " cam-" + opts.cam : "") + (opts.dim ? (opts.dim === 2 ? " dimmer" : " dim") : "");
  layer.innerHTML = sceneSvg(name);
  bg.appendChild(layer);
  fitSvg(layer.querySelector("svg"));
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add("show")));
  const old = [...bg.children].filter(c => c !== layer);
  setTimeout(() => old.forEach(o => o.remove()), 900);
  return layer;
}
function clearScene() { $("#bg").innerHTML = ""; }
function setFog(v) { $("#fog").style.opacity = v; }
window.addEventListener("resize", () => document.querySelectorAll("#bg .scene-svg").forEach(fitSvg));

function toast(html, ms = 2800) {
  const t = document.createElement("div"); t.className = "toast"; t.innerHTML = html;
  $("#main").appendChild(t); setTimeout(() => t.remove(), ms);
}

/* ---------------- HUD ---------------- */
let hudState = { kind: "none" };
function chLabel(ch) { return ch ? `${ch.num ? toRoman(ch.num) + " · " : ""}${T(ch.name)}` : ""; }
function toRoman(n) { return ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] || n; }
function renderHud(kind, ch, step) {
  hudState = { kind, ch, step };
  const hud = $("#hud");
  if (kind === "none") { hud.hidden = true; return; }
  hud.hidden = false;
  let h = `<div class="brand">PHILO<b>QUEST</b></div>`;
  if (kind === "chapter") h += `<div class="chap">${chLabel(ch)}</div>`;
  if (kind === "prologue") h += `<div class="chap">${U("prologue")}</div>`;
  h += `<div class="spacer"></div>`;
  if (kind === "chapter") {
    const names = U("steps");
    h += `<div class="steps">${names.map((n, i) => `<div class="st ${i === step ? "on" : i < step ? "done" : ""}"><i></i><span>${n}</span></div>`).join("")}</div>`;
  }
  h += `<div class="hud-btns">
    ${kind !== "map" ? `<button class="ibtn" data-act="map" title="${U("map")}" aria-label="${U("map")}">${ICON.map}</button>` : ""}
    <button class="ibtn ${S.narr ? "" : "off"}" data-act="narr" title="${U("narrator")}" aria-label="${U("narrator")}">${ICON.speaker}</button>
    <button class="ibtn opt-hide ${S.musicOn ? "" : "off"}" data-act="music" title="${U("music")}" aria-label="${U("music")}">${ICON.music}</button>
    <button class="ibtn txt opt-hide" data-act="lang" aria-label="${U("language")}">${S.lang === "es" ? "ES" : "FR"}</button>
    <button class="ibtn" data-act="settings" title="${U("settings")}" aria-label="${U("settings")}">${ICON.gear}</button></div>`;
  hud.innerHTML = h;
}
document.addEventListener("click", e => {
  const b = e.target.closest("#hud [data-act]"); if (!b) return;
  AudioSys.sfx("click");
  const a = b.dataset.act;
  if (a === "map") goMap();
  else if (a === "narr") { S.narr = !S.narr; if (!S.narr) Voice.stop(); save(); renderHud(hudState.kind, hudState.ch, hudState.step); }
  else if (a === "music") { S.musicOn = !S.musicOn; save(); AudioSys.applyVol(); renderHud(hudState.kind, hudState.ch, hudState.step); }
  else if (a === "lang") setLang(S.lang === "es" ? "fr" : "es");
  else if (a === "settings") openSettings();
});
function setLang(l) {
  S.lang = l; save(); document.documentElement.lang = l;
  renderHud(hudState.kind, hudState.ch, hudState.step);
  if (rerender) rerender();
}

/* ---------------- PORTRAITS / AVATARS ---------------- */
function portrait(id, bg = P.clay) {
  const look = LOOKS[id] || { hair: "cap", beard: "short" };
  return `<svg viewBox="-40 -40 80 80" aria-hidden="true"><rect x="-50" y="-50" width="100" height="100" fill="${bg}"/>${pth("M-34 60 C-34 30 -20 22 0 22 C20 22 34 30 34 60Z", P.ink)}${g(headGroup(look, P.ink, bg), "translate(-3 -6) scale(1.2)")}</svg>`;
}
function avatar(who) {
  if (who === "noctua") return `<svg viewBox="-52 -156 104 104" aria-hidden="true"><rect x="-60" y="-170" width="130" height="130" fill="${P.ink2}"/>${owl(0, 0, 1, {})}</svg>`;
  if (who === "doxa") return `<svg viewBox="-56 -392 112 112" aria-hidden="true"><rect x="-60" y="-400" width="130" height="130" fill="#2a2e32"/>${doxa(0, 0, 1)}</svg>`;
  return portrait(who);
}

/* ---------------- CINEMATIC ---------------- */
function words(text) {
  return String(text).split(/\s+/).map((w, i) => `<span class="w" style="animation-delay:${i * 26}ms">${w}</span>`).join(" ");
}
function cinematic(panels, opts = {}) {
  setMode("cine"); AudioSys.setMood(opts.mood || "story");
  let i = 0, lastScene = null;
  return ask(done => {
    const ui = $("#ui");
    function draw(newScene = true) {
      const p = panels[i];
      if (newScene) { setScene(p.scene, { cam: p.cam }); lastScene = p.scene; }
      const who = p.who;
      ui.innerHTML = `<button class="linkbtn skip" data-k="skip">${U("skip")} »</button>
      <div class="caption"><div class="cap-inner">
        <div class="cap-who ${who ? "" : "none"}">${who ? avatar(who) : ""}</div>
        <div class="cap-text"><div class="cap-name ${who === "doxa" ? "doxa" : ""}">${who ? T(UI.speakers[who]) : ""}</div><p class="cap-line">${words(T(p.text))}</p></div>
        <div class="cap-ctrl"><div class="dots">${panels.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>
          <div class="row" style="display:flex;gap:8px;align-items:center">${i > 0 ? `<button class="ibtn" data-k="back" aria-label="${U("back")}">${ICON.back}</button>` : ""}<button class="ibtn" data-k="replay" aria-label="${U("replay")}">${ICON.speaker}</button><button class="btn next-pulse" data-k="next">${U("next")} ${ICON.next}</button></div></div>
      </div></div>`;
      if (newScene !== "silent") Voice.speak(T(p.text), who);
    }
    function go(d) {
      if (d > 0 && i === panels.length - 1) { Voice.stop(); done(); return; }
      const ni = Math.max(0, i + d); if (ni === i) return;
      i = ni; AudioSys.sfx("page"); draw(true);
    }
    ui.onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      const k = b.dataset.k;
      if (k === "next") go(1); else if (k === "back") go(-1);
      else if (k === "replay") Voice.speak(T(panels[i].text), panels[i].who);
      else if (k === "skip") { Voice.stop(); done(); }
    };
    keyH = e => { if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); go(1); } else if (e.key === "ArrowLeft") go(-1); };
    rerender = () => draw(false);
    draw(true);
  });
}

/* ---------------- DOXA ---------------- */
function doxaPop(text) {
  setMode("play"); AudioSys.setMood("doxa"); AudioSys.sfx("doxa"); setFog(0.9);
  return ask(done => {
    const ui = $("#ui");
    const draw = () => {
      ui.innerHTML = `<div class="doxa-pop"><svg class="dx" viewBox="-170 -420 340 440" aria-hidden="true">${doxa(0, 0, 1)}</svg>
      <div class="bubble"><span class="who">DOXA</span>${T(text)}<div class="acts"><button class="btn" data-k="ok">${U("doxaBtn")}</button></div></div></div>`;
    };
    draw();
    Voice.speak(T(text), "doxa");
    const finish = () => { AudioSys.sfx("whoosh"); setFog(0.25); done(); };
    ui.onclick = e => { if (e.target.closest("[data-k=ok]")) finish(); };
    keyH = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); } };
    rerender = draw;
  });
}

/* ---------------- DILEMMA ---------------- */
function dilemma(ch) {
  setMode("play"); renderHud("chapter", ch, 2); AudioSys.setMood("story");
  setScene(ch.dilemma.scene, { dim: 2 });
  const D = ch.dilemma;
  let choice = -1;
  return ask(done => {
    const ui = $("#ui");
    function draw() {
      if (choice < 0) {
        ui.innerHTML = `<div class="center-wrap"><div class="dl panel meander">
          <div class="kicker">${U("steps")[2]} · ${T(ch.name)}</div>
          <p class="q">${T(D.q)}</p>
          <p class="hintline">${U("dilemmaHint")}</p>
          <div class="dl-opts">${D.opts.map((o, k) => `<button class="dl-opt" data-o="${k}"><span class="l">${"ABC"[k]}</span>${T(o)}</button>`).join("")}</div>
          <div style="display:flex;justify-content:flex-end"><button class="ibtn" data-k="replay" aria-label="${U("replay")}">${ICON.speaker}</button></div></div></div>`;
      } else {
        ui.innerHTML = `<div class="center-wrap"><div class="dl panel meander">
          <div class="kicker">${T(D.revealTitle)}</div>
          <div class="reveal"><div class="portrait">${portrait(ch.id)}</div><div>${D.reveal.map(r => `<p>${T(r)}</p>`).join("")}</div></div>
          <p class="hintline"><span class="chip">${U("yourChoice")} · ${"ABC"[choice]}</span>&nbsp; ${T(D.opts[choice])}</p>
          <p class="hintline">${U("philoAlso")}</p>
          <div style="display:flex;justify-content:flex-end;gap:10px;align-items:center"><button class="ibtn" data-k="replay2" aria-label="${U("replay")}">${ICON.speaker}</button><button class="btn" data-k="next">${U("cont")} ${ICON.next}</button></div></div></div>`;
      }
    }
    const sayQ = () => Voice.speak(T(D.q) + " " + D.opts.map((o, k) => "ABC"[k] + ": " + T(o)).join(". "));
    const sayR = () => Voice.speak(D.reveal.map(T).join(" "), "noctua");
    ui.onclick = e => {
      const o = e.target.closest("[data-o]");
      if (o && choice < 0) { choice = +o.dataset.o; AudioSys.sfx("ok"); o.classList.add("chosen"); later(() => { draw(); sayR(); }, 500); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "replay") sayQ();
      if (b.dataset.k === "replay2") sayR();
      if (b.dataset.k === "next") { Voice.stop(); done(choice); }
    };
    keyH = e => {
      if (choice < 0 && ["1", "2", "3", "a", "b", "c"].includes(e.key.toLowerCase())) { const k = "123".includes(e.key) ? +e.key - 1 : "abc".indexOf(e.key.toLowerCase()); ui.querySelector(`[data-o="${k}"]`)?.click(); }
      else if (choice >= 0 && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); Voice.stop(); done(choice); }
    };
    rerender = draw;
    draw(); sayQ();
  });
}

/* ---------------- REWARD ---------------- */
function reward(ch, stars, choice) {
  setMode("play"); renderHud("chapter", ch, 3); AudioSys.setMood("victory"); clearScene();
  const prev = S.done[ch.id];
  S.done[ch.id] = { stars: Math.max(stars, prev ? prev.stars : 0), choice };
  save();
  let stage = 0;
  return ask(done => {
    const ui = $("#ui");
    function draw(sound) {
      let inner = "";
      if (stage === 0) inner = `<div class="key-drop">${keySvg(ch.keyIcon, 130)}</div><div class="kicker">${U("gotKey")}</div><h2>${T(ch.key)}${S.lang === "fr" ? " !" : "!"}</h2><p class="lead">${T(ch.keyMeaning)}</p><div class="starrow">${starsHtml(stars)}</div>`;
      if (stage === 1) inner = `<div class="coin-flip">${coinSvg(ch, 190)}</div><div class="kicker">${U("newCoin")}</div><h2>${T(ch.name)}</h2><p class="lead">${T(ch.dates)} · ${T(ch.place)}</p><button class="btn ghost small" data-k="card">${U("seeCard")}</button>`;
      if (stage === 2) inner = `<div class="dinner-card"><div class="kicker">${U("dinner")}</div><p>${T(ch.dinnerQ)}</p></div><p class="hintline" style="color:var(--slipDim)">✓ ${U("dinnerSaved")}</p>`;
      const btn = stage < 2 ? `<button class="btn big" data-k="next">${U("cont")} ${ICON.next}</button>` : `<button class="btn big gold" data-k="next">${ICON.map} ${U("toMap")}</button>`;
      ui.innerHTML = `<div class="rw"><div class="rays"></div><div class="rw-box">${inner}<div>${btn}</div></div></div>`;
      if (!sound) return;
      if (stage === 0) { AudioSys.sfx("key"); Voice.speak(U("gotKey") + " " + T(ch.key) + ". " + T(ch.keyMeaning), "noctua"); }
      if (stage === 1) { AudioSys.sfx("coin"); Voice.speak(T(ch.name) + ". " + T(ch.dates)); }
      if (stage === 2) { AudioSys.sfx("page"); Voice.speak(U("dinner") + ". " + T(ch.dinnerQ)); }
    }
    const next = () => { if (stage < 2) { stage++; draw(true); } else { Voice.stop(); done(); } };
    ui.onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "next") next();
      if (b.dataset.k === "card") openCard(ch);
    };
    keyH = e => { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); next(); } };
    rerender = () => draw(false);
    draw(true);
  });
}

/* ---------------- CHAPTER RUNNER ---------------- */
const GAMES = {};
const STAGES = ["intro", "challenge", "post", "dilemma", "reward"];
const STAGE_STEP = { intro: 0, challenge: 1, post: 1, dilemma: 2, reward: 3 };
async function playChapter(ch, fresh = false) {
  abortFlow();
  if (fresh && S.resume && S.resume.ch === ch.id) { S.resume = null; save(); }
  const r = S.resume && S.resume.ch === ch.id ? S.resume : null;
  const from = STAGES.indexOf(r ? r.stage : "intro");
  const at = st => from <= STAGES.indexOf(st);
  let stars = r && r.stars ? r.stars : 1, choice = r && r.choice != null ? r.choice : -1;
  const mark = (stage, flash = true) => { S.resume = { ch: ch.id, stage, stars, choice }; save(); if (flash) savedFlash(); };
  try {
    if (at("intro")) { renderHud("chapter", ch, 0); setFog(0.35); mark("intro", false); await cinematic(ch.intro); }
    if (at("challenge")) {
      mark("challenge", from > 0);
      renderHud("chapter", ch, 1);
      await doxaPop(ch.doxa);
      setMode("play");
      const res = await GAMES[ch.id](ch);
      stars = res.stars; setFog(0); AudioSys.sfx("fogout");
      mark("post");
    }
    if (at("post") && ch.post) { renderHud("chapter", ch, 1); await cinematic(ch.post); }
    if (at("dilemma")) { mark("dilemma", false); choice = await dilemma(ch); mark("reward"); }
    S.resume = null;
    await reward(ch, stars, choice);
    showMap(ch.id);
  } catch (e) {
    if (!(e instanceof Abort)) { console.error(e); showMap(); }
  }
}
function goMap() { closeModal(); abortFlow(); showMap(); }

/* shared helpers for games */
function pipsHtml(results, cur) {
  return `<div class="pips">${results.map((r, i) => `<i class="${r === 1 ? "ok" : r === 0 ? "miss" : i === cur ? "cur" : ""}"></i>`).join("")}</div>`;
}
function feedbackHtml(ok, text, btn = true) {
  return `<div class="feedback ${ok ? "" : "bad"}"><span class="mark">${ok ? "✓ " + U("wellDone") : "✗ " + U("notQuite")}</span><p>${text}</p>${btn ? `<button class="btn small" data-k="fbnext">${U("next")} ${ICON.next}</button>` : ""}</div>`;
}

/* ---------------- TITLE (elegir partida) ---------------- */
function hasProgress() { return Object.keys(STORE.slots).length > 0; }
function fmtDate(t) { try { return new Date(t).toLocaleDateString(S.lang === "fr" ? "fr-FR" : "es-ES", { day: "numeric", month: "short" }); } catch (e) { return ""; } }
function slotCard(sl, confirmDel) {
  const keys = CHAPTERS.filter(c => sl.done && sl.done[c.id]).length;
  const res = sl.resume ? CHAPTERS.find(c => c.id === sl.resume.ch) : null;
  if (confirmDel === sl.id) return `<div class="slot del"><span class="sl-info"><b>${esc(U("delSure").replace("{name}", sl.name || "?"))}</b></span><span class="sl-acts"><button class="btn small" data-delyes="${sl.id}">${U("resetYes")}</button><button class="btn ghost small" data-delno="1">${U("resetNo")}</button></span></div>`;
  return `<div class="slot"><button class="sl-main" data-slot="${sl.id}"><span class="sav">${esc((sl.name || "?").slice(0, 1).toUpperCase())}</span>
    <span class="sl-info"><b>${esc(sl.name || "?")}</b><span>${sl.level === "phi" ? U("lvlPhi") : U("lvlApr")} · ${keys}/${CHAPTERS.length} ${U("keysShort")}${sl.updated ? " · " + fmtDate(sl.updated) : ""}</span>${res ? `<span class="sl-res">${U("resumeTip")}: ${T(res.name)}</span>` : ""}</span></button>
    <button class="sl-del" data-del="${sl.id}" aria-label="${U("delSlot")}" title="${U("delSlot")}">${ICON.close}</button></div>`;
}
function showTitle() {
  abortFlow(); closeModal(); setMode("title"); renderHud("none"); setFog(0);
  AudioSys.setMood("title");
  setScene("title");
  const ui = $("#ui");
  let confirmDel = null;
  const draw = () => {
    const list = slotList();
    ui.innerHTML = `<div class="title-ui">
      <div class="logo-sub">${U("subtitle")}</div>
      <h1 class="logo"><span class="phi">Φ</span>ILO<br>QUEST</h1>
      <p class="tag">${U("tagline")}</p>
      ${list.length ? `<div class="kicker" style="margin-top:4px">${U("slotsTitle")}</div>
        <div class="slots">${list.map(sl => slotCard(sl, confirmDel)).join("")}
        ${list.length < MAX_SLOTS ? `<button class="slot new" data-k="new"><span class="sav">+</span><span class="sl-info"><b>${U("newSlot")}</b></span></button>` : ""}</div>`
        : `<div class="title-actions"><button class="btn big gold" data-k="new">${ICON.play} ${U("start")}</button></div>`}
      <div style="display:flex;gap:10px;margin-top:6px;flex-wrap:wrap;align-items:center">
        <div class="seg" role="group" aria-label="${U("language")}"><button data-lang="es" class="${S.lang === "es" ? "on" : ""}">Español</button><button data-lang="fr" class="${S.lang === "fr" ? "on" : ""}">Français</button></div>
        <button class="btn ghost small" data-k="backup">${ICON.save} ${U("backup")}</button>
      </div>
      ${storageOk ? "" : `<p class="warnline">${U("noStorage")}</p>`}
    </div>`;
  };
  draw(); rerender = draw;
  ui.onclick = e => {
    AudioSys.init();
    const l = e.target.closest("[data-lang]"); if (l) { setLang(l.dataset.lang); AudioSys.sfx("click"); return; }
    const sl = e.target.closest("[data-slot]"); if (sl) { AudioSys.sfx("click"); loadSlot(sl.dataset.slot); S.seenPrologue ? showMap() : prologue(); return; }
    const d = e.target.closest("[data-del]"); if (d) { AudioSys.sfx("click"); confirmDel = d.dataset.del; draw(); return; }
    const dy = e.target.closest("[data-delyes]"); if (dy) { AudioSys.sfx("bad"); deleteSlot(dy.dataset.delyes); confirmDel = null; draw(); return; }
    if (e.target.closest("[data-delno]")) { confirmDel = null; draw(); return; }
    const b = e.target.closest("[data-k]"); if (!b) return;
    AudioSys.sfx("click");
    if (b.dataset.k === "new") onboarding();
    if (b.dataset.k === "backup") openBackup(draw);
  };
  keyH = e => {
    if (e.key !== "Enter") return;
    AudioSys.init();
    const first = slotList()[0];
    if (first) { loadSlot(first.id); S.seenPrologue ? showMap() : prologue(); } else onboarding();
  };
}

function onboarding() {
  abortFlow(); setMode("play");
  setScene("title", { dim: 2 });
  let lvl = "apr";
  const ui = $("#ui");
  const draw = () => {
    ui.innerHTML = `<div class="center-wrap"><div class="onb panel meander">
      <div class="kicker">${U("newSlot")}</div>
      <label><h2 style="margin-bottom:12px">${U("askName")}</h2><input id="nm" type="text" maxlength="14" placeholder="${U("namePh")}" autocomplete="off"></label>
      <div><h3 style="margin-bottom:10px">${U("askLevel")}</h3>
      <div class="lvl-row"><button class="lvl ${lvl === "apr" ? "on" : ""}" data-l="apr"><b>${U("lvlApr")}</b><span>${U("lvlAprSub")}</span></button>
      <button class="lvl ${lvl === "phi" ? "on" : ""}" data-l="phi"><b>${U("lvlPhi")}</b><span>${U("lvlPhiSub")}</span></button></div></div>
      <div style="display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap"><button class="btn ghost" data-k="back">${ICON.back} ${U("back")}</button><button class="btn big gold" data-k="go">${U("go")}</button></div>
    </div></div>`;
  };
  draw(); rerender = () => { const v = $("#nm")?.value; draw(); if (v != null) $("#nm").value = v; };
  setTimeout(() => $("#nm")?.focus(), 50);
  ui.onclick = e => {
    const l = e.target.closest("[data-l]"); if (l) { lvl = l.dataset.l; AudioSys.sfx("click"); const v = $("#nm").value; draw(); $("#nm").value = v; return; }
    const b = e.target.closest("[data-k]"); if (!b) return;
    AudioSys.sfx("click");
    if (b.dataset.k === "back") showTitle();
    if (b.dataset.k === "go") {
      const name = ($("#nm").value || "").trim().slice(0, 14);
      if (!name) { $("#nm").classList.add("shake"); $("#nm").focus(); setTimeout(() => $("#nm")?.classList.remove("shake"), 500); return; }
      newSlot(name, lvl); prologue();
    }
  };
  keyH = e => { if (e.key === "Enter") ui.querySelector("[data-k=go]").click(); };
}

function openBackup(after) {
  const html = () => `<div class="panel meander"><div class="modal-head"><h2>${U("backup")}</h2>${closeBtn}</div>
    <p class="lead" style="margin-bottom:18px">${U("backupSub")}</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <button class="btn gold" data-b="export" ${Object.keys(STORE.slots).length ? "" : "disabled"}>${ICON.save} ${U("exportBtn")}</button>
      <label class="btn ghost" style="cursor:pointer">${ICON.upload} ${U("importBtn")}<input id="impFile" type="file" accept=".json,application/json" hidden></label>
    </div>
    <p class="hintline" style="color:var(--slipDim);margin-top:16px">${U("backupHow")}</p></div>`;
  const m = openModal(html(), e => {
    const b = e.target.closest("[data-b]"); if (!b) return;
    AudioSys.sfx("click");
    if (b.dataset.b === "export") { exportSaves(); toast("✓ " + U("exported")); }
  }, () => { m.innerHTML = html(); bind(); });
  function bind() {
    const f = m.querySelector("#impFile"); if (!f) return;
    f.onchange = () => {
      const file = f.files && f.files[0]; if (!file) return;
      importSaves(file, (ok, n, full) => {
        if (!ok) { AudioSys.sfx("bad"); toast(U("importBad"), 4000); return; }
        AudioSys.sfx("ok");
        toast(U("importOk").replace("{n}", n) + (full ? " · " + U("slotsFull") : ""), 4200);
        closeModal(); if (after) after();
      });
    };
  }
  bind();
}

async function prologue() {
  abortFlow();
  try {
    renderHud("prologue"); setFog(0);
    await cinematic(PROLOGUE, { mood: "title" });
    S.seenPrologue = true; save();
    showMap();
  } catch (e) { if (!(e instanceof Abort)) console.error(e); }
}

/* ---------------- MAP ---------------- */
const MAP_W = 3500, MAP_H = 900;
const NODE_POS = [[300, 560], [610, 405], [920, 560], [1230, 405], [1530, 560], [1860, 420], [2190, 565], [2510, 405], [2830, 560], [3130, 415], [3380, 540]];
function mapSvg() {
  const id = uid("mg");
  let s = `<svg viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
   <stop offset="0" stop-color="#e8a464"/><stop offset=".41" stop-color="#c96a34"/>
   <stop offset=".47" stop-color="#e6d8bb"/><stop offset=".56" stop-color="#e6d8bb"/>
   <stop offset=".6" stop-color="#c47a58"/><stop offset=".66" stop-color="#c47a58"/>
   <stop offset=".7" stop-color="#2f5f70"/><stop offset=".76" stop-color="#2f5f70"/>
   <stop offset=".79" stop-color="#b79a6d"/><stop offset=".9" stop-color="#9b7c52"/>
   <stop offset=".935" stop-color="#5b6166"/><stop offset="1" stop-color="#25282b"/></linearGradient></defs>
   <rect width="${MAP_W}" height="${MAP_H}" fill="url(#${id})"/>`;
  // GRECIA
  s += sunDisk(180, 150, 46, P.goldHi, false);
  s += hill("M-50 700 C150 620 330 610 520 640 C700 660 800 600 1000 610 C1200 620 1400 640 1600 700 L1600 780 L-50 780Z", P.clayLo);
  s += temple(560, 650, 300, 200, P.ink, { cols: 6 });
  s += olive(160, 720, 1.0, P.ink, P.clay) + olive(1080, 700, 0.9, P.ink, P.clay) + cypress(1200, 700, 0.8, P.ink) + cypress(240, 720, 0.7, P.ink);
  s += g(sea(0, "#9b4a22", "#5e2a13", P.ink).replace(/width="2200"/g, 'width="520"').replace(/x="-300"/g, 'x="0"'), "translate(1240 690) scale(.6 .25)");
  s += ship(1380, 700, 0.5, P.ink, P.clay);
  s += column(800, 780, 160, P.ink, P.clay, 26);
  // CHINA
  const cid = uid("ink");
  s += `<defs><linearGradient id="${cid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3236" stop-opacity=".85"/><stop offset="1" stop-color="#2d3236" stop-opacity="0"/></linearGradient></defs>`;
  s += pth("M1640 640 L1730 300 L1790 420 L1860 240 L1950 520 L2010 640Z", `url(#${cid})`) + pth("M1680 700 L1760 470 L1840 560 L1920 420 L2000 700Z", "#2d3236", `opacity=".55"`);
  s += `<rect x="1780" y="640" width="140" height="70" fill="#1d2124"/>` + pth("M1750 640 C1790 630 1810 610 1850 600 C1890 610 1910 630 1950 640 C1930 636 1900 628 1850 622 C1800 628 1770 636 1750 640Z", "#1d2124") + circ(1700, 220, 34, "#b23a2a", `opacity=".8"`);
  // ROMA
  for (let i = 0; i < 6; i++) s += pth(`M${2050 + i * 46} 720 L${2050 + i * 46} 620 A20 20 0 0 1 ${2090 + i * 46} 620 L${2090 + i * 46} 720 L${2096 + i * 46} 720 L${2096 + i * 46} 600 L${2044 + i * 46} 600 L${2044 + i * 46} 720Z`, "#3a1d14");
  s += `<rect x="2040" y="580" width="282" height="20" fill="#3a1d14"/>`;
  for (let i = 0; i < 6; i++) s += pth(`M${2054 + i * 46} 560 A18 18 0 0 1 ${2090 + i * 46} 560 L${2090 + i * 46} 580 L${2054 + i * 46} 580Z`, "#3a1d14");
  // ALEJANDRÍA
  s += pth("M2420 740 L2440 470 L2490 470 L2510 740Z", "#14303b") + `<rect x="2430" y="440" width="70" height="30" fill="#14303b"/>` + pth("M2445 440 L2465 380 L2485 440Z", "#14303b");
  s += glow(2465, 400, 90, P.goldHi, 0.8, "fl") + circ(2465, 400, 12, P.goldHi);
  s += pth("M2560 740 C2560 680 2556 640 2566 600", "none", `stroke="#14303b" stroke-width="10"`) + pth("M2566 600 C2530 590 2510 610 2500 620 M2566 600 C2600 586 2620 600 2630 614 M2566 600 C2556 570 2540 562 2526 560 M2566 600 C2580 570 2600 566 2612 566", "none", `stroke="#14303b" stroke-width="8" stroke-linecap="round"`);
  // EUROPA
  s += pth("M2700 740 L2700 600 L2730 560 L2760 600 L2760 740Z", "#4a3a26") + pth("M2722 560 L2730 470 L2738 560Z", "#4a3a26");
  s += g(`<rect x="-20" y="-120" width="40" height="120" fill="#4a3a26"/>` + pth("M-24 -120 L0 -150 L24 -120Z", "#4a3a26") + `<g class="spin" style="transform-origin:0 -128px">${ln("M-70 -128 L70 -128 M0 -198 L0 -58", "#4a3a26", 6)}</g>`, "translate(2950 740)");
  s += `<rect x="3180" y="600" width="120" height="140" fill="#4a3a26"/>` + pth("M3172 600 L3240 560 L3308 600Z", "#4a3a26") + `<rect x="3200" y="540" width="24" height="60" fill="#4a3a26"/>` + pth("M3196 540 L3212 500 L3228 540Z", "#4a3a26");
  // DOXA
  s += fogLayer(5, 0.6).replace(/cx="([\d.]+)"/g, (m, x) => `cx="${3150 + (+x) / 5}"`);
  s += g(doxa(0, 0, 0.55), "translate(3440 760)", `opacity=".85"`);
  // suelo + camino
  s += `<rect x="0" y="770" width="${MAP_W}" height="130" fill="${P.ink}"/>`;
  s += meanderBand(782, 26, P.ink, P.clayLo).replace(/x="-300"/g, 'x="0"').replace(/width="2200"/g, `width="${MAP_W}"`);
  let d = `M${NODE_POS[0][0]} ${NODE_POS[0][1]}`;
  for (let i = 1; i < NODE_POS.length; i++) { const [x0, y0] = NODE_POS[i - 1], [x1, y1] = NODE_POS[i]; const mx = (x0 + x1) / 2; d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; }
  s += ln(d, P.ink, 8, `opacity=".35"`) + ln(d, P.slip, 3, `stroke-dasharray="2 14" opacity=".9"`);
  const eras = [[700, { es: "Grecia", fr: "Grèce" }], [1830, { es: "China", fr: "Chine" }], [2185, { es: "Roma", fr: "Rome" }], [2530, { es: "Alejandría", fr: "Alexandrie" }], [2960, { es: "Europa", fr: "Europe" }], [3380, { es: "La niebla", fr: "Le brouillard" }]];
  for (const [x, n] of eras) s += txt(x, 90, 34, x > 3200 ? "#c9cdd0" : x > 2400 && x < 2700 ? P.goldHi : P.ink, T(n).toUpperCase(), `font-weight="700" letter-spacing="10" opacity=".75"`);
  return s + "</svg>";
}
function nodeState(i) {
  if (i >= CHAPTERS.length) return "soon";
  const ch = CHAPTERS[i];
  if (S.done[ch.id]) return "done";
  if (!ch.playable) return "soon";
  const prevDone = i === 0 || S.done[CHAPTERS[i - 1].id];
  return prevDone ? "cur" : "lock";
}
function currentIndex() { for (let i = 0; i < CHAPTERS.length; i++) if (nodeState(i) === "cur") return i; return -1; }
function showMap(focusId) {
  abortFlow(); closeModal(); setMode("map"); renderHud("map"); AudioSys.setMood("map"); setFog(0); clearScene();
  const ui = $("#ui");
  const cur = currentIndex();
  const draw = () => {
    const keys = CHAPTERS.map(ch => `<span title="${T(ch.key)}">${keySvg(ch.keyIcon, 26, !S.done[ch.id])}</span>`).join("");
    const nodes = NODE_POS.map(([x, y], i) => {
      const st = nodeState(i), ch = CHAPTERS[i];
      const left = (x / MAP_W * 100).toFixed(3), top = (y / MAP_H * 100).toFixed(3);
      if (!ch) return `<button class="node soon" style="left:${left}%;top:${top}%" data-n="${i}"><div class="coinw"><svg viewBox="-62 -62 124 124" width="96" height="96" aria-hidden="true"><circle r="60" fill="#2a2e32"/><circle r="48" fill="none" stroke="#5b6166" stroke-width="1.4"/>${g(doxa(0, 0, 0.26), "translate(0 50)")}</svg></div><div class="lbl">${T(FINALE.name)}</div><div class="ribbon">${U("soon")}</div></button>`;
      const coin = coinSvg(ch, 96, st === "done" ? "done" : "locked");
      const extra = st === "done" ? `<div class="stars">${[0, 1, 2].map(k => starSvg(k < S.done[ch.id].stars)).join("")}</div>` : st === "soon" ? `<div class="ribbon">${U("soon")}</div>` : st === "lock" ? `<div class="ribbon">${ICON.lock.replace("<svg", '<svg width="10" height="10"')}</div>` : "";
      return `<button class="node ${st}" style="left:${left}%;top:${top}%" data-n="${i}" aria-label="${T(ch.name)}"><div class="coinw">${coin}</div><div class="lbl">${T(ch.name)}</div><div class="yr">${T(ch.year)}</div>${extra}</button>`;
    }).join("");
    const lastDone = CHAPTERS.reduce((k, c, idx) => (S.done[c.id] ? idx : k), 0);
    const oi = cur >= 0 ? cur : lastDone;
    const [ox, oy] = NODE_POS[oi];
    const owlM = `<div class="map-owl" style="left:${(ox / MAP_W * 100 + 2.6).toFixed(2)}%;top:${((oy - 40) / MAP_H * 100).toFixed(2)}%"><svg class="bob" viewBox="-60 -160 120 165" aria-hidden="true">${owl(0, 0, 1)}</svg></div>`;
    const resCh = S.resume ? CHAPTERS.find(c => c.id === S.resume.ch) : null;
    const tip = resCh
      ? `<span>${U("resumeTip")}: <b>${T(resCh.name)}</b> · ${U("steps")[STAGE_STEP[S.resume.stage] || 0]}</span><button class="btn small gold" data-n="${CHAPTERS.indexOf(resCh)}">${ICON.play} ${U("cont")}</button><button class="linkbtn" data-fresh="${CHAPTERS.indexOf(resCh)}">${U("restart")}</button>`
      : cur >= 0
      ? `<span>${U("nextStop")}: <b>${T(CHAPTERS[cur].name)}</b> · ${T(CHAPTERS[cur].year)}</span><button class="btn small gold" data-n="${cur}">${ICON.play} ${U("play")}</button>`
      : `<span>${U("endDemo").replace("{n}", Object.keys(S.done).length).replace("{a}", CHAPTERS.filter(c => !c.playable).map(c => c.num)[0] || "")}</span>`;
    ui.innerHTML = `<div class="map">
      <div class="map-top"><div class="keys-bar"><span class="kicker">${U("keysTitle")}</span>${keys}</div><div style="flex:1"></div>
        <button class="btn ghost small" data-k="coins">${ICON.coins} ${U("collection")}</button><button class="btn ghost small" data-k="nb">${ICON.book} ${U("notebook")}</button></div>
      <div class="map-scroll"><div class="map-inner">${mapSvg()}${nodes}${owlM}</div></div>
      <div class="map-arrows"><button class="ibtn" data-k="left" aria-label="◀">${ICON.back}</button><button class="ibtn" data-k="right" aria-label="▶">${ICON.next}</button></div>
      <div class="map-tip">${tip}</div></div>`;
    const sc = ui.querySelector(".map-scroll"), inner = ui.querySelector(".map-inner");
    const fi = focusId ? Math.max(0, CHAPTERS.findIndex(c => c.id === focusId) + 1) : oi;
    requestAnimationFrame(() => { const x = NODE_POS[Math.min(fi, NODE_POS.length - 1)][0] / MAP_W * inner.clientWidth; sc.scrollLeft = x - sc.clientWidth * 0.4; });
    // arrastrar para desplazar
    let down = null, moved = false;
    sc.onpointerdown = e => { if (e.pointerType !== "mouse") return; down = { x: e.clientX, s: sc.scrollLeft }; moved = false; };
    sc.onpointermove = e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 5) { moved = true; sc.classList.add("drag"); } sc.scrollLeft = down.s - dx; };
    const up = () => { down = null; sc.classList.remove("drag"); };
    sc.onpointerup = up; sc.onpointerleave = up;
    sc.onwheel = e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { sc.scrollLeft += e.deltaY; e.preventDefault(); } };
    sc.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  };
  draw(); rerender = draw;
  ui.onclick = e => {
    const fr = e.target.closest("[data-fresh]"); if (fr) { AudioSys.sfx("click"); playChapter(CHAPTERS[+fr.dataset.fresh], true); return; }
    const n = e.target.closest("[data-n]");
    if (n) {
      AudioSys.init(); AudioSys.sfx("click");
      const i = +n.dataset.n, st = nodeState(i), ch = CHAPTERS[i];
      if (st === "cur" || st === "done") playChapter(ch);
      else if (st === "lock") toast(U("locked"));
      else toast(ch ? `<b>${T(ch.name)}</b> · ${T(ch.key)} — ${U("soon")}` : `<b>${T(FINALE.name)}</b> ${T(FINALE.sub)} — ${U("soon")}`);
      return;
    }
    const b = e.target.closest("[data-k]"); if (!b) return;
    AudioSys.sfx("click");
    const sc = ui.querySelector(".map-scroll");
    if (b.dataset.k === "left") sc.scrollBy({ left: -sc.clientWidth * 0.6, behavior: "smooth" });
    if (b.dataset.k === "right") sc.scrollBy({ left: sc.clientWidth * 0.6, behavior: "smooth" });
    if (b.dataset.k === "coins") openCollection();
    if (b.dataset.k === "nb") openNotebook();
  };
  keyH = e => {
    const sc = ui.querySelector(".map-scroll"); if (!sc) return;
    if (e.key === "ArrowRight") sc.scrollBy({ left: 300, behavior: "smooth" });
    if (e.key === "ArrowLeft") sc.scrollBy({ left: -300, behavior: "smooth" });
    if (e.key === "Enter" && cur >= 0) playChapter(CHAPTERS[cur]);
  };
}

/* ---------------- MODALS ---------------- */
let modalRerender = null;
function openModal(html, onclick, redraw) {
  closeModal();
  const m = document.createElement("div"); m.className = "modal"; m.innerHTML = html;
  m.addEventListener("click", e => {
    if (e.target === m || e.target.closest("[data-close]")) { AudioSys.sfx("click"); closeModal(); return; }
    onclick && onclick(e, m);
  });
  $("#main").appendChild(m);
  modalRerender = redraw || null;
  return m;
}
function closeModal() { const m = $(".modal"); if (m) { m.remove(); modalRerender = null; Voice.stop(); return true; } return false; }
const closeBtn = `<button class="ibtn" data-close aria-label="${"×"}">${ICON.close}</button>`;

function cardHtml(ch) {
  const has = !!S.done[ch.id];
  if (!has || !ch.card) return `<div class="tcard"><div class="side">${coinSvg(ch, 170, "locked")}<h3>${T(ch.name)}</h3></div><div><p class="lead">${U("coinLocked")}</p><p class="hintline" style="color:var(--slipDim)">${T(ch.dates)} · ${T(ch.place)}</p></div></div>`;
  return `<div class="tcard"><div class="side">${coinSvg(ch, 170)}<h3>${T(ch.name)}</h3><span class="chip">${ch.greek}</span><div class="starrow" style="gap:4px">${[0, 1, 2].map(k => starSvg(k < S.done[ch.id].stars)).join("").replace(/<svg/g, '<svg width="22" height="22"')}</div></div>
    <dl><div><dt>${U("when")}</dt><dd>${T(ch.dates)}</dd></div><div><dt>${U("where")}</dt><dd>${T(ch.place)}</dd></div>
    <div><dt>${U("bigQ")}</dt><dd>${T(ch.bigQuestion)}</dd></div>
    <div><dt>${U("quote")}</dt><dd class="q">${T(ch.card.quote)}</dd></div>
    <div><dt>${U("fact")}</dt><dd>${T(ch.card.fact)}</dd></div>
    ${isPhi() ? `<div><dt>${U("factPro")}</dt><dd>${T(ch.card.pro)}</dd></div>` : ""}
    <div><dt>${T(ch.key)}</dt><dd>${T(ch.keyMeaning)}</dd></div></dl></div>`;
}
function openCard(ch) {
  const html = () => `<div class="panel meander"><div class="modal-head"><div class="kicker">${U("collection")}</div><div style="display:flex;gap:8px"><button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button>${closeBtn}</div></div>${cardHtml(ch)}</div>`;
  const m = openModal(html(), (e) => { if (e.target.closest("[data-k=say]") && ch.card) Voice.speak([T(ch.name), T(ch.dates), T(ch.place), T(ch.card.quote), T(ch.card.fact)].join(". ")); }, () => { $(".modal").innerHTML = html(); });
  return m;
}
function openCollection() {
  const html = () => `<div class="panel meander"><div class="modal-head"><h2>${U("collection")}</h2>${closeBtn}</div>
    <div class="coins-grid">${CHAPTERS.map((ch, i) => `<button class="coin-cell" data-c="${i}">${coinSvg(ch, 110, S.done[ch.id] ? "done" : "locked")}<span class="nm">${T(ch.name)}</span><span class="dt">${T(ch.dates)}</span></button>`).join("")}
    <button class="coin-cell" data-c="you">${coinSvg({ id: "you", greek: "", label: S.name || "?" }, 110, "locked")}<span class="nm">${esc(S.name || "?")}</span><span class="dt">${T(FINALE.name)}</span></button></div></div>`;
  openModal(html(), e => {
    const c = e.target.closest("[data-c]"); if (!c) return;
    AudioSys.sfx("click");
    if (c.dataset.c === "you") { toast(`${T(FINALE.name)} ${T(FINALE.sub)} — ${U("soon")}`); return; }
    openCard(CHAPTERS[+c.dataset.c]);
  }, () => { $(".modal").innerHTML = html(); });
}
function openNotebook() {
  const items = CHAPTERS.filter(ch => S.done[ch.id] && ch.dinnerQ);
  const html = () => `<div class="panel meander"><div class="modal-head"><h2>${U("notebook")}</h2>${closeBtn}</div>
    <p class="kicker" style="margin:0 0 6px">${U("dinner")}</p>
    ${items.length ? items.map(ch => {
      const c = S.done[ch.id].choice;
      return `<div class="nb-item"><div>${coinSvg(ch, 60)}</div><div><p class="dq">${T(ch.dinnerQ)}</p>${c != null && c >= 0 ? `<p class="ch">${U("nbChose")} (${T(ch.name)}): <b>${"ABC"[c]}</b> — ${T(ch.dilemma.opts[c])}</p>` : ""}</div></div>`;
    }).join("") : `<p class="lead" style="color:var(--slipDim)">${U("nbEmpty")}</p>`}</div>`;
  openModal(html(), null, () => { $(".modal").innerHTML = html(); });
}
function openSettings() {
  let confirmReset = false;
  const html = () => `<div class="panel meander"><div class="modal-head"><h2>${U("settings")}</h2>${closeBtn}</div>
    <div class="set-row"><div class="l"><b>${U("name")}</b></div><input type="text" id="setName" maxlength="14" value="${esc(S.name)}"></div>
    <div class="set-row"><div class="l"><b>${U("language")}</b></div><div class="seg"><button data-s="lang:es" class="${S.lang === "es" ? "on" : ""}">Español</button><button data-s="lang:fr" class="${S.lang === "fr" ? "on" : ""}">Français</button></div></div>
    <div class="set-row"><div class="l"><b>${U("level")}</b></div><div class="seg"><button data-s="level:apr" class="${S.level === "apr" ? "on" : ""}">${U("lvlApr")}</button><button data-s="level:phi" class="${S.level === "phi" ? "on" : ""}">${U("lvlPhi")}</button></div></div>
    <div class="set-row"><div class="l"><b>${U("narrator")}</b><span>${U("narratorSub")}</span></div><div class="seg"><button data-s="narr:1" class="${S.narr ? "on" : ""}">${U("on")}</button><button data-s="narr:0" class="${!S.narr ? "on" : ""}">${U("off")}</button></div></div>
    <div class="set-row"><div class="l"><b>${U("music")}</b></div><div style="display:flex;gap:10px;align-items:center"><input type="range" id="setMusic" min="0" max="1" step="0.05" value="${S.music}"><div class="seg"><button data-s="musicOn:1" class="${S.musicOn ? "on" : ""}">${U("on")}</button><button data-s="musicOn:0" class="${!S.musicOn ? "on" : ""}">${U("off")}</button></div></div></div>
    <div class="set-row"><div class="l"><b>${U("sfx")}</b></div><div style="display:flex;gap:10px;align-items:center"><input type="range" id="setSfx" min="0" max="1" step="0.05" value="${S.sfx}"><div class="seg"><button data-s="sfxOn:1" class="${S.sfxOn ? "on" : ""}">${U("on")}</button><button data-s="sfxOn:0" class="${!S.sfxOn ? "on" : ""}">${U("off")}</button></div></div></div>
    <div class="set-row"><div class="l"><b>${U("slotsTitle")}</b><span>${esc(S.name || "")}</span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost small" data-s="change">${U("changeSlot")}</button><button class="btn ghost small" data-s="backup">${ICON.save} ${U("backup")}</button></div></div>
    <div class="set-row"><div class="l"><b>${U("reset")}</b>${confirmReset ? `<span>${U("resetSure")}</span>` : ""}</div>${confirmReset ? `<div style="display:flex;gap:8px"><button class="btn small" data-s="resetYes">${U("resetYes")}</button><button class="btn ghost small" data-s="resetNo">${U("resetNo")}</button></div>` : `<button class="btn ghost small" data-s="reset">${U("reset")}</button>`}</div>
  </div>`;
  const m = openModal(html(), (e) => {
    const b = e.target.closest("[data-s]"); if (!b) return;
    AudioSys.init(); AudioSys.sfx("click");
    const [k, v] = b.dataset.s.split(":");
    if (k === "lang") { setLang(v); }
    else if (k === "level") { S.level = v; save(); }
    else if (k === "narr") { S.narr = v === "1"; if (!S.narr) Voice.stop(); save(); }
    else if (k === "musicOn") { S.musicOn = v === "1"; save(); AudioSys.applyVol(); }
    else if (k === "sfxOn") { S.sfxOn = v === "1"; save(); AudioSys.applyVol(); }
    else if (k === "reset") confirmReset = true;
    else if (k === "resetNo") confirmReset = false;
    else if (k === "resetYes") { S.done = {}; S.resume = null; S.seenPrologue = false; save(); closeModal(); showTitle(); return; }
    else if (k === "change") { closeModal(); showTitle(); return; }
    else if (k === "backup") { closeModal(); openBackup(); return; }
    m.innerHTML = html(); bind(); renderHud(hudState.kind, hudState.ch, hudState.step);
  }, () => { m.innerHTML = html(); bind(); });
  function bind() {
    const n = $("#setName"); if (n) n.oninput = () => { S.name = n.value.trim().slice(0, 14); save(); };
    const mu = $("#setMusic"); if (mu) mu.oninput = () => { S.music = +mu.value; save(); AudioSys.applyVol(); };
    const sf = $("#setSfx"); if (sf) sf.oninput = () => { S.sfx = +sf.value; save(); AudioSys.applyVol(); };
  }
  bind();
}
const _setLang = setLang;
setLang = function (l) { _setLang(l); if (modalRerender) modalRerender(); };

/* ---------------- BOOT ---------------- */
function boot() {
  loadSave();
  document.documentElement.lang = S.lang;
  document.addEventListener("pointerdown", () => AudioSys.init(), { once: false });
  showTitle();
}
