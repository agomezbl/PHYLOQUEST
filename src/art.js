/* =====================================================================
   PHILOQUEST — ARTE (SVG)
   Estilo: cerámica griega. Figuras negras sobre barro (día),
   figuras rojas sobre negro (noche), detalles "rayados" (incisiones).
   Todas las escenas usan viewBox 0 0 1600 900.
   ===================================================================== */

const P = {
  ink: "#17100c", ink2: "#2b1e16", ink3: "#3d2c20",
  clay: "#c4622d", clayHi: "#df8a4e", clayLo: "#8a3f1c", clayDk: "#5e2a13",
  slip: "#f1e2c2", slipDim: "#cdb791",
  gold: "#e2ae4a", goldHi: "#f7d683", goldLo: "#a8742a",
  red: "#7a2818", night: "#0c161d", night2: "#16303f", sea: "#21424d",
  fog: "#8d949a", fogDk: "#4b5157"
};

let _uid = 0;
const uid = (p = "u") => p + (++_uid);
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

const pth = (d, fill, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;
const ln = (d, stroke, w = 1.6, extra = "") => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const limb = (pts, stroke, w) => `<path d="M${pts.map(p => p[0] + " " + p[1]).join(" L")}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circ = (x, y, r, fill, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const ell = (x, y, rx, ry, fill, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const g = (inner, tr = "", extra = "") => `<g ${tr ? `transform="${tr}"` : ""} ${extra}>${inner}</g>`;

/* ---------------------------------------------------------------
   CABEZAS (perfil mirando a la derecha, centro en 0,0)
   --------------------------------------------------------------- */
const HEADS = {
  straight: "M-17 6 C-21 -12 -9 -23 4 -22 C13 -21 18 -15 18 -7 L27 7 L19 9 C20 13 18 18 12 19 C4 21 -7 19 -11 14 C-15 12 -17 9 -17 6Z",
  snub: "M-18 6 C-22 -13 -9 -24 4 -23 C14 -22 19 -15 19 -6 C21 -2 26 3 25 6 C23 8 21 8 20 9 C21 13 19 18 13 19 C4 21 -7 19 -12 14 C-16 12 -18 9 -18 6Z",
  kid: "M-16 4 C-19 -13 -8 -21 4 -20 C13 -19 17 -13 17 -5 L21 4 L17 6 C17 11 14 15 9 16 C2 17 -7 16 -11 12 C-15 10 -16 7 -16 4Z",
  female: "M-16 6 C-20 -11 -9 -22 4 -21 C13 -20 17 -14 17 -6 L24 6 L18 8 C19 12 17 17 11 18 C4 19 -6 18 -10 13 C-14 11 -16 9 -16 6Z"
};
const HAIR = {
  cap: "M-19 8 C-25 -14 -9 -28 9 -24 C16 -22 16 -17 9 -16 C1 -15 -5 -10 -7 -2 C-9 5 -13 10 -19 8Z",
  curly: "M-20 9 C-28 -2 -25 -19 -13 -26 C-4 -31 9 -29 14 -23 C18 -18 13 -15 8 -16 C2 -15 -4 -11 -6 -3 C-8 4 -13 11 -20 9Z",
  bald: "M-18 5 C-22 -4 -19 -12 -13 -13 C-16 -5 -14 2 -9 8 C-12 9 -16 8 -18 5Z",
  long: "M-19 8 C-25 -14 -9 -28 9 -24 C16 -22 16 -17 9 -16 C1 -15 -5 -10 -7 -2 C-8 10 -9 24 -12 38 C-20 32 -23 20 -19 8Z",
  bun: "M-18 8 C-24 -12 -9 -26 8 -23 C14 -21 13 -16 8 -16 C0 -15 -5 -9 -7 -2 C-9 5 -13 10 -18 8Z",
  kid: "M-17 6 C-22 -12 -8 -25 8 -22 C16 -20 18 -14 12 -13 C6 -16 0 -12 -2 -6 C-6 -2 -10 8 -17 6Z",
  none: ""
};
const BEARDS = {
  long: "M-10 9 C-7 22 3 35 21 39 C18 31 21 21 20 12 C13 17 3 17 -10 9Z",
  short: "M-10 9 C-7 18 2 25 14 26 C18 22 20 16 19 11 C12 15 2 15 -10 9Z",
  full: "M-13 4 C-15 22 -2 38 19 38 C26 31 25 20 21 11 C12 16 0 13 -13 4Z",
  none: ""
};

function headGroup(o, fill, line) {
  const skin = o.skin || fill;
  const shape = HEADS[o.nose || "straight"];
  let s = "";
  if (o.hair === "bun") s += circ(-21, -12, 9, fill);
  s += pth(shape, skin);
  if (o.hair && HAIR[o.hair]) s += pth(HAIR[o.hair], fill);
  if (o.beard && BEARDS[o.beard]) s += pth(BEARDS[o.beard], fill);
  if (o.helmet) {
    s += pth("M-21 7 C-26 -18 -7 -31 10 -25 C21 -21 23 -8 21 3 L15 5 L13 -5 L5 -5 L5 15 L-2 19 C-13 19 -19 15 -21 7Z", fill);
    s += pth("M-24 -14 C-22 -44 8 -48 20 -31 C7 -38 -11 -36 -24 -14Z", o.crest || fill);
    s += ln("M-18 -10 C-10 -22 4 -24 14 -18", line, 1.4);
  }
  // incisiones
  const ic = o.skin ? P.ink : line;
  s += ln("M6 -5 Q10.5 -8.5 15 -4.5 Q10.5 -2.2 6 -5Z", ic, 1.3);
  s += circ(11, -5, 1.5, ic);
  if (!o.helmet) s += ln("M-3 -2 Q-7 2 -3 6", ic, 1.2);
  if (o.hair === "cap" || o.hair === "long" || o.hair === "curly") s += ln("M-16 -7 Q-3 -19 11 -18", P.red, 2.6);
  if (o.hair === "curly") s += ln("M-20 2 q3 -3 0 -6 q3 -3 0 -6 q3 -3 1 -7", line, 1.2);
  if (o.hair === "bald") { s += ln("M2 -17 Q8 -18 13 -15", line, 1); s += ln("M0 -13 Q7 -14 12 -11", line, 1); }
  if (o.beard === "long" || o.beard === "full") {
    s += ln("M13 11 Q17 13 22 11", line, 1.2);
    s += ln("M0 17 Q7 24 15 30", line, 1.1);
    s += ln("M-5 13 Q1 22 9 30", line, 1.1);
  }
  if (o.hair === "bun") s += ln("M-15 -6 Q-2 -18 10 -17", P.red, 2.6);
  return s;
}

/* ---------------------------------------------------------------
   FIGURA HUMANA (pies en 0,0; ~300 de alto; mirando a la derecha)
   --------------------------------------------------------------- */
const ARMS_F = {
  down:  [[20, -236], [30, -190], [36, -146]],
  point: [[20, -236], [42, -208], [70, -226]],
  up:    [[18, -238], [34, -278], [46, -316]],
  out:   [[20, -236], [46, -214], [76, -208]],
  chin:  [[20, -236], [42, -206], [22, -250]],
  hold:  [[20, -236], [38, -196], [60, -200]],
  staff: [[20, -236], [38, -204], [54, -208]],
  write: [[20, -236], [34, -200], [58, -188]],
  give:  [[20, -236], [44, -200], [70, -196]],
  hug:   [[20, -236], [50, -226], [74, -244]]
};
const ARMS_B = {
  down: [[-16, -236], [-26, -190], [-28, -146]],
  back: [[-16, -236], [-34, -200], [-48, -172]],
  up:   [[-14, -238], [-26, -280], [-32, -318]],
  hip:  [[-16, -236], [-38, -206], [-18, -182]],
  fwd:  [[-14, -236], [8, -200], [40, -200]]
};

function fig(o) {
  o = Object.assign({ x: 0, y: 0, s: 1, flip: false, fill: P.ink, line: P.clay, hair: "cap", beard: "long", nose: "straight",
    build: 1, garment: "himation", front: "down", back: null, tilt: 0, sit: false, props: [] }, o);
  const f = o.fill, L = o.line, b = o.build;
  const skin = o.skin || f;
  const aw = 11 * Math.sqrt(b);
  let body = "", arms = "", headT = "";
  const dy = o.sit ? 30 : 0;

  // garments
  if (o.sit) {
    body += pth(`M${-22 * b} -216 C${-6 * b} -223 ${12 * b} -222 ${25 * b} -214 C${29 * b} -196 ${29 * b} -170 ${27 * b} -140 C40 -132 54 -126 58 -110 C60 -90 58 -50 54 -14 L36 -14 C36 -40 34 -70 32 -94 C10 -94 -10 -96 -28 -98 C-28 -140 ${-28 * b} -190 ${-22 * b} -216Z`, f);
    body += ln("M22 -206 Q2 -168 -22 -130", L, 1.4) + ln("M30 -128 Q44 -120 52 -104", L, 1.4) + ln("M38 -60 L40 -18", L, 1.2);
    body += pth("M36 -2 L38 -14 L52 -16 L64 -6 L68 0Z", skin);
  } else if (o.garment === "himation") {
    body += pth(`M${-22 * b} -246 C${-6 * b} -253 ${12 * b} -252 ${25 * b} -244 C${29 * b} -228 ${29 * b} -214 ${28 * b} -200 C${31 * b} -150 ${35 * b} -90 41 -30 L39 -21 C14 -17 -14 -17 -35 -21 C-33 -90 ${-31 * b} -160 ${-27 * b} -205 C${-27 * b} -222 ${-26 * b} -238 ${-22 * b} -246Z`, f);
    body += ln(`M${23 * b} -240 Q2 -196 ${-24 * b} -156`, L, 1.5) + ln(`M${27 * b} -196 Q6 -150 -21 -112`, L, 1.4) + ln("M30 -150 Q12 -104 -16 -66", L, 1.4);
    body += ln("M-14 -96 L-16 -34", L, 1.1) + ln("M2 -102 L4 -34", L, 1.1) + ln("M19 -96 L23 -34", L, 1.1);
    body += ln("M-33 -32 C-12 -28 16 -28 38 -32", L, 1.3) + ln("M-33 -27 C-12 -23 16 -23 39 -27", L, 1.3);
    body += limb([[-14, -24], [-15, -8]], skin, 9) + limb([[16, -24], [17, -8]], skin, 9);
    body += pth("M-25 0 L-23 -9 L-11 -11 L-1 -4 L2 0Z", skin) + pth("M6 0 L8 -9 L20 -11 L30 -4 L33 0Z", skin);
  } else if (o.garment === "short") {
    body += pth(`M${-21 * b} -246 C${-6 * b} -252 ${12 * b} -252 ${24 * b} -244 L${28 * b} -200 C${30 * b} -172 ${34 * b} -142 38 -112 L-30 -112 C-28 -150 ${-27 * b} -180 ${-25 * b} -205Z`, f);
    body += ln(`M${-25 * b} -176 L${28 * b} -176`, L, 2) + ln("M-18 -168 L-22 -116", L, 1.1) + ln("M2 -168 L2 -116", L, 1.1) + ln("M20 -168 L26 -116", L, 1.1);
    body += limb([[-8, -116], [-12, -64], [-14, -10]], skin, 13) + limb([[10, -116], [18, -64], [20, -10]], skin, 13);
    body += pth("M-25 0 L-22 -10 L-10 -12 L0 -4 L3 0Z", skin) + pth("M9 0 L12 -10 L24 -12 L34 -4 L37 0Z", skin);
    if (o.greaves) body += ln("M-12 -60 L-14 -14", L, 1.2) + ln("M18 -60 L20 -14", L, 1.2);
  } else if (o.garment === "peplos") {
    body += pth(`M${-20 * b} -244 C${-4 * b} -250 ${12 * b} -250 ${22 * b} -242 C26 -226 26 -214 25 -200 L26 -130 C30 -90 34 -50 36 -16 L36 -8 C12 -4 -14 -4 -32 -8 L-32 -16 C-30 -60 -28 -120 -26 -200 C-26 -222 -24 -236 ${-20 * b} -244Z`, f);
    body += ln("M-27 -168 C-8 -160 12 -160 27 -168", L, 1.6);
    body += ln("M-30 -40 C-10 -36 14 -36 35 -40", L, 1.4) + ln("M-31 -30 C-10 -26 14 -26 35 -30", L, 1.4);
    for (let i = 0; i < 6; i++) body += circ(-22 + i * 11, -35, 1.6, L);
    body += ln("M-12 -150 L-16 -44", L, 1.1) + ln("M6 -150 L8 -44", L, 1.1) + ln("M20 -150 L26 -44", L, 1.1);
    body += pth("M6 0 L8 -8 L20 -10 L30 -4 L33 0Z", skin);
  } else if (o.garment === "robe") {
    body += pth(`M${-26 * b} -246 C${-6 * b} -254 ${14 * b} -254 ${28 * b} -244 C36 -200 40 -120 48 -10 C20 -2 -20 -2 -44 -10 C-40 -120 -36 -200 ${-26 * b} -246Z`, f);
    body += ln("M24 -238 Q4 -150 -30 -40", L, 1.4) + ln("M-30 -24 C0 -18 26 -18 46 -24", L, 1.4);
  }

  // neck
  body += pth("M-7 -256 L-9 -238 L9 -238 L8 -256Z", skin, o.sit ? `transform="translate(0 ${dy})"` : "");

  // arms
  const tr = (pts) => pts.map(p => [p[0] * (p[0] > 0 ? Math.min(b, 1.15) : b), p[1] + dy]);
  if (o.back && ARMS_B[o.back]) {
    const pts = tr(ARMS_B[o.back]);
    arms += limb(pts, skin, aw * 0.95) + circ(pts[2][0], pts[2][1], 6, skin);
  }
  if (o.front && ARMS_F[o.front]) {
    const pts = tr(ARMS_F[o.front]);
    arms += limb(pts, skin, aw) + circ(pts[2][0], pts[2][1], 6.2, skin);
    if (o.front === "point") arms += limb([pts[2], [pts[2][0] + 11, pts[2][1] - 6]], skin, 4);
    const h = pts[2];
    for (const pr of o.props) arms += prop(pr, h, f, L);
  }
  // head
  const hy = -268 + dy;
  headT = g(headGroup(o, f, L), `translate(0 ${hy}) rotate(${o.tilt})`);
  const sx = o.flip ? -o.s : o.s;
  return g(body + headT + arms, `translate(${o.x} ${o.y}) scale(${sx} ${o.s})`, o.cls ? `class="${o.cls}"` : "");
}

function prop(type, h, f, L) {
  const [x, y] = h;
  switch (type) {
    case "staff": return ln(`M${x + 2} ${y - 120} L${x + 8} ${y + 208}`, f, 5) + circ(x + 2, y - 122, 5, f);
    case "scroll": return `<rect x="${x - 4}" y="${y - 22}" width="34" height="18" rx="3" fill="${P.slip}"/>` + circ(x - 4, y - 13, 9, P.slipDim) + circ(x + 30, y - 13, 9, P.slipDim) + ln(`M${x + 4} ${y - 16} L${x + 22} ${y - 16} M${x + 4} ${y - 10} L${x + 20} ${y - 10}`, P.ink, 1);
    case "lyre": return ln(`M${x - 4} ${y + 10} C${x - 24} ${y - 30} ${x - 6} ${y - 70} ${x + 4} ${y - 72} M${x + 34} ${y + 10} C${x + 54} ${y - 30} ${x + 36} ${y - 70} ${x + 26} ${y - 72} M${x} ${y - 62} L${x + 30} ${y - 62}`, f, 5) + ln(`M${x + 8} ${y - 62} L${x + 10} ${y + 8} M${x + 15} ${y - 62} L${x + 15} ${y + 8} M${x + 22} ${y - 62} L${x + 20} ${y + 8}`, L, 1) + ell(x + 15, y + 10, 22, 10, f);
    case "hammer": return ln(`M${x} ${y} L${x + 10} ${y - 40}`, f, 5) + `<rect x="${x - 2}" y="${y - 52}" width="26" height="14" rx="2" fill="${f}" transform="rotate(15 ${x + 10} ${y - 45})"/>`;
    case "cup": return pth(`M${x - 22} ${y - 10} Q${x} ${y + 16} ${x + 22} ${y - 10}Z`, f) + ln(`M${x - 22} ${y - 10} q-10 -4 -6 6 M${x + 22} ${y - 10} q10 -4 6 6`, f, 3);
    case "baby": return ell(x + 6, y - 6, 22, 13, P.slip) + circ(x + 28, y - 12, 9, P.slip) + ln(`M${x - 10} ${y - 8} L${x + 18} ${y - 2} M${x - 6} ${y - 14} L${x + 16} ${y - 8}`, P.ink, 1);
    case "fork": return ln(`M${x} ${y + 30} L${x + 30} ${y - 110} M${x + 30} ${y - 110} L${x + 20} ${y - 140} M${x + 30} ${y - 110} L${x + 44} ${y - 136}`, f, 4);
    case "spear": return ln(`M${x + 4} ${y - 150} L${x + 2} ${y + 200}`, f, 4) + pth(`M${x - 2} ${y - 150} L${x + 4} ${y - 182} L${x + 10} ${y - 150}Z`, f);
    case "shield": return circ(x + 12, y - 4, 40, f) + `<circle cx="${x + 12}" cy="${y - 4}" r="33" fill="none" stroke="${L}" stroke-width="1.6"/>` + circ(x + 12, y - 4, 9, "none", `stroke="${L}" stroke-width="1.6"`);
    case "torch": return ln(`M${x} ${y + 30} L${x + 6} ${y - 34}`, f, 6) + `<g class="fl">${pth(`M${x - 6} ${y - 34} C${x - 14} ${y - 60} ${x + 4} ${y - 70} ${x + 6} ${y - 92} C${x + 14} ${y - 70} ${x + 24} ${y - 56} ${x + 16} ${y - 34}Z`, P.goldHi)}</g>`;
    case "trident": return ln(`M${x + 2} ${y - 150} L${x + 8} ${y + 200}`, f, 5) + ln(`M${x - 22} ${y - 150} L${x + 26} ${y - 154} M${x - 22} ${y - 150} L${x - 24} ${y - 196} M${x + 2} ${y - 152} L${x + 1} ${y - 210} M${x + 26} ${y - 154} L${x + 28} ${y - 198}`, f, 5) + pth(`M${x - 30} ${y - 194} L${x - 24} ${y - 214} L${x - 18} ${y - 194}Z M${x - 5} ${y - 208} L${x + 1} ${y - 228} L${x + 7} ${y - 208}Z M${x + 22} ${y - 196} L${x + 28} ${y - 216} L${x + 34} ${y - 196}Z`, f);
    case "bolt": return g(pth("M0 -80 L18 -24 L4 -26 L24 40 L-6 -10 L8 -8 Z", P.goldHi), `translate(${x + 10} ${y - 40}) scale(.9) rotate(18)`);
    case "pen": return ln(`M${x} ${y} L${x + 18} ${y - 22}`, f, 3);
    case "puppetCat": return ln(`M${x} ${y} L${x + 4} ${y - 60}`, P.ink3, 4) + g(catShape(P.clayHi), `translate(${x + 4} ${y - 60}) scale(.55)`);
    default: return "";
  }
}

/* figura sentada sobre un taburete */
function seatedFig(o) {
  const stool = o.stool === false ? "" : g(`<rect x="-34" y="-96" width="70" height="8" rx="2" fill="${o.fill || P.ink}"/>` + ln("M-28 -88 L-22 0 M30 -88 L24 0 M-26 -40 L28 -40", o.fill || P.ink, 5), `translate(${o.x} ${o.y}) scale(${o.flip ? -o.s : o.s} ${o.s})`);
  return stool + fig(Object.assign({}, o, { sit: true }));
}

/* niño moderno (prólogo) */
function kid(o) {
  o = Object.assign({ x: 0, y: 0, s: 1, flip: false, fill: "#101820", line: "#2c4656", front: "down" }, o);
  const f = o.fill, L = o.line;
  let s = "";
  s += pth("M-24 -150 C-24 -170 -12 -176 0 -176 C14 -176 26 -170 26 -150 L30 -84 C10 -78 -12 -78 -30 -84Z", f);
  s += ln("M-22 -98 L28 -98", L, 2) + ln("M2 -168 L4 -100", L, 1.3);
  s += pth("M-24 -86 L28 -86 L26 -40 L22 -6 L8 -6 L4 -50 L-4 -50 L-8 -6 L-22 -6 L-26 -40Z", f);
  s += ln("M2 -84 L2 -52", L, 1.3);
  s += pth("M-26 0 L-24 -10 L-6 -10 L4 -4 L4 0Z", f) + pth("M8 0 L10 -10 L28 -10 L36 -4 L36 0Z", f);
  const arm = o.front === "out" ? [[18, -164], [40, -140], [62, -150]] : o.front === "point" ? [[18, -164], [40, -150], [66, -170]] : [[18, -164], [26, -124], [28, -92]];
  s += limb(arm, f, 12) + circ(arm[2][0], arm[2][1], 6, f);
  s += g(pth(HEADS.kid, f) + pth(HAIR.kid, f) + ln("M6 -5 Q10 -8 14 -4", L, 1.2) + circ(10, -5, 1.4, L), "translate(0 -196)");
  s += pth("M-20 -176 C-28 -186 -26 -206 -14 -214 C-22 -200 -18 -186 -10 -176Z", f);
  return g(s, `translate(${o.x} ${o.y}) scale(${o.flip ? -o.s : o.s} ${o.s})`);
}

/* ---------------------------------------------------------------
   NOCTUA (mochuelo) — pies en 0,0, ~150 de alto
   --------------------------------------------------------------- */
function owl(x, y, s = 1, opts = {}) {
  const id = uid("ow");
  const blink = opts.blink !== false;
  let o = "";
  o += `<defs><radialGradient id="${id}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="${P.ink3}"/><stop offset="1" stop-color="${P.ink}"/></radialGradient></defs>`;
  o += pth("M-12 -8 L-18 4 M-12 -8 L-10 5 M-12 -8 L-4 4 M12 -8 L18 4 M12 -8 L10 5 M12 -8 L4 4", "none", `stroke="${P.clayHi}" stroke-width="3" stroke-linecap="round"`);
  o += pth("M-38 -12 C-47 -42 -41 -82 -23 -98 L23 -98 C41 -82 47 -42 38 -12 C26 0 -26 0 -38 -12Z", `url(#${id})`);
  o += pth("M-39 -16 C-52 -42 -48 -80 -29 -94 C-31 -62 -31 -32 -21 -6Z", P.ink2) + pth("M39 -16 C52 -42 48 -80 29 -94 C31 -62 31 -32 21 -6Z", P.ink2);
  for (let i = 0; i < 4; i++) o += ln(`M${-44 + i * 2} ${-70 + i * 14} q8 6 14 4`, P.clay, 1.2) + ln(`M${44 - i * 2} ${-70 + i * 14} q-8 6 -14 4`, P.clay, 1.2);
  const r = rng(7);
  for (let row = 0; row < 5; row++) for (let i = 0; i < 4 - (row % 2); i++) { const sx = -15 + i * 10 + (row % 2) * 5 + (r() - .5) * 3, sy = -74 + row * 12 + (r() - .5) * 3; o += pth(`M${sx - 3} ${sy} Q${sx} ${sy + 4} ${sx + 3} ${sy}`, "none", `stroke="${P.slipDim}" stroke-width="1.6" stroke-linecap="round" opacity=".55"`); }
  o += pth("M-36 -100 C-41 -130 -22 -148 0 -148 C22 -148 41 -130 36 -100 C30 -86 -30 -86 -36 -100Z", P.ink);
  for (let i = 0; i < 9; i++) o += circ(-18 + r() * 36, -140 + r() * 14, 1.5, P.slipDim, `opacity=".8"`);
  o += ell(-15, -112, 17, 16, P.ink2) + ell(15, -112, 17, 16, P.ink2);
  o += pth("M-32 -124 Q-17 -136 -3 -119 Q-17 -128 -31 -119Z", P.slip) + pth("M32 -124 Q17 -136 3 -119 Q17 -128 31 -119Z", P.slip);
  o += pth("M-26 -100 Q-15 -94 -4 -101 Q-15 -96 -26 -100Z", P.slipDim) + pth("M26 -100 Q15 -94 4 -101 Q15 -96 26 -100Z", P.slipDim);
  o += circ(-15, -112, 11, P.gold) + circ(15, -112, 11, P.gold);
  o += `<g class="pupils">${circ(-14, -112, 5.6, P.ink) + circ(16, -112, 5.6, P.ink)}</g>`;
  o += circ(-11, -115, 2, P.slip) + circ(19, -115, 2, P.slip);
  if (blink) o += `<g class="lid">${ell(-15, -112, 12.5, 12.5, P.ink) + ell(15, -112, 12.5, 12.5, P.ink)}</g>`;
  o += pth("M-5 -105 L5 -105 L0 -92Z", P.clayHi);
  const cls = opts.cls ? `class="${opts.cls}"` : "";
  return g(g(o, "", cls), `translate(${x} ${y}) scale(${opts.flip ? -s : s} ${s})`);
}

