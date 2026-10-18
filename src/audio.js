/* =====================================================================
   PHILOQUEST — SONIDO Y NARRADOR
   Música generada (lira + bordón, modo dórico), efectos y voz (TTS).
   ===================================================================== */
const AudioSys = (() => {
  let ctx = null, master, musicBus, sfxBus, timer = null, mood = null, step = 0, last = 0;
  const NOTE = (root, semis) => root * Math.pow(2, semis / 12);
  const MOODS = {
    title:     { root: 146.83, scale: [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17], beat: 0.62, drone: [0, 7], vol: 0.22, density: 0.7 },
    story:     { root: 146.83, scale: [0, 2, 3, 5, 7, 9, 10, 12, 14], beat: 0.7, drone: [0, 7], vol: 0.18, density: 0.55 },
    map:       { root: 164.81, scale: [0, 2, 4, 7, 9, 12, 14, 16], beat: 0.55, drone: [0, 7], vol: 0.2, density: 0.65 },
    challenge: { root: 196.0, scale: [0, 2, 3, 5, 7, 10, 12, 14, 15], beat: 0.4, drone: [0, 7], vol: 0.16, density: 0.6 },
    cave:      { root: 110.0, scale: [0, 1, 3, 5, 7, 8, 10, 12], beat: 0.9, drone: [0, 5], vol: 0.2, density: 0.4 },
    doxa:      { root: 98.0, scale: [0, 1, 6, 7, 11, 12], beat: 1.0, drone: [0, 6], vol: 0.16, density: 0.35 },
    victory:   { root: 196.0, scale: [0, 4, 7, 12, 16, 19, 24], beat: 0.3, drone: [0, 7], vol: 0.2, density: 0.9 }
  };
  function init() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.connect(ctx.destination);
      const rev = ctx.createConvolver(); rev.buffer = impulse(2.6);
      const wet = ctx.createGain(); wet.gain.value = 0.32; rev.connect(wet); wet.connect(master);
      musicBus = ctx.createGain(); sfxBus = ctx.createGain();
      musicBus.connect(master); musicBus.connect(rev); sfxBus.connect(master); sfxBus.connect(rev);
      applyVol();
      if (mood) { const m = mood; mood = null; setMood(m); }
    } catch (e) { ctx = null; }
  }
  function impulse(sec) {
    const r = ctx.sampleRate, len = Math.floor(r * sec), b = ctx.createBuffer(2, len, r);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    return b;
  }
  function applyVol() {
    if (!ctx) return;
    musicBus.gain.setTargetAtTime(S.musicOn ? S.music * 0.9 : 0, ctx.currentTime, 0.2);
    sfxBus.gain.setTargetAtTime(S.sfxOn ? S.sfx : 0, ctx.currentTime, 0.05);
  }
  function pluck(freq, t, vol = 0.22, dur = 1.8, bus = musicBus) {
    const o = ctx.createOscillator(), o2 = ctx.createOscillator(), gn = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.setValueAtTime(Math.min(freq * 7, 9000), t); f.frequency.exponentialRampToValueAtTime(freq * 1.4, t + dur);
    o.type = "triangle"; o.frequency.value = freq; o2.type = "sine"; o2.frequency.value = freq * 2.003;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + 0.006); gn.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    o.connect(f); o2.connect(f); f.connect(gn); gn.connect(bus);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05);
  }
  function pad(freq, t, dur, vol = 0.05) {
    const gn = ctx.createGain(), f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 700;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(vol, t + dur * 0.35); gn.gain.linearRampToValueAtTime(0.0001, t + dur);
    [-6, 5].forEach(det => { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = freq; o.detune.value = det; o.connect(f); o.start(t); o.stop(t + dur + 0.1); });
    f.connect(gn); gn.connect(musicBus);
  }
  function tick() {
    if (!ctx || !mood) return;
    const m = MOODS[mood]; const now = ctx.currentTime;
    if (step % 16 === 0) m.drone.forEach(s => pad(NOTE(m.root / 2, s), now, m.beat * 16.5, mood === "doxa" ? 0.05 : 0.035));
    if (Math.random() < m.density) {
      const dir = Math.random() < 0.5 ? -1 : 1;
      last = Math.max(0, Math.min(m.scale.length - 1, last + dir * (1 + (Math.random() < 0.3 ? 1 : 0))));
      pluck(NOTE(m.root, m.scale[last]), now + 0.02, m.vol, m.beat * 3.2);
      if (step % 8 === 0) pluck(NOTE(m.root / 2, m.scale[0]), now + 0.02, m.vol * 0.7, m.beat * 6);
    }
    step++;
    timer = setTimeout(tick, m.beat * 1000);
  }
  function setMood(m) {
    if (mood === m) return;
    mood = m; clearTimeout(timer);
    if (!ctx) return;
    step = 0; last = 2; timer = setTimeout(tick, 120);
  }
  function noise(t, dur, vol, from, to, type = "bandpass") {
    const len = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = b;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = 1.2; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const gn = ctx.createGain(); gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(vol, t + dur * 0.3); gn.gain.linearRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(gn); gn.connect(sfxBus); src.start(t); src.stop(t + dur);
  }
  function sfx(name) {
    if (!ctx || !S.sfxOn) return;
    const t = ctx.currentTime + 0.01;
    switch (name) {
      case "click": pluck(880, t, 0.08, 0.15, sfxBus); break;
      case "page": noise(t, 0.35, 0.12, 1800, 600); break;
      case "ok": [0, 4, 7, 12].forEach((s, i) => pluck(NOTE(392, s), t + i * 0.07, 0.2, 1.2, sfxBus)); break;
      case "bad": pluck(155.56, t, 0.25, 0.6, sfxBus); pluck(146.83, t + 0.1, 0.22, 0.7, sfxBus); break;
      case "whoosh": noise(t, 0.5, 0.25, 300, 2400); break;
      case "coin": [2093, 2637, 3136].forEach((f, i) => pluck(f, t + i * 0.06, 0.12, 0.9, sfxBus)); break;
      case "key": [0, 7, 12, 16, 19, 24].forEach((s, i) => pluck(NOTE(523.25, s), t + i * 0.09, 0.16, 1.8, sfxBus)); break;
      case "eclipse": noise(t, 3.2, 0.3, 120, 60, "lowpass"); [0, 7, 12].forEach(s => pluck(NOTE(65.41, s), t, 0.2, 4, sfxBus)); break;
      case "doxa": [0, 1, 6].forEach(s => pluck(NOTE(98, s), t, 0.16, 2.2, sfxBus)); noise(t, 1.6, 0.16, 400, 150); break;
      case "fogout": noise(t, 1.8, 0.18, 600, 3000); break;
      case "buzz": { const o = ctx.createOscillator(), gn = ctx.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(190, t); o.frequency.linearRampToValueAtTime(240, t + 0.5); gn.gain.setValueAtTime(0.0001, t); gn.gain.linearRampToValueAtTime(0.05, t + 0.05); gn.gain.linearRampToValueAtTime(0.0001, t + 0.6); o.connect(gn); gn.connect(sfxBus); o.start(t); o.stop(t + 0.62); break; }
      case "fanfare": [0, 4, 7, 12, 7, 12, 16].forEach((s, i) => pluck(NOTE(392, s), t + i * 0.11, 0.18, 1.4, sfxBus)); break;
    }
  }
  return { init, setMood, sfx, applyVol };
})();

