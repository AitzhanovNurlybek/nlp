const pptxgen = require("pptxgenjs");

const OUT = "C:/Users/aitzh/OneDrive/Desktop/уроки/nlp/triage_project/triage_project_final.pptx";

const INK = "0D0D0D";
const MUTED = "5A5A5A";
const FAINT = "9E9E9E";
const CARD = "F4F4F4";
const CARD_DARK = "1E1E1E";
const PAPER = "FFFFFF";
const ON_DARK = "D0D0D0";

const HEAD = "Cambria";
const BODY = "Calibri";
const MONO = "Courier New";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "NLP project";
pres.title = "Patient Triage";

const W = 13.3, H = 7.5, M = 0.9;
// the visual sits above this line; everything below is the text you read out
const SCRIPT_Y = 4.30;
let pageNo = 0;

function slide(dark = false) {
  const s = pres.addSlide();
  pageNo += 1;
  if (dark) s.background = { color: INK };
  if (pageNo > 1) {
    s.addText(String(pageNo).padStart(2, "0"), {
      x: W - 1.05, y: H - 0.62, w: 0.5, h: 0.28,
      fontFace: BODY, fontSize: 10, color: dark ? "4A4A4A" : "C4C4C4",
      align: "right", isTextBox: true, margin: 0,
    });
  }
  return s;
}

function head(s, kicker, title, dark = false) {
  s.addText(kicker.toUpperCase(), {
    x: M, y: 0.32, w: W - 2 * M, h: 0.28,
    fontFace: BODY, fontSize: 10.5, bold: true, charSpacing: 2,
    color: dark ? "7A7A7A" : FAINT, isTextBox: true, margin: 0,
  });
  s.addText(title, {
    x: M, y: 0.62, w: W - 2 * M, h: 0.8,
    fontFace: HEAD, fontSize: 32, bold: true,
    color: dark ? PAPER : INK, isTextBox: true, margin: 0,
  });
}

/** The block you read from. Bold runs are the sentences that must be said. */
function script(s, runs, dark = false) {
  s.addShape(pres.ShapeType.roundRect, {
    x: M - 0.12, y: SCRIPT_Y, w: W - 2 * M + 0.24, h: H - SCRIPT_Y - 0.55,
    rectRadius: 0.04,
    fill: { color: dark ? CARD_DARK : CARD },
    line: { color: dark ? CARD_DARK : CARD, width: 0 },
  });
  const items = (Array.isArray(runs) ? runs : [[runs, {}]]).map(([t, o]) => ({
    text: t,
    options: Object.assign(
      { fontFace: BODY, fontSize: 14.5, color: dark ? ON_DARK : MUTED,
        breakLine: o.br !== false },
      o.bold ? { bold: true, color: dark ? PAPER : INK } : {},
      o.mono ? { fontFace: MONO, fontSize: 13.5 } : {},
      o.size ? { fontSize: o.size } : {}),
  }));
  s.addText(items, {
    x: M + 0.18, y: SCRIPT_Y + 0.16, w: W - 2 * M - 0.12, h: H - SCRIPT_Y - 0.88,
    isTextBox: true, margin: 0, valign: "top", lineSpacing: 21, paraSpaceAfter: 6,
  });
}

function dot(s, n, x, y, d = 0.46, dark = false) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: dark ? PAPER : INK }, line: { color: dark ? PAPER : INK, width: 0 },
  });
  s.addText(String(n), {
    x, y, w: d, h: d, fontFace: BODY, fontSize: 12, bold: true,
    color: dark ? INK : PAPER, align: "center", valign: "middle",
    isTextBox: true, margin: 0,
  });
}

function card(s, x, y, w, h, dark = false) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.05,
    fill: { color: dark ? INK : CARD }, line: { color: dark ? INK : CARD, width: 0 },
  });
}