/* ---------------------------------------------------------------
   DOXA (la villana) — pies en 0,0, ~400 de alto
   --------------------------------------------------------------- */
function doxa(x, y, s = 1) {
  const id = uid("dx"), id2 = uid("dxb");
  let d = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8187"/><stop offset=".6" stop-color="#3c4247"/><stop offset="1" stop-color="#2a2e32" stop-opacity="0"/></linearGradient>
  <filter id="${id2}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>`;
  d += `<g filter="url(#${id2})" class="fogd">${ell(-60, -40, 120, 40, "#6d7378", `opacity=".6"`)}${ell(70, -20, 110, 34, "#80878c", `opacity=".5"`)}</g>`;
  d += pth("M-66 0 C-80 -120 -66 -250 -34 -322 C-22 -352 22 -352 34 -322 C66 -250 80 -120 66 0 C30 12 -30 12 -66 0Z", `url(#${id})`);
  d += pth("M-34 -300 C-90 -280 -120 -250 -150 -230 C-130 -232 -110 -238 -96 -236 C-80 -260 -56 -276 -30 -282Z", "#4f565b");
  d += pth("M34 -300 C90 -280 120 -250 150 -230 C130 -232 110 -238 96 -236 C80 -260 56 -276 30 -282Z", "#4f565b");
  d += ell(-150, -228, 8, 6, "#c9cdd0") + ell(150, -228, 8, 6, "#c9cdd0");
  d += pth("M-36 -296 C-44 -352 -22 -384 0 -386 C22 -384 44 -352 36 -296 C20 -284 -20 -284 -36 -296Z", "#3a4045");
  d += pth("M-28 -372 L-22 -402 L-11 -380 L0 -410 L11 -380 L22 -402 L28 -372 C10 -378 -10 -378 -28 -372Z", "#9aa1a6");
  d += ell(0, -332, 20, 26, "#ece6da");
  d += pth("M-14 -340 Q-8 -348 -2 -340 Q-8 -344 -14 -340Z", P.ink) + pth("M14 -340 Q8 -348 2 -340 Q8 -344 14 -340Z", P.ink);
  d += ln("M-11 -320 Q0 -309 11 -320", P.ink, 2);
  d += ln("M-18 -350 Q0 -360 18 -350", "#b9b2a5", 1.2);
  for (let i = 0; i < 5; i++) d += ln(`M${-40 + i * 20} -260 Q${-44 + i * 22} -150 ${-52 + i * 26} -20`, "#5c6368", 1.4);
  return g(d, `translate(${x} ${y}) scale(${s})`, `class="doxa"`);
}

