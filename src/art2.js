/* =====================================================================
   PHILOQUEST — ARTE de los capítulos 4 (Aristóteles) y 5 (Diógenes)
   ===================================================================== */

/* ---------- formas nuevas ---------- */
function chickenShape(fill, line) {
  let c = ell(0, 0, 26, 19, fill) + pth("M18 -8 C26 -16 24 -26 28 -32 L34 -30 C32 -24 32 -14 24 -2Z", fill) + circ(30, -34, 7, fill) + pth("M36 -36 L44 -33 L36 -30Z", P.gold);
  c += ln("M-6 16 L-10 36 M-14 38 L-10 36 L-4 38 M8 16 L10 36 M4 38 L10 36 L16 38", fill, 3);
  for (let i = 0; i < 12; i++) c += circ(-18 + (i % 4) * 11 + (i > 7 ? 4 : 0), -8 + Math.floor(i / 4) * 8, 1.2, line, `opacity=".5"`);
  c += circ(31, -35, 1.4, P.ink);
  return c;
}
function octopus(x, y, s, fill, line) {
  let o = "";
  for (let k = 0; k < 8; k++) {
    const sx = -21 + k * 6, dir = k < 4 ? -1 : 1, spread = (k % 4) * 16 + 14;
    o += ln(`M${sx} -16 C${sx + dir * spread * 0.6} 10 ${sx + dir * spread} 34 ${sx + dir * (spread + 10)} 44 q${dir * 10} 4 ${dir * 6} -8`, fill, 7 - (k % 2));
  }
  o += ell(0, -44, 28, 34, fill) + circ(-10, -30, 4, P.slip) + circ(10, -30, 4, P.slip) + circ(-10, -30, 1.8, P.ink) + circ(10, -30, 1.8, P.ink);
  o += ln("M-14 -60 q14 -8 28 0", line, 1.2);
  return g(o, `translate(${x} ${y}) scale(${s})`);
}
function fish(x, y, s, fill, line, flip) {
  const f = ell(0, 0, 40, 16, fill) + pth("M36 0 L60 -16 L56 0 L60 16Z", fill) + circ(-26, -4, 3.4, P.slip) + circ(-26, -4, 1.4, P.ink)
    + ln("M-10 -10 q6 10 0 20 M2 -12 q6 12 0 24 M14 -10 q6 10 0 20", line, 1.1) + pth("M-6 -14 L8 -26 L16 -14Z", fill);
  return g(f, `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`);
}
function heron(x, y, s, fill) {
  const h = ell(0, -110, 40, 20, fill) + pth("M30 -118 C52 -130 40 -160 50 -178 C54 -186 66 -188 70 -180 C62 -176 58 -168 60 -160 C62 -140 56 -122 36 -106Z", fill)
    + ln("M68 -182 L104 -176", fill, 4) + ln("M-4 -92 L-8 0 M8 -92 L12 0 M-14 0 L0 0 M4 0 L20 0", fill, 3.5) + pth("M-36 -112 L-64 -100 L-36 -100Z", fill);
  return g(h, `translate(${x} ${y}) scale(${s})`);
}
function pithos(x, y, s, fill, line, flip) {
  let p = pth("M-130 0 C-162 -24 -160 -118 -116 -138 C-62 -158 40 -158 84 -128 L114 -118 L114 -38 L84 -28 C40 2 -64 10 -130 0Z", fill);
  p += ell(114, -78, 14, 40, P.ink) + ell(114, -78, 8, 30, "#0a0604");
  p += ln("M-140 -94 C-60 -112 30 -112 90 -96 M-142 -46 C-60 -32 30 -32 90 -46", line, 2) + ln("M-130 -70 C-60 -78 30 -78 90 -70", line, 1.2, `stroke-dasharray="4 6"`);
  return g(p, `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`);
}
function dog(x, y, s, fill, line, flip) {
  const d = ell(0, -16, 50, 16, fill) + circ(48, -28, 14, fill) + pth("M56 -28 L76 -22 L74 -14 L54 -18Z", fill) + pth("M40 -38 L36 -54 L48 -42Z", fill)
    + ln("M38 -6 L74 -2 M-36 -6 L-6 -2", fill, 7) + ln("M-48 -20 C-70 -24 -76 -12 -84 -18", fill, 6) + circ(52, -32, 1.6, line);
  return g(d, `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`);
}
function fountainHouse(x, y, s, fill, line) {
  let f = `<rect x="-140" y="-300" width="280" height="300" fill="${fill}"/>` + ln("M-140 -240 L140 -240 M-140 -180 L140 -180 M-140 -120 L140 -120 M-140 -60 L140 -60", line, 1, `opacity=".45"`);
  f += pth("M-160 -300 L0 -360 L160 -300Z", fill) + circ(0, -200, 28, P.clayHi) + circ(0, -200, 20, P.ink2) + pth("M-8 -196 L8 -196 L0 -184Z", P.clayHi);
  for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; f += pth(`M${Math.cos(a) * 26} ${-200 + Math.sin(a) * 26} L${Math.cos(a + .3) * 38} ${-200 + Math.sin(a + .3) * 38} L${Math.cos(a + .6) * 26} ${-200 + Math.sin(a + .6) * 26}Z`, P.clayHi); }
  f += `<g class="pour">${ln("M0 -184 C2 -140 -2 -100 0 -70", "#9cc7cf", 6)}${ln("M-4 -170 C-2 -130 -6 -96 -4 -72", P.slip, 1.5, `opacity=".7"`)}</g>`;
  f += `<rect x="-90" y="-70" width="180" height="70" fill="${P.ink2}"/>` + `<rect x="-84" y="-66" width="168" height="14" fill="#5f9aa5" opacity=".9"/>`;
  return g(f, `translate(${x} ${y}) scale(${s})`);
}
function verginaSun(x, y, r, color) {
  let v = circ(x, y, r * 0.28, color);
  for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; v += pth(`M${x + Math.cos(a - .09) * r * .3} ${y + Math.sin(a - .09) * r * .3} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r} L${x + Math.cos(a + .09) * r * .3} ${y + Math.sin(a + .09) * r * .3}Z`, color); }
  return v;
}
function coinPile(x, y, n, color = P.gold) {
  let c = ""; for (let i = 0; i < n; i++) c += ell(x + (i % 3) * 16 - 16, y - Math.floor(i / 3) * 6, 12, 5, i % 2 ? P.goldHi : color);
  return c;
}
function scaleBalance(x, y, s, fill) {
  return g(ln("M0 0 L0 -70 M-50 -66 L50 -66 M-50 -66 L-62 -34 M-50 -66 L-38 -34 M50 -66 L38 -34 M50 -66 L62 -34", fill, 3) + pth("M-66 -34 Q-50 -22 -34 -34Z", fill) + pth("M34 -34 Q50 -22 66 -34Z", fill) + `<rect x="-14" y="-4" width="28" height="6" fill="${fill}"/>`, `translate(${x} ${y}) scale(${s})`);
}

