/* =====================================================================
   PHILOQUEST — ARTE del capítulo 6 (Confucio)
   Estilo distinto al griego: tinta china sobre papel de arroz, con un
   sello rojo como sol. Las figuras siguen siendo siluetas de tinta.
   ===================================================================== */
const CN = {
  paper: "#eadfc4", paper2: "#d9c7a0", paperDk: "#b9a57c",
  ink: "#1d2124", ink2: "#3a4044", ink3: "#5d6468", ink4: "#8b9195",
  seal: "#b23a2a", sealHi: "#d4583f",
  bronze: "#b68d47", bronzeHi: "#e6c47a", bronzeLo: "#6d5226", patina: "#5f7d6a",
  skin: "#f1e2c2", blush: "#e59a7e", jade: "#7fa98d"
};
const CN_FIG = { fill: CN.ink, line: CN.paper2 };
const confucioLook = (o = {}) => Object.assign({ garment: "hanfu", hair: "topknot", beard: "thin", nose: "straight", pin: CN.jade }, CN_FIG, o);

/* ---------- formas ---------- */
function paperSky(top = CN.paper, bot = CN.paper2) {
  return skyGrad(top, bot) + inkTexture(7);
}
function inkTexture(seed) {
  const r = rng(seed); let s = "";
  for (let i = 0; i < 14; i++) s += ell((r() * 1600).toFixed(0), (r() * 900).toFixed(0), (60 + r() * 220).toFixed(0), (8 + r() * 24).toFixed(0), CN.paperDk, `opacity="${(0.06 + r() * 0.08).toFixed(2)}"`);
  return s;
}
function sealSun(x, y, r) { return glow(x, y, r * 2.4, CN.sealHi, 0.35) + circ(x, y, r, CN.seal, `opacity=".9"`); }
function inkMountains(y, h, seed, color, op = 1) {
  const r = rng(seed); let d = `M-300 ${y}`; let x = -300;
  while (x < 1900) {
    const w = 120 + r() * 220, peak = y - h * (0.35 + r() * 0.65);
    d += ` C${x + w * 0.25} ${y - (y - peak) * 0.3} ${x + w * 0.38} ${peak} ${x + w * 0.5} ${peak} C${x + w * 0.62} ${peak + 10} ${x + w * 0.78} ${y - (y - peak) * 0.4} ${x + w} ${y - (y - peak) * 0.08}`;
    x += w;
  }
  d += ` L1900 ${y + 400} L-300 ${y + 400}Z`;
  const id = uid("mt");
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>` + pth(d, `url(#${id})`);
}
function mist(y, op = 0.7) { return `<g class="drift">${ell(400, y, 700, 34, CN.paper, `opacity="${op}"`) + ell(1300, y + 18, 620, 28, CN.paper, `opacity="${op * 0.8}"`)}</g>`; }
/* tejado chino con aleros curvados hacia arriba (x = centro, y = base del tejado) */
function cnRoof(x, y, w, h, fill) {
  const hw = w / 2;
  return pth(`M${x - hw - 26} ${y - 10} C${x - hw} ${y} ${x - hw + 10} ${y - h * 0.4} ${x - hw * 0.55} ${y - h * 0.8} L${x + hw * 0.55} ${y - h * 0.8} C${x + hw - 10} ${y - h * 0.4} ${x + hw} ${y} ${x + hw + 26} ${y - 10} C${x + hw} ${y + 4} ${x - hw} ${y + 4} ${x - hw - 26} ${y - 10}Z`, fill)
    + `<rect x="${x - hw * 0.58}" y="${y - h - 4}" width="${hw * 1.16}" height="${h * 0.24}" rx="3" fill="${fill}"/>`;
}
function pavilion(x, y, w, h, fill, line, opts = {}) {
  let s = cnRoof(x, y - h, w + 30, h * 0.42, fill);
  const n = opts.cols || 4;
  for (let i = 0; i < n; i++) { const cx = x - w / 2 + 10 + i * ((w - 20) / (n - 1)); s += `<rect x="${cx - 7}" y="${y - h}" width="14" height="${h}" fill="${fill}"/>`; }
  s += `<rect x="${x - w / 2 - 20}" y="${y}" width="${w + 40}" height="16" fill="${fill}"/>`;
  if (opts.lantern) s += lanternCn(x - w / 2 + 40, y - h + 30, 0.7) + lanternCn(x + w / 2 - 40, y - h + 30, 0.7);
  if (line) s += ln(`M${x - w / 2} ${y - h + 8} L${x + w / 2} ${y - h + 8}`, line, 1.4, `opacity=".6"`);
  return s;
}
function lanternCn(x, y, s) {
  return g(glow(0, 30, 70, CN.sealHi, 0.45, "fl") + ln("M0 -20 L0 0", CN.ink, 2) + ell(0, 30, 24, 30, CN.seal) + ln("M-18 30 L18 30 M-14 14 L14 14 M-14 46 L14 46", CN.sealHi, 1.2) + `<rect x="-10" y="-2" width="20" height="6" fill="${CN.ink}"/><rect x="-10" y="58" width="20" height="6" fill="${CN.ink}"/>` + ln("M0 64 L0 80", CN.seal, 2), `translate(${x} ${y}) scale(${s})`);
}
function cityWall(x, y, w, h, fill) {
  let s = `<rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${fill}"/>`;
  for (let i = 0; i < w; i += 30) s += `<rect x="${x + i}" y="${y - h - 14}" width="18" height="14" fill="${fill}"/>`;
  const gx = x + w / 2;
  s += pavilion(gx, y - h - 6, 150, 70, fill, null, { cols: 3 });
  s += pth(`M${gx - 34} ${y} L${gx - 34} ${y - h + 34} A34 34 0 0 1 ${gx + 34} ${y - h + 34} L${gx + 34} ${y}Z`, CN.paper2, `opacity=".55"`);
  return s;
}
function pine(x, y, s, fill) {
  let p = ln("M0 0 C-10 -60 14 -120 -6 -190 C-14 -220 6 -250 20 -270", fill, 14);
  p += ln("M-2 -120 C-40 -140 -80 -136 -110 -150 M2 -190 C40 -206 80 -200 110 -220 M14 -250 C-10 -262 -40 -262 -60 -276", fill, 6);
  for (const [cx, cy, rx] of [[-110, -160, 64], [110, -228, 70], [-60, -284, 54], [24, -290, 46], [-4, -200, 40]]) p += ell(cx, cy, rx, rx * 0.32, fill) + ell(cx + 10, cy - 12, rx * 0.7, rx * 0.22, fill, `opacity=".8"`);
  return g(p, `translate(${x} ${y}) scale(${s})`);
}
function bamboo(x, y, s, fill, seed = 3) {
  const r = rng(seed); let b = "";
  for (let k = 0; k < 3; k++) {
    const bx = k * 26 - 26, hgt = 300 + r() * 140;
    b += ln(`M${bx} 0 L${bx + 6} ${-hgt}`, fill, 8);
    for (let j = 60; j < hgt; j += 60) b += ln(`M${bx - 6 + j * 0.02} ${-j} L${bx + 8 + j * 0.02} ${-j}`, CN.paper2, 2);
    for (let j = 0; j < 4; j++) { const ly = -(120 + r() * (hgt - 140)), dir = r() > 0.5 ? 1 : -1; b += pth(`M${bx + 4} ${ly} C${bx + 30 * dir} ${ly - 14} ${bx + 70 * dir} ${ly - 4} ${bx + 90 * dir} ${ly + 10} C${bx + 60 * dir} ${ly + 8} ${bx + 30 * dir} ${ly + 6} ${bx + 4} ${ly}Z`, fill); }
  }
  return g(b, `translate(${x} ${y}) scale(${s})`);
}
function apricot(x, y, s, fill) {
  let a = ln("M0 0 C6 -80 -20 -150 10 -230", fill, 18) + ln("M4 -150 C50 -170 90 -200 130 -200 M6 -190 C-40 -220 -80 -220 -120 -240 M10 -230 C30 -270 60 -290 80 -310", fill, 7);
  const r = rng(11);
  for (let i = 0; i < 40; i++) { const bx = -150 + r() * 300, by = -330 + r() * 160; a += circ(bx.toFixed(0), by.toFixed(0), (5 + r() * 6).toFixed(1), i % 3 ? "#f0c2c0" : "#e7a0a2", `opacity=".9"`); }
  return g(a, `translate(${x} ${y}) scale(${s})`);
}
function granaryHouse(x, y, s, fill, line) {
  let h = `<rect x="-70" y="-150" width="140" height="120" fill="${fill}"/>` + cnRoof(0, -150, 170, 70, fill);
  for (const lx of [-56, -18, 18, 56]) h += `<rect x="${lx - 6}" y="-30" width="12" height="30" fill="${fill}"/>`;
  h += ln("M-60 -110 L60 -110 M-60 -70 L60 -70", line, 1.2, `opacity=".7"`);
  h += `<rect x="-18" y="-120" width="36" height="46" fill="${line}" opacity=".35"/>`;
  return g(h, `translate(${x} ${y}) scale(${s})`);
}
function grainSack(x, y, s, fill, line) { return g(pth("M-26 0 C-34 -30 -26 -56 -10 -62 L-14 -72 L14 -72 L10 -62 C26 -56 34 -30 26 0Z", fill) + ln("M-14 -60 L14 -60", line, 2) + ln("M-14 -30 Q0 -24 14 -30", line, 1, `opacity=".6"`), `translate(${x} ${y}) scale(${s})`); }
function sheep(x, y, s, fill, wool, flip = false) {
  let h = "";
  const r = rng(5);
  for (let i = 0; i < 9; i++) h += circ((-50 + r() * 100).toFixed(0), (-70 + r() * 36).toFixed(0), (20 + r() * 8).toFixed(0), wool);
  h += ell(62, -78, 18, 14, fill) + ell(52, -86, 8, 5, fill) + circ(68, -80, 2.4, wool);
  for (const lx of [-36, -14, 22, 40]) h += limb([[lx, -46], [lx, -4]], fill, 7);
  return g(h, `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`);
}
function ox(x, y, s, fill, line) {
  let h = ell(0, -110, 120, 52, fill) + pth("M96 -136 C130 -150 160 -140 168 -112 C172 -90 150 -78 130 -86 L104 -96Z", fill);
  h += ln("M140 -142 C150 -170 176 -172 186 -160 M132 -142 C126 -170 104 -176 96 -166", fill, 7) + circ(150, -116, 3, line);
  for (const lx of [-80, -50, 54, 84]) h += limb([[lx, -76], [lx + 2, -8]], fill, 16);
  h += ln("M-118 -120 C-140 -100 -144 -70 -138 -40", fill, 6);
  return g(h, `translate(${x} ${y}) scale(${s})`);
}
function cart(x, y, s, fill, line) {
  let c = `<rect x="-120" y="-120" width="230" height="64" fill="${fill}"/>` + cnRoof(0, -120, 210, 70, fill);
  c += circ(-40, -30, 46, "none", `stroke="${fill}" stroke-width="10"`) + circ(-40, -30, 40, "none", `stroke="${line}" stroke-width="1.4" opacity=".6"`) + circ(-40, -30, 8, fill);
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c += ln(`M-40 -30 L${(-40 + Math.cos(a) * 44).toFixed(1)} ${(-30 + Math.sin(a) * 44).toFixed(1)}`, fill, 3); }
  c += ln("M110 -76 L230 -70", fill, 7) + ln("M-110 -100 L100 -100", line, 1.2, `opacity=".6"`);
  return g(c, `translate(${x} ${y}) scale(${s})`);
}
function bigFire(x, y, s) {
  let f = "";
  const H = [150, 230, 190, 260, 170, 120];
  for (let i = 0; i < 6; i++) { const x0 = -130 + i * 46, h = H[i]; f += `<g class="fl" style="animation-delay:${-i * 0.23}s">${pth(`M${x0 - 30} 0 C${x0 - 46} ${-h * 0.4} ${x0 - 10} ${-h * 0.62} ${x0 - 2} ${-h} C${x0 + 16} ${-h * 0.6} ${x0 + 40} ${-h * 0.4} ${x0 + 26} 0Z`, i % 2 ? CN.sealHi : "#f2b046")}${pth(`M${x0 - 12} 0 C${x0 - 20} ${-h * 0.3} ${x0} ${-h * 0.4} ${x0 + 2} ${-h * 0.62} C${x0 + 12} ${-h * 0.36} ${x0 + 20} ${-h * 0.2} ${x0 + 12} 0Z`, "#ffe3a0", `opacity=".8"`)}</g>`; }
  return g(glow(0, -100, 260, CN.sealHi, 0.5) + f, `translate(${x} ${y}) scale(${s})`);
}
function smokeCn(x, y, s) { return g(`<g class="drift2">${ell(0, -40, 160, 50, CN.ink3, `opacity=".45"`) + ell(80, -110, 140, 44, CN.ink4, `opacity=".4"`) + ell(-60, -170, 120, 38, CN.ink4, `opacity=".3"`)}</g>`, `translate(${x} ${y}) scale(${s})`); }
function cnGround(y, color = CN.ink2) { return pth(`M-300 ${y} C200 ${y - 14} 700 ${y + 10} 1100 ${y - 6} C1400 ${y - 14} 1700 ${y} 1900 ${y + 4} L1900 1200 L-300 1200Z`, color); }
function brushBand(y) { return `<rect x="-300" y="${y}" width="2200" height="60" fill="${CN.ink}"/>` + ln(`M-300 ${y + 8} L1900 ${y + 8}`, CN.seal, 3, `opacity=".8"`); }
function slips(x, y, s) {
  let b = "";
  for (let i = 0; i < 7; i++) b += `<rect x="${i * 13}" y="0" width="10" height="60" rx="2" fill="${CN.paper2}"/>` + ln(`M${i * 13 + 5} 8 L${i * 13 + 5} 52`, CN.ink, 1.2, `stroke-dasharray="3 4"`);
  b += ln("M-2 14 L92 14 M-2 46 L92 46", CN.seal, 1.6);
  return g(b, `translate(${x} ${y}) scale(${s})`);
}