/* ---------------------------------------------------------------
   ELEMENTOS DE ESCENARIO
   --------------------------------------------------------------- */
function skyGrad(top, bot, mid) {
  const id = uid("sky");
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/>${mid ? `<stop offset=".55" stop-color="${mid}"/>` : ""}<stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-300" y="-300" width="2200" height="1500" fill="url(#${id})"/>`;
}
function glow(x, y, r, color, op = 0.6, cls = "") {
  const id = uid("gl");
  return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs><circle ${cls ? `class="${cls}"` : ""} cx="${x}" cy="${y}" r="${r}" fill="url(#${id})"/>`;
}
function stars(n, seed, x0 = 0, y0 = 0, w = 1600, h = 520, color = P.goldHi) {
  const r = rng(seed); let s = "";
  for (let i = 0; i < n; i++) {
    const big = r() > 0.92;
    s += circ((x0 + r() * w).toFixed(1), (y0 + r() * h).toFixed(1), big ? 2.6 : 1 + r() * 1.2, color, `class="tw" style="animation-delay:${(-r() * 5).toFixed(2)}s" opacity="${(0.4 + r() * 0.6).toFixed(2)}"`);
  }
  return s;
}
function hill(d, fill) { return pth(d, fill); }
function meanderBand(y, h, fill, line) {
  const id = uid("mb");
  const u = h;
  return `<defs><pattern id="${id}" width="${u}" height="${u}" patternUnits="userSpaceOnUse" y="${y}">
    <path d="M0 ${u * .9} H${u} M${u * .05} ${u * .9} V${u * .12} H${u * .82} V${u * .7} H${u * .3} V${u * .38} H${u * .56}" fill="none" stroke="${line}" stroke-width="${u * .1}"/></pattern></defs>
    <rect x="-300" y="${y}" width="2200" height="${u}" fill="${fill}"/><rect x="-300" y="${y}" width="2200" height="${u}" fill="url(#${id})"/>`;
}
function waveBand(y, color, amp = 14, period = 64, cls = "drift") {
  let d = `M-400 ${y}`;
  for (let x = -400; x < 2100; x += period) d += ` c${period * .25} ${-amp} ${period * .5} ${-amp} ${period * .62} ${-amp * .3} c${period * .08} ${amp * .5} ${-period * .14} ${amp * .7} ${-period * .2} ${amp * .25} M${x + period} ${y}`;
  return `<g class="${cls}">${ln(d, color, 3)}</g>`;
}
function sea(y, top = P.sea, bot = P.night2, waveCol = P.slipDim) {
  const id = uid("sea");
  let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-300" y="${y}" width="2200" height="${1000 - y + 300}" fill="url(#${id})"/>`;
  for (let i = 0; i < 4; i++) s += `<g opacity="${0.55 - i * 0.1}">${waveBand(y + 30 + i * 46, waveCol, 10 - i, 70 + i * 16, i % 2 ? "drift2" : "drift")}</g>`;
  return s;
}
function temple(x, y, w, h, fill, opts = {}) {
  const cols = opts.cols || 6, L = opts.line || P.clay;
  const step = h * 0.05, colH = h * 0.6, arch = h * 0.11, ped = h * 0.18;
  let s = "";
  for (let i = 0; i < 3; i++) s += `<rect x="${x - w / 2 - (3 - i) * 8}" y="${y - step * (i + 1)}" width="${w + (3 - i) * 16}" height="${step}" fill="${fill}"/>`;
  const base = y - step * 3, top = base - colH;
  const cw = w / (cols * 1.8);
  for (let i = 0; i < cols; i++) {
    const cx = x - w / 2 + cw * 0.6 + i * ((w - cw * 1.2) / (cols - 1));
    s += pth(`M${cx - cw / 2} ${base} L${cx - cw * 0.42} ${top + 6} L${cx + cw * 0.42} ${top + 6} L${cx + cw / 2} ${base}Z`, fill);
    s += `<rect x="${cx - cw * 0.7}" y="${top}" width="${cw * 1.4}" height="7" fill="${fill}"/>`;
    if (opts.flutes !== false) s += ln(`M${cx - cw * .15} ${base - 4} L${cx - cw * .12} ${top + 10} M${cx + cw * .15} ${base - 4} L${cx + cw * .12} ${top + 10}`, L, 0.8, `opacity=".6"`);
  }
  s += `<rect x="${x - w / 2 - 6}" y="${top - arch}" width="${w + 12}" height="${arch}" fill="${fill}"/>`;
  for (let i = 0; i < cols * 2; i++) s += ln(`M${x - w / 2 + 10 + i * (w - 20) / (cols * 2 - 1)} ${top - arch * .9} l0 ${arch * .45}`, L, 1.1, `opacity=".7"`);
  s += pth(`M${x - w / 2 - 10} ${top - arch} L${x} ${top - arch - ped} L${x + w / 2 + 10} ${top - arch}Z`, fill);
  s += ln(`M${x - w / 2 + 14} ${top - arch - 5} L${x} ${top - arch - ped + 12} L${x + w / 2 - 14} ${top - arch - 5}`, L, 1.1, `opacity=".7"`);
  if (opts.text) s += `<text x="${x}" y="${top - arch * .3}" text-anchor="middle" font-family="Cinzel, serif" font-size="${arch * .5}" letter-spacing="3" fill="${opts.textColor || L}">${opts.text}</text>`;
  return s;
}
function stoa(x, y, w, h, fill, line, n = 12) {
  let s = `<rect x="${x}" y="${y - 10}" width="${w}" height="10" fill="${fill}"/>`;
  const cw = 12;
  for (let i = 0; i < n; i++) { const cx = x + 20 + i * (w - 40) / (n - 1); s += `<rect x="${cx - cw / 2}" y="${y - h}" width="${cw}" height="${h - 10}" fill="${fill}"/><rect x="${cx - cw}" y="${y - h - 6}" width="${cw * 2}" height="6" fill="${fill}"/>`; }
  s += `<rect x="${x - 8}" y="${y - h - 28}" width="${w + 16}" height="22" fill="${fill}"/>` + pth(`M${x - 16} ${y - h - 28} L${x + w / 2} ${y - h - 52} L${x + w + 16} ${y - h - 28}Z`, fill);
  s += ln(`M${x} ${y - h - 17} L${x + w} ${y - h - 17}`, line, 1, `opacity=".6"`);
  return s;
}
function olive(x, y, s, fill, line) {
  let t = pth("M-7 0 C-12 -30 4 -50 -5 -82 C-9 -98 6 -112 2 -124 L11 -122 C13 -102 5 -92 9 -78 C15 -56 4 -30 9 0Z", fill);
  t += pth("M3 -90 C-12 -100 -24 -104 -40 -118 L-34 -122 C-20 -112 -8 -106 4 -100Z", fill);
  const blobs = [[-38, -132, 42, 22], [8, -156, 50, 26], [44, -128, 38, 20], [-12, -116, 30, 15], [24, -176, 30, 17], [-30, -160, 28, 15]];
  for (const b of blobs) t += ell(b[0], b[1], b[2], b[3], fill);
  const r = rng(Math.round(x + y));
  for (let i = 0; i < 16; i++) { const bx = -60 + r() * 120, by = -180 + r() * 70; t += ln(`M${bx} ${by} q6 -4 12 -2`, line, 1, `opacity=".7"`); }
  return g(t, `translate(${x} ${y}) scale(${s})`);
}
function cypress(x, y, s, fill) { return g(pth("M0 0 C-16 -40 -18 -130 0 -220 C18 -130 16 -40 0 0Z", fill), `translate(${x} ${y}) scale(${s})`); }
function ship(x, y, s, fill, line, opts = {}) {
  let k = pth("M-150 0 C-118 30 100 30 140 0 C150 -10 162 -30 152 -50 C148 -30 132 -10 112 -8 L-130 -8 C-150 -14 -162 -26 -176 -46 C-172 -22 -162 -6 -150 0Z", fill);
  k += circ(112, -2, 6, P.slip) + circ(113, -2, 2.6, P.ink);
  k += ln("M-120 6 C-40 14 40 14 120 4", line, 1.4);
  k += ln("M0 -8 L0 -176", fill, 5) + ln("M-86 -166 L86 -166", fill, 4);
  k += pth("M-82 -164 L82 -164 L76 -44 L-76 -44Z", opts.sail || P.slip, `class="sail"`);
  for (let i = -3; i <= 3; i++) k += ln(`M${i * 22} -164 L${i * 20.5} -44`, P.clayLo, 1.2, `opacity=".7"`);
  k += ln("M0 -176 L-140 -10 M0 -176 L140 -12", fill, 1.2);
  if (opts.oars) for (let i = 0; i < 9; i++) k += ln(`M${-100 + i * 24} 8 L${-110 + i * 24} 40`, fill, 3);
  return g(g(k, "", `class="rock"`), `translate(${x} ${y}) scale(${opts.flip ? -s : s} ${s})`);
}
function sunDisk(x, y, r, color = P.goldHi, rays = true) {
  let s = glow(x, y, r * 3, color, 0.45) + circ(x, y, r, color);
  if (rays) for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; s += ln(`M${x + Math.cos(a) * (r + 10)} ${y + Math.sin(a) * (r + 10)} L${x + Math.cos(a) * (r + 30)} ${y + Math.sin(a) * (r + 30)}`, color, 4, `opacity=".8"`); }
  return s;
}
function moon(x, y, r, color = P.slip, bg = P.night) { return glow(x, y, r * 3.2, color, 0.25) + circ(x, y, r, color) + circ(x + r * .42, y - r * .2, r * .9, bg); }
function amphora(x, y, s, fill, line) {
  let a = pth("M-8 -120 L8 -120 L10 -104 C34 -96 40 -60 30 -30 C24 -14 12 -4 8 0 L-8 0 C-12 -4 -24 -14 -30 -30 C-40 -60 -34 -96 -10 -104Z", fill);
  a += ln("M-10 -104 C-26 -104 -30 -80 -24 -70 M10 -104 C26 -104 30 -80 24 -70", fill, 4);
  a += ln("M-30 -48 L30 -48 M-31 -42 L31 -42", line, 1.4) + ln("M-24 -78 L24 -78", line, 1.2);
  return g(a, `translate(${x} ${y}) scale(${s})`);
}
function column(x, y, h, fill, line, w = 34) {
  let c = `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="${fill}"/>`;
  c += `<rect x="${x - w}" y="${y - h - 14}" width="${w * 2}" height="14" fill="${fill}"/>` + pth(`M${x - w * .7} ${y - h} L${x + w * .7} ${y - h} L${x + w / 2} ${y - h + 10} L${x - w / 2} ${y - h + 10}Z`, fill);
  for (let i = 1; i < 4; i++) c += ln(`M${x - w / 2 + i * w / 4} ${y - 4} L${x - w / 2 + i * w / 4} ${y - h + 12}`, line, 1, `opacity=".6"`);
  c += `<rect x="${x - w * .7}" y="${y - 8}" width="${w * 1.4}" height="8" fill="${fill}"/>`;
  return c;
}
function cloud(x, y, s, fill, line) {
  const c = pth("M-90 0 C-110 0 -112 -30 -86 -34 C-88 -60 -50 -70 -36 -50 C-28 -80 20 -84 30 -54 C46 -72 86 -60 80 -30 C108 -30 110 0 88 0Z", fill) + ln("M-60 -20 q10 -12 22 -4 M10 -30 q12 -14 26 -2", line, 1.4);
  return g(c, `translate(${x} ${y}) scale(${s})`);
}
function bolt(x, y, s, color) { return g(pth("M0 -80 L18 -24 L4 -26 L24 40 L-6 -10 L8 -8 Z", color) + pth("M-4 -90 L4 -90 L2 -78Z", color), `translate(${x} ${y}) scale(${s}) rotate(18)`); }
function pyramid(x, y, w, h, fill, line) {
  let p = pth(`M${x - w / 2} ${y} L${x} ${y - h} L${x + w / 2} ${y}Z`, fill);
  for (let i = 1; i < 7; i++) { const yy = y - h * i / 7, hw = w / 2 * (1 - i / 7); p += ln(`M${x - hw} ${yy} L${x + hw} ${yy}`, line, 1, `opacity=".6"`); }
  return p;
}
function horse(x, y, s, fill, line, sleepy = true) {
  let h = ell(0, -150, 112, 46, fill);
  h += pth("M70 -180 C96 -210 120 -238 140 -262 L170 -246 C150 -220 128 -186 104 -150Z", fill);
  h += pth(sleepy ? "M140 -262 C150 -270 168 -268 176 -258 L206 -196 C208 -186 198 -180 190 -184 L160 -232Z" : "M140 -262 C152 -274 170 -270 178 -258 L214 -226 C218 -216 210 -208 200 -212 L162 -236Z", fill);
  h += pth("M146 -270 L150 -292 L160 -268Z", fill);
  h += ln("M98 -192 C110 -214 126 -236 140 -256", line, 1.6) + ln("M92 -186 C106 -210 122 -234 136 -252", line, 1.2);
  h += ln(sleepy ? "M170 -238 q6 4 12 0" : "M172 -246 a3 3 0 1 0 1 0", line, 1.6);
  for (const lx of [-82, -56, 62, 88]) h += limb([[lx, -120], [lx + (lx > 0 ? 6 : -4), -60], [lx + (lx > 0 ? 4 : -2), -6]], fill, 15) + `<rect x="${lx - 10}" y="-10" width="20" height="10" fill="${fill}"/>`;
  h += ln("M-108 -168 C-140 -160 -150 -110 -146 -60", fill, 12);
  h += ln("M-60 -150 C-20 -132 30 -132 70 -150", line, 1.2);
  return g(h, `translate(${x} ${y}) scale(${s})`);
}
function gadfly(x, y, s, fill = P.ink) {
  const b = ell(0, 0, 16, 8, fill) + circ(15, -2, 7, fill) + ell(-2, -10, 14, 6, P.slip, `opacity=".75" class="wing"`) + ell(4, -12, 12, 5, P.slip, `opacity=".6" class="wing"`) + ln("M-6 6 L-12 16 M2 7 L0 18 M8 6 L12 16", fill, 1.6) + circ(19, -4, 2, P.gold);
  return g(g(b, "", `class="buzz"`), `translate(${x} ${y}) scale(${s})`);
}
function catShape(fill) {
  return pth("M-30 0 C-40 -20 -38 -46 -22 -60 C-26 -74 -20 -86 -10 -92 L-6 -112 L4 -96 C10 -97 16 -97 20 -96 L28 -112 L32 -90 C42 -80 42 -64 34 -56 C44 -40 44 -18 36 0 Z", fill)
    + pth("M-28 -6 C-56 -6 -70 -20 -66 -44 C-64 -54 -56 -56 -54 -48 C-58 -30 -48 -16 -26 -16Z", fill);
}
function hoplite(x, y, s, fill, line, flip, shieldType = "round") {
  let h = fig({ x: 0, y: 0, s: 1, fill, line, garment: "short", hair: "none", beard: "short", helmet: true, front: "hold", back: "fwd", props: ["spear"], greaves: true });
  if (shieldType === "round") h += circ(42, -170, 44, fill) + `<circle cx="42" cy="-170" r="36" fill="none" stroke="${line}" stroke-width="1.6"/>` + pth("M30 -180 L54 -180 L42 -150Z", line);
  else h += `<rect x="20" y="-230" width="40" height="110" rx="18" fill="${fill}"/>` + ln("M28 -220 L28 -130 M40 -224 L40 -126 M52 -220 L52 -130", line, 1.2);
  return g(h, `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`);
}
function well(x, y, s, fill, line) {
  return g(`<rect x="-40" y="-40" width="80" height="40" fill="${fill}"/>` + ln("M-40 -26 L40 -26 M-40 -12 L40 -12 M-20 -40 L-20 -26 M10 -40 L10 -26 M-6 -26 L-6 -12 M24 -26 L24 -12", line, 1.2) + ell(0, -40, 40, 8, P.ink) + ln("M-34 -40 L-34 -96 M34 -40 L34 -96 M-40 -96 L40 -96", fill, 5) + ln("M0 -96 L0 -60", fill, 2), `translate(${x} ${y}) scale(${s})`);
}
function fire(x, y, s) {
  return g(glow(0, -40, 260, P.clayHi, 0.55, "fl") + `<g class="fl">${pth("M-50 0 C-60 -40 -30 -60 -20 -110 C-6 -80 4 -86 6 -140 C24 -100 50 -80 40 -36 C56 -50 60 -24 52 0Z", P.clayHi)}${pth("M-30 0 C-34 -30 -14 -44 -8 -80 C4 -56 14 -60 16 -96 C30 -60 40 -40 30 0Z", P.goldHi)}</g>` + ln("M-60 4 L60 -6 M-56 -6 L58 4", P.ink3, 10), `translate(${x} ${y}) scale(${s})`);
}
function hearth(x, y, s) { return fire(x, y, s); }
function lamp(x, y, s) { return g(glow(0, -40, 120, P.goldHi, 0.5, "fl") + pth("M-30 0 C-30 -18 20 -18 36 -10 L48 -14 L44 -4 C30 4 -20 4 -30 0Z", P.ink) + `<g class="fl">${pth("M44 -14 C40 -26 46 -34 48 -44 C52 -34 56 -26 50 -14Z", P.goldHi)}</g>`, `translate(${x} ${y}) scale(${s})`); }
function chain(x1, y1, x2, y2, color) { return ln(`M${x1} ${y1} L${x2} ${y2}`, color, 3, `stroke-dasharray="7 5"`); }
function qmark(x, y, s, color, cls = "") { return `<text x="${x}" y="${y}" font-family="Cinzel, serif" font-weight="700" font-size="${60 * s}" fill="${color}" text-anchor="middle" ${cls ? `class="${cls}"` : ""}>?</text>`; }
function txt(x, y, size, color, str, extra = "") { return `<text x="${x}" y="${y}" font-family="Cinzel, serif" font-size="${size}" fill="${color}" text-anchor="middle" letter-spacing="2" ${extra}>${str}</text>`; }
function rock(d, fill) { return pth(d, fill); }

