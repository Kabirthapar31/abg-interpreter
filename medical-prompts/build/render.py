"""Render a volume of the library to HTML and PDF in the Parabox design system.

Usage: python3 build/render.py 1
"""
import subprocess
import sys
from pathlib import Path

from library import ROOT, TIERS, fmt, load_volume, qa, stats, words

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"

VOLUMES = {
    1: {"start": 1, "title": "Thesis, Research<br><em>&amp; Publication.</em>", "plain": "Thesis, Research & Publication",
        "file": "Vol1_Thesis_Research_Publication",
        "lead": "400 clinician-grade AI prompts for every stage of your thesis and first papers, from finding a feasible topic to the published manuscript, case report and conference poster."},
    2: {"start": 401, "title": "Seminars, Journal Clubs<br><em>&amp; Presentations.</em>", "plain": "Seminars, Journal Clubs & Presentations",
        "file": "Vol2_Seminars_JournalClubs_Presentations",
        "lead": "300 prompts to build seminars on any topic, appraise and present journal articles, design slides and posters, and deliver talks that hold a room."},
    3: {"start": 701, "title": "Study, Exam<br><em>&amp; Viva Prep.</em>", "plain": "Study, Exam & Viva Prep",
        "file": "Vol3_Study_Exam_Viva",
        "lead": "300 prompts to learn any topic, plan revision, practise MCQs for NEET-PG and UPSC CMS, write university answers, face the viva and reason through a differential diagnosis."},
}


BACK = {
    1: {"tools": [
            ("Mapping research gaps, current literature", "Perplexity (Academic), Consensus", "Live search with clickable citations"),
            ("Reading and comparing your own PDFs", "NotebookLM, Claude, ChatGPT (upload)", "Answers grounded in the documents you give it"),
            ("Finding recent Indian papers", "Semantic Scholar, PubMed", "Filters by year and field; TLDR summaries"),
            ("Drafting and structuring long text", "Claude, ChatGPT, Gemini", "Strong long-form structure and formatting control"),
            ("Running statistics on your data", "ChatGPT data analysis, Julius AI, Gemini in Sheets", "Reads CSV/XLSX and runs code, but verify every number"),
            ("Sample size cross-check", "OpenEpi, G*Power", "Validated calculators to confirm AI arithmetic"),
            ("Posters and figures", "Canva, PowerPoint, ChatGPT images", "Layout and custom visuals")],
        "ethics_title": "The ethics of AI in research",
        "ethics": ["Disclose AI use as your institution and target journal require.",
                   "Don't submit AI text verbatim. Rewrite it in your own academic voice.",
                   "Verify every statistic, reference and data point against the primary source.",
                   "AI cannot replace your guide's approval, your IEC clearance or your clinical judgement."],
        "closing": "These prompts will not make you a researcher. They will make you a faster one, and only if the judgement behind them is yours. The clinicians who do well in the next decade will not be the ones who use AI the most. They will be the ones who know exactly when to stop trusting it.",
        "slogan": "Use them. Check everything. Publish work you can defend.",
        "disclaimer": "This resource is for educational purposes. It does not replace your institutional research guidelines, ethics committee requirements, university thesis regulations or the advice of your supervisor and statistician. Verify all AI-generated content independently before using it in any submitted work. AI cannot be an author; disclose AI use per ICMJE and your target journal's policy."},
    2: {"tools": [
            ("Studying sources for a seminar", "NotebookLM, Claude, ChatGPT (upload)", "Answers and audio overviews grounded in your PDFs"),
            ("Current evidence and recent trials", "Perplexity (Academic), Consensus", "Live search with clickable citations"),
            ("Outlines, scripts and speaker notes", "Claude, ChatGPT, Gemini", "Strong structure and plain-language rewriting"),
            ("Slide decks", "PowerPoint (Copilot), Gamma, Canva", "Fast first drafts from your verified outline"),
            ("Posters, infographics and leaflets", "Canva, ChatGPT images, Gemini images", "Layouts and illustrations; proofread every word"),
            ("Polls and live quizzes", "Mentimeter, Slido, Google Forms", "Turn a lecture into an interactive session"),
            ("Rehearsal feedback", "Phone recording + AI transcript review", "See your pace, filler words and timing")],
        "ethics_title": "Teaching with AI, responsibly",
        "ethics": ["Verify every drug dose, guideline year and trial detail before it goes on a slide.",
                   "Never put identifiable patient data or images into AI tools or slides.",
                   "Credit figures you adapt, and use only images you have the right to use.",
                   "AI drafts the deck. You own the content, the delivery and the answers."],
        "closing": "These prompts will not make you a great teacher. They will give you more time to become one: time to rehearse, to listen to your audience and to answer the question behind the question. The best presenters use AI to prepare and themselves to connect.",
        "slogan": "Prepare with AI. Teach with judgement. Leave the room better informed.",
        "disclaimer": "This resource is for educational purposes. Clinical content in any seminar, poster or protocol must be verified against current guidelines and your institution's approved protocols. It does not replace the advice of your moderator, department or hospital policy. Verify all AI-generated content independently before presenting or distributing it."},
    3: {"tools": [
            ("Learning a topic from your own books and notes", "NotebookLM, Claude, ChatGPT (upload)", "Explanations grounded in your sources"),
            ("Tutoring, active recall and self-testing", "ChatGPT Study mode, Claude, Gemini", "Socratic questioning and instant feedback"),
            ("Custom exam tutor from your notes", "Custom GPTs, Claude Projects, Gemini Gems", "Answers only from your uploaded material"),
            ("Flashcards and spaced repetition", "Anki, Quizlet", "Proven spaced-repetition scheduling"),
            ("Audio revision on the move", "NotebookLM Audio Overview", "Turns chapters into listenable discussions"),
            ("Visual notes and mind maps", "Canva, Napkin AI, ChatGPT images", "Diagrams and summary sheets"),
            ("Checking facts and recent guidelines", "Perplexity, Consensus, the guideline itself", "Cited sources you can verify")],
        "ethics_title": "Studying with AI, safely",
        "ethics": ["Verify every fact, number and drug dose against a standard textbook or current guideline.",
                   "Use AI to test yourself, not to avoid thinking. Answer first, then check.",
                   "Never use AI during an exam or assessment where it isn't allowed.",
                   "Clinical reasoning prompts are for learning, not for decisions about real patients."],
        "closing": "These prompts will not pass your exam for you. They will make every hour of study count: more recall, more practice and more feedback. The doctors who do best will be the ones who use AI to think harder, not less.",
        "slogan": "Test yourself. Check everything. Walk into the exam hall ready.",
        "disclaimer": "This resource is for educational purposes. It does not replace standard textbooks, current clinical guidelines, your university curriculum or your teachers. AI-generated content may contain errors: verify all facts independently. Clinical reasoning prompts are learning aids and are not a substitute for clinical judgement or supervision in patient care."},
}