/* ---------- iconos de la mochila de Diógenes (caja 80x80, centro 0,0) ---------- */
function itemIcon(name) {
  switch (name) {
    case "agua": return pth("M0 -30 C10 -12 22 2 22 12 C22 26 12 32 0 32 C-12 32 -22 26 -22 12 C-22 2 -10 -12 0 -30Z", "#8cc1c9") + pth("M-10 10 C-10 18 -4 22 2 22", "none", `stroke="${P.slip}" stroke-width="3" stroke-linecap="round"`);
    case "pan": return ell(0, 4, 30, 20, P.clayHi) + ell(0, -2, 26, 14, "#e9a463") + ln("M-14 -6 l8 10 M-2 -10 l8 10 M10 -8 l6 8", P.clayLo, 3);
    case "manto": return pth("M-26 -24 L26 -24 L32 28 L-32 28Z", P.clayLo) + ln("M-14 -20 L-20 24 M0 -20 L0 24 M14 -20 L20 24", P.ink, 1.6) + ln("M-26 -24 Q0 -12 26 -24", P.ink, 2);
    case "aceitunas": return ln("M-28 22 C-6 4 10 -10 26 -26", "#4f5a2a", 4) + ell(-10, 4, 7, 10, "#2f3a1a", `transform="rotate(-30 -10 4)"`) + ell(6, -8, 7, 10, "#2f3a1a", `transform="rotate(-30 6 -8)"`) + ell(18, 6, 7, 10, "#2f3a1a", `transform="rotate(-30 18 6)"`) + ell(-20, -8, 4, 12, "#6f7d3a", `transform="rotate(40 -20 -8)"`);
    case "amigo": return circ(-12, -10, 10, P.slip) + circ(14, -12, 10, P.slip) + pth("M-28 26 C-28 6 -20 2 -12 2 C-4 2 4 6 4 26Z", P.slip) + pth("M-2 26 C-2 4 6 0 14 0 C22 0 30 4 30 26Z", P.slipDim);
    case "sol": { let s = circ(0, 0, 13, P.goldHi); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; s += ln(`M${Math.cos(a) * 18} ${Math.sin(a) * 18} L${Math.cos(a) * 28} ${Math.sin(a) * 28}`, P.goldHi, 3.4); } return s; }
    case "corona": return pth("M-28 18 L-30 -16 L-16 0 L0 -24 L16 0 L30 -16 L28 18Z", P.gold) + `<rect x="-28" y="14" width="56" height="10" fill="${P.goldHi}"/>` + circ(0, 2, 4.5, "#c0392b") + circ(-16, 8, 3.5, "#2e86c1") + circ(16, 8, 3.5, "#2e86c1");
    case "monedas": return coinPile(0, 22, 8) + circ(10, -14, 14, P.goldHi) + circ(10, -14, 9, "none", `stroke="${P.goldLo}" stroke-width="2"`);
    case "perfume": return circ(0, 8, 20, P.clay) + `<rect x="-6" y="-24" width="12" height="16" fill="${P.clay}"/>` + ell(0, -26, 12, 4, P.ink) + ln("M-14 8 L14 8", P.ink, 2) + pth("M-8 0 L0 -6 L8 0 L0 6Z", P.ink) + ln("M14 -16 q8 -6 4 -14 M20 -10 q10 -6 6 -14", P.slip, 1.6, `opacity=".7"`);
    case "sandalias": return pth("M-26 18 C-30 -2 -20 -24 -2 -26 C14 -26 22 -10 26 18Z", P.ink3) + ln("M-18 -2 L18 4 M-14 -14 L14 -10 M-8 -24 L-4 18", P.gold, 3.5) + circ(0, -6, 4, P.goldHi);
    case "consola": return pth("M-30 -4 C-30 -16 -20 -18 -8 -14 L8 -14 C20 -18 30 -16 30 -4 L32 12 C32 22 22 24 16 16 L10 10 L-10 10 L-16 16 C-22 24 -32 22 -32 12Z", "#2b3138") + ln("M-20 -4 L-12 -4 M-16 -8 L-16 0", P.slip, 2.6) + circ(14, -6, 3, "#e74c3c") + circ(20, 0, 3, "#3498db");
    case "movil": return `<rect x="-16" y="-30" width="32" height="60" rx="6" fill="#20262c"/><rect x="-12" y="-24" width="24" height="44" rx="2" fill="#5dade2"/>` + circ(0, 25, 2, P.slipDim) + ln("M-8 -14 L8 -14 M-8 -6 L4 -6", P.slip, 2, `opacity=".8"`);
    case "palacio": return temple(0, 28, 56, 60, P.gold, { cols: 4, line: P.goldLo, flutes: false });
    case "joyas": { let j = ln("M-24 -18 C-24 18 24 18 24 -18", P.gold, 2.4); for (let i = 0; i < 9; i++) { const a = Math.PI * (i / 8); j += circ(-24 * Math.cos(a), -18 + 26 * Math.sin(a), 3.4, i % 2 ? P.goldHi : "#e8e2d6"); } return j + pth("M-6 8 L0 22 L6 8 L0 2Z", "#c0392b"); }
    default: return circ(0, 0, 16, P.clay);
  }
}