/* ---------- espejo de bronce ---------- */
/* back: dorso decorado (con botón central); front: cara pulida con un reflejo */
function bronzeMirror(r, side, inner = "") {
  const id = uid("bz"), id2 = uid("bzf"), clip = uid("bzc");
  let s = `<defs><radialGradient id="${id}" cx=".38" cy=".32" r=".85"><stop offset="0" stop-color="${CN.bronzeHi}"/><stop offset=".55" stop-color="${CN.bronze}"/><stop offset="1" stop-color="${CN.bronzeLo}"/></radialGradient>
    <radialGradient id="${id2}" cx=".4" cy=".35" r=".9"><stop offset="0" stop-color="#fff3d2"/><stop offset=".6" stop-color="#e8cf98"/><stop offset="1" stop-color="#b08a4c"/></radialGradient>
    <clipPath id="${clip}"><circle r="${r * 0.84}"/></clipPath></defs>`;
  s += circ(0, 0, r + 8, CN.ink) + circ(0, 0, r, `url(#${id})`);
  if (side === "back") {
    s += `<circle r="${r * 0.86}" fill="none" stroke="${CN.bronzeLo}" stroke-width="4"/><circle r="${r * 0.62}" fill="none" stroke="${CN.bronzeLo}" stroke-width="2.4"/>`;
    for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; s += circ((Math.cos(a) * r * 0.93).toFixed(1), (Math.sin(a) * r * 0.93).toFixed(1), r * 0.022, CN.bronzeLo); }
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; s += g(pth(`M0 ${-r * 0.4} C${r * 0.14} ${-r * 0.5} ${r * 0.2} ${-r * 0.7} 0 ${-r * 0.78} C${-r * 0.2} ${-r * 0.7} ${-r * 0.14} ${-r * 0.5} 0 ${-r * 0.4}Z`, CN.patina, `opacity=".8"`), `rotate(${i * 90 + 45})`); s += g(ln(`M${-r * 0.08} ${-r * 0.36} L${-r * 0.08} ${-r * 0.24} L${r * 0.08} ${-r * 0.24} L${r * 0.08} ${-r * 0.36}`, CN.bronzeLo, 3), `rotate(${a * 180 / Math.PI})`); }
    s += `<rect x="${-r * 0.22}" y="${-r * 0.22}" width="${r * 0.44}" height="${r * 0.44}" fill="none" stroke="${CN.bronzeLo}" stroke-width="3"/>`;
    s += circ(0, 0, r * 0.13, CN.bronzeLo) + circ(-r * 0.04, -r * 0.04, r * 0.05, CN.bronzeHi, `opacity=".7"`);
    s += ln(`M${-r * 0.06} 0 L${r * 0.06} 0`, CN.ink, 3);
  } else {
    s += circ(0, 0, r * 0.86, `url(#${id2})`);
    s += `<g clip-path="url(#${clip})">${inner}</g>`;
    s += pth(`M${-r * 0.6} ${-r * 0.45} C${-r * 0.4} ${-r * 0.72} ${-r * 0.1} ${-r * 0.8} ${r * 0.1} ${-r * 0.78}`, "none", `stroke="#fff" stroke-width="${r * 0.05}" stroke-linecap="round" opacity=".45"`);
  }
  return s;
}

