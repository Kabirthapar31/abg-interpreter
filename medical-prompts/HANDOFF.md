# HANDOFF: The 1,000 Medical Prompts (Parabox AI): paste this into a new chat to continue

You are continuing a project for **Dr. Abhishek J. Benur** (MD Respiratory Medicine, AIIMS Rishikesh; Co-Founder,
Parabox AI; Instagram @abhishekjbenur; paraboxai.com): a library of **exactly 1,000 AI prompts** for doctors,
residents and medical students, published as **three PDF volumes** plus a combined edition, in the Parabox
black-and-orange design.

## Where everything lives
- Repo: `kabirthapar31/abg-interpreter`, branch **`claude/medical-prompts-pdf-qsg4x1`** (always push here).
- Folder: `medical-prompts/`
  - `SKILL.md`: the prompt-writing rules (lab guidelines + Parabox house style). **Read it first.**
  - `PROGRESS.md`: section-by-section status. **Check it to see what's done.**
  - `prompts/vol1/*.txt`, `prompts/vol2/*.txt`, `prompts/vol3/*.txt`: prompt source files (one file per section).
  - `build/library.py`: parser + QA. Run `python3 build/library.py N` (N = volume) and it must print `QA clean`.
  - `build/render.py`: renders `VolN_*.pdf` via headless Chromium. Run `python3 build/render.py N`.
  - `build/fonts/`: Poppins and Lora woff2 files (already downloaded).
  - Deliverables: `Medical_Prompt_Guidelines.pdf` (step 1), `1000_Prompts_Blueprint.pdf` (step 2),
    `Vol1_Thesis_Research_Publication.pdf` (done, 400 prompts, 210 pages).
- Chromium binary: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (already set in render.py).
  Python deps: `pip install pymupdf pypdf` if missing.

## Decisions the user approved (do not re-ask)
1. Three volumes + a combined edition. **Exactly 1,000 prompts**: Vol 1 Thesis 400 (#1–400), Vol 2 Seminars 300
   (#401–700), Vol 3 Study 300 (#701–1000).
2. Framework: the user's own **P-R-O-M-P-T** (Persona, Request, Output, Material, Parameters, Tweak), written in the
   order Persona → MY CONTEXT → TASK → RULES → OUTPUT (→ TWEAK for Master prompts).
3. Tiers (word count of the prompt body, enforced by QA): **Quick 40–80**, **Standard 100–200**, **Master 250–450**.
   Aim for about 12% Master, 57% Standard and 31% Quick per section.
4. **Exam defaults:** MBBS students and graduates → **NEET-PG and UPSC CMS**; residents → their **residency
   university exams (MD/MS/DNB theory, practical, viva)**. USMLE / PLAB / MRCP are optional inside brackets, e.g.
   `[NEET-PG / UPSC CMS / USMLE / PLAB / MRCP]`. INI-CET is not a default.
5. India-first realism (government medical college, ICMR, NFHS, CTRI, IEC, local languages), with brackets for others.
6. The user's existing prompts were reused and refreshed as Master anchors in Vol 1 (thesis). For Vol 3, refresh
   their exam prompts from "Ophthalmology Claude Prompts" (Topic Master, Viva Simulator, Comparison Table, PYQ Answer
   Writer, Flashcards), "3 ChatGPT Prompts" (tutor, study coach, exam mentor), "15 AI Cheat Codes" (layers,
   flowchart, decision matrix, roadmap…) and the NEET-PG study guide (NotebookLM audio, Custom GPT, viva drill).
   For Vol 2, refresh their "Medical Presentation Builder" (mixed-audience deck) as a Master anchor.

## Source-file format (parsed by build/library.py)
```
# 2.1 | Section title | One-line WHY for the section opener page
@@ M | unique-slug | Prompt title
aud: PG Resident / MBBS Student
use: When to use it.
why: Why this prompt exists (Master only).
persona: You are a … with … You are known for …
context: Field: [e.g. …]
Another field: [PLACEHOLDER]
[PASTE … HERE]            ← paste slots always go in context, never in task
task: 1. …
2. …
rules: A rule, then the action to take instead, and "because …" (pair every "Do not" with a fix and a reason).
output: The exact shape, length and tone.
tweak: Self-critique ending (Master only).
tips:
- tip 1 (Master only, 3 tips)
- tip 2
- tip 3
next: another-slug        ← optional; must exist in the SAME volume
@@ S | slug | Title
aud / use / persona / context / task / rules / output / tip / try / next
@@ Q | slug | Title
aud: …
body: Act as … (one paragraph, 40–80 words, ≤5 placeholders)
try: A concrete TRY IT WITH example.
```
Master cards need aud, use, why, persona, context, task, rules, output, tweak, tips. Standard cards need aud, use,
persona, context, task, rules, output, tip (plus try and next where useful). Quick cards need aud, body, try.
Within each section file, order the prompts Masters first, then Standards, then Quicks (numbering follows file order).

## Style rules (short version; the full version is in SKILL.md)
- The persona is a senior expert with credentials and a personality trait, never just "an expert".
- Accuracy guards: `[CITE]`, `[VERIFY]`, `[VERIFY IN ICMR GUIDELINES]`, `[CHECK …]`, `[ASK ME: …]`, `[NOT REPORTED]`.
  Never let a prompt invite invented references, statistics, drug doses or guideline claims; tell the model to mark
  them `[VERIFY]`.
- Clinical prompts: de-identified details only; say "reason step by step"; frame outputs as learning and decision
  support, not a substitute for clinical judgement.
- Say what to do, not only what to avoid. Name the output shape. Avoid contradictions. Write plain, direct English.
- Write each prompt comfortably inside its tier. Short prompts fail QA, so err slightly long.

## Workflow per section
1. Write `prompts/volN/NN_name.txt`.
2. Run `python3 build/library.py N` and fix every issue until it prints `QA clean` (the section count must match
   the target in PROGRESS.md).
3. Update PROGRESS.md (mark the section done), then `git add -A && git commit && git push -u origin
   claude/medical-prompts-pdf-qsg4x1`.
4. When a volume is complete, run `python3 build/render.py N`, check for sparse pages (see the snippet in
   PROGRESS.md), then send the PDF to the user.
Commit messages end with the session attribution lines given by the environment.

## Plans for Volumes 2 and 3
See PROGRESS.md for the section targets and status. Planned sections:
- **Vol 2 · Seminars, Journal Clubs & Presentations (#401–700):** 2.1 Seminar preparation (60) · 2.2 Journal club
  (60) · 2.3 Slide design & structure (40) · 2.4 Talks & oral presentations (35) · 2.5 Posters & visual teaching aids
  (35) · 2.6 Case presentations & grand rounds (40) · 2.7 Delivery, Q&A & teaching (30).
- **Vol 3 · Study, Exam & Viva Prep (#701–1000):** 3.1 Learning any topic (50) · 3.2 Study planning & revision (30)
  · 3.3 MCQ practice & exam strategy (NEET-PG, UPSC CMS) (50) · 3.4 Long/short answer writing (30) · 3.5 Viva &
  OSCE / practical exams (50) · 3.6 Clinical reasoning & differential diagnosis (60) · 3.7 Memory aids &
  high-yield summaries (30).
- Vol 1 section 1.13 already covers research conference abstracts, posters and oral papers, so Vol 2 sections 2.4
  and 2.5 focus on general teaching talks, CMEs, educational posters and visual aids (no duplicates).

## After all three volumes
Build the combined edition: add a combined mode to render.py that loads vol1–3 and uses one cover titled "The 1,000
Medical Prompts", then send all PDFs. Final numbering must run from 1 to 1000 with no gaps.