const Voice = (() => {
  let voices = [];
  const ok = "speechSynthesis" in window;
  function load() { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  if (ok) { load(); try { speechSynthesis.onvoiceschanged = load; } catch (e) {} }
  function pick() {
    const L = S.lang === "fr" ? "fr" : "es";
    const region = L === "fr" ? "fr-fr" : "es-es";
    const c = voices.filter(v => (v.lang || "").toLowerCase().replace("_", "-").startsWith(L));
    const score = v => {
      const n = (v.name || "").toLowerCase(); let s = 0;
      if ((v.lang || "").toLowerCase().replace("_", "-") === region) s += 3;
      if (/natural|online|neural|premium|enhanced/.test(n)) s += 5;
      if (/google/.test(n)) s += 2;
      return s;
    };
    return c.sort((a, b) => score(b) - score(a))[0] || null;
  }
  function speak(text, who) {
    if (!ok || !S.narr || !text) return;
    try {
      speechSynthesis.cancel();
      const clean = String(text).replace(/<[^>]+>/g, "").replace(/[«»"]/g, "");
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = S.lang === "fr" ? "fr-FR" : "es-ES";
      const v = pick(); if (v) u.voice = v;
      u.rate = 0.96; u.pitch = who === "doxa" ? 0.6 : who === "noctua" ? 1.15 : 1;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stop() { if (ok) try { speechSynthesis.cancel(); } catch (e) {} }
  return { speak, stop };
})();
