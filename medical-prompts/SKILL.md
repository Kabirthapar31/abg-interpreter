---
name: medical-prompt-writer
description: Write Parabox-style, copy-paste-ready AI prompts for doctors, residents and medical students covering thesis and research, seminars, journal clubs and presentations, and study, exam and viva preparation. Use whenever asked to create, rewrite, audit or batch-generate medical prompts, including the 1,000-prompt library. It combines the prompting guidance of OpenAI, Anthropic, Google and Microsoft with the house style of Dr. Abhishek J. Benur's Parabox prompt packs.
---

# Medical Prompt Writer (v2: lab guidelines + Parabox house style)

A prompt written with this skill should read "the way a research supervisor thinks, not the way a
chatbot answers" and should work unchanged in ChatGPT, Claude, Gemini and Copilot.

Two sources feed it:
1. **Lab guidance** from OpenAI, Anthropic, Google and Microsoft (section 1).
2. **Parabox house style**, taken from 12 published packs: The Complete Thesis Prompts, Research
   Prompt Pack, AI Research Prompts, AI in PG Thesis Parts 1–3, Thesis Stats Toolkit, Prompt
   Cheatcode, Ophthalmology Claude Prompts, Parabox Study Guide, 3 ChatGPT Prompts, Medical
   Presentation Builder, 15 AI Cheat Codes, and 7 Humanize Prompts (section 2).

---

## 1. What every major lab agrees on

| Principle | Source |
|---|---|
| Be clear, specific and direct. A colleague should be able to follow the prompt cold. | All four; Anthropic "golden rule" |
| Give a role or persona | All four (Google Persona, OpenAI Identity, Claude role) |
| Give context and explain *why* | Anthropic, Google (Context), Microsoft (Goal + Context) |
| Name the output format, length and tone | All four (Google Format, Microsoft Expectations) |
| Separate sections with labels, ### or XML | All four |
| Use examples when format matters (Anthropic: 3–5, diverse) | OpenAI, Anthropic |
| Break big work into steps or chained prompts | Anthropic, OpenAI |
| Say what to do, not only what to avoid | All four |
| Ground the answer in a named source; quote before answering | Anthropic, Microsoft (Source) |
| Put long pasted material first and the question last (up to 30% better) | Anthropic |
| No contradictory instructions (GPT-5 follows them literally) | OpenAI |
| Iterate with follow-up turns | All four |

## 2. Parabox house style: 8 traits every prompt keeps

1. **A senior persona with credentials and a personality trait.** For example: "a biostatistician with
   two decades of experience… openly critical of common misuse", or "a strict but fair examiner".
   Never write a bare "You are an expert."
2. **A MY CONTEXT block of labelled fill-in fields,** each with a hint: `Specialty: [e.g. Respiratory Medicine]`.
   "The AI does not know your patients."
3. **A numbered TASK** that names exactly what comes out ("for each, give me exactly this: 1… 10").
4. **A RULES block against fabrication, using named tags:** `[CITE]`, `[VERIFY]`,
   `[ASSUMPTION — VERIFY FROM PUBLISHED DATA]`, `[CITATION NEEDED — FIND SOURCE]`,
   `[UNVERIFIED BACKGROUND — CONFIRM INDEPENDENTLY]`, `[NOT REPORTED]`, `[ASK ME: …]`.
   A citation is allowed only if the user uploaded the paper or the model gives a verified PMID/DOI.
5. **India-first realism:** government medical college, ICMR 2017, NFHS, CTRI, IEC, NEET-PG / INI-CET,
   2-year MD timelines, limited lab infrastructure. International options go inside brackets:
   `[NEET-PG / INI-CET / USMLE / PLAB / MRCP]`.
6. **A self-critique ending:** hostile-reviewer sentences, "AVOID THESE", "act as the ethics
   committee reviewer", or a performance summary with weak areas.
7. **A reader wrapper:** USE IT (when), WHY (in Lora italic, why this prompt exists), and
   HOW TO GET MORE OUT OF IT / PRO TIP.