CSS = """
@page { size: A4; margin: 15mm 16mm 17mm 16mm; background: #0a0808;
  @bottom-left { content: "THE 1,000 MEDICAL PROMPTS · VOL %(vol)s"; font-family: Poppins; font-size: 6.5pt; letter-spacing: .1em; color: #8a7f75; }
  @bottom-right { content: "@abhishekjbenur · " counter(page); font-family: Poppins; font-size: 6.5pt; color: #ff641e; }
}
@page cover { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
:root { --bg:#0a0808; --panel:#141010; --panel2:#1a1413; --line:#33291f; --ink:#fbf4ec; --body:#e9ded2; --muted:#b8aba0; --dim:#8a7f75; --or:#ff641e; --or-soft:rgba(255,100,30,.12); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { background: var(--bg); }
body { background: var(--bg); font-family: Poppins, 'DejaVu Sans', sans-serif; color: var(--body); font-size: 8.4pt; line-height: 1.5; }
b, strong { color: var(--ink); font-weight: 600; }
.kick { font-size: 6.8pt; font-weight: 600; letter-spacing: .28em; text-transform: uppercase; color: var(--or); margin-bottom: 1.5mm; }
h2 { font-weight: 700; color: var(--ink); font-size: 19pt; line-height: 1.15; margin-bottom: 4mm; }
h2 em, h1 em { font-style: normal; color: var(--or); }
h3 { font-weight: 600; color: var(--ink); font-size: 10pt; margin: 4mm 0 2mm; }
.lead { font-family: Lora, serif; font-style: italic; color: var(--muted); font-size: 10.5pt; line-height: 1.55; margin-bottom: 5mm; }
p { margin-bottom: 2.5mm; }
.brk { break-before: page; }
.small { font-size: 7.3pt; color: var(--muted); }
.ph { color: var(--or); }
ul.arrow { list-style: none; }
ul.arrow li { padding-left: 4.5mm; position: relative; margin-bottom: 1.5mm; }
ul.arrow li::before { content: "›"; position: absolute; left: 0; color: var(--or); font-weight: 700; }
table { width: 100%%; border-collapse: collapse; font-size: 7.8pt; margin: 2mm 0 4mm; }
th { text-align: left; font-size: 6.6pt; letter-spacing: .14em; text-transform: uppercase; color: var(--or); font-weight: 600; padding: 1.8mm 2mm; border-bottom: 1px solid var(--or); }
td { padding: 1.7mm 2mm; border-bottom: 1px solid var(--line); vertical-align: top; }
tr { break-inside: avoid; }
.callout { border: 1px solid var(--or); background: var(--or-soft); border-radius: 2mm; padding: 3.5mm 4mm; margin: 3mm 0; break-inside: avoid; }

/* cover */
.cover { page: cover; height: 297mm; display: flex; flex-direction: column; }
.cover .top { padding: 22mm 20mm 0; flex: 1; }
.brand { font-size: 7.5pt; font-weight: 600; letter-spacing: .45em; color: var(--ink); display: flex; align-items: center; gap: 2.5mm; }
.brand::before { content: ""; width: 2.3mm; height: 2.3mm; border-radius: 50%%; background: var(--or); display: inline-block; }
.cover .kick { margin-top: 30mm; font-size: 7.6pt; }
.cover h1 { font-weight: 800; color: var(--ink); font-size: 40pt; line-height: 1.02; margin: 5mm 0 6mm; text-transform: uppercase; letter-spacing: -.01em; }
.cover .lead { font-size: 12pt; max-width: 150mm; }
.cover .secs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5mm 4mm; margin-top: 10mm; border-top: 1px solid var(--line); padding-top: 4mm; }
.cover .secs div { font-size: 7pt; color: var(--muted); line-height: 1.35; }
.cover .secs b { display: block; color: var(--or); font-size: 7pt; }
.cover .band { background: var(--or); color: #1a0d05; padding: 10mm 20mm; display: flex; justify-content: space-between; align-items: flex-end; }
.cover .band .nm { font-weight: 700; font-size: 13pt; }
.cover .band .cr { font-size: 7.4pt; margin-top: 1mm; }
.cover .band .h { font-weight: 700; font-size: 10pt; text-align: right; }
.cover .band .h span { display: block; font-weight: 400; font-size: 7.4pt; }
.cover .stat { display: flex; gap: 10mm; margin-top: 8mm; }
.cover .stat div b { display: block; font-size: 22pt; font-weight: 800; color: var(--ink); line-height: 1.1; }
.cover .stat div { font-size: 7.2pt; color: var(--muted); border-top: 2px solid var(--or); padding-top: 2mm; min-width: 30mm; }

/* front matter */
.nn .it { display: grid; grid-template-columns: 10mm 1fr; margin-bottom: 3.5mm; }
.nn .k { color: var(--or); font-weight: 700; font-size: 12pt; line-height: 1.15; }
.nn b { display: block; font-size: 9.5pt; margin-bottom: .5mm; }
.pp { display: grid; grid-template-columns: repeat(6, 1fr); gap: 2.2mm; margin: 3mm 0 4mm; }
.pp > div { background: var(--panel); border: 1px solid var(--line); border-top: 2.5px solid var(--or); border-radius: 0 0 2mm 2mm; padding: 3mm 2.4mm; }
.pp .L { font-size: 22pt; font-weight: 800; color: var(--or); line-height: 1; }
.pp .w { font-weight: 600; color: var(--ink); font-size: 8.4pt; margin-top: 1mm; }
.pp .d { font-size: 6.9pt; color: var(--muted); line-height: 1.4; margin-top: 1mm; }
.bgb { display: grid; grid-template-columns: 22mm 1fr; gap: 2mm; padding: 2.5mm 0; border-bottom: 1px solid var(--line); }
.bgb span { font-weight: 700; letter-spacing: .15em; font-size: 7pt; }
.tiers { display: grid; grid-template-columns: repeat(3,1fr); gap: 3mm; margin: 3mm 0; }
.tier { background: var(--panel); border: 1px solid var(--line); border-radius: 2mm; padding: 3mm 3.5mm; }
.tier .t { font-weight: 700; color: var(--ink); }
.toc .row { display: grid; grid-template-columns: 12mm 1fr 26mm; padding: 2.1mm 0; border-bottom: 1px dotted var(--line); font-size: 9pt; }
.toc .row span:first-child { color: var(--or); font-weight: 700; }
.toc .row span:last-child { text-align: right; color: var(--muted); font-size: 8pt; }

/* section opener */
.opener { break-before: page; padding-top: 50mm; }
.opener.long { padding-top: 14mm; }
.opener.long .big { font-size: 48pt; }
.opener.long h2 { font-size: 22pt; margin: 2mm 0 3mm; }
.opener.long .meta { margin: 4mm 0 5mm; }
.opener.xlong { padding-top: 8mm; }
.opener.xlong .lead { margin-bottom: 3mm; font-size: 10.5pt; }
.opener.xlong ol { columns: 3; column-gap: 5mm; font-size: 6.6pt; }
.opener.xlong ol li { padding: .8mm 0; grid-template-columns: 8mm 1fr; }
.opener .big { font-size: 64pt; font-weight: 800; color: var(--or); line-height: 1; }
.opener h2 { font-size: 26pt; margin: 3mm 0 5mm; }
.opener .lead { font-size: 12pt; max-width: 150mm; }
.opener .meta { display: flex; gap: 8mm; margin: 6mm 0 8mm; }
.opener .meta div { border-top: 2px solid var(--or); padding-top: 2mm; font-size: 7.2pt; color: var(--muted); min-width: 26mm; }
.opener .meta b { display: block; font-size: 16pt; font-weight: 800; color: var(--ink); line-height: 1.1; }
.opener ol { list-style: none; columns: 2; column-gap: 8mm; font-size: 7.6pt; }
.opener ol li { break-inside: avoid; padding: 1.2mm 0; border-bottom: 1px solid var(--line); display: grid; grid-template-columns: 9mm 1fr; }
.opener ol li span { color: var(--or); font-weight: 600; }

/* cards */
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 2.2mm; padding: 3.5mm 4mm; margin-bottom: 4mm; break-inside: avoid; }
.card.master { break-before: page; border: none; background: none; padding: 0; }
.pc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 3mm; margin-bottom: 1mm; }
.pc-num { font-size: 15pt; font-weight: 800; color: var(--or); line-height: 1; margin-right: 2.5mm; }
.pc-title { font-size: 10.3pt; font-weight: 700; color: var(--ink); line-height: 1.25; }
.master .pc-num { font-size: 28pt; display: block; margin-bottom: 1mm; }
.master .pc-title { font-size: 17pt; display: block; line-height: 1.15; }
.badge { flex: none; font-size: 6pt; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; border: 1px solid var(--or); color: var(--or); border-radius: 5mm; padding: .3mm 2.2mm; margin-top: .8mm; }
.badge.S { background: var(--or); color: #1a0d05; }
.badge.M { background: var(--ink); color: #1a0d05; border-color: var(--ink); }
.pc-meta { font-size: 6.6pt; color: var(--dim); letter-spacing: .06em; text-transform: uppercase; margin-bottom: 2.2mm; }
.use { font-size: 7.8pt; color: var(--muted); margin-bottom: 2.2mm; }
.lab { color: var(--or); font-size: 6.2pt; letter-spacing: .18em; font-weight: 600; margin-right: 1.5mm; text-transform: uppercase; }
.why { font-family: Lora, serif; font-style: italic; color: var(--muted); font-size: 8.6pt; margin-bottom: 3mm; }
.duo { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 2mm 0 3.5mm; }
.duo > div { background: var(--panel); border: 1px solid var(--line); border-radius: 2mm; padding: 3mm 3.5mm; }
.duo .lab { display: block; margin-bottom: 1mm; }
.copy { font-size: 6.4pt; letter-spacing: .22em; color: var(--or); font-weight: 600; margin-bottom: 1.5mm; }
.prompt { background: var(--panel2); border-left: 2.5px solid var(--or); border-radius: 0 2mm 2mm 0; padding: 3mm 4mm; font-size: 7.9pt; line-height: 1.55; color: var(--body); }
.master.dense .prompt { font-size: 7.3pt; line-height: 1.4; }
.master.dense .duo { margin: 1mm 0 2mm; }
.master.xdense .prompt { font-size: 7pt; }
.master.xdense .prompt .row { padding: .9mm 0; }
.master .prompt { font-size: 7.8pt; padding: 3.2mm 4.5mm; line-height: 1.45; }
.prompt .row { display: grid; grid-template-columns: 17mm 1fr; gap: 2mm; padding: 1.3mm 0; border-top: 1px solid #2a211b; }
.prompt .row:first-child { border-top: none; padding-top: 0; }
.prompt .blk { font-size: 6.1pt; letter-spacing: .16em; font-weight: 600; color: var(--or); text-transform: uppercase; padding-top: .4mm; }
.tipline { font-size: 7.6pt; color: var(--muted); margin-top: 2.2mm; }
.nx { color: var(--or); font-weight: 600; }
.tips { margin-top: 3mm; }
.qgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 4mm; }
.qgrid .card { margin-bottom: 0; }
.qgrid .card { padding: 3mm 3.5mm; }
.qgrid .pc-title { font-size: 9pt; }
.qgrid .pc-num { font-size: 12pt; }
.qhead { break-before: auto; break-after: avoid; margin: 2mm 0 3mm; }

/* index */
.idx { columns: 2; column-gap: 7mm; font-size: 7pt; }
.idx .s { break-after: avoid; color: var(--or); font-weight: 600; font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; margin: 3mm 0 1mm; }
.idx .r { display: grid; grid-template-columns: 8mm 1fr 5mm; padding: .55mm 0; border-bottom: 1px solid #1d1614; break-inside: avoid; }
.idx .r span:first-child { color: var(--or); font-weight: 600; }
.idx .r span:last-child { color: var(--dim); font-size: 6pt; text-align: right; }
"""


