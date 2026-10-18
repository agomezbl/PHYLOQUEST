/* =====================================================================
   CAPÍTULO 3 · PLATÓN — «La caverna»
   Fase 1: detective de sombras (mover la antorcha antes de decidir).
   Fase 2: la salida (ordenar lo que ve el prisionero, República VII).
   ===================================================================== */
const SH = "#0e0805";
function rr(x, y, w, h, r, fill, tr = "") { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${tr ? `transform="${tr}"` : ""}/>`; }
function dragonShape(fill) {
  return ell(0, 0, 120, 46, fill)
    + pth("M80 -20 C120 -60 130 -110 160 -130 L178 -112 C150 -96 140 -50 110 10Z", fill)
    + pth("M150 -140 C170 -160 210 -160 230 -140 L250 -126 L216 -118 C200 -110 176 -108 160 -112Z", fill)
    + pth("M168 -152 L160 -190 L182 -158Z M190 -156 L196 -196 L204 -154Z", fill)
    + pth("M-30 -36 C-60 -150 20 -210 60 -230 C40 -190 60 -170 40 -150 C70 -160 80 -140 60 -120 C90 -120 90 -96 70 -80 C40 -60 10 -50 -30 -36Z", fill)
    + pth("M-110 10 C-170 30 -210 70 -250 60 C-230 76 -200 90 -170 74 C-150 64 -130 40 -100 30Z", fill)
    + pth("M-250 60 L-290 40 L-280 70 L-300 90 L-262 78Z", fill)
    + limb([[-60, 30], [-66, 80]], fill, 18) + limb([[-20, 36], [-16, 84]], fill, 18) + limb([[50, 34], [56, 82]], fill, 18) + limb([[86, 26], [96, 74]], fill, 18);
}
function handPair(t, fill) {
  // t=0: sombra de pájaro (manos cruzadas por los pulgares); t=1: dos manos separadas con sus brazos
  const off = 170 * t, rot = 32 * t, spread = 1 - t;
  const side = (dir) => {
    let h = ell(0, 0, 46, 34, fill);
    for (let k = 0; k < 4; k++) {
      const ang = dir * (58 + k * (14 + 10 * spread));
      h += rr(-13, -4, 26, 120 - k * 8, 13, fill, `rotate(${ang.toFixed(1)} 0 0) translate(0 -${118 - k * 8})`);
    }
    h += rr(-12, -88, 24, 78, 12, fill, `rotate(${(dir * (-14 + 30 * t)).toFixed(1)} 0 -10)`);
    h += `<g opacity="${Math.min(1, t * 1.4).toFixed(2)}">${rr(-30, 16, 60, 320, 22, fill)}</g>`;
    return g(h, `translate(${(500 + dir * (30 + off)).toFixed(1)} 300) rotate(${(dir * rot).toFixed(1)})`);
  };
  const bird = `<g opacity="${Math.max(0, 1 - t * 2.2).toFixed(2)}">${ell(500, 300, 64, 40, fill)}${ell(500, 220, 30, 34, fill)}${pth("M524 206 L572 222 L524 236Z", fill)}${pth("M470 330 L500 380 L530 330Z", fill)}</g>`;
  return g(side(-1) + side(1) + bird, "translate(500 300) scale(1.25) translate(-500 -300)");
}
const SHADOWS = {
  cat(t, f = SH) {
    const s = 2.9 - 2.0 * t;
    return g(catShape(f), `translate(${430 - t * 60} 500) scale(${s})`) + g(amphora(0, 0, 1, f, f), "translate(800 500) scale(1.55)");
  },
  hands(t, f = SH) { return handPair(t, f); },
  scroll(t, f = SH) {
    const th = t * Math.PI / 2, L = 380, r = 74, w = L * Math.cos(th), rx = Math.max(0.1, r * Math.sin(th));
    return `<rect x="${500 - w / 2}" y="${280 - r}" width="${Math.max(0.1, w)}" height="${2 * r}" fill="${f}"/>` + ell(500 - w / 2, 280, rx, r, f) + ell(500 + w / 2, 280, rx, r, f);
  },
  cone(t, f = SH) {
    const th = t * Math.PI / 2, h = 330, r = 112, ax = 500 + h / 2 * Math.cos(th), bx = 500 - h / 2 * Math.cos(th), rx = Math.max(0.1, r * Math.sin(th));
    return pth(`M${bx} ${280 - r} L${ax} 280 L${bx} ${280 + r}Z`, f) + ell(bx, 280, rx, r, f);
  },
  dragon(t, f = SH) {
    const sx = 1 - 0.95 * t;
    return g(dragonShape(f), `translate(520 270) scale(${(sx * 1.25).toFixed(3)} 1.25)`) + `<g opacity="${t.toFixed(2)}">${rr(512, 330, 16, 260, 6, f)}${ell(520, 470, 34, 26, f)}</g>`;
  }
};
const TRUTH = {
  cat: () => g(catShape(P.goldHi), "translate(0 40) scale(1.1)") + ln("M-20 -60 q4 -6 8 0 M2 -60 q4 -6 8 0", P.ink, 2.4) + ln("M-4 -48 l4 3 l4 -3", P.ink, 2),
  hands: () => g(handPair(1, P.slip), "scale(.3) translate(-500 -380)"),
  scroll: () => `<rect x="-90" y="-26" width="180" height="52" fill="${P.slip}"/>` + ell(-90, 0, 18, 26, P.slipDim) + ell(90, 0, 18, 26, P.slip) + ell(90, 0, 8, 12, P.slipDim) + ln("M-70 -12 L60 -12 M-70 0 L50 0 M-70 12 L64 12", P.clayLo, 2),
  cone: () => { const id = uid("cg"); return `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${P.clayLo}"/><stop offset=".5" stop-color="${P.clayHi}"/><stop offset="1" stop-color="${P.clayLo}"/></linearGradient></defs>` + pth("M-70 50 L0 -80 L70 50Z", `url(#${id})`) + ell(0, 50, 70, 16, P.clay); },
  dragon: () => g(dragonShape(P.goldHi), "scale(.38)") + rr(-6, 20, 12, 80, 4, P.ink3) + ell(0, 96, 18, 12, P.slip)
};