/* ---------------------------------------------------------------
   ICONOS de tarjetas y llaves (24x24 aprox, centrados en 0,0)
   --------------------------------------------------------------- */
function icon(name, c = P.ink, c2 = P.clay) {
  switch (name) {
    case "eye": return pth("M-22 0 C-12 -14 12 -14 22 0 C12 14 -12 14 -22 0Z", "none", `stroke="${c}" stroke-width="3.5"`) + circ(0, 0, 7, c) + pth("M0 -24 L2 -18 L8 -18 L3 -14 L5 -8 L0 -12 L-5 -8 L-3 -14 L-8 -18 L-2 -18Z", c);
    case "question": return `<text x="0" y="14" font-family="Cinzel, serif" font-weight="700" font-size="46" text-anchor="middle" fill="${c}">?</text>`;
    case "sun": { let s = circ(0, 0, 9, c); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += ln(`M${Math.cos(a) * 13} ${Math.sin(a) * 13} L${Math.cos(a) * 21} ${Math.sin(a) * 21}`, c, 3.5); } return s; }
    case "scale": return ln("M0 -18 L0 18 M-14 18 L14 18 M-20 -12 L20 -12 M-20 -12 L-26 4 M-20 -12 L-14 4 M20 -12 L14 4 M20 -12 L26 4", c, 3) + pth("M-28 4 Q-20 12 -12 4Z", c) + pth("M12 4 Q20 12 28 4Z", c);
    case "lamp": return pth("M-20 8 C-20 -2 10 -2 20 2 L28 0 L24 8 C12 14 -12 14 -20 8Z", c) + pth("M24 -2 C22 -10 26 -16 27 -22 C30 -16 32 -10 29 -2Z", c);
    case "mirror": return `<circle cx="0" cy="-4" r="14" fill="none" stroke="${c}" stroke-width="3.5"/>` + ln("M0 10 L0 22 M-8 22 L8 22", c, 3.5);
    case "wave": return ln("M-22 4 C-14 -10 -6 -10 0 2 C6 14 14 14 22 0", c, 4) + ln("M-22 -8 C-14 -18 -6 -18 0 -8", c, 2.5, `opacity=".6"`);
    case "astrolabe": return `<circle cx="0" cy="0" r="16" fill="none" stroke="${c}" stroke-width="3"/><circle cx="0" cy="0" r="8" fill="none" stroke="${c}" stroke-width="2"/>` + ln("M-20 -20 L20 20", c, 3) + circ(0, -20, 3, c);
    case "doubt": return `<text x="-6" y="12" font-family="Cinzel, serif" font-weight="700" font-size="34" text-anchor="middle" fill="${c}">?</text><text x="10" y="12" font-family="Cinzel, serif" font-weight="700" font-size="24" text-anchor="middle" fill="${c}" opacity=".6">?</text>`;
    case "globe": return `<circle cx="0" cy="0" r="17" fill="none" stroke="${c}" stroke-width="3"/>` + ln("M-17 0 L17 0 M0 -17 C-10 -6 -10 6 0 17 M0 -17 C10 -6 10 6 0 17", c, 2);
    case "quake": return ln("M-22 10 L-12 -2 L-4 8 L4 -8 L12 4 L22 -6", c, 3.5) + ln("M-22 18 L22 18", c, 3);
    case "stars": return pth("M-10 -14 L-8 -8 L-2 -8 L-7 -4 L-5 2 L-10 -2 L-15 2 L-13 -4 L-18 -8 L-12 -8Z", c) + pth("M12 -2 L14 4 L20 4 L15 8 L17 14 L12 10 L7 14 L9 8 L4 4 L10 4Z", c) + circ(4, -16, 2.5, c);
    case "rainbow": return ln("M-22 10 A22 22 0 0 1 22 10", c, 3.5) + ln("M-15 10 A15 15 0 0 1 15 10", c2, 3.5) + ln("M-8 10 A8 8 0 0 1 8 10", c, 3.5);
    case "pyramid": return pth("M-22 14 L0 -18 L22 14Z", "none", `stroke="${c}" stroke-width="3.5" stroke-linejoin="round"`) + ln("M26 14 L26 -2 M26 14 L36 14", c, 3) + circ(-16, -18, 4, c);
    case "bolt": return pth("M4 -22 L-10 2 L0 2 L-6 22 L10 -4 L0 -4Z", c);
    case "drop": return pth("M0 -22 C8 -8 16 2 16 8 C16 18 8 22 0 22 C-8 22 -16 18 -16 8 C-16 2 -8 -8 0 -22Z", c);
    case "ship": return pth("M-22 6 L22 6 L16 14 L-16 14Z", c) + ln("M0 6 L0 -20", c, 3) + pth("M2 -18 L16 -2 L2 -2Z", c) + circ(-12, -16, 2.5, c);
    default: return circ(0, 0, 10, c);
  }
}