8. **An honest, direct voice:** "The AI drafts. You decide."

## 3. Merge rules (where lab guidance adjusts the house style)

- **Pair every "Do not" with the action to take instead.** Keep the critical bans, e.g.
  "Do not invent references; put [CITE] where one is needed."
- **The paste slot goes above the TASK.** `[PASTE … HERE]` always sits in MY CONTEXT, before the task.
- **Give a reason for key rules.** Add "…because examiners check every number" so the model generalises.
- **Add examples.** Every Quick and Standard prompt gets a `TRY IT WITH` line. Master prompts get a
  worked example where the format is unusual.
- **One job per prompt, then chain.** Most prompts do one job and end with `→ NEXT #nnn`.
  Master prompts are kept for full workflows (protocol, SAP, full manuscript, full mock viva).
- **No contradictions.** Check before a prompt is accepted.

## 4. The framework: P-R-O-M-P-T (your own acronym, mapped to the labs)

| Block | Meaning | Label in prompt | Lab equivalent |
|---|---|---|---|
| **P**ersona | Senior expert with credentials and a trait | `Persona` (or opening sentence) | Google Persona · OpenAI Identity · Claude role |
| **M**aterial | Context fields + paste slot (written *before* the task) | `MY CONTEXT` | Google/Microsoft Context · Microsoft Source |
| **R**equest | One clear task as numbered steps | `TASK` | Google Task · Microsoft Goal · OpenAI Instructions |
| **P**arameters | Rules, guidelines, accuracy tags | `RULES` | OpenAI constraints · Claude "say if unsure" |
| **O**utput | Shape, length, tone | `OUTPUT` | Google Format · Microsoft Expectations |
| **T**weak | Self-critique ending + PRO TIP + → NEXT | `TWEAK` / tip line | All labs: iterate |

The order inside a prompt is Persona → Material → Request → Parameters → Output → Tweak.

## 5. Length tiers

| Tier | Words (prompt body) | Share of library | Structure | Layout |
|---|---|---|---|---|
| **Quick** | 40–80 | ≈300 | Persona + Request + Output in 2–4 sentences, plus TRY IT WITH | 4 per page |
| **Standard** (default) | 100–200 | ≈580 | USE IT line · Persona · MY CONTEXT (2–5 fields) · TASK · RULES · OUTPUT · PRO TIP · → NEXT | 2 per page |
| **Master** | 250–450 | ≈120 | Full USE IT / WHY / prompt / HOW TO GET MORE OUT OF IT (3 tips) | 1 per page |

Placeholders: 5 or fewer in Quick prompts, and as many as needed in a Master MY CONTEXT block.
Each placeholder carries a hint.

## 6. Card templates

**Quick**
```
#[NNN]  [Title]                                                      [QUICK]
PART › SECTION · AUDIENCE
Act as a [senior persona + trait]. For [MATERIAL / PASTE], [numbered request].
[Output shape + length]. [One accuracy guard].
TRY IT WITH: [concrete example]
```

**Standard**
```
#[NNN]  [Title]                                                   [STANDARD]
PART › SECTION · AUDIENCE
USE IT: [when]
PERSONA   You are [credentialed expert] known for [trait].
MY CONTEXT  I am a [level] in [SPECIALTY] … [PASTE … HERE]
TASK      1. … 2. … 3. …
RULES     [Rule + the action to take instead + reason].
OUTPUT    [Shape, length, tone]. [Self-critique ending].
PRO TIP: …    → NEXT #nnn
```

