/* =====================================================================
   CAPÍTULO 4 · ARISTÓTELES — «La balanza del justo medio» + «Laboratorio de lógica»
   ===================================================================== */
GAMES.aristoteles = async function (ch) {
  const m1 = await virtueGame(ch);
  const m2 = await logicGame(ch);
  return { stars: starsFromMistakes(Math.floor((m1 + m2) / 2)) };
};

function balanceSvg(angle, glowOn) {
  const r = angle * Math.PI / 180, L = 230;
  const lx = -L * Math.cos(r), ly = -L * Math.sin(r), rx = L * Math.cos(r), ry = L * Math.sin(r);
  const pan = (x, y) => ln(`M${x} ${y} L${x - 52} ${y + 70} M${x} ${y} L${x + 52} ${y + 70}`, P.ink, 2.4) + pth(`M${x - 66} ${y + 70} Q${x} ${y + 102} ${x + 66} ${y + 70}Z`, P.clay) + ln(`M${x - 60} ${y + 76} Q${x} ${y + 98} ${x + 60} ${y + 76}`, P.ink, 1.2);
  return `${glowOn ? glow(0, -110, 160, P.goldHi, 0.55) : ""}
    ${pth("M-16 120 L-10 -110 L10 -110 L16 120Z", P.ink)}<rect x="-70" y="112" width="140" height="18" rx="3" fill="${P.ink}"/>
    ${pth("M-7 -112 L0 -150 L7 -112Z", glowOn ? P.goldHi : P.gold)}
    <g>${ln(`M${lx} ${ly - 110} L${rx} ${ry - 110}`, P.ink, 10)}${circ(0, -110, 12, P.gold)}</g>
    ${pan(lx, ly - 110)}${pan(rx, ry - 110)}`;
}

function virtueGame(ch) {
  AudioSys.setMood("challenge");
  setScene("lyceum", { dim: 2 });
  const V = ch.virtue;
  const cards = shuffle(V.cards.filter(c => !c.pro || isPhi()));
  const results = cards.map(() => null);
  let i = 0, mistakes = 0, answered = -1, angle = 0, summary = false;
  return ask(done => {
    const ui = $("#ui");
    let anim = 0;
    function tweenTo(target) {
      cancelAnimationFrame(anim);
      const from = angle, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / 650), e = 1 - Math.pow(1 - k, 3);
        angle = from + (target - from) * e + Math.sin(k * Math.PI * 3) * (1 - k) * 3;
        const sv = $("#bal"); if (sv) sv.innerHTML = balanceSvg(angle, answered >= 0 && answered === cards[i].a && cards[i].a === 1);
        if (k < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }
    function draw() {
      if (summary) return drawSummary();
      const c = cards[i];
      const labels = V.pos.map(T);
      ui.innerHTML = `<div class="ch-wrap">
        <div class="ch-head"><div class="ins">${T(V.intro)}</div>${pipsHtml(results, i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>
        <div class="vb">
          <svg id="bal" class="balance" viewBox="-320 -170 640 310" aria-hidden="true">${balanceSvg(angle, false)}</svg>
          <div class="vb-labels"><span>◀ ${labels[0]}</span><span>${labels[1]}</span><span>${labels[2]} ▶</span></div>
          <div class="ostrakon ${answered < 0 ? "in" : ""}" id="card" style="min-height:150px;width:min(640px,100%)"><div>${T(c.t)}</div></div>
          ${answered < 0 ? `<div class="vb-btns">${labels.map((l, k) => `<button class="opt" data-p="${k}"><span class="n">${["←", "↓", "→"][k]}</span><span>${l}</span></button>`).join("")}</div>`
            : `<div style="display:flex;justify-content:center;width:100%">${feedbackHtml(answered === c.a, T(c.e))}</div>`}
        </div></div>`;
    }
    function drawSummary() {
      const used = V.virtues.filter(v => !v.pro || isPhi());
      const labels = V.pos.map(T);
      ui.innerHTML = `<div class="ch-wrap"><div class="center-wrap" style="position:relative;inset:auto;padding:0;flex:1"><div class="panel meander" style="width:min(820px,100%)">
        <div class="kicker">${T(V.summary)}</div>
        <table class="vtable"><thead><tr><th>${labels[0]}</th><th class="mid">${labels[1]}</th><th>${labels[2]}</th></tr></thead>
        <tbody>${used.map(v => `<tr><td>${T(v.names[0])}</td><td class="mid">${T(v.names[1])}</td><td>${T(v.names[2])}</td></tr>`).join("")}</tbody></table>
        <div style="display:flex;justify-content:flex-end;margin-top:18px"><button class="btn big" data-k="end">${U("cont")} ${ICON.next}</button></div>
      </div></div></div>`;
    }
    function answer(p) {
      if (answered >= 0 || summary) return;
      const c = cards[i]; answered = p;
      const ok = p === c.a; results[i] = ok ? 1 : 0; if (!ok) mistakes++;
      AudioSys.sfx(ok ? "ok" : "bad");
      draw(); tweenTo([-16, 0, 16][p]);
      Voice.speak((ok ? U("wellDone") : U("notQuite")) + " " + T(c.e), "noctua");
    }
    function next() {
      if (summary) { Voice.stop(); cancelAnimationFrame(anim); done(mistakes); return; }
      answered = -1; i++;
      if (i >= cards.length) { summary = true; AudioSys.sfx("fanfare"); draw(); Voice.speak(T(V.summary), "noctua"); return; }
      AudioSys.sfx("page"); draw(); tweenTo(0); Voice.speak(T(cards[i].t));
    }
    ui.onclick = e => {
      const b0 = e.target.closest("[data-p]"); if (b0) { answer(+b0.dataset.p); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "fbnext" || b.dataset.k === "end") next();
      if (b.dataset.k === "say") Voice.speak(T(V.intro) + " " + T(cards[i].t));
    };
    keyH = e => {
      if (answered < 0 && !summary) {
        if (e.key === "ArrowLeft") answer(0); else if (e.key === "ArrowDown") { e.preventDefault(); answer(1); } else if (e.key === "ArrowRight") answer(2);
        else if (["1", "2", "3"].includes(e.key)) answer(+e.key - 1);
      } else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
    };
    rerender = draw;
    draw();
    Voice.speak(T(V.intro) + " " + T(cards[0].t), "noctua");
  });
}