GAMES.platon = async function (ch) {
  const m1 = await shadowGame(ch);
  const m2 = await escapeGame(ch);
  return { stars: starsFromMistakes(m1 + Math.floor(m2 / 2)) };
};

function shadowGame(ch) {
  AudioSys.setMood("cave");
  setScene("caveWall");
  const puzzles = ch.cave.puzzles.filter(p => !p.pro || isPhi());
  const results = puzzles.map(() => null);
  let i = 0, t = 0, explored = false, answered = -1, mistakes = 0;
  return ask(done => {
    const ui = $("#ui");
    const fid = uid("blur");
    function shadow() {
      const p = puzzles[i];
      return `<defs><filter id="${fid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.6"/></filter></defs><g filter="url(#${fid})" opacity=".9" class="wallflick">${SHADOWS[p.id](t)}</g>`;
    }
    function draw() {
      const p = puzzles[i];
      const truth = answered >= 0;
      ui.innerHTML = `<div class="cave-ui">
        <div class="ch-head"><div class="ins">${T(ch.cave.intro)}</div>${pipsHtml(results, i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>
        <div class="cave-stage"><svg id="shadowSvg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${shadow()}</svg>
          ${truth ? `<svg viewBox="-160 -150 320 300" style="left:auto;right:0;top:0;width:34%;height:auto;inset:auto 0 auto auto;position:absolute;animation:popIn .4s ease" aria-hidden="true">${glow(0, 0, 160, P.goldHi, 0.5)}<circle r="140" fill="none" stroke="${P.gold}" stroke-width="3" stroke-dasharray="6 8"/>${TRUTH[p.id]()}</svg>` : ""}
        </div>
        <div class="torch-row"><label for="torch">${U("torch")}</label><input id="torch" class="torch" type="range" min="0" max="100" value="${Math.round(t * 100)}" ${truth ? "disabled" : ""}></div>
        ${truth ? `<div style="display:flex;justify-content:center;width:100%">${feedbackHtml(answered === p.ans, T(p.e))}</div>`
          : `<div class="opts" style="grid-template-columns:repeat(3,minmax(0,1fr))">${p.opts.map((o, k) => `<button class="opt" data-o="${k}" ${explored ? "" : "disabled style=\"opacity:.45\""}><span class="n">${k + 1}</span><span>${T(o)}</span></button>`).join("")}</div>`}
      </div>`;
      const r = $("#torch");
      if (r) r.oninput = () => {
        t = +r.value / 100;
        $("#shadowSvg").innerHTML = shadow();
        if (!explored && t > 0.55) { explored = true; AudioSys.sfx("whoosh"); ui.querySelectorAll(".opt").forEach(b => { b.disabled = false; b.style.opacity = ""; }); }
      };
    }
    function answer(k) {
      if (answered >= 0 || !explored) return;
      const p = puzzles[i]; answered = k;
      const ok = k === p.ans; results[i] = ok ? 1 : 0; if (!ok) mistakes++;
      AudioSys.sfx(ok ? "ok" : "bad");
      t = 1; draw();
      Voice.speak((ok ? U("wellDone") : U("notQuite")) + " " + T(p.e), "noctua");
    }
    function next() {
      i++; t = 0; explored = false; answered = -1;
      if (i >= puzzles.length) { Voice.stop(); done(mistakes); return; }
      AudioSys.sfx("page"); draw(); Voice.speak(U("whatIsIt"));
    }
    ui.onclick = e => {
      const o = e.target.closest("[data-o]"); if (o) { answer(+o.dataset.o); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "fbnext") next();
      if (b.dataset.k === "say") Voice.speak(T(ch.cave.intro));
    };
    keyH = e => {
      if (answered < 0 && ["1", "2", "3"].includes(e.key)) answer(+e.key - 1);
      else if (answered >= 0 && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    };
    rerender = draw;
    draw();
    Voice.speak(T(ch.cave.intro), "noctua");
  });
}

function escapeGame(ch) {
  AudioSys.setMood("cave");
  clearScene();
  const steps = ch.cave.steps;
  let order = shuffle(steps.map((_, k) => k));
  let got = 0, mistakes = 0, fb = "", out = false;
  return ask(done => {
    const ui = $("#ui");
    function scene() {
      const lv = got / steps.length;
      const sky = `<rect x="-300" y="-300" width="2200" height="1500" fill="#0b0705"/>`;
      let s = sky;
      s += `<rect x="-300" y="-300" width="2200" height="1500" fill="#f6d98b" opacity="${(lv * 0.95).toFixed(2)}"/>`;
      s += glow(800, 120, 700 * (0.4 + lv), "#fff3c8", 0.3 + lv * 0.5);
      s += pth(`M-300 1200 L-300 ${700 - lv * 80} C300 ${640 - lv * 60} 1300 ${640 - lv * 60} 1900 ${700 - lv * 80} L1900 1200Z`, lv > 0.5 ? "#c87a3c" : "#24160d");
      if (got >= 1 && got < 3) s += g(SHADOWS.cat(1, "#00000066"), "translate(300 300) scale(.5)");
      if (got >= 2) s += pth("M500 790 C640 760 960 760 1100 790 C960 820 640 820 500 790Z", "#7fb0b8", `opacity=".85"`) + g(olive(0, 0, 0.6, P.ink, P.clay), "translate(800 790) scale(1 -0.5)", `opacity=".5"`);
      if (got >= 3) s += olive(320, 700, 1.0, P.ink, P.clay) + olive(1300, 690, 0.9, P.ink, P.clay);
      if (got === 4) s += moon(1300, 170, 40, P.slip, "#3a2a1c") + stars(30, 4, 0, 0, 1600, 300, P.slip);
      if (got >= 5) s += sunDisk(800, 160, 80, "#fff3c8", true);
      return s;
    }
    function draw() {
      ui.innerHTML = `<div class="ecl"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${scene()}</svg></div>
      <div class="cave-ui" style="justify-content:flex-end">
        <div class="ch-head"><div class="ins">${out ? T(ch.cave.outside) : T(ch.cave.escapeIntro)}</div><button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>
        <div style="flex:1"></div>
        ${out ? `<button class="btn big gold" data-k="end">${U("cont")} ${ICON.next}</button>` : `
        <div class="order-grid">${order.map(k => {
          const isDone = k < got;
          return `<button class="opt ${isDone ? "done" : ""}" data-s="${k}">${isDone ? `<span class="n" style="background:var(--ok)">${k + 1}</span>` : ""}<span>${T(steps[k])}</span></button>`;
        }).join("")}</div>
        <div style="min-height:60px;display:flex;justify-content:center;width:100%">${fb}</div>`}
      </div>`;
    }
    function pick(k) {
      if (out) return;
      if (k < got) return;
      if (k === got) {
        got++; fb = ""; AudioSys.sfx("ok");
        if (got === steps.length) { out = true; AudioSys.sfx("fanfare"); draw(); Voice.speak(T(ch.cave.outside), "noctua"); return; }
        draw(); Voice.speak(T(steps[k]));
      } else {
        mistakes++; AudioSys.sfx("bad");
        fb = feedbackHtml(false, T(ch.cave.wrong) + (!isPhi() ? ` → <b>${T(steps[got])}</b>` : ""), false);
        draw(); ui.querySelector(".order-grid")?.classList.add("shake");
        Voice.speak(T(ch.cave.wrong), "noctua");
      }
    }
    ui.onclick = e => {
      const s = e.target.closest("[data-s]"); if (s) { pick(+s.dataset.s); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "say") Voice.speak(out ? T(ch.cave.outside) : T(ch.cave.escapeIntro));
      if (b.dataset.k === "end") { Voice.stop(); done(mistakes); }
    };
    keyH = e => { if (out && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); Voice.stop(); done(mistakes); } };
    rerender = draw;
    draw();
    Voice.speak(T(ch.cave.escapeIntro), "noctua");
  });
}