function stat(s, x, y, w, big, label, dark = false, grey = false) {
  s.addText(big, {
    x, y, w, h: 0.78, fontFace: HEAD, fontSize: 38, bold: true,
    color: grey ? FAINT : (dark ? PAPER : INK), isTextBox: true, margin: 0,
  });
  s.addText(label, {
    x, y: y + 0.76, w, h: 0.55, fontFace: BODY, fontSize: 12,
    color: dark ? ON_DARK : MUTED, lineSpacing: 15, isTextBox: true, margin: 0,
  });
}

// ================================================================ 1
{
  const s = slide(true);
  s.addText("Patient Triage", {
    x: M, y: 1.75, w: 9.4, h: 1.0,
    fontFace: HEAD, fontSize: 50, bold: true, color: PAPER, isTextBox: true, margin: 0,
  });
  s.addText("Russian · Kazakh · both in one sentence", {
    x: M, y: 2.85, w: 9.4, h: 0.45,
    fontFace: BODY, fontSize: 17, color: ON_DARK, isTextBox: true, margin: 0,
  });
  script(s, [
    ["This is first-contact triage for patient requests. A person writes what hurts, and the system answers two things: how urgent it is, and which specialist to see.", { bold: true }],
    ["Three urgency levels, six specialties. What it does not do is diagnose — that boundary has been there since day one.", {}],
  ], true);
  s.addNotes("Do not linger. The boundary sentence is the one that matters.");
}

// ================================================================ 2
{
  const s = slide();
  head(s, "How it works", "Five steps");
  const steps = ["Read the text", "Detect the language", "Pull out the facts",
                 "Judge urgency", "Decide where to send"];
  const cw = 2.18, gap = 0.3;
  steps.forEach((t, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 1.65, cw, 2.3, i === 1);
    dot(s, i + 1, x + 0.28, 1.92, 0.44, i === 1);
    s.addText(t, {
      x: x + 0.28, y: 2.55, w: cw - 0.56, h: 1.1,
      fontFace: HEAD, fontSize: 15, bold: true,
      color: i === 1 ? PAPER : INK, isTextBox: true, margin: 0,
    });
  });
  script(s, [
    ["Five steps. Read the text. Detect the language — that step is new, it is the black one. Pull the facts out: what hurts, where, for how long. Judge urgency. And only then decide where to send the patient.", {}],
    ["The danger-phrase list can only ever raise urgency, never lower it. A false alarm costs a wasted trip. A miss can cost a life. The two errors are not symmetrical, so the handling is not symmetrical either.", { bold: true }],
  ]);
  s.addNotes("The asymmetry sentence is the one to say without fail.");
}