function logicGame(ch) {
  AudioSys.setMood("challenge");
  setScene("lyceum", { dim: 2 });
  const L = ch.logic;
  const items = L.items.filter(x => !x.pro || isPhi());
  const results = items.map(() => null);
  let i = 0, mistakes = 0, answered = null;
  let order = shuffle([0, 1, 2]);
  return ask(done => {
    const ui = $("#ui");
    function draw() {
      const it = items[i];
      const ok = answered !== null && (it.type === "complete" ? answered === it.ans : answered === it.ans);
      let conclusion;
      if (it.type === "complete") conclusion = answered !== null ? `<b>${T(it.opts[it.ans])}</b>` : `<span class="blank">_____________</span>`;
      else conclusion = `<b>${T(it.c).replace(/^(Por tanto|Donc),?\s*/i, "")}</b>`;
      ui.innerHTML = `<div class="ch-wrap">
        <div class="ch-head"><div class="ins">${T(L.intro)}</div>${pipsHtml(results, i)}<button class="ibtn" data-k="say" aria-label="${U("replay")}">${ICON.speaker}</button></div>
        <div class="tablet">
          ${it.p.map((p, k) => `<p class="prem"><span class="pn">${k + 1}</span>${T(p)}</p>`).join("")}
          <p class="ther"><span class="pn">∴</span>${T(L.therefore)} ${conclusion}</p>
        </div>
        ${answered === null ? (it.type === "complete"
            ? `<div class="opts">${order.map((o, n) => `<button class="opt" data-o="${o}"><span class="n">${n + 1}</span><span>${T(it.opts[o])}</span></button>`).join("")}</div>`
            : `<p class="lead" style="text-align:center;margin:0">${T(L.askCheck)}</p><div class="yn"><button class="opt" data-o="1"><span class="n">1</span><span>${T(L.yes)}</span></button><button class="opt" data-o="0"><span class="n">2</span><span>${T(L.no)}</span></button></div>`)
          : `<div style="display:flex;justify-content:center;width:100%">${feedbackHtml(ok, T(it.e))}</div>`}
      </div>`;
    }
    function say() { const it = items[i]; Voice.speak(it.p.map(T).join(" ") + " " + (it.type === "complete" ? T(L.therefore) : T(it.c) + " " + T(L.askCheck))); }
    function answer(v) {
      if (answered !== null) return;
      const it = items[i];
      answered = it.type === "complete" ? v : v === 1;
      const ok = answered === it.ans;
      results[i] = ok ? 1 : 0; if (!ok) mistakes++;
      AudioSys.sfx(ok ? "ok" : "bad"); draw();
      Voice.speak((ok ? U("wellDone") : U("notQuite")) + " " + T(it.e), "noctua");
    }
    function next() {
      answered = null; i++; order = shuffle([0, 1, 2]);
      if (i >= items.length) { Voice.stop(); done(mistakes); return; }
      AudioSys.sfx("page"); draw(); say();
    }
    ui.onclick = e => {
      const o = e.target.closest("[data-o]"); if (o) { answer(+o.dataset.o); return; }
      const b = e.target.closest("[data-k]"); if (!b) return;
      if (b.dataset.k === "fbnext") next();
      if (b.dataset.k === "say") say();
    };
    keyH = e => {
      const it = items[i];
      if (answered === null && ["1", "2", "3"].includes(e.key)) {
        const n = +e.key - 1;
        if (it.type === "complete") answer(order[n]); else if (n < 2) answer(n === 0 ? 1 : 0);
      } else if (answered !== null && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); next(); }
    };
    rerender = draw;
    draw(); say();
  });
}