def card(p):
    t = p["tier"]
    head = (f'<div class="pc-head"><div><span class="pc-num">{p["n"]}</span>'
            f'<span class="pc-title">{fmt(p["title"])}</span></div>'
            f'<span class="badge {t}">{TIERS[t]}</span></div>'
            f'<div class="pc-meta">{p["section"]} {fmt(p["section_title"])} · {fmt(p["aud"])}</div>')
    nxt = ""
    if p.get("next"):
        nxt = f' <span class="nx">→ NEXT #{p["next_n"]}</span> {fmt(p["next_title"])}'
    if t == "Q":
        return (f'<div class="card">{head}<div class="prompt">{fmt(p["body"])}</div>'
                f'<div class="tipline"><span class="lab">Try it with</span>{fmt(p["try"])}</div></div>')
    blocks = [("Persona", "persona"), ("My context", "context"), ("Task", "task"),
              ("Rules", "rules"), ("Output", "output")]
    if t == "M":
        blocks.append(("Tweak", "tweak"))
    body = "".join(f'<div class="row"><span class="blk">{lbl}</span><div>{fmt(p[k])}</div></div>' for lbl, k in blocks)
    if t == "S":
        extra = f'<div class="tipline"><span class="lab">Pro tip</span>{fmt(p["tip"])}</div>'
        if p.get("try"):
            extra += f'<div class="tipline"><span class="lab">Try it with</span>{fmt(p["try"])}</div>'
        if nxt:
            extra += f'<div class="tipline">{nxt}</div>'
        return (f'<div class="card">{head}<div class="use"><span class="lab">Use it</span>{fmt(p["use"])}</div>'
                f'<div class="prompt">{body}</div>{extra}</div>')
    tips = "".join(f"<li>{fmt(x.lstrip('- ').strip())}</li>" for x in p["tips"].splitlines() if x.strip())
    dense = " dense xdense" if words(p) > 410 else " dense" if words(p) > 380 else ""
    return (f'<div class="card master{dense}">{head}'
            f'<div class="duo"><div><span class="lab">Use it</span>{fmt(p["use"])}</div>'
            f'<div class="why" style="margin:0"><span class="lab" style="font-family:Poppins;font-style:normal">Why</span>{fmt(p["why"])}</div></div>'
            f'<div class="copy">COPY THE PROMPT BELOW</div><div class="prompt">{body}</div>'
            f'<h3>How to get more out of it</h3><ul class="arrow small tips">{tips}'
            + (f'<li>{nxt}</li>' if nxt else "") + '</ul></div>')


