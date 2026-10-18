/* =====================================================================
   CAPÍTULO 1 · TALES — «Mito o Logos» + «El eclipse del 585 a.C.»
   ===================================================================== */
GAMES.tales = async function (ch) {
  const m1 = await mitoLogos(ch);
  const m2 = await eclipseGame(ch);
  return { stars: starsFromMistakes(m1 + m2) };
};

function mitoLogos(ch) {
  AudioSys.setMood("challenge");
  setScene("miletus", { dim: 1 });
  let cards = ch.mito.cards.filter(c => !c.pro || isPhi());
  const trap = cards.find(c => c.trap);
  cards = shuffle(cards.filter(c => !c.trap));
  cards.splice(cards.length - 1, 0, trap);
  const results = cards.map(() => null);
  let i = 0, mistakes = 0, answered = null;
  return ask(done => {
    const ui = $("#ui");
    function draw() {
      const c = cards[i];
      ui.innerHTML = `<div class="ch-wrap">
        <div class="ch-head"><div class="ins">${T(ch.mito.intro)}</div>${pipsHtml(results, i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>
        <div class="ml-board">
          <button class="ml-zone" data-a="mito"><svg viewBox="-30 -30 60 60" aria-hidden="true">${icon("bolt", P.goldHi)}</svg><b>${U("mito")}</b><span>${U("mitoSub")}</span><span class="k">←</span></button>
          <div class="ostrakon in" id="card"><svg viewBox="-30 -30 60 60" aria-hidden="true">${icon(c.icon, P.clayLo, P.clay)}</svg><div>${T(c.t)}</div></div>
          <button class="ml-zone" data-a="logos"><svg viewBox="-30 -30 60 60" aria-hidden="true">${icon("eye", P.goldHi)}</svg><b>${U("logos")}</b><span>${U("logosSub")}</span><span class="k">→</span></button>
        </div>
        <div id="fb" style="min-height:74px;display:flex;justify-content:center;width:100%"></div>
      </div>`;
      if (answered !== null) showFb(false);
      bindDrag();
    }
    function showFb(animate = true) {
      const c = cards[i]; const ok = answered === c.a;
      const card = $("#card"); if (card && animate) card.classList.add(answered === "mito" ? "toL" : "toR");
      else if (card) card.style.visibility = "hidden";
      $("#fb").innerHTML = feedbackHtml(ok, T(c.e));
      ui.querySelectorAll(".ml-zone").forEach(z => z.disabled = true);
    }
    function answer(a) {
      if (answered !== null) return;
      const c = cards[i]; answered = a;
      const ok = a === c.a;
      results[i] = ok ? 1 : 0; if (!ok) mistakes++;
      AudioSys.sfx(ok ? "ok" : "bad");
      showFb(true);
      ui.querySelector(".pips").outerHTML = pipsHtml(results, i);
      Voice.speak((ok ? U("wellDone") : U("notQuite")) + " " + T(c.e), "noctua");
    }
    function next() {
      answered = null; i++;
      if (i >= cards.length) { Voice.stop(); done(mistakes); return; }
      AudioSys.sfx("page"); draw(); Voice.speak(T(cards[i].t));
    }
    function bindDrag() {
      const card = $("#card"); if (!card) return;
      let sx = null;
      card.onpointerdown = e => { if (answered !== null) return; sx = e.clientX; card.setPointerCapture(e.pointerId); card.style.transition = "none"; };
      card.onpointermove = e => { if (sx === null) return; const dx = e.clientX - sx; card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; ui.querySelector('[data-a="mito"]').classList.toggle("hot", dx < -60); ui.querySelector('[data-a="logos"]').classList.toggle("hot", dx > 60); };
      card.onpointerup = e => {
        if (sx === null) return; const dx = e.clientX - sx; sx = null; card.style.transition = ""; card.style.transform = "";
        ui.querySelectorAll(".ml-zone").forEach(z => z.classList.remove("hot"));
        if (dx < -90) answer("mito"); else if (dx > 90) answer("logos");
      };
    }
    ui.onclick = e => {
      const z = e.target.closest("[data-a]"); if (z) { answer(z.dataset.a); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "fbnext") next();
      if (b.dataset.k === "say") Voice.speak(T(ch.mito.intro) + " " + T(cards[i].t));
    };
    keyH = e => {
      if (answered === null && (e.key === "ArrowLeft" || e.key.toLowerCase() === "m")) answer("mito");
      else if (answered === null && (e.key === "ArrowRight" || e.key.toLowerCase() === "l")) answer("logos");
      else if (answered !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    };
    rerender = draw;
    draw();
    Voice.speak(T(ch.mito.intro) + " " + T(cards[0].t), "noctua");
  });
}

function eclipseGame(ch) {
  AudioSys.setMood("challenge");
  clearScene();
  const SUN = { x: 800, y: 300, r: 92 };
  const speed = isPhi() ? 430 : 300, tol = isPhi() ? 14 : 24;
  let tries = 0, misses = 0, won = false, mx = -150, last = 0, frozen = false, msg = null, helped = false;
  return ask(done => {
    const ui = $("#ui");
    function draw() {
      ui.innerHTML = `<div class="ecl"><svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect x="-300" y="-300" width="2200" height="1500" fill="${P.clayHi}"/>
        <rect id="eSky" x="-300" y="-300" width="2200" height="1500" fill="#0b1118" opacity="0"/>
        <g id="eStars" opacity="0">${stars(90, 33, 0, 0, 1600, 560)}</g>
        ${glow(SUN.x, SUN.y, 300, P.goldHi, 0.55)}
        <g id="corona" opacity="0">${glow(SUN.x, SUN.y, 230, "#fff3c8", 0.9)}</g>
        <circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r}" fill="${P.goldHi}"/>
        <circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r + 6}" fill="none" stroke="${P.slip}" stroke-width="2" stroke-dasharray="6 10" opacity=".7"/>
        <g id="moonG"><circle id="moon" cx="${mx}" cy="${SUN.y}" r="${SUN.r + 2}" fill="#2a1a12" stroke="#5e3a26" stroke-width="2"/></g>
        ${hill("M-300 900 L-300 690 C300 660 900 670 1900 690 L1900 900Z", P.clayLo)}
        <g id="armyL" style="transition:transform 3s ease 1s">${[0, 1, 2, 3, 4, 5].map(k => hoplite(80 + k * 70, 720 + (k % 2) * 14, 0.62, P.ink, P.clay, false, "round")).join("")}</g>
        <g id="armyR" style="transition:transform 3s ease 1s">${[0, 1, 2, 3, 4, 5].map(k => hoplite(1520 - k * 70, 720 + (k % 2) * 14, 0.62, P.ink, P.clay, true, "rect")).join("")}</g>
      </svg>
      <div class="ch-wrap" style="position:absolute;inset:0 0 auto 0;overflow:visible"><div class="ch-head"><div class="ins">${T(ch.eclipse.intro)}</div><div class="chip">${U("tries")}: ${Math.max(0, 3 - tries)}</div><button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div></div>
      <div class="ecl-ui">
        <div id="emsg" style="min-height:60px;display:flex;justify-content:center;width:100%">${msg || ""}</div>
        ${won ? `<button class="btn big gold" data-k="cont">${U("cont")} ${ICON.next}</button>` : `<button class="btn big" data-k="now" ${frozen ? "disabled" : ""}>${U("now")}</button>`}
      </div></div>`;
      paint();
    }
    function paint() {
      const moon = $("#moon"); if (!moon) return;
      moon.setAttribute("cx", mx.toFixed(1));
      const d = Math.abs(mx - SUN.x), cover = Math.max(0, 1 - d / (SUN.r * 2));
      $("#eSky").setAttribute("opacity", (won ? 0.9 : cover * 0.82).toFixed(3));
      $("#eStars").setAttribute("opacity", (won ? 1 : Math.max(0, cover - 0.6) * 2.2).toFixed(3));
      $("#corona").setAttribute("opacity", (won ? 1 : Math.max(0, cover - 0.85) * 5).toFixed(3));
    }
    function loop(t) {
      if (!last) last = t;
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!frozen && !won) { mx += speed * dt; if (mx > 1750) mx = -150; paint(); }
      rafId = requestAnimationFrame(loop);
    }
    function press() {
      if (won || frozen) return;
      const d = Math.abs(mx - SUN.x);
      tries++;
      if (d <= tol) { win(); return; }
      misses++; AudioSys.sfx("bad"); frozen = true;
      if (tries >= 3) {
        msg = feedbackHtml(false, T(ch.eclipse.help), false); helped = true;
        draw();
        later(() => { const anim = () => { mx += (SUN.x - mx) * 0.08; paint(); if (Math.abs(mx - SUN.x) > 0.5) rafId = requestAnimationFrame(anim); else win(); }; cancelAnimationFrame(rafId); rafId = requestAnimationFrame(anim); }, 1200);
        return;
      }
      msg = feedbackHtml(false, T(ch.eclipse.miss), false);
      draw();
      later(() => { frozen = false; msg = null; draw(); }, 1300);
    }
    function win() {
      won = true; frozen = false; mx = SUN.x; cancelAnimationFrame(rafId);
      AudioSys.sfx("eclipse"); later(() => AudioSys.sfx("fanfare"), 1400);
      msg = feedbackHtml(true, T(ch.eclipse.win), false);
      draw();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const l = $("#armyL"), r = $("#armyR");
        if (l) l.style.transform = "translateX(-260px)"; if (r) r.style.transform = "translateX(260px)";
      }));
      Voice.speak(T(ch.eclipse.win), "noctua");
    }
    ui.onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "now") press();
      if (b.dataset.k === "say") Voice.speak(T(ch.eclipse.intro), "noctua");
      if (b.dataset.k === "cont") { Voice.stop(); cancelAnimationFrame(rafId); done(helped ? 2 : Math.min(misses, 2)); }
    };
    keyH = e => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (won) ui.querySelector("[data-k=cont]")?.click(); else press(); }
    };
    rerender = draw;
    draw();
    Voice.speak(T(ch.eclipse.intro), "noctua");
    rafId = requestAnimationFrame(loop);
  });
}