/* ---------- ESCENAS ---------- */
Object.assign(SCENES, {
  /* ===== CAP 4 · ARISTÓTELES ===== */
  stagira() {
    let s = skyGrad("#e2995b", "#c96a34");
    s += hill("M-300 600 L100 380 L320 470 L560 330 L820 500 L1100 360 L1400 480 L1900 380 L1900 700 L-300 700Z", "#8f4a22");
    s += hill("M-300 900 L-300 690 C300 650 1000 650 1900 690 L1900 900Z", "#a85326");
    for (let i = 0; i < 6; i++) { const x = 980 + i * 86, yy = 690 - (i % 2) * 12; s += `<rect x="${x}" y="${yy - 46}" width="64" height="46" fill="${P.ink}"/>` + pth(`M${x - 6} ${yy - 46} L${x + 32} ${yy - 68} L${x + 70} ${yy - 46}Z`, P.ink); }
    s += cypress(900, 690, 0.8, P.ink) + olive(1500, 700, 0.8, P.ink, P.clay);
    s += fig({ x: 470, y: 820, s: 1.2, front: "hold", props: ["scroll"], hair: "cap", beard: "long", back: "down" });
    s += fig({ x: 660, y: 820, s: 0.62, flip: true, garment: "short", front: "point", hair: "cap", beard: "none", nose: "kid", tilt: -10 });
    s += g(scaleBalance(0, 0, 1, P.ink), "translate(300 820)");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  academyTwo() {
    let s = skyGrad("#e8a464", "#cf743c");
    s += glow(800, 180, 420, P.goldHi, 0.35);
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b9602d"/>`;
    for (let i = 0; i < 3; i++) s += pth(`M${320 + i * 480} 700 L${320 + i * 480} 250 A${180} 180 0 0 1 ${680 + i * 480} 250 L${680 + i * 480} 700 L${700 + i * 480} 700 L${700 + i * 480} 160 L${300 + i * 480} 160 L${300 + i * 480} 700Z`, P.clayLo, `opacity=".55"`);
    s += txt(800, 140, 20, P.ink, "ΑΓΕΩΜΕΤΡΗΤΟΣ ΜΗΔΕΙΣ ΕΙΣΙΤΩ", `opacity=".6"`);
    s += fig({ x: 700, y: 820, s: 1.3, front: "up", hair: "bald", beard: "long", back: "down", props: ["scroll"].slice(0, 0) });
    s += fig({ x: 900, y: 820, s: 1.3, flip: true, front: "give", hair: "cap", beard: "short", back: "hip" });
    s += ln("M742 380 L760 340", P.goldHi, 3, `opacity=".8"`) + ln("M858 600 L840 640", P.goldHi, 3, `opacity=".8"`);
    s += seatedFig({ x: 360, y: 820, s: 0.8, front: "chin", hair: "curly", beard: "none" });
    s += seatedFig({ x: 1240, y: 820, s: 0.8, flip: true, front: "hold", props: ["scroll"], hair: "cap", beard: "short" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  lesbos() {
    let s = skyGrad("#eaa86a", "#d27a40");
    s += sunDisk(1330, 170, 56, P.goldHi, false);
    s += hill("M900 520 C1100 470 1400 470 1900 500 L1900 560 L900 560Z", P.clayLo);
    s += sea(540, "#9b4a22", "#5e2a13", P.ink);
    s += pth("M-300 900 L-300 640 C100 620 400 640 600 700 C700 730 760 800 780 900Z", "#d79a63");
    s += octopus(1000, 760, 1.5, P.ink, P.clay) + fish(1300, 690, 1.0, P.ink, P.clay) + fish(1180, 800, 0.8, P.ink, P.clay, true) + fish(1450, 780, 0.7, P.ink, P.clay);
    s += heron(220, 690, 1.0, P.ink);
    s += fig({ x: 560, y: 800, s: 1.25, front: "point", hair: "cap", beard: "short", back: "hip", tilt: 8 });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  pella() {
    let s = skyGrad("#e39a5c", P.clay);
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b65d2b"/>`;
    s += temple(800, 700, 1100, 520, P.clayLo, { cols: 10, line: P.clay });
    s += verginaSun(800, 228, 40, P.goldHi);
    s += fig({ x: 420, y: 820, s: 1.25, front: "out", hair: "cap", beard: "full", diadem: true, back: "down" });
    s += fig({ x: 820, y: 820, s: 0.95, garment: "short", front: "hold", props: ["scroll"], hair: "curly", beard: "none", back: "down" });
    s += fig({ x: 1150, y: 820, s: 1.25, flip: true, front: "point", hair: "cap", beard: "short", back: "hip" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  bucephalus() {
    let s = skyGrad("#efb070", "#d27a40");
    s += sunDisk(1380, 260, 64, P.goldHi, true);
    s += hill("M-300 900 L-300 700 C400 670 1100 670 1900 700 L1900 900Z", "#b65d2b");
    s += pth("M380 780 C320 790 120 800 -60 800 L-60 760 C120 760 300 768 380 770Z", P.ink, `opacity=".35"`);
    s += horse(760, 780, 1.4, P.ink, P.clay, false);
    s += fig({ x: 1100, y: 800, s: 1.0, flip: true, garment: "short", front: "hold", hair: "curly", beard: "none", back: "down" });
    s += ln("M1060 600 C1040 600 1010 430 1020 420", P.ink, 3);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  lyceum() {
    let s = skyGrad("#e8a464", "#cf743c");
    s += olive(140, 640, 1.2, P.clayLo, P.clay) + olive(1500, 640, 1.2, P.clayLo, P.clay);
    s += stoa(80, 640, 1440, 320, P.ink, P.clay, 15);
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#c06a35"/>` + ln("M-300 700 L1900 700", P.clayLo, 2, `opacity=".6"`);
    s += fig({ x: 520, y: 820, s: 1.2, front: "point", hair: "cap", beard: "short", back: "down" });
    s += fig({ x: 760, y: 820, s: 0.95, garment: "short", stride: true, front: "down", hair: "curly", beard: "none", back: "back" });
    s += fig({ x: 950, y: 820, s: 0.95, garment: "short", stride: true, front: "chin", hair: "cap", beard: "none", back: "back" });
    s += fig({ x: 1140, y: 820, s: 0.95, garment: "short", stride: true, front: "hold", props: ["scroll"], hair: "curly", beard: "short", back: "back" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },

  /* ===== CAP 5 · DIÓGENES ===== */
  sinope() {
    let s = skyGrad("#d9945c", "#b9602d");
    s += hill("M800 520 C1000 420 1300 400 1500 470 C1650 500 1800 520 1900 520 L1900 600 L800 600Z", P.clayLo);
    for (let i = 0; i < 6; i++) { const x = 1040 + i * 80, yy = 480 - (i % 2) * 12; s += `<rect x="${x}" y="${yy - 40}" width="56" height="40" fill="${P.ink}"/>` + pth(`M${x - 6} ${yy - 40} L${x + 28} ${yy - 60} L${x + 62} ${yy - 40}Z`, P.ink); }
    s += sea(560, "#3e5c5c", "#1d3335", P.slipDim);
    s += ship(1250, 660, 0.6, P.ink, P.clay);
    s += pth("M-300 900 L-300 640 C100 630 500 650 760 700 L760 900Z", "#a85326");
    s += `<rect x="280" y="700" width="300" height="20" fill="${P.ink}"/>` + ln("M300 720 L300 800 M560 720 L560 800", P.ink, 8) + coinPile(380, 694, 9) + coinPile(480, 694, 6);
    s += fig({ x: 660, y: 820, s: 1.15, flip: true, front: "give", props: ["hammer"], hair: "cap", beard: "short", back: "down" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  jar() {
    let s = skyGrad("#e39a5c", P.clay);
    s += stoa(-40, 640, 1700, 260, P.clayLo, P.clay, 18);
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#b9602d"/>`;
    s += pithos(820, 800, 1.6, P.clay, P.ink);
    s += seatedFig({ x: 470, y: 820, s: 1.1, front: "chin", hair: "wild", beard: "long", stool: false });
    s += dog(1180, 820, 1.2, P.ink, P.clay, true);
    s += ln("M300 830 L340 520", P.ink, 6) + g(prop("sack", [300, 560], P.ink, P.clay), "translate(-10 0)");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  fountain() {
    let s = skyGrad("#e8a464", "#cf743c");
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b9602d"/>`;
    s += fountainHouse(520, 780, 1.4, P.ink, P.clay);
    s += fig({ x: 760, y: 820, s: 0.62, flip: true, garment: "short", front: "hold", hair: "cap", beard: "none", nose: "kid", tilt: 14 });
    s += fig({ x: 1150, y: 820, s: 1.2, flip: true, front: "up", hair: "wild", beard: "long", back: "down" });
    s += g(prop("bowl", [0, 0], P.ink, P.clay), "translate(1320 260) rotate(30)") + ln("M1180 380 C1220 300 1270 270 1300 270", P.ink, 2, `stroke-dasharray="6 8"`);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  lantern() {
    let s = skyGrad("#f0b673", "#d98444");
    s += sunDisk(220, 150, 58, P.goldHi, true);
    s += stoa(500, 640, 1200, 230, P.clayLo, P.clay, 12);
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#c06a35"/>`;
    s += fig({ x: 700, y: 820, s: 1.25, front: "hold", props: ["oillamp"], hair: "wild", beard: "long", back: "down" });
    s += fig({ x: 1150, y: 820, s: 0.95, flip: true, front: "chin", hair: "cap", beard: "short" }) + fig({ x: 1330, y: 820, s: 0.95, flip: true, front: "out", hair: "curly", beard: "none" });
    s += qmark(1150, 470, 1.0, P.ink, "bob") + qmark(1330, 470, 0.9, P.ink, "bob");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  chicken() {
    let s = skyGrad("#e39a5c", P.clay);
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b9602d"/>`;
    s += `<rect x="900" y="300" width="22" height="400" fill="${P.ink}"/><rect x="1360" y="300" width="22" height="400" fill="${P.ink}"/><rect x="880" y="270" width="522" height="40" fill="${P.ink}"/>`;
    s += txt(1141, 298, 20, P.clayHi, "ΑΓΕΩΜΕΤΡΗΤΟΣ ΜΗΔΕΙΣ ΕΙΣΙΤΩ");
    s += fig({ x: 1140, y: 820, s: 1.2, flip: true, front: "chin", hair: "bald", beard: "long", back: "down" });
    s += seatedFig({ x: 1400, y: 820, s: 0.8, flip: true, front: "out", hair: "curly", beard: "none" });
    s += fig({ x: 560, y: 820, s: 1.25, front: "up", props: ["chicken"], hair: "wild", beard: "long", back: "hip" });
    s += olive(170, 720, 1.3, P.ink, P.clay);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  corinth() {
    let s = skyGrad("#f2bd7d", "#d98444");
    s += sunDisk(180, 210, 66, "#fff1c4", true);
    s += hill("M700 560 C900 330 1150 300 1400 420 C1600 500 1800 520 1900 520 L1900 640 L700 640Z", P.clayLo);
    s += temple(1240, 430, 260, 150, P.clayDk, { cols: 7, line: P.clay });
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#c06a35"/>`;
    s += pth("M640 820 L1200 860 L1240 760 L700 800Z", P.ink, `opacity=".28"`);
    s += hoplite(330, 820, 0.8, P.ink, P.clay, false, "round") + hoplite(210, 830, 0.75, P.ink, P.clay, false, "round");
    s += fig({ x: 560, y: 820, s: 1.25, garment: "short", front: "out", hair: "curly", beard: "none", helmet: true, crest: P.red, back: "down" });
    s += pithos(1330, 820, 1.2, P.clay, P.ink, true);
    s += seatedFig({ x: 1060, y: 820, s: 1.05, flip: true, front: "out", hair: "wild", beard: "long", stool: false });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  backpackField() {
    let s = skyGrad("#efb070", "#d98444");
    s += sunDisk(1380, 140, 50, P.goldHi, false);
    s += stoa(-40, 700, 1700, 220, P.clayLo, P.clay, 18);
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b9602d"/>`;
    return s;
  }
});