def front_matter(vol, cfg, secs, total, counts):
    first, last = cfg["start"], cfg["start"] + total - 1
    sec_html = "".join(f'<div><b>{s["num"]}</b>{fmt(s["title"])}</div>' for s in secs)
    cover = f"""
<div class="cover"><div class="top"><div class="brand">PARABOX AI</div>
<div class="kick">The 1,000 Medical Prompts · Volume {vol} of 3</div>
<h1>{cfg["title"]}</h1><p class="lead">{cfg["lead"]}</p>
<div class="stat"><div><b>{total}</b>prompts · #{first}–{last}</div><div><b>{len(secs)}</b>sections</div>
<div><b>{counts["M"]} · {counts["S"]} · {counts["Q"]}</b>Master · Standard · Quick</div></div>
<div class="secs">{sec_html}</div></div>
<div class="band"><div><div class="nm">Dr. Abhishek J. Benur</div><div class="cr">MD Respiratory Medicine, AIIMS Rishikesh · Co-Founder, Parabox AI</div></div>
<div class="h">@abhishekjbenur<span>paraboxai.com</span></div></div></div>"""

    first_page = """
<div class="brk"><div class="kick">Before you start</div><h2>Read this <em>first.</em></h2>
<p class="lead">These prompts are written the way a research supervisor thinks, not the way a chatbot answers. Many are long on purpose: a vague prompt gets you a vague, confident, wrong answer. Before you paste anything, five non-negotiables.</p>
<div class="nn">
<div class="it"><div class="k">01</div><div><b>The AI does not know your patients.</b>Every prompt has a context block. Fill it honestly. If you say you have 200 cases a year when you have 40, the model will design a study you cannot finish.</div></div>
<div class="it"><div class="k">02</div><div><b>Never accept a citation you have not opened.</b>Language models fabricate references that look flawless: real journal, real authors, wrong or non-existent paper. Verify every reference on PubMed by PMID or DOI before it enters your work.</div></div>
<div class="it"><div class="k">03</div><div><b>Never paste identifiable patient data.</b>No names, hospital IDs, MRNs or scans with burned-in identifiers. De-identify before the data touches a chatbot. This is an ethics committee issue, not a preference.</div></div>
<div class="it"><div class="k">04</div><div><b>The AI drafts. You decide.</b>Use it to speed up structure, phrasing and pre-checking. The scientific judgement, the assumptions and the interpretation stay yours. Your name goes on the paper, not the model's.</div></div>
<div class="it"><div class="k">05</div><div><b>Declare AI use where required.</b>ICMJE and most journals require disclosure of generative AI use. AI cannot be an author. Check your journal's policy and your university's thesis rules before submission.</div></div>
</div>
<h3>How to use each prompt</h3>
<ul class="arrow">
<li>Copy the full prompt. The length is what makes the output specific.</li>
<li>Replace every <span class="ph">[SQUARE BRACKET]</span> with your real details. Options inside a bracket are separated by "/"; keep the one that applies.</li>
<li>Put anything you paste (abstracts, drafts, results) where the prompt shows <span class="ph">[PASTE …]</span>, above the task.</li>
<li>Use a model with web search or document upload switched on wherever the prompt asks for evidence.</li>
<li>Run each stage in a fresh chat so the model doesn't carry assumptions from earlier steps.</li>
<li>Push back. If the output is generic, reply: "Be more specific. Tie every point to my context."</li>
</ul></div>"""

    framework = """
<div class="brk"><div class="kick">The framework</div><h2>Every prompt is built on <em>P-R-O-M-P-T.</em></h2>
<p class="lead">One formula, six layers. Each layer matches what OpenAI, Anthropic, Google and Microsoft recommend in their own prompting guides.</p>
<div class="pp">
<div><div class="L">P</div><div class="w">Persona</div><div class="d">Who the AI should be: a senior expert with a trait</div></div>
<div><div class="L">R</div><div class="w">Request</div><div class="d">One clear task, as numbered steps</div></div>
<div><div class="L">O</div><div class="w">Output</div><div class="d">Shape, length, tone, tables</div></div>
<div><div class="L">M</div><div class="w">Material</div><div class="d">Your context and anything you paste</div></div>
<div><div class="L">P</div><div class="w">Parameters</div><div class="d">Rules, guidelines, accuracy guards</div></div>
<div><div class="L">T</div><div class="w">Tweak</div><div class="d">Self-critique and the next step</div></div>
</div>
<h3>See it in action</h3>
<div class="bgb"><span style="color:#b8aba0">BAD</span><div>"Tell me about pneumonia."</div></div>
<div class="bgb"><span style="color:#e9ded2">GOOD</span><div>"Explain community-acquired pneumonia management for an MBBS exam."</div></div>
<div class="bgb"><span class="ph">BETTER</span><div>"Act as a pulmonologist. Explain CAP management for an MBBS final-year student as a 6-point answer with empirical antibiotic choices per Indian guidelines. Keep it under 150 words, exam-oriented."</div></div>
<h3>Three kinds of prompt</h3>
<div class="tiers">
<div class="tier"><span class="badge Q" style="display:inline-block">Quick</span><p class="t" style="margin-top:2mm">40–80 words</p><p class="small">One focused output in a few sentences. Each has a TRY IT WITH example.</p></div>
<div class="tier"><span class="badge S" style="display:inline-block">Standard</span><p class="t" style="margin-top:2mm">100–200 words</p><p class="small">One real task done properly: context, numbered task, rules, output, a pro tip and the next prompt to run.</p></div>
<div class="tier"><span class="badge M" style="display:inline-block">Master</span><p class="t" style="margin-top:2mm">250–450 words</p><p class="small">A full workflow on its own page, with when to use it, why it exists and how to get more out of it.</p></div>
</div>
<h3>Tags you will see in the outputs</h3>
<table><tr><th style="width:38%">Tag</th><th>What to do</th></tr>
<tr><td class="ph">[CITE] · [CITATION NEEDED]</td><td>Find a real source on PubMed and insert it yourself.</td></tr>
<tr><td class="ph">[VERIFY] · [ASSUMPTION — VERIFY FROM PUBLISHED DATA]</td><td>Replace the number with a sourced figure before use.</td></tr>
<tr><td class="ph">[UNVERIFIED BACKGROUND]</td><td>Treat as a lead to check, not a fact.</td></tr>
<tr><td class="ph">[ASK ME] · [NEED INFO] · [NOT REPORTED]</td><td>The model is missing information. Supply it, or leave it out.</td></tr>
</table>
<p class="small">Every prompt works in ChatGPT, Claude, Gemini and Copilot. <span class="nx">→ NEXT</span> points to the prompt to run after this one.</p></div>"""

    toc_rows = "".join(
        f'<div class="row"><span>{s["num"]}</span><span>{fmt(s["title"])}</span>'
        f'<span>#{s["prompts"][0]["n"]}–{s["prompts"][-1]["n"]}</span></div>' for s in secs)
    toc = f"""<div class="brk"><div class="kick">Contents</div><h2>What's in <em>this volume.</em></h2>
<div class="toc">{toc_rows}</div>
<div class="callout" style="margin-top:6mm"><div class="kick">The full library</div>
<span class="small"><b>Volume 1</b> · Thesis, Research &amp; Publication (#1–400) · <b>Volume 2</b> · Seminars, Journal Clubs &amp; Presentations (#401–700) · <b>Volume 3</b> · Study, Exam &amp; Viva Prep (#701–1000). The full index of this volume is at the back.</span></div></div>"""
    return cover + first_page + framework + toc