// ================================================================ 3
{
  const s = slide();
  head(s, "Three rounds of work", "What we changed");
  const rows = [
    ["Languages", "Russian only", "Russian, Kazakh, and both"],
    ["Text cleaning", "deleted every Kazakh letter", "Kazakh letters are kept"],
    ["How we test", "one pile for everything", "three piles + real complaints"],
    ["How we judge reading", "\u201cdid we find anything?\u201d", "\u201cdid we find everything?\u201d"],
    ["Danger phrases", "fixed Russian wordings", "word patterns, both languages"],
  ];
  s.addText("BEFORE", { x: M + 3.1, y: 1.6, w: 3.0, h: 0.25, fontFace: BODY,
    fontSize: 9.5, bold: true, color: FAINT, charSpacing: 1.3, isTextBox: true, margin: 0 });
  s.addText("NOW", { x: M + 6.9, y: 1.6, w: 3.0, h: 0.25, fontFace: BODY,
    fontSize: 9.5, bold: true, color: INK, charSpacing: 1.3, isTextBox: true, margin: 0 });
  rows.forEach(([a, b, c], i) => {
    const y = 1.92 + i * 0.46;
    s.addText(a, { x: M, y, w: 3.0, h: 0.4, fontFace: HEAD, fontSize: 13, bold: true,
      color: INK, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(b, { x: M + 3.1, y, w: 3.7, h: 0.4, fontFace: BODY, fontSize: 12,
      color: FAINT, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(c, { x: M + 6.9, y, w: 4.5, h: 0.4, fontFace: BODY, fontSize: 12,
      color: INK, isTextBox: true, margin: 0, valign: "middle" });
  });
  script(s, [
    ["Five changes. Languages: Russian only, now three cases. Text cleaning — I will come back to that on the next slide, there was a serious bug. How we test: one pile of data doing every job, now three piles with one job each. How we judge the reading step: the question used to be \u201cdid we find anything\u201d, now it is \u201cdid we find everything\u201d, checked by hand. And the danger phrases became word patterns in both languages.", {}],
    ["The fourth row is the main story of week two. I will come back to it on slide eight.", { bold: true }],
  ]);
}

// ================================================================ 4
{
  const s = slide();
  head(s, "The data", "We wrote it ourselves");
  [["6 387", "complaints to\nlearn from"], ["682", "complaints\nkept aside"],
   ["3", "languages"], ["6", "kinds of doctor"]].forEach(([b, l], i) => {
    stat(s, M + i * 3.0, 1.7, 2.8, b, l);
  });
  script(s, [
    ["6 387 complaints to learn from, and 682 kept aside. The ones kept aside describe the same conditions, deliberately written in different words. The system never sees them while it learns. That is the pile that tells us the truth.", {}],
    ["We wrote this data ourselves. No doctor has read it. No native Kazakh speaker has read the Kazakh half. That is acceptable for a student project and not acceptable for a real clinic — and we say this first rather than waiting for the question.", { bold: true }],
  ]);
  s.addNotes("Volunteering the limitation is stronger than defending it later.");
}

// ================================================================ 5
{
  const s = slide();
  head(s, "Week 1 — adding Kazakh", "Three things broke, and nothing complained");
  [["The cleaner deleted Kazakh", "nine letters turned into blanks"],
   ["No Kazakh word tool exists", "we match stems and endings ourselves"],
   ["A rule cannot see mixing", "a Russian insert has no Kazakh-only letters"],
  ].forEach(([t, sub], i) => {
    const y = 1.62 + i * 0.85;
    dot(s, i + 1, M, y, 0.42);
    s.addText(t, { x: M + 0.62, y: y - 0.04, w: 5.2, h: 0.35, fontFace: HEAD,
      fontSize: 15, bold: true, color: INK, isTextBox: true, margin: 0 });
    s.addText(sub, { x: M + 5.9, y: y - 0.04, w: 5.5, h: 0.35, fontFace: BODY,
      fontSize: 12.5, color: MUTED, isTextBox: true, margin: 0 });
  });
  s.addText([
    { text: "«Құлағым ауырады, қызуым жоқ»", options: { fontFace: MONO, fontSize: 13, color: INK } },
    { text: "   became   ", options: { fontFace: BODY, fontSize: 12.5, color: FAINT } },
    { text: "«ла ым ауырады, ызуым жо»", options: { fontFace: MONO, fontSize: 13, color: "A0A0A0" } },
  ], { x: M, y: 3.75, w: 11.5, h: 0.4, isTextBox: true, margin: 0 });
  script(s, [
    ["When we added Kazakh, three things broke and not one raised an error. The text cleaner kept Russian letters only — Kazakh has nine more, and every one was turned into a blank before the system even looked at the words.", {}],
    ["For Russian there is a ready tool that reduces any word to its base. Nothing like it exists for Kazakh. And a letter rule fundamentally cannot see a mixed sentence, because a Russian insert is often made of letters Kazakh also has.", {}],
    ["What the three have in common is that none of them crashed. The system kept running and kept producing normal-looking numbers.", { bold: true }],
  ]);
}

// ================================================================ 6
{
  const s = slide();
  head(s, "Week 1 — what the system pulls out", "It shows its working");
  card(s, M, 1.6, 11.5, 0.58);
  s.addText("«второй день болит горло, температуры нет»", {
    x: M + 0.3, y: 1.6, w: 11.0, h: 0.58, fontFace: MONO, fontSize: 13.5,
    color: INK, isTextBox: true, margin: 0, valign: "middle" });
  [["what hurts", "боль"], ["where", "горло"], ["how long", "второй день"],
   ["patient denies", "температура"]].forEach(([k, v], i) => {
    const x = M + i * 2.9;
    s.addText(k.toUpperCase(), { x, y: 2.35, w: 2.7, h: 0.25, fontFace: BODY,
      fontSize: 9.5, bold: true, color: FAINT, charSpacing: 1.2, isTextBox: true, margin: 0 });
    s.addText(v, { x, y: 2.6, w: 2.7, h: 0.5, fontFace: HEAD, fontSize: 19,
      bold: true, color: INK, isTextBox: true, margin: 0 });
  });
  s.addText("→   send to an ear, nose and throat doctor — soon, not urgently", {
    x: M, y: 3.35, w: 11.5, h: 0.4, fontFace: BODY, fontSize: 13.5, bold: true,
    color: INK, isTextBox: true, margin: 0 });
  script(s, [
    ["This is what the system extracts. Two different mechanisms inside — one for Russian, one for Kazakh — and one output format outside.", {}],
    ["Look at the last column: \u201cno fever\u201d is recognised as something the patient denies, not as a symptom. That is separate logic.", {}],
    ["The point of this layer is not accuracy. It is that a doctor can check the reasoning instead of trusting a label blindly.", { bold: true }],
  ]);
}

// ================================================================ 7
{
  const s = slide();
  head(s, "Week 1 — finding the language", "A simple rule was not enough");
  s.addText("SIMPLE RULE", { x: M + 5.2, y: 1.6, w: 2.6, h: 0.25, fontFace: BODY,
    fontSize: 9.5, bold: true, color: FAINT, charSpacing: 1.2, isTextBox: true, margin: 0 });
  s.addText("TRAINED MODEL", { x: M + 8.1, y: 1.6, w: 2.8, h: 0.25, fontFace: BODY,
    fontSize: 9.5, bold: true, color: INK, charSpacing: 1.2, isTextBox: true, margin: 0 });
  [["Russian", "1.00", "1.00", false], ["Kazakh", "0.99", "1.00", false],
   ["Mixed, both languages", "0.43", "0.98", true]].forEach(([l, a, b, weak], i) => {
    const y = 1.95 + i * 0.72;
    s.addText(l, { x: M, y, w: 5.0, h: 0.6, fontFace: BODY, fontSize: 14,
      bold: weak, color: weak ? INK : MUTED, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(a, { x: M + 5.2, y, w: 2.6, h: 0.6, fontFace: HEAD, fontSize: 26,
      bold: true, color: weak ? "B4B4B4" : FAINT, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(b, { x: M + 8.1, y, w: 2.6, h: 0.6, fontFace: HEAD, fontSize: 26,
      bold: true, color: INK, isTextBox: true, margin: 0, valign: "middle" });
  });
  script(s, [
    ["We started with a rule. Kazakh has nine unique letters, so a word carrying one is definitely Kazakh. The rule separates Russian from Kazakh very well. On mixed sentences it gets 0.43.", {}],
    ["The reason is fundamental, not a bug. A rule can only recognise a language by evidence for it, and a Russian insert like «давление скачет» contains no letter that Kazakh does not also have. No evidence, so the rule sees nothing Russian.", { bold: true }],
    ["We replaced it with a trained model that looks at the spelling of each word. On mixed sentences: 0.43 became 0.98.", {}],
  ]);
}

// ================================================================ 8
{
  const s = slide();
  head(s, "Week 2 — our biggest mistake", "We were measuring the wrong thing");
  card(s, M, 1.6, 5.4, 1.1);
  s.addText("75–86%", { x: M + 0.3, y: 1.72, w: 2.4, h: 0.6, fontFace: HEAD,
    fontSize: 30, bold: true, color: FAINT, isTextBox: true, margin: 0 });
  s.addText("the old number:\ndid we find ANYTHING?", { x: M + 2.9, y: 1.74, w: 2.4, h: 0.8,
    fontFace: BODY, fontSize: 11.5, color: MUTED, lineSpacing: 14, isTextBox: true, margin: 0 });
  card(s, M, 2.85, 5.4, 1.1, true);
  s.addText("54%", { x: M + 0.3, y: 2.97, w: 2.4, h: 0.6, fontFace: HEAD,
    fontSize: 30, bold: true, color: PAPER, isTextBox: true, margin: 0 });
  s.addText("the real number:\ndid we find EVERYTHING?", { x: M + 2.9, y: 2.99, w: 2.4, h: 0.8,
    fontFace: BODY, fontSize: 11.5, color: ON_DARK, lineSpacing: 14, isTextBox: true, margin: 0 });
  ["We took 60 complaints from the pile kept aside.",
   "We read them ourselves and wrote down every symptom.",
   "We compared that with what the system found."].forEach((t, i) => {
    const y = 1.72 + i * 0.72;
    dot(s, i + 1, 6.8, y, 0.38);
    s.addText(t, { x: 7.35, y: y - 0.04, w: 5.0, h: 0.5, fontFace: BODY,
      fontSize: 12.5, color: MUTED, isTextBox: true, margin: 0 });
  });
  script(s, [
    ["For two weeks we reported the reading step as \u201ccoverage\u201d — the share of complaints where at least one entity was found. That gave 75 to 86 percent and looked like a result. The real number is 54 percent, and of what the system does report, 95 percent is correct.", {}],
    ["The old number was not a lie. It answered an easier question: did we find anything, instead of did we find everything.", { bold: true }],
    ["We annotated what a reader sees, not what is in our word list — otherwise the system would be marking its own exam.", {}],
  ]);
  s.addNotes("The most important slide. Let the two numbers sit before you explain.");
}

// ================================================================ 9
{
  const s = slide();
  head(s, "Week 2 — the obvious fix", "We cannot just add more words");
  [["0 of 15", "words the system failed on\nappear in our training data"],
   ["52%", "of the kept-aside vocabulary\nwas never seen in training"]].forEach(([b, l], i) => {
    stat(s, M + i * 5.9, 1.7, 5.4, b, l);
  });
  s.addText("body parts  0.75 → 0.88          symptoms  0.52 → 0.54", {
    x: M, y: 3.35, w: 11.5, h: 0.4, fontFace: BODY, fontSize: 14, bold: true,
    color: INK, isTextBox: true, margin: 0 });
  script(s, [
    ["Recall of 54 percent is a dictionary problem, and the obvious move is to make the dictionary bigger. But the words may only come from the training data — taking them from the exam would end the measurement.", {}],
    ["So we combed through it. Not one of the fifteen words the system failed on appears in the training data at all, and 52 percent of the kept-aside vocabulary was never seen in training.", { bold: true }],
    ["That explains the lopsided gain. Body parts are a couple of dozen words that repeat; a symptom can be phrased a hundred ways. A hand-written dictionary cannot be read into generality from data you already have.", {}],
  ]);
}

// ================================================================ 10
{
  const s = slide();
  head(s, "Week 2 — what our teacher asked us to fix", "Three piles of data, three jobs");
  [["LEARN", "4 470", false], ["CHOOSE", "958", false],
   ["CHECK", "959", true], ["KEPT ASIDE", "682", true]].forEach(([n, v, dark], i) => {
    const x = M + i * 2.95;
    card(s, x, 1.65, 2.75, 1.95, dark);
    s.addText(n, { x: x + 0.28, y: 1.85, w: 2.2, h: 0.25, fontFace: BODY,
      fontSize: 9.5, bold: true, charSpacing: 1.2,
      color: dark ? FAINT : MUTED, isTextBox: true, margin: 0 });
    s.addText(v, { x: x + 0.28, y: 2.15, w: 2.2, h: 0.8, fontFace: HEAD,
      fontSize: 30, bold: true, color: dark ? PAPER : INK, isTextBox: true, margin: 0 });
  });
  script(s, [
    ["The feedback was methodological: we had no separate pile for tuning. The same data was used both to choose settings and to report the result, so the score partly measured how well our choices fitted that one pile.", {}],
    ["Now there are four piles with one job each. The system learns on the first. We try options on the second. The third we look at once, at the very end, and it chooses nothing. The fourth is written in different words.", { bold: true }],
    ["The confidence threshold used to be set by hand with a comment saying it was picked by eye. Now it comes from a trade-off table on the second pile and is never touched again.", {}],
  ]);
}

// ================================================================ 11
{
  const s = slide(true);
  head(s, "Week 2 — the score on urgency", "Which number to believe", true);
  [["0.99", "tuned on it", true], ["0.98", "wording like training", false],
   ["0.76", "words never seen", false]].forEach(([b, l, grey], i) => {
    const x = M + i * 3.95;
    card(s, x, 1.6, 3.6, 1.95, false);
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.6, w: 3.6, h: 1.95,
      rectRadius: 0.05, fill: { color: CARD_DARK }, line: { color: CARD_DARK, width: 0 } });
    s.addText(b, { x: x + 0.35, y: 1.8, w: 2.9, h: 0.8, fontFace: HEAD, fontSize: 34,
      bold: true, color: grey ? "6B6B6B" : PAPER, isTextBox: true, margin: 0 });
    s.addText(l, { x: x + 0.35, y: 2.65, w: 2.9, h: 0.6, fontFace: BODY, fontSize: 12.5,
      color: grey ? "7A7A7A" : ON_DARK, isTextBox: true, margin: 0 });
  });
  script(s, [
    ["Three numbers. 0.99 on the pile we tuned on, which flatters us and is no longer an estimate of anything. 0.98 on the checking pile, where the wording is like the training data. And 0.76 where the same conditions are described in different words.", {}],
    ["Judge us on 0.76. The gap is not a fault to fix — it measures how much of the pretty number is recognition of familiar phrasing. And the thing that matters most holds up best: on unseen words it still catches 79 percent of emergencies.", { bold: true }],
    ["On Kazakh the checking pile shows exactly 1.00. That is a warning sign, not a result — the honest Kazakh figure is 0.77.", {}],
  ], true);
}

// ================================================================ 12
{
  const s = slide(true);
  head(s, "Week 2 — an experiment", "We tried a smarter model. It lost.", true);
  [["picking how urgent", "0.757", "0.708", false],
   ["catching emergencies", "0.791", "0.816", true],
   ["picking the doctor", "0.840", "0.755", false]].forEach(([l, a, b, wins], i) => {
    const y = 1.62 + i * 0.72;
    s.addText(l, { x: M, y, w: 5.0, h: 0.6, fontFace: BODY, fontSize: 13.5,
      color: ON_DARK, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(a, { x: M + 5.2, y, w: 2.6, h: 0.6, fontFace: HEAD, fontSize: 24, bold: true,
      color: wins ? "6B6B6B" : PAPER, isTextBox: true, margin: 0, valign: "middle" });
    s.addText(b, { x: M + 8.1, y, w: 2.6, h: 0.6, fontFace: HEAD, fontSize: 24, bold: true,
      color: wins ? PAPER : "6B6B6B", isTextBox: true, margin: 0, valign: "middle" });
  });
  s.addText("OURS", { x: M + 5.2, y: 1.35, w: 2.6, h: 0.22, fontFace: BODY, fontSize: 9.5,
    bold: true, color: "7A7A7A", charSpacing: 1.2, isTextBox: true, margin: 0 });
  s.addText("SMARTER", { x: M + 8.1, y: 1.35, w: 2.6, h: 0.22, fontFace: BODY, fontSize: 9.5,
    bold: true, color: PAPER, charSpacing: 1.2, isTextBox: true, margin: 0 });
  script(s, [
    ["The previous slide leads to a hypothesis: a model that understands meaning rather than spelling should not care which words a complaint uses. We tested that instead of assuming it, and the hypothesis was not confirmed.", {}],
    ["We built our data from a bank of set phrases, so the useful clues in it are the exact words. Our model is built to use them; the smarter model abstracts away from exact words and throws those clues out. This says as much about our data as about the models.", { bold: true }],
    ["And it wins exactly where the theory predicted: on Kazakh, and on catching emergencies — where exact words help least.", {}],
  ], true);
}

// ================================================================ 13
{
  const s = slide();
  head(s, "Week 2 — a surprise", "The danger list does not keep patients safe");
  [["72%", "the danger-phrase\nlist alone", false],
   ["98%", "the trained\nmodel", true]].forEach(([b, l, dark], i) => {
    const x = M + i * 5.9;
    card(s, x, 1.65, 5.4, 1.95, dark);
    s.addText(b, { x: x + 0.35, y: 1.85, w: 2.4, h: 0.8, fontFace: HEAD, fontSize: 34,
      bold: true, color: dark ? PAPER : INK, isTextBox: true, margin: 0 });
    s.addText(l, { x: x + 2.9, y: 1.95, w: 2.3, h: 0.8, fontFace: BODY, fontSize: 12.5,
      color: dark ? ON_DARK : MUTED, lineSpacing: 15, isTextBox: true, margin: 0 });
  });
  script(s, [
    ["We measured the danger-phrase list separately from the model, and that was the most useful check we ran. On its own the list catches 72 percent of emergencies; the model catches 98.", {}],
    ["So the intuition that the rules keep the patient safe and the model is convenience is backwards. The model carries the safety; the list is a narrow backstop.", { bold: true }],
    ["The improvement had a price. Rewriting the list took it from 30 percent to 72, but it now raises more false alarms: right 75 percent of the time instead of 87. For triage that is the correct direction, but it is a choice we made, not a free win.", {}],
  ]);
}

// ================================================================ 14
{
  const s = slide();
  head(s, "Week 3 — data we did not write", "We tested on real patients at last");
  [["0.98", "our own test data", false, true], ["0.84", "our own, other words", false, true],
   ["0.64", "real patient complaints", true, false]].forEach(([b, l, dark, grey], i) => {
    const x = M + i * 3.95;
    card(s, x, 1.65, 3.6, 1.95, dark);
    s.addText(b, { x: x + 0.35, y: 1.85, w: 2.9, h: 0.8, fontFace: HEAD, fontSize: 34,
      bold: true, color: dark ? PAPER : (grey ? FAINT : INK), isTextBox: true, margin: 0 });
    s.addText(l, { x: x + 0.35, y: 2.7, w: 2.9, h: 0.6, fontFace: BODY, fontSize: 12.5,
      bold: !grey, color: dark ? ON_DARK : MUTED, isTextBox: true, margin: 0 });
  });
  s.addText("6 360 real outpatient complaints, released by Sber's AI lab under an open licence", {
    x: M, y: 3.75, w: 11.5, h: 0.35, fontFace: BODY, fontSize: 12.5, italic: true,
    color: FAINT, isTextBox: true, margin: 0 });
  script(s, [
    ["Until now everything we tested ourselves on, we had written ourselves. That was the largest assumption in the work, and it is now partly removed. These are genuine outpatient records, with typos, abbreviations and drug names.", {}],
    ["Each step down removes one assumption. The last number is the first check against text nobody here wrote, and it is the one to judge us on. The drop makes sense: ours are what a person types into a form, theirs are clinical shorthand.", { bold: true }],
    ["Two limits. It cannot test urgency at all — the records carry a diagnosis, and urgency does not follow from a diagnosis. And it covers 46 percent of the corpus; the rest needs an orthopedist, a urologist and an endocrinologist, which we do not route to.", {}],
  ]);
  s.addNotes("End here. This closes the most obvious objection to the whole project.");
}

pres.writeFile({ fileName: OUT }).then(() => console.log("written:", OUT));
