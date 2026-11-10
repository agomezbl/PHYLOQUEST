/* =====================================================================
   CAPÍTULO 6 · CONFUCIO — «El espejo de bronce»
   Cada ronda: una situación de la vida diaria. El espejo muestra la cara
   de la otra persona (empatía) y luego se elige qué hacer pasando la
   «prueba de Confucio»: ¿te gustaría que te lo hicieran a ti? (reciprocidad)
   Aprendiz: primero se gira el espejo y luego se adivina el sentimiento.
   Filósofo: se adivina el sentimiento solo con la situación; el espejo
   lo confirma después. Además tiene dos rondas más difíciles.
   ===================================================================== */
const FEM_FACES = ["girl", "girl2"];
function feelLabel(k, kind) { const f = FEELINGS[k]; if (!f) return ""; const arr = f[S.lang] || f.es; return arr[FEM_FACES.includes(kind) ? 1 : 0]; }
function feelIcon(k) { return `<svg viewBox="-90 -100 180 200" aria-hidden="true">${faceSvg("neutral", k === "unknown" ? "unknown" : k)}</svg>`; }

GAMES.confucio = function (ch) {
  AudioSys.setMood("challenge");
  setScene("mirrorPlay", { dim: 1 });
  setFog(0.5);
  const K = ch.mirror;
  const phi = isPhi();
  const rounds = K.rounds.filter(r => !r.pro || phi);
  const results = rounds.map(() => null);
  let i = 0, mistakes = 0, phase = "", finished = false, wrongF = new Set(), wrongA = new Set(), fb = "", hintShown = false, mirrorFront = false, mood = "";
  let feelOrder = [], actOrder = [];
  function startRound() {
    const r = rounds[i];
    phase = phi ? "feel" : "look"; mirrorFront = false; mood = r.show;
    wrongF = new Set(); wrongA = new Set(); fb = ""; hintShown = false;
    feelOrder = shuffle(r.opts); actOrder = shuffle(r.acts.map((_, k) => k));
  }
  return ask(done => {
    const ui = $("#ui");
    function fogPct() { return Math.round(100 * results.filter(x => x === null).length / rounds.length); }
    function mirrorSvg(r) {
      const front = mirrorFront ? faceSvg(r.face, mood, 1.55) : "";
      return `<svg class="mr-svg ${mirrorFront ? "front" : "back"}" viewBox="-200 -200 400 440" aria-hidden="true">
        ${ln("M0 180 L0 222 M-70 226 L70 226", CN.bronzeLo, 12)}
        <g class="mr-disc">${bronzeMirror(180, mirrorFront ? "front" : "back", front)}</g></svg>`;
    }
    function head() {
      return `<div class="ch-head"><div class="ins">${T(phi ? K.introPhi : K.intro)}</div><div class="fogmeter">${U("fogLeft")}<span class="bar"><i style="width:${fogPct()}%"></i></span></div>${pipsHtml(results, finished ? -1 : i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>`;
    }
    function draw() {
      if (finished) {
        ui.innerHTML = `<div class="ch-wrap">${head()}<div class="mr-stage"><div class="mr-mirror"><svg viewBox="-200 -340 400 360" aria-hidden="true">${glow(0, -170, 190, CN.bronzeHi, 0.35)}${fig(confucioLook({ x: 0, y: 0, s: 1.05, fill: P.ink, line: P.clay, front: "out", back: "down" }))}</svg></div>
          <div class="mr-side" style="justify-content:center;align-items:center">${feedbackHtml(true, T(K.win), false)}<button class="btn big gold" data-k="end">${U("cont")} ${ICON.next}</button></div></div></div>`;
        return;
      }
      const r = rounds[i];
      const who = T(r.who);
      let panel = `<div class="mr-sit panel"><div class="kicker">${U("chapter")} ${toRoman(ch.num)} · ${i + 1}/${rounds.length}</div><p>${T(r.sit)}</p></div>`;
      if (phase === "look") {
        panel += `<div class="mr-actions"><button class="btn big gold next-pulse" data-k="turn">${ICON.next} ${T(K.turn)}</button></div>`;
      } else if (phase === "feel") {
        panel += `<p class="mr-q">${T(K.feelQ).replace("{who}", who)}</p>
          <div class="feel-grid">${feelOrder.map((k, n) => `<button class="feel-btn ${wrongF.has(k) ? "bad" : ""}" data-f="${k}" ${wrongF.has(k) ? "disabled" : ""}><span class="n">${n + 1}</span>${feelIcon(k)}<span class="lb">${esc(feelLabel(k, r.face))}</span></button>`).join("")}</div>`;
      } else if (phase === "act" || phase === "solved") {
        panel += `<p class="mr-q">${T(K.actQ)} <span class="chip">${T(K.ruleTest)}</span></p>`;
        if (phase === "act") panel += `<div class="opts">${actOrder.map((k, n) => `<button class="opt ${wrongA.has(k) ? "bad" : ""}" data-a="${k}" ${wrongA.has(k) ? "disabled" : ""}><span class="n">${n + 1}</span><span>${T(r.acts[k].t)}</span></button>`).join("")}</div>`;
        else { const good = r.acts.find(a => a.ok); panel += `<div class="opts"><div class="opt good"><span class="n">✓</span><span>${T(good.t)}</span></div></div>`; }
      }
      const hintBtn = !phi && !hintShown && !fb && (phase === "feel" || phase === "act") ? `<button class="btn ghost small" data-k="hint">${ICON.hint} ${U("hint")}</button>` : "";
      const nextBtn = phase === "solved" ? `<button class="btn big" data-k="next">${U("next")} ${ICON.next}</button>` : "";
      ui.innerHTML = `<div class="ch-wrap">${head()}
        <div class="mr-stage">
          <div class="mr-mirror">${mirrorFront ? `<div class="mr-name">${esc(who)}</div>` : ""}${mirrorSvg(r)}</div>
          <div class="mr-side">${panel}<div id="fb" class="mr-fb">${fb}${hintBtn}${nextBtn}</div></div>
        </div></div>`;
    }
    function sayNow() {
      const r = rounds[i];
      if (finished) return Voice.speak(T(K.win), "noctua");
      if (phase === "look") return Voice.speak(T(r.sit));
      if (phase === "feel") return Voice.speak((phi ? T(r.sit) + " " : "") + T(K.feelQ).replace("{who}", T(r.who)) + " " + feelOrder.map((k, n) => (n + 1) + ": " + feelLabel(k, r.face)).join(". "));
      if (phase === "act") return Voice.speak(T(K.actQ) + " " + actOrder.map((k, n) => (n + 1) + ": " + T(r.acts[k].t)).join(". "));
    }
    function turn() {
      if (phase !== "look") return;
      mirrorFront = true; phase = "feel"; AudioSys.sfx("whoosh"); draw();
      ui.querySelector(".mr-svg")?.classList.add("flip");
      sayNow();
    }
    function chooseFeel(k) {
      const r = rounds[i];
      if (phase !== "feel" || wrongF.has(k)) return;
      if (r.feel.includes(k)) {
        AudioSys.sfx("ok");
        const flipNow = !mirrorFront;
        mirrorFront = true; phase = "act"; hintShown = false;
        fb = feedbackHtml(true, T(K.feelOk), false);
        draw();
        if (flipNow) { AudioSys.sfx("whoosh"); ui.querySelector(".mr-svg")?.classList.add("flip"); }
        Voice.speak(T(K.feelOk) + " " + T(K.actQ) + " " + actOrder.map((kk, n) => (n + 1) + ": " + T(r.acts[kk].t)).join(". "));
      } else {
        wrongF.add(k); mistakes++; if (results[i] === null) results[i] = 0;
        AudioSys.sfx("bad");
        fb = feedbackHtml(false, T(K.feelBad), false);
        draw(); ui.querySelector(".feel-grid")?.classList.add("shake");
        Voice.speak(T(K.feelBad), "noctua");
      }
    }
    function chooseAct(k) {
      const r = rounds[i];
      if (phase !== "act" || wrongA.has(k)) return;
      const a = r.acts[k];
      if (a.ok) {
        phase = "solved"; if (results[i] === null) results[i] = 1;
        mood = "happy";
        AudioSys.sfx("ok"); later(() => AudioSys.sfx("coin"), 300);
        fb = feedbackHtml(true, T(a.r), false);
        setFog(0.5 * fogPct() / 100);
        draw();
        Voice.speak(T(a.r), "noctua");
      } else {
        wrongA.add(k); mistakes++; if (results[i] === null) results[i] = 0;
        AudioSys.sfx("bad");
        fb = feedbackHtml(false, T(a.r), false);
        draw(); ui.querySelector(".opts")?.classList.add("shake");
        Voice.speak(T(a.r), "noctua");
      }
    }
    function next() {
      if (phase !== "solved") return;
      i++;
      if (i >= rounds.length) {
        finished = true; setFog(0); AudioSys.sfx("fogout"); later(() => AudioSys.sfx("fanfare"), 600);
        draw(); Voice.speak(T(K.win), "noctua"); return;
      }
      AudioSys.sfx("page"); startRound(); draw(); sayNow();
    }
    ui.onclick = e => {
      const f = e.target.closest("[data-f]"); if (f) { chooseFeel(f.dataset.f); return; }
      const a = e.target.closest("[data-a]"); if (a) { chooseAct(+a.dataset.a); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      const k = b.dataset.k;
      if (k === "turn") turn();
      if (k === "next") next();
      if (k === "say") sayNow();
      if (k === "hint") { hintShown = true; fb = `<div class="feedback" style="border-color:var(--gold)"><span class="mark" style="color:var(--goldHi)">${U("hint")}</span><p>${T(phase === "act" ? K.ruleTest : K.hint)}</p></div>`; draw(); Voice.speak(T(phase === "act" ? K.ruleTest : K.hint), "noctua"); }
      if (k === "end") { Voice.stop(); done({ stars: starsFromMistakes(mistakes) }); }
    };
    keyH = e => {
      if (finished) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ui.querySelector("[data-k=end]")?.click(); } return; }
      if (phase === "look" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); turn(); return; }
      if (phase === "feel" && /^[1-4]$/.test(e.key)) { const k = feelOrder[+e.key - 1]; if (k) chooseFeel(k); return; }
      if (phase === "act" && /^[1-3]$/.test(e.key)) { const k = actOrder[+e.key - 1]; if (k != null) chooseAct(k); return; }
      if (phase === "solved" && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) { e.preventDefault(); next(); }
    };
    rerender = draw;
    startRound(); draw(); sayNow();
  });
};