/* ---------------------------------------------------------------
   LLAVE dorada
   --------------------------------------------------------------- */
function keySvg(iconName, size = 160, dim = false) {
  const id = uid("k"), id2 = uid("kg");
  const fill = dim ? "#5a4434" : `url(#${id})`;
  const line = dim ? "#7a5c44" : P.goldLo;
  return `<svg viewBox="-80 -80 160 220" width="${size}" height="${size * 1.375}" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.goldHi}"/><stop offset=".5" stop-color="${P.gold}"/><stop offset="1" stop-color="${P.goldLo}"/></linearGradient>
  <radialGradient id="${id2}"><stop offset="0" stop-color="${P.goldHi}" stop-opacity=".55"/><stop offset="1" stop-color="${P.goldHi}" stop-opacity="0"/></radialGradient></defs>
  ${dim ? "" : `<circle cx="0" cy="0" r="78" fill="url(#${id2})"/>`}
  <circle cx="0" cy="0" r="44" fill="${fill}"/><circle cx="0" cy="0" r="34" fill="${dim ? "#241911" : P.ink}"/>
  <circle cx="0" cy="0" r="39" fill="none" stroke="${line}" stroke-width="2" stroke-dasharray="4 4"/>
  <g transform="scale(1.05)">${icon(iconName, dim ? "#7a5c44" : P.goldHi, dim ? "#7a5c44" : P.gold)}</g>
  <rect x="-7" y="40" width="14" height="96" rx="3" fill="${fill}"/>
  <path d="M7 86 H34 V100 H20 V112 H34 V126 H7Z" fill="${fill}"/>
  <path d="M-7 60 h-10 v10 h10" fill="${fill}"/>
  </svg>`;
}

/* ---------------------------------------------------------------
   MONEDAS (anverso con el perfil del pensador)
   --------------------------------------------------------------- */