/* ---------- caras para el espejo (centro 0,0, radio ~70) ---------- */
function faceSvg(kind, emo, sc = 1) {
  if (emo === "unknown") return g(faceSvg(kind, "neutral", 1) + `<g class="fogd">${ell(0, 0, 120, 90, "#d8dcdf", `opacity=".88"`)}</g>` + `<text x="0" y="30" text-anchor="middle" font-family="Cinzel, serif" font-weight="900" font-size="96" fill="${CN.ink3}">?</text>`, sc !== 1 ? `scale(${sc})` : "");
  const ink = CN.ink, skin = CN.skin;
  let h = "";
  // pelo trasero
  if (kind === "girl") h += circ(-74, 6, 24, ink) + circ(74, 6, 24, ink) + ln("M-74 30 L-80 70 M74 30 L80 70", ink, 10);
  if (kind === "girl2") h += pth("M-74 -20 C-90 30 -84 90 -60 110 L60 110 C84 90 90 30 74 -20Z", ink);
  // cabeza
  h += ell(0, 4, 66, 74, skin) + ell(-66, 10, 12, 16, skin) + ell(66, 10, 12, 16, skin);
  // pelo delantero
  if (kind === "boy") h += pth("M-66 -14 C-70 -70 -20 -88 10 -84 C50 -82 72 -54 66 -14 C50 -34 20 -44 -10 -40 C-30 -38 -50 -28 -66 -14Z", ink);
  if (kind === "boy2") { h += pth("M-68 -10 C-74 -60 -36 -86 0 -86 C40 -86 74 -60 68 -10 C56 -30 30 -44 0 -42 C-30 -44 -56 -30 -68 -10Z", ink); for (let i = 0; i < 7; i++) h += circ(-54 + i * 18, -62 - (i % 2) * 10, 14, ink); }
  if (kind === "girl" || kind === "girl2") h += pth("M-66 -8 C-70 -66 -24 -86 0 -86 C30 -86 70 -66 66 -8 C50 -40 20 -40 0 -26 C-20 -40 -50 -40 -66 -8Z", ink) + (kind === "girl2" ? ln("M-60 -46 C-20 -70 20 -70 60 -46", CN.seal, 7) : circ(-40, -56, 8, CN.seal) + circ(40, -56, 8, CN.seal));
  if (kind === "small") h += pth("M-10 -68 C-14 -90 4 -96 10 -80 C14 -92 30 -88 22 -70Z", ink) + pth("M-60 -26 C-50 -62 -20 -72 0 -70 C30 -72 56 -58 62 -26 C40 -44 -30 -46 -60 -26Z", ink);
  if (kind === "elder") h += pth("M-66 -10 C-70 -40 -60 -54 -48 -58 C-52 -40 -54 -26 -52 -6Z", CN.ink4) + pth("M66 -10 C70 -40 60 -54 48 -58 C52 -40 54 -26 52 -6Z", CN.ink4) + ln("M-30 -58 Q0 -66 30 -58", CN.ink4, 2);
  if (kind === "neutral") h += pth("M-66 -14 C-70 -70 -20 -86 0 -86 C30 -86 70 -70 66 -14 C40 -40 -40 -40 -66 -14Z", CN.ink3);
  // rasgos según emoción
  const E = { // [cejaIzq, cejaDer, ojos, boca, extras]
    neutral: ["M-38 -26 L-16 -26", "M16 -26 L38 -26", "dot", "M-16 38 L16 38", ""],
    happy:   ["M-38 -30 Q-27 -38 -16 -30", "M16 -30 Q27 -38 38 -30", "arc", "M-26 30 Q0 58 26 30", "blush"],
    sad:     ["M-38 -20 L-16 -30", "M16 -30 L38 -20", "dot", "M-20 46 Q0 30 20 46", "tear"],
    shame:   ["M-38 -22 L-16 -28", "M16 -28 L38 -22", "down", "M-14 42 q7 -6 14 0 q7 6 14 0", "blushBig"],
    angry:   ["M-40 -34 L-14 -22", "M14 -22 L40 -34", "dot", "M-20 44 Q0 32 20 44", "red"],
    proud:   ["M-38 -34 Q-27 -40 -16 -34", "M16 -34 Q27 -40 38 -34", "closed", "M-20 34 Q4 48 26 30", ""],
    hopeful: ["M-38 -32 Q-27 -40 -16 -32", "M16 -32 Q27 -40 38 -32", "big", "M-14 34 Q0 50 14 34Z", "blush"],
    nervous: ["M-38 -22 L-16 -30", "M16 -30 L38 -22", "dot", "M-20 40 q5 -6 10 0 q5 6 10 0 q5 -6 10 0", "sweat"],
    bored:   ["M-38 -24 L-16 -24", "M16 -24 L38 -24", "half", "M-14 42 L14 40", ""],
    scared:  ["M-38 -30 L-16 -38", "M16 -38 L38 -30", "big", "M-10 44 a10 12 0 1 0 20 0 a10 12 0 1 0 -20 0", "sweat"],
    lonely:  ["M-38 -20 L-16 -28", "M16 -28 L38 -20", "down", "M-16 44 Q0 36 16 44", ""]
  }[emo] || null;
  const F = E || ["M-38 -26 L-16 -26", "M16 -26 L38 -26", "dot", "M-16 38 L16 38", ""];
  if (kind === "elder") h += ln(F[0], CN.ink4, 6) + ln(F[1], CN.ink4, 6); else h += ln(F[0], ink, 5) + ln(F[1], ink, 5);
  const eye = (x) => {
    switch (F[2]) {
      case "arc": return ln(`M${x - 10} -6 Q${x} -18 ${x + 10} -6`, ink, 5);
      case "down": return ln(`M${x - 10} -4 Q${x} 4 ${x + 10} -4`, ink, 4) + circ(x, 4, 3.5, ink);
      case "closed": return ln(`M${x - 10} -8 Q${x} 0 ${x + 10} -8`, ink, 4);
      case "big": return circ(x, -8, 11, "#fff") + circ(x, -6, 7, ink) + circ(x + 3, -10, 2.4, "#fff");
      case "half": return ln(`M${x - 11} -10 L${x + 11} -10`, ink, 4) + pth(`M${x - 9} -10 Q${x} 0 ${x + 9} -10Z`, ink);
      default: return circ(x, -8, 6.5, ink) + circ(x + 2, -10, 2, "#fff");
    }
  };
  h += eye(-27) + eye(27);
  if (kind === "elder") h += `<circle cx="-27" cy="-8" r="16" fill="none" stroke="${ink}" stroke-width="2.4"/><circle cx="27" cy="-8" r="16" fill="none" stroke="${ink}" stroke-width="2.4"/>` + ln("M-11 -8 L11 -8", ink, 2.4);
  h += ln("M0 4 Q-6 18 2 20", ink, 2.4, `opacity=".7"`);
  h += emo === "hopeful" || emo === "scared" ? pth(F[3], ink) : ln(F[3], ink, 4.4);
  if (kind === "elder") h += pth("M-40 52 C-30 96 30 96 40 52 C24 64 -24 64 -40 52Z", CN.ink4, `opacity=".9"`);
  if (F[4] === "blush" || F[4] === "blushBig") h += ell(-42, 20, F[4] === "blushBig" ? 16 : 11, 7, CN.blush, `opacity="${F[4] === "blushBig" ? 0.95 : 0.7}"`) + ell(42, 20, F[4] === "blushBig" ? 16 : 11, 7, CN.blush, `opacity="${F[4] === "blushBig" ? 0.95 : 0.7}"`);
  if (F[4] === "tear") h += pth("M-30 4 C-34 14 -36 20 -30 24 C-24 20 -26 14 -30 4Z", "#7fb6d8");
  if (F[4] === "sweat") h += pth("M52 -40 C46 -28 46 -20 52 -18 C58 -20 58 -28 52 -40Z", "#7fb6d8");
  if (F[4] === "red") h += ell(0, -2, 60, 66, CN.sealHi, `opacity=".12"`);
  return sc !== 1 ? g(h, `scale(${sc})`) : h;
}

