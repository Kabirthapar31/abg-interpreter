// Parabox slide kit: black-and-orange design system shared by all four PULMOCON 2026 decks.
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const C = {
  bg: "0A0808", panel: "141010", panel2: "1C1614", line: "2E2522",
  or: "FF641E", orSoft: "3A1E12", cream: "FBF4EC", muted: "A89C91", dim: "6F655E",
  green: "5BC08A", red: "E5484D",
};
const H = "Arial";          // headings
const B = "Arial";          // body
const SERIF = "Cambria";    // italic accent (stands in for Lora)
const MONO = "Courier New"; // prompts
const W = 13.333, HGT = 7.5, MX = 0.6;

function lines(text, size, width, f = 0.56) {
  const plain = text.replace(/\*/g, "");
  const per = Math.max(1, Math.floor((width * 72) / (size * f)));
  let n = 0;
  plain.split("\n").forEach((l) => {
    let cur = 0, ln = 1;
    l.split(" ").forEach((w) => { if (cur && cur + 1 + w.length > per) { ln++; cur = w.length; } else cur += (cur ? 1 : 0) + w.length; });
    n += ln;
  });
  return n;
}

const iconCache = {};
async function icon(name, color = C.or) {
  const key = name + color;
  if (!iconCache[key]) {
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[name], { color: "#" + color, size: 256 }));
    const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
    iconCache[key] = "image/png;base64," + buf.toString("base64");
  }
  return iconCache[key];
}

class Deck {
  constructor({ file, session, time, total }) {
    this.p = new pptxgen();
    this.p.layout = "LAYOUT_WIDE";
    this.p.author = "Dr. Abhishek J. Benur · Parabox AI";
    this.p.company = "Parabox AI";
    this.p.title = session;
    this.file = file; this.session = session; this.time = time;
    this.n = 0; this.total = total; this.pending = [];
  }

  base(notes) {
    const s = this.p.addSlide();
    s.background = { color: C.bg };
    this.n += 1;
    if (notes) s.addNotes(notes);
    return s;
  }