def section_html(s):
    items = "".join(f'<li><span>#{p["n"]}</span>{fmt(p["title"])}</li>' for p in s["prompts"])
    c = {k: sum(1 for p in s["prompts"] if p["tier"] == k) for k in TIERS}
    n_p = len(s["prompts"])
    cls = "opener long xlong" if n_p > 48 else "opener long" if n_p > 28 else "opener"
    opener = f"""<div class="{cls}"><div class="kick">Section {s["num"]}</div><div class="big">{s["num"]}</div>
<h2>{fmt(s["title"])}</h2><p class="lead">{fmt(s["why"])}</p>
<div class="meta"><div><b>{len(s["prompts"])}</b>prompts</div><div><b>{c["M"]}</b>Master</div><div><b>{c["S"]}</b>Standard</div><div><b>{c["Q"]}</b>Quick</div></div>
<ol>{items}</ol></div>"""
    masters = "".join(card(p) for p in s["prompts"] if p["tier"] == "M")
    stds = "".join(card(p) for p in s["prompts"] if p["tier"] == "S")
    quicks = [p for p in s["prompts"] if p["tier"] == "Q"]
    qhtml = ""
    if quicks:
        qhtml = ('<div class="qhead"><div class="kick">Quick prompts · ' + s["num"] + '</div></div>'
                 '<div class="qgrid">' + "".join(card(p) for p in quicks) + "</div>")
    std_block = f'<div class="brk">{stds}</div>' if stds else ""
    return opener + masters + std_block + qhtml


