/* =====================================================================
   CAPÍTULO 2 · SÓCRATES — «Duelo en el ágora»
   Elegir la pregunta que pone a prueba una definición (contraejemplo),
   sin atacar a la persona ni darle la razón sin pensar.
   ===================================================================== */
const DUEL_LOOKS = {
  general: { garment: "short", hair: "none", beard: "short", helmet: true, front: "hold", back: "down", props: ["spear"] },
  elder:   { garment: "himation", hair: "bald", beard: "long", front: "staff", back: null, props: ["staff"] },
  sophist: { garment: "robe", hair: "curly", beard: "short", front: "hold", back: "hip", props: ["scroll"] },
  young:   { garment: "himation", hair: "curly", beard: "none", front: "out", back: null, props: [] }
};
function tondo(inner) {
  const id = uid("td");
  return `<defs><clipPath id="${id}"><circle cx="0" cy="-165" r="172"/></clipPath></defs>
    <circle cx="0" cy="-165" r="186" fill="${P.ink}"/><circle cx="0" cy="-165" r="172" fill="${P.clay}"/>
    <g clip-path="url(#${id})">${glow(0, -200, 200, P.clayHi, 0.6)}${inner}<rect x="-200" y="0" width="400" height="40" fill="${P.clayLo}"/></g>
    <circle cx="0" cy="-165" r="179" fill="none" stroke="${P.clay}" stroke-width="2" stroke-dasharray="10 6"/>`;
}
function duelFig(look, flip, extra = "") {
  const L = DUEL_LOOKS[look];
  return tondo(fig(Object.assign({ x: 0, y: 0, s: 0.95, flip, fill: P.ink, line: P.clay }, L)) + extra);
}
function socratesFig(pose = "out", extra = "") {
  return tondo(fig({ x: 0, y: 0, s: 0.95, fill: P.ink, line: P.clay, hair: "bald", beard: "full", nose: "snub", front: pose, back: "down" }) + extra);
}

GAMES.socrates = function (ch) {
  AudioSys.setMood("challenge");
  setScene("agora", { dim: 2 });
  setFog(0.5);
  const rounds = ch.duel.rounds.filter(r => !r.pro || isPhi());
  const results = rounds.map(() => null);
  let i = 0, mistakes = 0, solved = false, finished = false, wrong = new Set(), fb = "", hintShown = false;
  let order = shuffle(["good", "insult", "soft"]);
  return ask(done => {
    const ui = $("#ui");
    function fogPct() { return Math.round(100 * results.filter(x => x !== 1).length / rounds.length); }
    function draw() {
      const r = rounds[i];
      const head = `<div class="ch-head"><div class="ins">${T(ch.duel.intro)}</div><div class="fogmeter">${U("fogLeft")}<span class="bar"><i style="width:${fogPct()}%"></i></span></div>${pipsHtml(results, i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>`;
      if (finished) {
        ui.innerHTML = `<div class="ch-wrap">${head}<div class="duel"><div class="side me"><svg viewBox="-190 -355 380 375" aria-hidden="true">${socratesFig("up", gadfly(70, -290, 1.2))}</svg></div>
          <div class="side"><div class="center" style="display:flex;flex-direction:column;gap:16px;align-items:center;justify-content:center;height:100%">${feedbackHtml(true, T(ch.duel.win), false)}<button class="btn big gold" data-k="end">${U("cont")} ${ICON.next}</button></div></div></div></div>`;
        return;
      }
      const opp = duelFig(r.look, true, solved ? qmark(-60, -250, 1.3, P.ink, "bob") + qmark(-100, -290, 0.8, P.ink, "bob") : "");
      ui.innerHTML = `<div class="ch-wrap">${head}
        <div class="duel">
          <div class="side me">${solved ? `<div class="speech s-left"><span class="who">${T(UI.speakers.socrates)}</span>${T(r.good)}</div>` : ""}<svg viewBox="-190 -355 380 375" aria-hidden="true">${socratesFig(solved ? "point" : "chin", solved ? gadfly(110, -250, 1.1) : "")}</svg></div>
          <div class="side"><div class="speech s-right ${solved ? "react" : ""}"><span class="who">${T(r.who)}</span>${solved ? T(r.react) : T(r.claim)}</div><svg viewBox="-190 -355 380 375" aria-hidden="true">${opp}</svg></div>
        </div>
        ${solved ? `<div style="display:flex;justify-content:center;gap:12px;align-items:center"><span class="chip">${r.src}</span><button class="btn big" data-k="next">${U("next")} ${ICON.next}</button></div>`
          : `<div class="opts">${order.map((k, n) => `<button class="opt ${wrong.has(k) ? "bad" : ""}" data-o="${k}" ${wrong.has(k) ? "disabled" : ""}><span class="n">${n + 1}</span><span>${T(r[k])}</span></button>`).join("")}</div>
             <div id="fb" style="display:flex;justify-content:center;gap:10px;min-height:56px;width:min(1100px,100%);align-items:center">${fb}${!isPhi() && !hintShown && !fb ? `<button class="btn ghost small" data-k="hint">${ICON.hint} ${U("hint")}</button>` : ""}</div>`}
      </div>`;
    }
    function choose(k) {
      if (solved || wrong.has(k)) return;
      const r = rounds[i];
      if (k === "good") {
        solved = true; if (results[i] === null) results[i] = 1;
        AudioSys.sfx("buzz"); later(() => AudioSys.sfx("ok"), 350);
        fb = ""; draw();
        Voice.speak(T(r.good) + " … " + T(r.react));
      } else {
        wrong.add(k); mistakes++;
        AudioSys.sfx("bad");
        fb = feedbackHtml(false, T(k === "insult" ? ch.duel.wrongInsult : ch.duel.wrongSoft), false);
        draw();
        ui.querySelector(".opts")?.classList.add("shake");
        Voice.speak(T(k === "insult" ? ch.duel.wrongInsult : ch.duel.wrongSoft), "noctua");
      }
    }
    function next() {
      if (!solved) return;
      i++; solved = false; wrong = new Set(); fb = ""; hintShown = false; order = shuffle(["good", "insult", "soft"]);
      if (i >= rounds.length) {
        finished = true; i = rounds.length - 1; setFog(0); AudioSys.sfx("fogout"); later(() => AudioSys.sfx("fanfare"), 600);
        draw(); Voice.speak(T(ch.duel.win), "noctua"); return;
      }
      AudioSys.sfx("page"); setFog(0.5 * fogPct() / 100);
      draw(); sayRound();
    }
    function sayRound() { const r = rounds[i]; Voice.speak(T(r.who) + ". " + T(r.claim)); }
    ui.onclick = e => {
      const o = e.target.closest("[data-o]"); if (o) { choose(o.dataset.o); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      const k = b.dataset.k;
      if (k === "next") next();
      if (k === "hint") { hintShown = true; fb = `<div class="feedback" style="border-color:var(--gold)"><span class="mark" style="color:var(--goldHi)">${U("hint")}</span><p>${T(ch.duel.hint)}</p></div>`; draw(); Voice.speak(T(ch.duel.hint), "noctua"); }
      if (k === "say") { finished ? Voice.speak(T(ch.duel.win)) : sayRound(); }
      if (k === "end") { Voice.stop(); done({ stars: starsFromMistakes(mistakes) }); }
    };
    keyH = e => {
      if (finished && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ui.querySelector("[data-k=end]")?.click(); return; }
      if (!solved && ["1", "2", "3"].includes(e.key)) { choose(order[+e.key - 1]); return; }
      if (solved && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) { e.preventDefault(); next(); }
    };
    rerender = draw;
    draw(); sayRound();
  });
};