/* ---------- ESCENAS ---------- */
Object.assign(SCENES, {
  /* ===== CAP 6 · CONFUCIO ===== */
  lu() {
    let s = paperSky();
    s += sealSun(1260, 190, 70);
    s += inkMountains(520, 320, 21, CN.ink3, 0.55) + mist(470, 0.6);
    s += inkMountains(620, 240, 37, CN.ink2, 0.8) + mist(600, 0.5);
    s += cityWall(860, 700, 520, 90, CN.ink2);
    s += cnGround(720, CN.ink2);
    s += pine(220, 760, 1.05, CN.ink);
    s += fig(confucioLook({ x: 560, y: 820, s: 0.62, beard: "none", hair: "topknot", nose: "kid", front: "hold", back: "down" }));
    s += fig({ x: 470, y: 820, s: 1.08, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "bun", beard: "none", nose: "female", front: "hug", back: "down" });
    s += brushBand(860);
    return s;
  },
  granary() {
    let s = paperSky("#efe3c6", "#dccaa2");
    s += inkMountains(560, 220, 44, CN.ink3, 0.45) + mist(540, 0.6);
    s += granaryHouse(1080, 720, 1.4, CN.ink2, CN.paper2) + granaryHouse(1360, 720, 1.1, CN.ink3, CN.paper2);
    s += cnGround(720, CN.ink2);
    s += grainSack(760, 810, 1.2, CN.ink3, CN.paper2) + grainSack(830, 816, 1.0, CN.ink3, CN.paper2) + grainSack(700, 818, 0.9, CN.ink3, CN.paper2);
    s += ox(260, 806, 0.9, CN.ink, CN.paper2) + sheep(480, 800, 0.8, CN.ink, CN.ink4, true);
    s += fig(confucioLook({ x: 960, y: 820, s: 1.05, beard: "none", front: "hold", props: ["scroll"], back: "down" }));
    s += brushBand(860);
    return s;
  },
  school() {
    let s = paperSky();
    s += sealSun(220, 160, 46);
    s += bamboo(1480, 760, 1.1, CN.ink3, 4) + bamboo(120, 760, 0.9, CN.ink3, 9);
    s += pavilion(800, 690, 620, 300, CN.ink2, CN.paper2, { cols: 4, lantern: true });
    s += cnGround(706, CN.ink2);
    s += seatedFig(Object.assign(confucioLook({ x: 620, y: 820, s: 1.02, front: "out", back: "down" }), { stool: false }));
    s += seatedFig({ x: 900, y: 820, s: 0.82, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "none", front: "hold", props: ["scroll"], stool: false });
    s += seatedFig({ x: 1060, y: 820, s: 0.78, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "bun", beard: "none", front: "chin", stool: false });
    s += seatedFig({ x: 1210, y: 820, s: 0.8, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "short", front: "write", props: ["pen"], stool: false });
    s += slips(760, 760, 0.9);
    s += brushBand(860);
    return s;
  },
  stable() {
    let s = skyGrad("#6b4a3a", "#c97a4a", "#a25a36");
    s += smokeCn(1100, 420, 1.4);
    s += pavilion(1120, 700, 460, 220, CN.ink, null, { cols: 5 });
    s += bigFire(1120, 640, 1.2);
    s += cnGround(706, CN.ink);
    s += horse(1300, 800, 0.5, "#5a3a2c", CN.paper2, false);
    s += fig({ x: 820, y: 820, s: 0.9, flip: true, fill: CN.ink, line: CN.paper2, garment: "short", hair: "topknot", beard: "none", front: "up", back: "up" });
    s += fig(confucioLook({ x: 420, y: 820, s: 1.15, front: "out", back: "down" }));
    s += fig({ x: 260, y: 820, s: 0.92, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "short", front: "chin" });
    s += brushBand(860);
    return s;
  },
  roads() {
    let s = paperSky();
    s += sealSun(1380, 150, 54);
    s += inkMountains(480, 330, 61, CN.ink3, 0.5) + mist(430, 0.7);
    s += inkMountains(620, 260, 73, CN.ink2, 0.75) + mist(610, 0.55);
    s += pth("M-300 900 C200 760 700 720 1000 700 C1300 680 1600 700 1900 690 L1900 900Z", CN.ink4);
    s += pth("M-300 900 C200 800 700 760 1100 730 L1900 728 L1900 900Z", CN.paperDk, `opacity=".55"`);
    s += ox(1270, 796, 0.66, CN.ink, CN.paper2) + cart(990, 796, 0.9, CN.ink, CN.paper2);
    s += fig(confucioLook({ x: 720, y: 820, s: 1.0, front: "staff", props: ["staff"], back: "down" }));
    s += fig({ x: 560, y: 820, s: 0.9, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "short", front: "hold", props: ["sack"] });
    s += fig({ x: 420, y: 820, s: 0.88, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "none", front: "down" });
    s += pine(1520, 790, 0.8, CN.ink);
    s += brushBand(860);
    return s;
  },
  mirror() {
    let s = skyGrad("#2a2420", "#15110e");
    s += glow(800, 420, 520, CN.bronzeHi, 0.18);
    for (let i = 0; i < 6; i++) s += `<rect x="${120 + i * 230}" y="160" width="200" height="560" fill="#3a2f26" opacity=".55"/>` + ln(`M${120 + i * 230} 300 L${320 + i * 230} 300 M${120 + i * 230} 440 L${320 + i * 230} 440 M${220 + i * 230} 160 L${220 + i * 230} 720`, "#5a4a3a", 2, `opacity=".6"`);
    s += lanternCn(180, 120, 1.1) + lanternCn(1420, 120, 1.1);
    s += `<rect x="-300" y="720" width="2200" height="400" fill="#120e0b"/>`;
    s += g(bronzeMirror(170, "back"), "translate(800 470)") + ln("M800 640 L800 760 M740 760 L860 760", CN.bronzeLo, 10);
    s += brushBand(860);
    return s;
  },
  disciples() {
    let s = paperSky();
    s += inkMountains(560, 240, 81, CN.ink3, 0.45) + mist(530, 0.6);
    s += apricot(560, 760, 1.35, CN.ink);
    s += cnGround(740, CN.ink2);
    s += seatedFig(Object.assign(confucioLook({ x: 620, y: 830, s: 1.05, front: "out", back: "down" }), { stool: false }));
    s += fig({ x: 980, y: 830, s: 1.0, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "short", front: "give", back: "down" });
    s += seatedFig({ x: 1160, y: 830, s: 0.8, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "none", front: "chin", stool: false });
    s += seatedFig({ x: 1320, y: 830, s: 0.78, flip: true, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "bun", beard: "none", front: "hold", props: ["scroll"], stool: false });
    s += txt(1440, 200, 54, CN.seal, "恕", `font-weight="700"`);
    s += brushBand(860);
    return s;
  },
  village() {
    let s = paperSky();
    s += inkMountains(540, 240, 91, CN.ink3, 0.45) + mist(520, 0.6);
    s += granaryHouse(1240, 720, 1.1, CN.ink2, CN.paper2) + granaryHouse(1460, 720, 0.9, CN.ink3, CN.paper2);
    s += cnGround(724, CN.ink2);
    for (let i = 0; i < 9; i++) s += ln(`M${180 + i * 50} 760 L${180 + i * 50} 690`, CN.ink, 7);
    s += ln("M170 710 L590 710 M170 740 L590 740", CN.ink, 5);
    s += sheep(300, 830, 0.85, CN.ink, CN.ink3) + sheep(470, 836, 0.7, CN.ink, CN.ink3, true);
    s += fig({ x: 900, y: 830, s: 1.05, fill: CN.ink, line: CN.paper2, garment: "hanfu", hair: "topknot", beard: "long", front: "point", back: "down" });
    s += brushBand(860);
    return s;
  },
  mirrorPlay() {
    let s = skyGrad("#2a2420", "#15110e");
    s += glow(800, 420, 620, CN.bronzeHi, 0.14);
    for (let i = 0; i < 7; i++) s += `<rect x="${-40 + i * 250}" y="120" width="220" height="620" fill="#3a2f26" opacity=".45"/>`;
    s += lanternCn(120, 90, 1) + lanternCn(1480, 90, 1);
    s += `<rect x="-300" y="740" width="2200" height="400" fill="#120e0b"/>`;
    return s;
  }
});