**Master:** the full flagship layout (see sample #361 in the blueprint PDF).

## 7. Mandatory medical guards

| Guard | Standard wording |
|---|---|
| Citations | Cite only uploaded papers or verified PMID/DOI; otherwise [CITE] / [CITATION NEEDED — FIND SOURCE] |
| Numbers | Never invent statistics; use [VERIFY] / [ASSUMPTION — VERIFY FROM PUBLISHED DATA]; reproduce user numbers exactly |
| Uncertainty | "If evidence conflicts or you're unsure, say so." |
| Guidelines | Name the standard: ICMR, CONSORT, STROBE, STARD, PRISMA, CARE, CASP/JBI, NICE, WHO… |
| Reasoning | "Reason step by step" for differentials and clinical decisions |
| Privacy | De-identified details only; relative dates (Day 0…) |
| Integrity | AI drafts, you decide; AI can't be an author; disclose per ICMJE/journal; no fabricated data |
| Causation | Associational language unless the design is randomised |

## 8. QA checklist (run on every prompt)

- [ ] All P-R-O-M-P-T blocks present (Quick may merge them)
- [ ] Persona has seniority and a trait
- [ ] Word count inside its tier
- [ ] Paste slot above the TASK
- [ ] Output shape and length named
- [ ] Every "Do not" paired with the action to take instead
- [ ] Accuracy guard present where facts matter
- [ ] No identifiers; de-identification line on case prompts
- [ ] No contradictions; no near-duplicate in the library
- [ ] TRY IT WITH (Quick/Standard) or HOW TO GET MORE (Master) present
- [ ] Works unchanged in ChatGPT, Claude, Gemini and Copilot

## 9. Library plan (1,000 prompts)

| Part | Sections (count) | Total |
|---|---|---:|
| 1 · Thesis, Research & Publication | 1.1 Topic & question (35) · 1.2 Lit search (30) · 1.3 Introduction (30) · 1.4 ROL (40) · 1.5 Aims & hypotheses (20) · 1.6 Design & methods (40) · 1.7 Sample size & stats (45) · 1.8 Results (25) · 1.9 Discussion (30) · 1.10 Protocol & ethics (20) · 1.11 Manuscript & publication (35) · 1.12 Case reports & series (30) · 1.13 Conference abstracts/posters/orals (20) | 400 |
| 2 · Seminars, Journal Clubs & Presentations | 2.1 Seminars (60) · 2.2 Journal club (60) · 2.3 Slide design (40) · 2.4 Oral presentations (35) · 2.5 Posters (35) · 2.6 Case presentations & grand rounds (40) · 2.7 Delivery, Q&A & teaching (30) | 300 |
| 3 · Study, Exam & Viva Prep | 3.1 Learning any topic (50) · 3.2 Planning (30) · 3.3 MCQs & strategy (50) · 3.4 Answer writing (30) · 3.5 Viva & OSCE (50) · 3.6 Clinical reasoning & DDx (60) · 3.7 Memory aids (30) | 300 |

Numbering runs continuously: Part 1 = #1–400, Part 2 = #401–700, Part 3 = #701–1000.

## 10. Design system (for the PDF)

Background #0A0808 · panels #141010 · Parabox orange #FF641E · cream text #FBF4EC / body #E9DED2 ·
muted #B8ABA0. Poppins (400–800) for headings and body, Lora italic for intros and WHY lines.
Spaced-caps orange kickers, big orange prompt numbers, an orange left rule on prompt boxes, an orange
cover band, and the footer "@abhishekjbenur".

## 11. Sources

- Anthropic, Prompting best practices: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- OpenAI, GPT-5 prompting guide: https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb
- OpenAI, Prompt engineering guide: https://developers.openai.com/api/docs/guides/prompt-engineering
- Google, Prompt design strategies: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Google, Gemini for Workspace prompt tips: https://blog.google/products-and-platforms/products/workspace/google-gemini-workspace-ai-prompt-tips/
- Microsoft, Writing prompts in Microsoft 365 Copilot: https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-writing-prompts-in-microsoft-365-copilot
- Microsoft, Prompt engineering techniques: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- JMIR 2025, Prompt Engineering in Clinical Practice: https://www.jmir.org/2025/1/e72644/PDF
- Parabox packs in the user's Google Drive (listed at the top)