def back_matter(vol, secs):
    rows = []
    for s in secs:
        rows.append(f'<div class="s">{s["num"]} · {fmt(s["title"])}</div>')
        rows += [f'<div class="r"><span>#{p["n"]}</span><span>{fmt(p["title"])}</span><span>{p["tier"]}</span></div>'
                 for p in s["prompts"]]
    index = f"""<div class="brk"><div class="kick">Index</div><h2>Every prompt <em>at a glance.</em></h2>
<p class="small">Q = Quick · S = Standard · M = Master</p><div class="idx">{"".join(rows)}</div></div>"""
    b = BACK[vol]
    rows_html = "".join(f"<tr><td>{a}</td><td>{t}</td><td>{w}</td></tr>" for a, t, w in b["tools"])
    ethics = "".join(f"<li>{x}</li>" for x in b["ethics"])
    tools = f"""<div class="brk"><div class="kick">Tools</div><h2>Which AI tool <em>for which job.</em></h2>
<table><tr><th style="width:32%">Job</th><th style="width:28%">Best tool</th><th>Why</th></tr>{rows_html}</table>
<div class="callout"><div class="kick">{b["ethics_title"]}</div><ul class="arrow" style="margin-top:1mm">{ethics}</ul></div>
<h3 style="margin-top:8mm">One last thing.</h3>
<p class="lead">{b["closing"]}</p>
<p><b>{b["slogan"]}</b></p>
<p class="small" style="margin-top:6mm">More AI in medicine every week: Instagram <span class="ph">@abhishekjbenur</span> · paraboxai.com</p>
<p class="small" style="margin-top:4mm">{b["disclaimer"]}</p></div>"""
    return index + tools


