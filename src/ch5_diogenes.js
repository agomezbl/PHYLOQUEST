/* =====================================================================
   CAPÍTULO 5 · DIÓGENES — «La mochila de Diógenes» (arcade)
   Atrapa lo que necesitas, deja caer los caprichos: cuanto más pesa
   el zurrón, más lento te mueves (y menos libre eres).
   ===================================================================== */
GAMES.diogenes = async function (ch) {
  const m = await packGame(ch);
  return { stars: starsFromMistakes(m) };
};

function packGame(ch) {
  AudioSys.setMood("challenge");
  clearScene();
  const K = ch.pack;
  const phi = isPhi();
  const needs = K.items.filter(it => it.need);
  const wants = K.items.filter(it => !it.need && (!it.pro || phi));
  let queue = shuffle(needs.concat(wants, phi ? shuffle(needs).slice(0, 2) : []));
  // que no empiece con dos caprichos seguidos
  if (!queue[0].need) { const k = queue.findIndex(q => q.need); [queue[0], queue[k]] = [queue[k], queue[0]]; }
  const FALL = phi ? 250 : 175, GAP = phi ? 1.15 : 1.55, BASE = phi ? 820 : 720;
  const CATCH_Y = 676, GROUND = 880;
  let px = 800, target = null, weight = 0, mistakes = 0, spawned = 0, timeToSpawn = 0.6, last = 0;
  let falling = [], caught = [], floats = [], started = false, finished = false;
  const keys = { l: false, r: false };
  return ask(done => {
    const ui = $("#ui");
    function playerSvg() {
      const sw = 1 + weight * 0.22;
      return fig({ x: 0, y: 0, s: 0.9, front: "hold", hair: "wild", beard: "long", back: "down" })
        + g(pth("M-58 0 C-70 70 50 78 58 0 C40 -10 -40 -10 -58 0Z", P.clayLo) + ell(0, 0, 58, 14, P.ink) + ell(0, 0, 50, 10, "#0b0604")
          + ln("M-40 34 Q0 46 40 34", P.ink, 1.4) + (weight ? g(Array.from({ length: Math.min(weight, 6) }, (_, k) => circ(-30 + k * 12, -10 - (k % 2) * 8, 9, P.gold)).join(""), "") : ""),
          `translate(64 -178) scale(${sw})`);
    }
    function itemSvg(it) {
      return g(circ(0, 0, 50, P.ink, `opacity=".88"`) + `<circle r="50" fill="none" stroke="${P.clay}" stroke-width="3"/>` + g(itemIcon(it.id), "scale(1.05)")
        + `<text y="80" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="28" fill="${P.slip}" stroke="${P.ink}" stroke-width="6" paint-order="stroke">${esc(T(it.n))}</text>`, `translate(${it.x.toFixed(1)} ${it.y.toFixed(1)})`);
    }
    function freedom() { return Math.max(0, 100 - weight * 20); }
    function hud() {
      return `<div class="ch-head"><div class="ins">${T(K.intro)}</div>
        <div class="fogmeter" style="color:var(--goldHi)">${T(K.freedom)}<span class="bar"><i style="width:${freedom()}%;background:linear-gradient(90deg,var(--gold),var(--goldHi))"></i></span></div>
        <button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>`;
    }
    function frame() {
      return `<svg id="arena" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" style="touch-action:none">
        ${SCENES.backpackField()}
        <g id="items">${falling.map(itemSvg).join("")}</g>
        <g id="player" transform="translate(${px.toFixed(1)} ${GROUND - 20})">${playerSvg()}</g>
        <g id="floats">${floats.map(f => `<text x="${f.x}" y="${f.y}" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="${f.ok ? "#bfe39a" : "#ffb39a"}" stroke="${P.ink}" stroke-width="6" paint-order="stroke" opacity="${Math.min(1, f.life).toFixed(2)}">${esc(f.t)}</text>`).join("")}</g>
      </svg>`;
    }
    function draw() {
      if (finished) return drawEnd();
      ui.innerHTML = `<div class="ecl">${frame()}</div>
        <div class="ch-wrap" style="position:absolute;inset:0 0 auto 0;overflow:visible;pointer-events:none"><div style="pointer-events:auto;width:min(1100px,100%)">${hud()}</div></div>
        ${started ? "" : `<div class="center-wrap" style="background:rgba(12,8,6,.55)"><div class="panel meander" style="width:min(600px,100%);text-align:center;display:flex;flex-direction:column;gap:16px;align-items:center">
            <div class="pk-demo"><div class="pk"><svg viewBox="-42 -42 84 84" aria-hidden="true">${itemIcon("agua")}</svg><span>${T(K.items[0].n)}</span><b class="okc">✓ ${T(K.catchIt)}</b></div>
              <div class="pk bad"><svg viewBox="-42 -42 84 84" aria-hidden="true">${itemIcon("corona")}</svg><span>${T(K.items[6].n)}</span><b class="badc">✗ ${T(K.dropIt)}</b></div></div>
            <p class="lead">${T(K.intro)}</p><span class="chip">${T(K.controls)}</span>
            <button class="btn big gold" data-k="start">${ICON.play} ${T(K.startBtn)}</button></div></div>`}`;
      bindPointer();
    }
    function drawEnd() {
      ui.innerHTML = `<div class="ecl">${frame()}</div>
        <div class="center-wrap" style="background:rgba(12,8,6,.6)"><div class="panel meander" style="width:min(720px,100%);display:flex;flex-direction:column;gap:16px">
          <div class="kicker">${T(K.got)}</div>
          <div class="packrow">${caught.length ? caught.map(it => `<div class="pk ${it.need ? "" : "bad"}"><svg viewBox="-42 -42 84 84" aria-hidden="true">${itemIcon(it.id)}</svg><span>${esc(T(it.n))}</span></div>`).join("") : "—"}</div>
          <div class="fogmeter" style="color:var(--goldHi)">${T(K.freedom)} ${freedom()}%<span class="bar" style="width:220px"><i style="width:${freedom()}%;background:linear-gradient(90deg,var(--gold),var(--goldHi))"></i></span></div>
          ${feedbackHtml(mistakes <= 2, T(K.end), false)}
          <div style="display:flex;justify-content:flex-end"><button class="btn big gold" data-k="end">${U("cont")} ${ICON.next}</button></div>
        </div></div>`;
    }
    function paint() {
      const it = $("#items"), pl = $("#player"), fl = $("#floats");
      if (!it) return;
      it.innerHTML = falling.map(itemSvg).join("");
      pl.setAttribute("transform", `translate(${px.toFixed(1)} ${GROUND - 20})`);
      pl.innerHTML = playerSvg();
      fl.innerHTML = floats.map(f => `<text x="${f.x}" y="${f.y.toFixed(0)}" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="34" fill="${f.ok ? "#bfe39a" : "#ffb39a"}" stroke="${P.ink}" stroke-width="6" paint-order="stroke" opacity="${Math.min(1, f.life).toFixed(2)}">${esc(f.t)}</text>`).join("");
      const bar = ui.querySelector(".fogmeter .bar i"); if (bar) bar.style.width = freedom() + "%";
    }
    function float(t, x, ok) { floats.push({ t, x, y: CATCH_Y - 60, ok, life: 1.6 }); }
    function visRange() {
      const sv = $("#arena"); if (!sv) return [0, 1600];
      const r = sv.getBoundingClientRect(); if (!r.width) return [0, 1600];
      const sc = Math.max(r.width / 1600, r.height / 900), w = Math.min(1600, r.width / sc);
      return [800 - w / 2, 800 + w / 2];
    }
    function loop(now) {
      if (!last) last = now;
      const [vx0, vx1] = visRange();
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const speed = BASE * Math.max(0.35, 1 - 0.17 * weight);
      if (keys.l) px -= speed * dt; if (keys.r) px += speed * dt;
      if (target !== null && !keys.l && !keys.r) { const d = target - px; px += Math.sign(d) * Math.min(Math.abs(d), speed * dt); }
      px = Math.max(vx0 + 60, Math.min(vx1 - 130, px));
      timeToSpawn -= dt;
      if (timeToSpawn <= 0 && spawned < queue.length) {
        const it = Object.assign({}, queue[spawned++]); const mg = Math.min(170, (vx1 - vx0) * 0.24); it.x = vx0 + mg + Math.random() * Math.max(10, vx1 - vx0 - 2 * mg); it.y = -70; falling.push(it); timeToSpawn = GAP;
      }
      const mouthX = px + 58;
      falling = falling.filter(it => {
        it.y += FALL * dt;
        if (it.y >= CATCH_Y - 30 && it.y <= CATCH_Y + 30 && Math.abs(it.x - mouthX) < 80) {
          caught.push(it);
          if (it.need) { AudioSys.sfx("coin"); float("+ " + T(it.n), mouthX, true); }
          else { weight++; mistakes++; AudioSys.sfx("bad"); float(T(K.heavy), mouthX, false); }
          return false;
        }
        if (it.y > GROUND + 60) { if (it.need) { mistakes++; AudioSys.sfx("bad"); float(T(K.lost), Math.max(vx0 + 200, Math.min(vx1 - 200, it.x)), false); } return false; }
        return true;
      });
      floats.forEach(f => { f.y -= 50 * dt; f.life -= dt; }); floats = floats.filter(f => f.life > 0);
      paint();
      if (spawned >= queue.length && !falling.length) { later(() => { finished = true; AudioSys.sfx("fanfare"); draw(); Voice.speak(T(K.end), "noctua"); }, 700); return; }
      rafId = requestAnimationFrame(loop);
    }
    function bindPointer() {
      const sv = $("#arena"); if (!sv) return;
      const toX = e => { const r = sv.getBoundingClientRect(); const sc = Math.max(r.width / 1600, r.height / 900); const ox = (r.width - 1600 * sc) / 2; return (e.clientX - r.left - ox) / sc - 58; };
      sv.onpointerdown = e => { target = toX(e); sv.setPointerCapture?.(e.pointerId); };
      sv.onpointermove = e => { if (e.pointerType === "mouse" || e.buttons) target = toX(e); };
    }
    function start() { if (started) return; started = true; AudioSys.sfx("whoosh"); draw(); last = 0; rafId = requestAnimationFrame(loop); }
    const up = e => { if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") keys.l = false; if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") keys.r = false; };
    document.addEventListener("keyup", up); addCleanup(() => document.removeEventListener("keyup", up));
    ui.onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "start") start();
      if (b.dataset.k === "say") Voice.speak(T(K.intro), "noctua");
      if (b.dataset.k === "end") { Voice.stop(); document.removeEventListener("keyup", up); done(mistakes); }
    };
    keyH = e => {
      if (!started && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); start(); return; }
      if (finished && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ui.querySelector("[data-k=end]")?.click(); return; }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") { keys.l = true; target = null; }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") { keys.r = true; target = null; }
    };
    rerender = draw;
    draw();
    Voice.speak(T(K.intro), "noctua");
  });
}