const LOOKS = {
  tales:    { hair: "cap", beard: "long", nose: "straight" },
  socrates: { hair: "bald", beard: "full", nose: "snub" },
  platon:   { hair: "curly", beard: "long", nose: "straight" }
};
function coinSvg(ch, size = 120, state = "done") {
  return `<svg viewBox="-62 -62 124 124" width="${size}" height="${size}" aria-hidden="true" class="coin-svg">${coinInner(ch, state)}</svg>`;
}
function coinInner(ch, state = "done") {
  const id = uid("c"), id2 = uid("cp");
  const locked = state !== "done";
  const METALS = { tales: ["#f5ebbd", "#cfb766", "#7e6a2c"], socrates: ["#f7f7f2", "#c3c7c8", "#666d71"], owlcoin: ["#f7f7f2", "#c3c7c8", "#666d71"] };
  const met = locked ? ["#4a3a2c", "#2c2119", "#3b2d22"] : (METALS[ch.id] || ["#f6d98b", "#d29f45", "#9b6a26"]);
  let beads = "";
  for (let i = 0; i < 40; i++) { const a = i * Math.PI / 20; beads += circ((Math.cos(a) * 54).toFixed(2), (Math.sin(a) * 54).toFixed(2), 2.1, locked ? "#5a4636" : met[0]); }
  let face = "";
  const look = LOOKS[ch.id];
  if (!locked && look) face = g(headGroup(Object.assign({}, look), met[2], met[0]), "translate(-5 4) scale(1.5)");
  else if (!locked && ch.id === "owlcoin") face = owl(0, 30, 0.36, { blink: false });
  else if (!locked && ch.id === "you") face = `<text x="0" y="12" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="${ch.label && ch.label.length > 6 ? 16 : 22}" fill="${met[2]}">${ch.label || ""}</text>`;
  else face = `<text x="0" y="16" text-anchor="middle" font-family="Cinzel, serif" font-weight="700" font-size="44" fill="${locked ? "#6b5442" : met[2]}">?</text>`;
  const legend = locked ? "" : `<defs><path id="${id2}" d="M-40 0 A40 40 0 1 1 40 0 A40 40 0 1 1 -40 0"/></defs><text font-family="Cinzel, serif" font-size="11" letter-spacing="3" fill="${met[2]}" font-weight="700"><textPath href="#${id2}" startOffset="${ch.greek && ch.greek.length > 7 ? "14%" : "19%"}">${ch.greek || ""}</textPath></text>`;
  return `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${met[0]}"/><stop offset=".55" stop-color="${met[1]}"/><stop offset="1" stop-color="${met[2]}"/></radialGradient></defs>
  <circle r="60" fill="url(#${id})"/>${beads}<circle r="48" fill="none" stroke="${locked ? "#5a4636" : met[0]}" stroke-width="1.4"/>
  ${legend}${face}`;
}

/* ---------------------------------------------------------------
   ESCENAS (viewBox 1600x900). Cada una devuelve el contenido SVG.
   --------------------------------------------------------------- */