  chrome(s, kicker, title) {
    // brand mark, counter, kicker, title, footer
    s.addShape(this.p.shapes.OVAL, { x: MX, y: 0.42, w: 0.12, h: 0.12, fill: { color: C.or }, line: { color: C.or } });
    s.addText("PARABOX AI", { x: MX + 0.2, y: 0.33, w: 3, h: 0.3, fontFace: H, fontSize: 10, bold: true, color: C.cream, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText(`${String(this.n).padStart(2, "0")} / ${this.total}`, { x: W - MX - 2, y: 0.33, w: 2, h: 0.3, fontFace: H, fontSize: 10, color: C.dim, align: "right", margin: 0, isTextBox: true });
    if (kicker) s.addText(kicker.toUpperCase(), { x: MX, y: 0.9, w: W - 2 * MX, h: 0.3, fontFace: H, fontSize: 11, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
    if (title) s.addText(runs(title, 30), { x: MX, y: 1.2, w: W - 2 * MX, h: 0.75, fontFace: H, fontSize: 30, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    s.addText("paraboxai.com  ·  @abhishekjbenur", { x: MX, y: 7.0, w: 5, h: 0.25, fontFace: H, fontSize: 9, color: C.dim, margin: 0, isTextBox: true });
    s.addText(`PULMOCON 2026  ·  ${this.session.toUpperCase()}`, { x: W - MX - 7, y: 7.0, w: 7, h: 0.25, fontFace: H, fontSize: 9, color: C.dim, align: "right", charSpacing: 1, margin: 0, isTextBox: true });
  }

  // ---------- slide types ----------
  cover({ kicker, title, lead, chips = [], presenters, cred, notes }) {
    const s = this.base(notes);
    s.addShape(this.p.shapes.OVAL, { x: MX, y: 0.62, w: 0.14, h: 0.14, fill: { color: C.or }, line: { color: C.or } });
    s.addText("PARABOX AI", { x: MX + 0.24, y: 0.53, w: 4, h: 0.32, fontFace: H, fontSize: 12, bold: true, color: C.cream, charSpacing: 4, margin: 0, isTextBox: true });
    s.addText(kicker.toUpperCase(), { x: MX, y: 1.55, w: 11, h: 0.35, fontFace: H, fontSize: 12, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
    const tl = lines(title, 54, 11.8, 0.5), th = tl * 54 * 1.15 / 72;
    s.addText(runs(title, 54), { x: MX, y: 1.95, w: 11.8, h: th + 0.1, fontFace: H, fontSize: 54, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    s.addText(lead, { x: MX, y: 1.95 + th + 0.3, w: 9.6, h: 0.9, fontFace: SERIF, italic: true, fontSize: 18, color: C.muted, margin: 0, valign: "top", isTextBox: true });
    let x = MX;
    chips.forEach((c) => {
      const w = 0.25 + c.length * 0.1;
      s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y: 5.15, w, h: 0.36, rectRadius: 0.18, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
      s.addText(c.toUpperCase(), { x, y: 5.15, w, h: 0.36, fontFace: H, fontSize: 9, bold: true, color: C.cream, align: "center", valign: "middle", charSpacing: 2, margin: 0, isTextBox: true });
      x += w + 0.15;
    });
    s.addShape(this.p.shapes.RECTANGLE, { x: 0, y: 6.05, w: W, h: 1.45, fill: { color: C.or }, line: { color: C.or } });
    s.addText(presenters, { x: MX, y: 6.25, w: 8.5, h: 0.45, fontFace: H, fontSize: 20, bold: true, color: C.bg, margin: 0, isTextBox: true });
    s.addText(cred, { x: MX, y: 6.72, w: 8.5, h: 0.5, fontFace: H, fontSize: 11, color: "2A1208", margin: 0, valign: "top", isTextBox: true });
    s.addText([{ text: "@abhishekjbenur", options: { bold: true, fontSize: 14, breakLine: true } }, { text: `PULMOCON 2026  ·  ${this.time}`, options: { fontSize: 10 } }],
      { x: W - MX - 4, y: 6.3, w: 4, h: 0.8, fontFace: H, color: C.bg, align: "right", margin: 0, isTextBox: true });
    return s;
  }

  section({ num, kicker, title, lead, notes }) {
    const s = this.base(notes);
    this.chrome(s);
    s.addText(num, { x: MX - 0.05, y: 1.2, w: 5, h: 2.2, fontFace: H, fontSize: 150, bold: true, color: C.or, margin: 0, valign: "top", isTextBox: true });
    s.addText(kicker.toUpperCase(), { x: MX, y: 3.65, w: 11, h: 0.35, fontFace: H, fontSize: 12, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
    s.addText(runs(title, 44), { x: MX, y: 4.0, w: 12, h: 1.0, fontFace: H, fontSize: 44, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    if (lead) s.addText(lead, { x: MX, y: 5.1, w: 10, h: 1.1, fontFace: SERIF, italic: true, fontSize: 18, color: C.muted, margin: 0, valign: "top", isTextBox: true });
    return s;
  }

  // n cards in a grid; each {icon, tag, title, body}
  async cards({ kicker, title, intro, items, cols, note, notes, y0 = 2.2, cardH }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    let y = y0;
    if (intro) { s.addText(intro, { x: MX, y: y - 0.1, w: 12, h: 0.5, fontFace: B, fontSize: 14, color: C.muted, margin: 0, valign: "top", isTextBox: true }); y += 0.55; }
    cols = cols || Math.min(items.length, items.length === 4 ? 4 : 3);
    const rows = Math.ceil(items.length / cols), gap = 0.3;
    const cw = (W - 2 * MX - gap * (cols - 1)) / cols;
    const bottom = note ? 6.05 : 6.75;
    const ch = cardH || (bottom - y - gap * (rows - 1)) / rows;
    for (let i = 0; i < items.length; i++) {
      const it = items[i], cx = MX + (i % cols) * (cw + gap), cy = y + Math.floor(i / cols) * (ch + gap);
      await this.card(s, cx, cy, cw, ch, it);
    }
    if (note) this.note(s, note, 6.2);
    return s;
  }

  async card(s, x, y, w, h, it) {
    s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: it.hot ? C.orSoft : C.panel }, line: { color: it.hot ? C.or : C.line, width: 1 } });
    let ty = y + 0.22;
    if (it.icon) {
      s.addShape(this.p.shapes.OVAL, { x: x + 0.25, y: ty, w: 0.55, h: 0.55, fill: { color: C.orSoft }, line: { color: C.orSoft } });
      s.addImage({ data: await icon(it.icon), x: x + 0.39, y: ty + 0.14, w: 0.27, h: 0.27 });
      ty += 0.72;
    }
    if (it.tag) { s.addText(it.tag.toUpperCase(), { x: x + 0.25, y: ty, w: w - 0.5, h: 0.25, fontFace: H, fontSize: 9, bold: true, color: C.or, charSpacing: 2, margin: 0, isTextBox: true }); ty += 0.28; }
    const tsz = it.titleSize || 17;
    s.addText(it.title, { x: x + 0.25, y: ty, w: w - 0.5, h: lines(it.title, tsz, w - 0.5, 0.54) * tsz * 1.25 / 72 + 0.05, fontFace: H, fontSize: tsz, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    ty += it.titleH || lines(it.title, tsz, w - 0.5, 0.54) * tsz * 1.25 / 72 + 0.12;
    if (it.body) s.addText(bodyRuns(it.body), { x: x + 0.25, y: ty, w: w - 0.5, h: y + h - ty - 0.15, fontFace: B, fontSize: it.size || 14, color: C.muted, margin: 0, valign: "top", paraSpaceAfter: 4, isTextBox: true });
  }

  note(s, text, y = 6.2) {
    s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX, y, w: W - 2 * MX, h: 0.58, rectRadius: 0.08, fill: { color: C.orSoft }, line: { color: C.orSoft } });
    s.addText(runs(text, 13), { x: MX + 0.25, y, w: W - 2 * MX - 0.5, h: 0.58, fontFace: B, fontSize: 13, color: C.cream, valign: "middle", margin: 0, isTextBox: true });
  }

  // numbered process flow; items {title, body}
  flow({ kicker, title, intro, items, note, notes }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    let y = 2.25;
    if (intro) { s.addText(intro, { x: MX, y: y - 0.1, w: 12, h: 0.5, fontFace: B, fontSize: 14, color: C.muted, margin: 0, isTextBox: true }); y += 0.6; }
    const n = items.length, gap = 0.28, cw = (W - 2 * MX - gap * (n - 1)) / n, ch = (note ? 6.0 : 6.7) - y;
    items.forEach((it, i) => {
      const x = MX + i * (cw + gap);
      s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
      s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.22, y: y + 0.2, w: 1.2, h: 0.6, fontFace: H, fontSize: 30, bold: true, color: C.or, margin: 0, isTextBox: true });
      const tH = lines(it.title, 15, cw - 0.44, 0.52) * 15 * 1.25 / 72;
      s.addText(it.title, { x: x + 0.22, y: y + 0.9, w: cw - 0.44, h: tH + 0.05, fontFace: H, fontSize: 15, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
      s.addText(bodyRuns(it.body), { x: x + 0.22, y: y + 1.05 + tH, w: cw - 0.44, h: ch - 1.2 - tH, fontFace: B, fontSize: it.size || 14.5, color: C.muted, margin: 0, valign: "top", isTextBox: true });
      if (i < n - 1) s.addText("›", { x: x + cw - 0.02, y: y + 0.25, w: gap + 0.04, h: 0.5, fontFace: H, fontSize: 22, bold: true, color: C.or, align: "center", margin: 0, isTextBox: true });
    });
    if (note) this.note(s, note, 6.15);
    return s;
  }

  // table rows: first row is header
  table({ kicker, title, intro, rows, colW, note, notes, fontSize = 13 }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    let y = 2.2;
    if (intro) { s.addText(intro, { x: MX, y: y - 0.1, w: 12, h: 0.5, fontFace: B, fontSize: 14, color: C.muted, margin: 0, isTextBox: true }); y += 0.55; }
    const data = rows.map((r, i) => r.map((c, j) => ({
      text: c, options: i === 0
        ? { bold: true, color: C.or, fontSize: 10, charSpacing: 2, fill: { color: C.bg } }
        : { color: j === 0 ? C.cream : j === 1 ? C.or : C.muted, bold: j < 2, fontSize, fill: { color: i % 2 ? C.panel : C.bg } },
    })));
    s.addTable(data, { x: MX, y, w: W - 2 * MX, colW, fontFace: B, border: { type: "solid", pt: 0.75, color: C.line }, margin: [8, 10, 8, 10], valign: "middle" });
    if (note) this.note(s, note, 6.2);
    return s;
  }

  // two columns, e.g. bad vs good prompt
  compare({ kicker, title, left, right, note, notes }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    const y = 2.2, gap = 0.35, cw = (W - 2 * MX - gap) / 2, ch = (note ? 6.0 : 6.75) - y;
    [left, right].forEach((col, i) => {
      const x = MX + i * (cw + gap), good = col.good;
      s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, rectRadius: 0.08, fill: { color: good ? C.orSoft : C.panel }, line: { color: good ? C.or : C.line, width: 1 } });
      s.addText(col.label.toUpperCase(), { x: x + 0.3, y: y + 0.22, w: cw - 0.6, h: 0.3, fontFace: H, fontSize: 11, bold: true, color: good ? C.or : C.muted, charSpacing: 3, margin: 0, isTextBox: true });
      if (col.prompt && !col.promptH) col.promptH = lines(col.prompt, col.promptSize || 12, cw - 0.6, 0.6) * (col.promptSize || 12) * 1.2 / 72 + 0.1;
      if (col.prompt) {
        s.addText(col.prompt, { x: x + 0.3, y: y + 0.6, w: cw - 0.6, h: col.promptH || 1.2, fontFace: MONO, fontSize: col.promptSize || 12, color: C.cream, margin: 0, valign: "top", isTextBox: true });
      }
      const by = y + 0.6 + (col.prompt ? (col.promptH || 1.2) + 0.15 : 0);
      if (col.body) s.addText(bodyRuns(col.body), { x: x + 0.3, y: by, w: cw - 0.6, h: y + ch - by - 0.2, fontFace: B, fontSize: col.size || 13, color: good ? C.cream : C.muted, margin: 0, valign: "top", paraSpaceAfter: 5, isTextBox: true });
    });
    if (note) this.note(s, note, 6.15);
    return s;
  }

  // a prompt on screen, with optional side panel of callouts
  prompt({ kicker, title, label, text, size = 12, side, sideTitle, note, notes }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    const y = 2.2, bottom = note ? 6.0 : 6.75, pw = side ? 8.1 : W - 2 * MX;
    s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX, y, w: pw, h: bottom - y, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.or, width: 1 } });
    s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX + 0.25, y: y + 0.2, w: 0.45 + label.length * 0.118, h: 0.32, rectRadius: 0.16, fill: { color: C.or }, line: { color: C.or } });
    s.addText(label.toUpperCase(), { x: MX + 0.25, y: y + 0.2, w: 0.45 + label.length * 0.118, h: 0.32, fontFace: H, fontSize: 9, bold: true, color: C.bg, align: "center", valign: "middle", charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(promptRuns(text), { x: MX + 0.3, y: y + 0.68, w: pw - 0.6, h: bottom - y - 0.85, fontFace: MONO, fontSize: size, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    if (side) {
      const sx = MX + pw + 0.3, sw = W - MX - sx;
      s.addText((sideTitle || "WHY IT WORKS").toUpperCase(), { x: sx, y, w: sw, h: 0.3, fontFace: H, fontSize: 10, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
      const items = [];
      side.forEach((t, i) => {
        const [h, b] = t.split("|");
        items.push({ text: h, options: { bold: true, color: C.cream, fontSize: 14, breakLine: true } });
        items.push({ text: b || "", options: { color: C.muted, fontSize: 12.5, breakLine: i < side.length - 1, paraSpaceAfter: 10 } });
      });
      s.addText(items, { x: sx, y: y + 0.4, w: sw, h: bottom - y - 0.4, fontFace: B, margin: 0, valign: "top", isTextBox: true });
    }
    if (note) this.note(s, note, 6.15);
    return s;
  }

  // big statement
  statement({ kicker, big, sub, points, notes }) {
    const s = this.base(notes);
    this.chrome(s, kicker);
    s.addText(runs(big, 40), { x: MX, y: 1.4, w: 12, h: 2.0, fontFace: H, fontSize: 40, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    if (sub) s.addText(sub, { x: MX, y: 3.4, w: 11, h: 0.8, fontFace: SERIF, italic: true, fontSize: 18, color: C.muted, margin: 0, valign: "top", isTextBox: true });
    if (points) {
      const n = points.length, gap = 0.3, cw = (W - 2 * MX - gap * (n - 1)) / n;
      points.forEach((p, i) => {
        const x = MX + i * (cw + gap);
        s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x, y: 4.45, w: cw, h: 2.2, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
        s.addText(p.label.toUpperCase(), { x: x + 0.25, y: 4.65, w: cw - 0.5, h: 0.3, fontFace: H, fontSize: 10, bold: true, color: C.or, charSpacing: 2, margin: 0, isTextBox: true });
        s.addText(p.body, { x: x + 0.25, y: 5.0, w: cw - 0.5, h: 1.55, fontFace: B, fontSize: 13, color: C.cream, margin: 0, valign: "top", isTextBox: true });
      });
    }
    return s;
  }

  // three stats + optional cards below
  stats({ kicker, title, items, below, note, notes }) {
    const s = this.base(notes);
    this.chrome(s, kicker, title);
    const n = items.length, gap = 0.3, cw = (W - 2 * MX - gap * (n - 1)) / n;
    items.forEach((it, i) => {
      const x = MX + i * (cw + gap);
      s.addText(it.value, { x, y: 2.25, w: cw, h: 1.0, fontFace: H, fontSize: 54, bold: true, color: C.or, margin: 0, isTextBox: true });
      s.addText(it.label, { x, y: 3.3, w: cw, h: 0.4, fontFace: H, fontSize: 15, bold: true, color: C.cream, margin: 0, isTextBox: true });
      s.addText(it.body, { x, y: 3.72, w: cw - 0.2, h: 0.9, fontFace: B, fontSize: 12, color: C.muted, margin: 0, valign: "top", isTextBox: true });
    });
    if (below) this.note(s, below, 4.95);
    if (note) s.addText(note, { x: MX, y: 6.55, w: 12, h: 0.3, fontFace: B, fontSize: 9, italic: true, color: C.dim, margin: 0, isTextBox: true });
    return s;
  }

  closing({ kicker, title, lead, next, notes }) {
    const s = this.base(notes);
    this.chrome(s);
    s.addText(kicker.toUpperCase(), { x: MX, y: 1.6, w: 11, h: 0.35, fontFace: H, fontSize: 12, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
    const th = lines(title, 52, 12, 0.5) * 52 * 1.15 / 72;
    s.addText(runs(title, 52), { x: MX, y: 2.0, w: 12, h: th + 0.1, fontFace: H, fontSize: 52, bold: true, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    s.addText(lead, { x: MX, y: 2.0 + th + 0.35, w: 10.5, h: 1.0, fontFace: SERIF, italic: true, fontSize: 19, color: C.muted, margin: 0, valign: "top", isTextBox: true });
    if (next) {
      s.addShape(this.p.shapes.ROUNDED_RECTANGLE, { x: MX, y: 5.35, w: W - 2 * MX, h: 1.2, rectRadius: 0.08, fill: { color: C.panel }, line: { color: C.line, width: 1 } });
      s.addText("UP NEXT", { x: MX + 0.3, y: 5.5, w: 3, h: 0.3, fontFace: H, fontSize: 10, bold: true, color: C.or, charSpacing: 3, margin: 0, isTextBox: true });
      s.addText(next, { x: MX + 0.3, y: 5.82, w: W - 2 * MX - 0.6, h: 0.6, fontFace: B, fontSize: 15, color: C.cream, margin: 0, valign: "top", isTextBox: true });
    }
    return s;
  }

  async save(dir) {
    if (this.n !== this.total) throw new Error(`${this.file}: built ${this.n} slides, header says ${this.total}`);
    await this.p.writeFile({ fileName: `${dir}/${this.file}.pptx` });
    console.log(`wrote ${this.file}.pptx (${this.n} slides)`);
  }
}

// "Plain *orange* plain" -> runs with the starred part in orange
function runs(text, size) {
  return text.split(/(\*[^*]+\*)/).filter(Boolean).map((t) =>
    t.startsWith("*") ? { text: t.slice(1, -1), options: { color: C.or } } : { text: t, options: {} });
}

// body: string with "\n" lines; lines starting "- " become bullets; "**x**" bold cream
function bodyRuns(body) {
  const lines = body.split("\n");
  const out = [];
  lines.forEach((line, li) => {
    const bullet = line.startsWith("- ");
    const txt = bullet ? line.slice(2) : line;
    // pptxgenjs writes one pPr per run, so a bullet line must be a single run (bold is dropped there)
    const parts = bullet ? [txt.replace(/\*\*/g, "")] : txt.split(/(\*\*[^*]+\*\*)/).filter(Boolean);
    parts.forEach((p, pi) => {
      const o = {};
      if (p.startsWith("**")) { o.bold = true; o.color = C.cream; }
      if (bullet) o.bullet = { indent: 14 };
      if (pi === parts.length - 1 && li < lines.length - 1) o.breakLine = true;
      out.push({ text: p.startsWith("**") ? p.slice(2, -2) : p, options: o });
    });
  });
  return out;
}

// prompt text: [PLACEHOLDERS] and ALL-CAPS labels at line start in orange
function promptRuns(text) {
  const out = [];
  const lines = text.split("\n");
  lines.forEach((line, li) => {
    const parts = line.split(/(\[[^\]]+\]|^[A-Z][A-Z &-]{2,}:)/).filter(Boolean);
    if (!parts.length) parts.push(" ");
    parts.forEach((p, pi) => {
      const o = {};
      if (/^\[.*\]$/.test(p) || /^[A-Z][A-Z &-]{2,}:$/.test(p)) { o.color = C.or; o.bold = true; }
      if (pi === parts.length - 1 && li < lines.length - 1) o.breakLine = true;
      out.push({ text: p, options: o });
    });
  });
  return out;
}

module.exports = { Deck, C };