def render(vol):
    cfg = VOLUMES[vol]
    secs = load_volume(vol, cfg["start"])
    probs, slugs = qa(secs)
    if probs:
        print("QA problems:\n" + "\n".join(probs))
    for s in secs:
        for p in s["prompts"]:
            if p.get("next") and p["next"] in slugs:
                p["next_n"] = slugs[p["next"]]["n"]
                p["next_title"] = slugs[p["next"]]["title"]
    total, counts = stats(secs)
    body = front_matter(vol, cfg, secs, total, counts) + "".join(section_html(s) for s in secs) + back_matter(vol, secs)
    out_html = ROOT / "build" / f"vol{vol}.html"
    out_html.write_text(f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>The 1,000 Medical Prompts · Vol {vol}</title><link rel="stylesheet" href="fonts/fonts.css">
<style>{CSS % {"vol": vol}}</style></head><body>{body}</body></html>""", encoding="utf-8")
    out_pdf = ROOT / f"{cfg['file']}.pdf"
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    "--allow-file-access-from-files", "--virtual-time-budget=10000",
                    "--generate-pdf-document-outline", f"--print-to-pdf={out_pdf}", str(out_html)],
                   check=True, capture_output=True)
    print(f"wrote {out_pdf.name}: {total} prompts {counts}")


if __name__ == "__main__":
    render(int(sys.argv[1]))