const SCENES = {
  /* ---------- PORTADA ---------- */
  title() {
    let s = skyGrad("#0a1219", P.night2, "#0f2230");
    s += stars(140, 11, 0, 0, 1600, 560);
    s += moon(1280, 170, 52, P.slip, "#0f2230");
    s += hill("M-300 900 L-300 700 C0 650 200 640 420 600 C560 572 700 560 820 600 C980 650 1200 640 1400 600 C1600 560 1800 620 1900 650 L1900 900Z", "#2a160c");
    s += hill("M380 640 C420 560 520 520 640 520 L1060 520 C1160 530 1220 580 1260 640Z", P.clayDk);
    s += temple(830, 522, 420, 260, P.clay, { cols: 8, line: P.ink });
    s += olive(260, 690, 1.3, P.clayLo, P.ink) + olive(1450, 660, 1.1, P.clayLo, P.ink) + cypress(140, 700, 1.2, "#3b1d0e") + cypress(1560, 690, 1.0, "#3b1d0e");
    s += column(1230, 900, 220, P.clayDk, P.ink, 46);
    s += g(owl(1230, 666, 1.55, { cls: "bob" }), "", `class="hero-owl"`);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  /* ---------- PRÓLOGO ---------- */
  room() {
    let s = skyGrad("#0b1620", "#132433");
    s += `<rect x="900" y="110" width="420" height="380" rx="6" fill="#0a121a"/>`;
    s += stars(40, 3, 910, 120, 400, 360, "#e9dcc0") + moon(1200, 230, 40, "#efe4cb", "#0a121a");
    s += pth("M900 380 L960 330 L1010 360 L1080 300 L1140 350 L1200 320 L1320 380 L1320 490 L900 490Z", "#070d13");
    s += ln("M1110 110 L1110 490 M900 300 L1320 300", "#1c2d3b", 10) + `<rect x="900" y="110" width="420" height="380" rx="6" fill="none" stroke="#1c2d3b" stroke-width="14"/>`;
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#0e1a24"/>`;
    s += glow(560, 470, 420, "#f2c46a", 0.38, "fl");
    s += `<rect x="260" y="560" width="700" height="24" fill="#20313f"/><rect x="290" y="584" width="24" height="200" fill="#1a2834"/><rect x="900" y="584" width="24" height="200" fill="#1a2834"/>`;
    s += `<rect x="600" y="584" width="280" height="80" fill="#1a2834"/><rect x="620" y="664" width="240" height="40" fill="#24384a" transform="skewX(-8)"/>`;
    s += pth("M420 560 L440 440 L480 420 L470 410 L420 430 L400 560Z", "#24384a") + pth("M450 420 L560 470 L540 500 L430 440Z", "#f4d38a", `opacity=".9"`);
    s += pth("M450 430 L700 560 L360 560Z", "#f6d27a", `opacity=".12"`);
    s += kid({ x: 1040, y: 760, s: 1.6, flip: true, front: "out", fill: "#0a1118", line: "#2b4252" });
    s += glow(700, 676, 90, P.goldHi, 0.9, "fl") + `<ellipse cx="700" cy="676" rx="34" ry="12" fill="${P.gold}"/><ellipse cx="700" cy="672" rx="34" ry="12" fill="${P.goldHi}"/>`;
    return s;
  },
  owlAwakes() {
    let s = skyGrad("#0b141c", "#1b120c");
    s += glow(800, 470, 520, P.goldHi, 0.35, "fl");
    const r = rng(3);
    for (let i = 0; i < 30; i++) s += circ(800 + (r() - .5) * 1100, 450 + (r() - .5) * 700, 2 + r() * 3, P.goldHi, `class="tw" style="animation-delay:${(-r() * 3).toFixed(2)}s"`);
    s += g(coinInner({ id: "owlcoin", greek: "ΑΘΕ" }, "done"), "translate(800 610) scale(2.6)");
    s += owl(800, 400, 2.1, { cls: "bob" });
    return s;
  },
  doxa() {
    let s = skyGrad("#1b1f23", "#0d0f11");
    s += g(temple(380, 720, 360, 230, "#3a3f44", { cols: 6, line: "#2a2e32" }), "", `opacity=".55"`);
    s += g(temple(1250, 700, 300, 200, "#3a3f44", { cols: 5, line: "#2a2e32" }), "", `opacity=".35"`);
    const r = rng(40);
    for (let i = 0; i < 14; i++) s += qmark((120 + r() * 1360).toFixed(0), (160 + r() * 480).toFixed(0), 0.6 + r() * 0.9, P.clayHi, "dissolve").replace(`class="dissolve"`, `class="dissolve" style="animation-delay:${(-r() * 6).toFixed(2)}s"`);
    s += `<rect x="-300" y="720" width="2200" height="400" fill="#141719"/>`;
    s += doxa(820, 800, 1.45);
    s += fogLayer(5, 0.55);
    return s;
  },
  portal() {
    let s = skyGrad("#081016", "#16110c");
    s += stars(120, 21);
    const id = uid("pt");
    s += `<defs><radialGradient id="${id}"><stop offset="0" stop-color="${P.goldHi}"/><stop offset=".35" stop-color="${P.clayHi}" stop-opacity=".9"/><stop offset="1" stop-color="${P.clay}" stop-opacity="0"/></radialGradient></defs>`;
    s += `<circle cx="960" cy="420" r="330" fill="url(#${id})" class="fl"/>`;
    for (let i = 0; i < 4; i++) s += `<circle class="${i % 2 ? "spin" : "spinr"}" cx="960" cy="420" r="${250 - i * 52}" fill="none" stroke="${i % 2 ? P.ink : P.goldHi}" stroke-width="${10 - i * 1.5}" stroke-dasharray="${26 - i * 4} ${14 - i * 2}" opacity=".85"/>`;
    s += `<rect x="-300" y="760" width="2200" height="400" fill="#120c08"/>`;
    s += kid({ x: 430, y: 780, s: 1.55, front: "point", fill: "#0b0806", line: "#3b2a1c" });
    s += owl(590, 560, 1.2, { cls: "bob" });
    return s;
  },

  /* ---------- CAP 1 · TALES ---------- */
  miletus() {
    let s = skyGrad(P.clayHi, P.clay, "#d77840");
    s += sunDisk(1300, 170, 60, P.goldHi, false);
    s += hill("M-300 560 C100 470 400 480 700 520 C900 545 1100 470 1400 440 C1600 420 1800 460 1900 480 L1900 600 L-300 600Z", P.clayLo);
    s += temple(1180, 470, 260, 180, P.ink, { cols: 6 });
    for (let i = 0; i < 9; i++) { const x = 260 + i * 92, y = 540 - (i % 3) * 10; s += `<rect x="${x}" y="${y - 50}" width="70" height="50" fill="${P.ink}"/>` + pth(`M${x - 6} ${y - 50} L${x + 35} ${y - 74} L${x + 76} ${y - 50}Z`, P.ink) + `<rect x="${x + 28}" y="${y - 30}" width="14" height="30" fill="${P.clayLo}"/>`; }
    s += cypress(1440, 470, 0.8, P.ink) + cypress(1490, 476, 0.6, P.ink);
    s += sea(580, "#9b4a22", "#5e2a13", P.ink);
    s += ship(520, 700, 1.2, P.ink, P.clay, { oars: true });
    s += ship(1150, 640, 0.7, P.ink, P.clay, { flip: true });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  gods() {
    let s = skyGrad("#d98448", P.clay);
    s += cloud(1180, 200, 1.3, P.slip, P.clayLo);
    s += fig({ x: 470, y: 470, s: 1.15, front: "up", back: "fwd", hair: "long", beard: "long", props: ["bolt"] });
    s += cloud(470, 500, 2.4, P.slip, P.clayLo);
    s += bolt(700, 300, 1.6, P.goldHi) + bolt(980, 380, 1.1, P.goldHi);
    s += sea(640, P.clayLo, "#5e2a13", P.ink);
    s += fig({ x: 1130, y: 840, s: 1.2, flip: true, front: "staff", hair: "long", beard: "full", props: ["trident"] });
    s += ln("M150 720 L210 690 L240 730 L300 700 M180 790 L260 760 L300 800", P.ink, 5);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  thalesStars() {
    let s = skyGrad("#070d12", "#14222c");
    s += stars(170, 5, 0, 0, 1600, 640);
    const um = [[1020, 120], [1060, 170], [1120, 196], [1190, 214], [1230, 270], [1310, 264], [1286, 210]];
    s += ln("M" + um.map(p => p.join(" ")).join(" L") + " L1190 214", P.goldHi, 1.4, `opacity=".55"`);
    um.forEach((p, i) => s += circ(p[0], p[1], i === 0 ? 7 : 4.2, P.goldHi, i === 0 ? `class="tw"` : ""));
    s += glow(1020, 120, 40, P.goldHi, 0.6);
    s += hill("M-300 900 L-300 720 C200 690 500 700 900 730 C1200 750 1500 720 1900 700 L1900 900Z", "#1d120b");
    s += well(1150, 760, 1.4, P.clay, P.ink);
    s += fig({ x: 700, y: 790, s: 1.35, fill: P.clay, line: P.ink, front: "up", tilt: -22, props: [], back: "down" });
    s += g(ln("M0 -330 L10 0", P.clay, 6), "translate(650 790) scale(1.35)");
    s += owl(1150, 620, 0.8);
    return s;
  },
  pyramid() {
    let s = skyGrad("#e7a061", "#d27a40");
    s += sunDisk(280, 160, 56, P.goldHi, true);
    s += hill("M-300 900 L-300 700 L1900 700 L1900 900Z", "#b8622f");
    s += pyramid(980, 700, 640, 400, P.ink, P.clay);
    s += pth("M1300 700 L760 700 L1660 760 L1900 760Z", P.ink, `opacity=".25"`);
    s += ln("M1300 700 L1680 760", P.ink, 3, `stroke-dasharray="12 10"`);
    s += fig({ x: 400, y: 700, s: 0.9, front: "staff", props: [], back: "hip" });
    s += ln("M452 470 L460 700", P.ink, 5);
    s += pth("M460 700 L620 728 L600 732 L456 704Z", P.ink, `opacity=".4"`);
    s += ln("M280 160 L460 470 L620 728", P.goldHi, 2, `stroke-dasharray="8 8" opacity=".8"`);
    s += ln("M280 160 L980 300 L1680 760", P.goldHi, 2, `stroke-dasharray="8 8" opacity=".5"`);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  battle() {
    let s = `<rect x="-300" y="-300" width="2200" height="1500" class="ecl-sky" fill="${P.clayHi}"/>`;
    s += hill("M-300 900 L-300 690 C300 660 900 670 1900 690 L1900 900Z", P.clayLo);
    for (let i = 0; i < 6; i++) s += hoplite(80 + i * 70, 720 + (i % 2) * 14, 0.62, P.ink, P.clay, false, "round");
    for (let i = 0; i < 6; i++) s += hoplite(1520 - i * 70, 720 + (i % 2) * 14, 0.62, P.ink, P.clay, true, "rect");
    return s;
  },

  /* ---------- CAP 2 · SÓCRATES ---------- */
  agora() {
    let s = skyGrad("#e39a5c", P.clay);
    s += hill("M-300 520 C300 470 900 480 1900 500 L1900 600 L-300 600Z", P.clayLo);
    s += g(temple(1300, 420, 240, 150, P.clayDk, { cols: 6, line: P.clay }), "", `opacity=".9"`);
    s += stoa(-40, 640, 900, 230, P.ink, P.clay, 14);
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#b9602d"/>`;
    s += ln("M-300 700 L1900 700", P.clayLo, 2, `opacity=".6"`);
    s += amphora(1180, 740, 0.9, P.ink, P.clay) + amphora(1240, 744, 0.8, P.ink, P.clay) + `<rect x="1150" y="744" width="200" height="12" fill="${P.ink}"/>` + ln("M1160 756 L1160 800 M1340 756 L1340 800", P.ink, 6);
    s += fig({ x: 330, y: 820, s: 0.95, front: "chin", hair: "cap", beard: "short" });
    s += fig({ x: 1440, y: 820, s: 0.95, flip: true, front: "out", hair: "curly", beard: "none" });
    s += fig({ x: 780, y: 840, s: 1.25, front: "out", hair: "bald", beard: "full", nose: "snub", back: "down" });
    s += qmark(900, 470, 1.2, P.ink, "bob");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  parents() {
    let s = skyGrad("#e19657", P.clay);
    s += `<rect x="-300" y="720" width="2200" height="400" fill="#b65d2b"/>`;
    s += `<rect x="770" y="80" width="60" height="800" fill="${P.ink}" opacity=".18"/>`;
    s += `<rect x="440" y="610" width="180" height="120" fill="${P.slipDim}"/>` + ln("M470 640 L520 690 M560 630 L590 700", P.clayLo, 2);
    s += fig({ x: 330, y: 800, s: 1.1, garment: "short", front: "give", back: "fwd", props: ["hammer"], beard: "short" });
    s += fig({ x: 1150, y: 800, s: 1.1, garment: "peplos", hair: "bun", beard: "none", nose: "female", skin: P.slip, front: "hold", back: "fwd", props: ["baby"] });
    s += glow(1260, 590, 70, P.goldHi, 0.7, "fl");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  delphi() {
    let s = skyGrad("#d88a52", "#b9602d");
    s += hill("M-300 700 L200 300 L420 420 L640 200 L900 460 L1180 260 L1500 520 L1900 400 L1900 900 L-300 900Z", P.clayLo);
    s += hill("M-300 900 L-300 700 C300 640 900 650 1900 700 L1900 900Z", P.clayDk);
    s += temple(1040, 690, 520, 330, P.ink, { cols: 6, text: "ΓΝΩΘΙ ΣΑΥΤΟΝ", textColor: P.clayHi });
    s += g(`<path d="M-40 0 L-20 -90 L20 -90 L40 0 M-26 -60 L26 -60" fill="none" stroke="${P.ink}" stroke-width="6"/>` + ell(0, -96, 50, 10, P.ink), "translate(1040 690)");
    s += seatedFig({ x: 1040, y: 596, s: 0.62, fill: P.ink, garment: "peplos", hair: "bun", beard: "none", nose: "female", skin: P.slip, front: "out", stool: false });
    for (let i = 0; i < 3; i++) s += `<path class="smoke" style="animation-delay:${-i * 1.3}s" d="M${1020 + i * 20} 590 C${990 + i * 20} 540 ${1060 + i * 20} 500 ${1030 + i * 20} 440" fill="none" stroke="${P.slip}" stroke-width="5" opacity=".5"/>`;
    s += fig({ x: 520, y: 840, s: 1.1, front: "out", hair: "cap", beard: "short", tilt: -6 });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  craftsmen() {
    let s = skyGrad("#e39a5c", P.clay);
    s += `<rect x="-300" y="720" width="2200" height="400" fill="#b65d2b"/>`;
    s += g(`<ellipse cx="0" cy="-60" rx="60" ry="10" fill="${P.ink}"/><rect x="-6" y="-60" width="12" height="60" fill="${P.ink}"/>` + pth("M-24 -70 C-34 -100 -26 -130 -10 -140 L10 -140 C26 -130 34 -100 24 -70Z", P.clayLo), "translate(330 790)");
    s += seatedFig({ x: 230, y: 800, s: 0.75, front: "give", garment: "short", hair: "cap", beard: "short" });
    s += fig({ x: 800, y: 800, s: 0.85, front: "hold", props: ["lyre"], hair: "long", beard: "short" });
    s += `<rect x="1180" y="640" width="200" height="40" fill="${P.ink}"/><rect x="1150" y="680" width="260" height="40" fill="${P.ink}"/>`;
    s += fig({ x: 1280, y: 640, s: 0.8, front: "up", hair: "cap", beard: "long" });
    s += fig({ x: 560, y: 840, s: 1.0, flip: true, front: "chin", hair: "bald", beard: "full", nose: "snub" });
    s += qmark(340, 470, 1, P.ink, "bob") + qmark(820, 420, 1, P.ink, "bob") + qmark(1280, 300, 1, P.ink, "bob");
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  gadfly() {
    let s = skyGrad("#e7a061", P.clay);
    s += hill("M-300 900 L-300 720 C300 700 900 700 1900 720 L1900 900Z", "#b65d2b");
    s += g(temple(760, 520, 520, 300, P.clayLo, { cols: 8, line: P.clay }), "", `opacity=".55"`);
    s += horse(860, 770, 1.6, P.ink, P.clay, true);
    s += txt(1260, 330, 46, P.ink, "z z Z", `class="bob" font-style="italic"`);
    s += gadfly(1000, 410, 2.1);
    s += fig({ x: 300, y: 820, s: 1.05, front: "point", hair: "bald", beard: "full", nose: "snub", back: "down" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  trial() {
    let s = skyGrad("#c86e3a", "#9b4a22");
    s += stoa(100, 640, 1400, 300, P.ink, P.clay, 16);
    s += `<rect x="-300" y="640" width="2200" height="400" fill="#8a3f1c"/>`;
    for (let i = 0; i < 9; i++) s += fig({ x: 140 + i * 90, y: 760, s: 0.55, front: i % 2 ? "out" : "down", hair: i % 3 ? "cap" : "curly", beard: i % 2 ? "short" : "long", flip: false });
    s += amphora(1060, 780, 0.8, P.ink, P.clay) + amphora(1160, 780, 0.8, P.ink, P.clay);
    for (let i = 0; i < 6; i++) s += circ(1050 + i * 22, 790 + (i % 2) * 6, 5, P.slipDim);
    s += fig({ x: 1380, y: 830, s: 1.1, flip: true, front: "out", hair: "bald", beard: "full", nose: "snub" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  prison() {
    let s = skyGrad("#1a120d", "#2a1a10");
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) s += `<rect x="${-100 + c * 200 + (r % 2) * 100}" y="${r * 100}" width="196" height="96" fill="#2b1c13" opacity=".7"/>`;
    s += `<rect x="1080" y="160" width="220" height="200" fill="#16303f"/>` + stars(20, 9, 1080, 160, 220, 200, "#efe4cb");
    s += glow(1190, 260, 300, "#9fc3d8", 0.22);
    s += ln("M1120 160 L1120 360 M1165 160 L1165 360 M1210 160 L1210 360 M1255 160 L1255 360", "#0c0806", 9);
    s += `<rect x="-300" y="760" width="2200" height="300" fill="#140d09"/>`;
    s += `<rect x="560" y="660" width="360" height="26" fill="${P.clayDk}"/>` + ln("M590 686 L590 770 M890 686 L890 770", P.clayDk, 10);
    s += seatedFig({ x: 700, y: 760, s: 1.05, fill: P.clay, line: P.ink, hair: "bald", beard: "full", nose: "snub", front: "chin", stool: false });
    s += fig({ x: 1080, y: 780, s: 1.05, flip: true, fill: P.clay, line: P.ink, front: "out", hair: "cap", beard: "short", back: "down" });
    s += lamp(400, 700, 1.4);
    return s;
  },

  /* ---------- CAP 3 · PLATÓN ---------- */
  palaestra() {
    let s = skyGrad("#e8a464", "#cf743c");
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#e2b27a"/>` + ln("M-300 700 L1900 700", P.clayLo, 2);
    s += column(180, 700, 420, P.ink, P.clay, 40) + column(1420, 700, 420, P.ink, P.clay, 40);
    s += g(fig({ x: 0, y: 0, s: 1.25, garment: "short", build: 1.45, front: "hug", back: "fwd", hair: "curly", beard: "short", tilt: 14 }), "translate(700 800) rotate(14)");
    s += g(fig({ x: 0, y: 0, s: 1.15, flip: true, garment: "short", front: "hug", back: "fwd", hair: "cap", beard: "none", tilt: 14 }), "translate(840 800) rotate(-14)");
    s += txt(700, 330, 34, P.ink, "«ΠΛΑΤΩΝ»", `font-weight="700"`);
    s += fig({ x: 1220, y: 800, s: 0.95, flip: true, front: "hold", props: ["fork"], hair: "cap", beard: "long" });
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  voyage() {
    let s = skyGrad("#e7a061", "#d27a40");
    s += sunDisk(260, 200, 50, P.goldHi, false);
    s += hill("M900 560 L1120 360 L1180 380 L1220 340 L1460 560Z", P.clayLo) + hill("M800 580 C1000 540 1400 540 1700 580Z", P.clayLo);
    for (let i = 0; i < 3; i++) s += `<path class="smoke" style="animation-delay:${-i * 1.6}s" d="M${1180 + i * 10} 350 C${1150 + i * 10} 300 ${1230 + i * 10} 250 ${1190 + i * 10} 180" fill="none" stroke="${P.ink}" stroke-width="10" opacity=".45"/>`;
    s += sea(570, "#9b4a22", "#5e2a13", P.ink);
    s += ship(560, 700, 1.4, P.ink, P.clay, {});
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  academy() {
    let s = skyGrad("#e39a5c", P.clay);
    s += `<rect x="-300" y="700" width="2200" height="400" fill="#b9602d"/>`;
    s += olive(140, 720, 1.6, P.ink, P.clay) + olive(1480, 720, 1.5, P.ink, P.clay) + olive(1180, 690, 1.0, P.clayDk, P.clay);
    s += `<rect x="560" y="300" width="22" height="400" fill="${P.ink}"/><rect x="1020" y="300" width="22" height="400" fill="${P.ink}"/><rect x="540" y="270" width="522" height="40" fill="${P.ink}"/>`;
    s += txt(801, 298, 20, P.clayHi, "ΑΓΕΩΜΕΤΡΗΤΟΣ ΜΗΔΕΙΣ ΕΙΣΙΤΩ");
    s += fig({ x: 800, y: 800, s: 1.3, front: "up", hair: "curly", beard: "long", build: 1.3, back: "down", props: [] });
    s += seatedFig({ x: 470, y: 800, s: 0.85, front: "chin", hair: "cap", beard: "none" });
    s += seatedFig({ x: 1130, y: 800, s: 0.85, flip: true, front: "hold", props: ["scroll"], hair: "curly", beard: "short" });
    s += ln("M600 770 m-40 0 a40 14 0 1 0 80 0 a40 14 0 1 0 -80 0 M940 784 L990 754 L1030 784Z", P.clayLo, 2.5);
    s += meanderBand(860, 40, P.ink, P.clay);
    return s;
  },
  writing() {
    let s = skyGrad("#150e0a", "#24170f");
    s += glow(620, 560, 520, P.clayHi, 0.35, "fl");
    s += `<rect x="-300" y="760" width="2200" height="300" fill="#100a07"/>`;
    s += `<rect x="560" y="640" width="380" height="20" fill="${P.clayDk}"/>` + ln("M590 660 L590 770 M910 660 L910 770", P.clayDk, 10);
    s += lamp(620, 640, 1.3);
    s += `<rect x="760" y="618" width="120" height="22" rx="3" fill="${P.slip}"/>` + ln("M772 626 L860 626 M772 632 L850 632", P.ink, 1.2);
    s += seatedFig({ x: 1060, y: 770, s: 1.1, flip: true, fill: P.clay, line: P.ink, front: "write", props: ["pen"], hair: "curly", beard: "long", build: 1.3 });
    s += g(fig({ x: 0, y: 0, s: 1, fill: "none", line: P.clayHi, front: "out", hair: "bald", beard: "full", nose: "snub" }).replace(/fill="none"/g, `fill="${P.clayHi}" fill-opacity=".14"`), "translate(380 740) scale(1.1)", `class="ghost"`);
    return s;
  },
  caveIntro() {
    let s = skyGrad("#0a0705", "#160e09");
    s += pth("M1300 -50 L1650 -50 L1650 300 C1550 260 1420 200 1300 120Z", "#f0c27a", `opacity=".85"`);
    s += glow(1500, 60, 340, P.goldHi, 0.5);
    s += pth("M-300 -300 L1900 -300 L1900 120 C1600 120 1500 200 1320 260 C1150 320 1000 260 900 300 C700 380 400 280 120 300 L-300 300Z", "#24160d");
    s += pth("M-300 1200 L-300 760 C200 740 900 720 1300 700 C1500 690 1700 660 1900 600 L1900 1200Z", "#1a100a");
    s += fire(1180, 640, 1.2);
    s += `<rect x="560" y="580" width="560" height="70" fill="#2c1b10"/>`;
    s += fig({ x: 760, y: 660, s: 0.7, fill: P.clay, line: P.ink, front: "up", props: [], back: "down", garment: "short", hair: "cap", beard: "short", flip: true });
    s += pth("M770 420 L800 380 L840 400 L830 430Z", P.clayHi);
    s += fig({ x: 960, y: 660, s: 0.7, fill: P.clay, line: P.ink, front: "up", props: [], back: "down", garment: "short", hair: "curly", beard: "none", flip: true });
    s += g(catShape(P.clayHi), "translate(948 410) scale(.5)");
    s += pth("M40 300 C40 300 60 700 40 760 L-300 760 L-300 300Z", "#3a2416");
    s += g(catShape("#0b0705"), "translate(170 560) scale(2.2)", `opacity=".85"`);
    s += pth("M300 470 L360 380 L430 430 L400 500Z", "#0b0705", `opacity=".8"`);
    for (let i = 0; i < 4; i++) s += seatedFig({ x: 340 + i * 120, y: 770, s: 0.6, fill: P.clay, line: P.ink, flip: true, front: "down", hair: i % 2 ? "curly" : "cap", beard: i % 2 ? "none" : "short", stool: false });
    s += chain(280, 760, 760, 760, P.ink3);
    return s;
  },
  caveWall() {
    let s = skyGrad("#1a0f08", "#0c0705");
    s += pth("M-300 -300 L1900 -300 L1900 1200 L-300 1200Z", "#221409");
    const id = uid("wl");
    s += `<defs><radialGradient id="${id}" cx=".55" cy=".45" r=".7"><stop offset="0" stop-color="#e2955a"/><stop offset=".55" stop-color="#a5552a"/><stop offset="1" stop-color="#2a170c"/></radialGradient></defs>`;
    s += pth("M120 60 C500 20 1100 20 1480 70 C1540 300 1540 560 1470 760 C1100 800 500 800 130 760 C60 560 60 300 120 60Z", `url(#${id})`, `class="wallflick"`);
    const r = rng(12);
    for (let i = 0; i < 22; i++) s += ln(`M${160 + r() * 1280} ${90 + r() * 640} q${20 + r() * 40} ${-6 + r() * 12} ${50 + r() * 60} ${-4 + r() * 8}`, "#7a3c1b", 2, `opacity=".45"`);
    s += `<rect x="-300" y="800" width="2200" height="300" fill="#0b0604"/>`;
    for (let i = 0; i < 5; i++) s += g(circ(0, 0, 44, "#0b0604") + `<rect x="-52" y="20" width="104" height="80" rx="30" fill="#0b0604"/>`, `translate(${330 + i * 240} ${850 + (i % 2) * 10})`);
    return s;
  },
  outside() {
    let s = skyGrad("#f6d98b", "#e8a464");
    s += sunDisk(1240, 180, 70, "#fff3c8", true);
    s += hill("M-300 620 C200 560 700 580 1100 600 C1400 610 1700 560 1900 560 L1900 1200 L-300 1200Z", "#c87a3c");
    s += pth("M900 820 C1050 790 1350 790 1500 820 C1350 850 1050 850 900 820Z", "#7fb0b8", `opacity=".8"`);
    s += olive(260, 640, 1.2, P.ink, P.clay) + olive(1400, 620, 1.0, P.ink, P.clay) + cypress(1530, 640, 0.9, P.ink);
    s += fig({ x: 760, y: 740, s: 1.0, fill: P.ink, front: "up", garment: "short", hair: "cap", beard: "short", tilt: -14, back: "down" });
    return s;
  }
};

/* niebla de Doxa como capa SVG */
function fogLayer(n = 4, op = 0.5) {
  const id = uid("fb");
  let s = `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter></defs><g filter="url(#${id})" opacity="${op}">`;
  const r = rng(99);
  for (let i = 0; i < n; i++) s += ell(r() * 1600, 400 + r() * 500, 300 + r() * 300, 80 + r() * 60, i % 2 ? "#8d949a" : "#b5bbbf", `class="fogd" style="animation-delay:${-r() * 20}s"`);
  return s + "</g>";
}

function sceneSvg(name, extraClass = "") {
  const fn = SCENES[name] || SCENES.title;
  return `<svg class="scene-svg ${extraClass}" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="cam">${fn()}</g></svg>`;
}
