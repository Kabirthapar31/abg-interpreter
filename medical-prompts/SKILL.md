---
name: medical-prompt-writer
description: Write high-quality, copy-paste-ready AI prompts for doctors, residents and medical students covering thesis and research, seminars, journal clubs and presentations, and study, exam and viva preparation. Use whenever asked to create, rewrite, audit or batch-generate prompts for a medical audience, including the 1,000-prompt library. The rules are drawn from the published prompting guidance of OpenAI, Anthropic, Google and Microsoft.
---

# Medical Prompt Writer

This skill turns a medical task ("help me write my ROL", "prepare me for a cardiology viva") into a
prompt that works in ChatGPT, Claude, Gemini and Copilot without editing. Every rule below comes from
the four major labs' own prompting guides (see Sources at the end). Where the labs disagree, this
skill says which rule it follows and why.

---

## 1. What the four labs agree on

| # | Principle | OpenAI | Anthropic | Google | Microsoft |
|---|-----------|:-----:|:-----:|:-----:|:-----:|
| 1 | Be clear, specific and direct. Vague prompts get generic answers. | ✔ | ✔ | ✔ | ✔ |
| 2 | Give the model a role or persona. | ✔ (identity) | ✔ (role) | ✔ (Persona) | ✔ |
| 3 | Give context: who you are, the purpose, the audience, and the constraints. | ✔ | ✔ ("explain *why*") | ✔ (Context) | ✔ (Context) |
| 4 | State the output format: structure, length, tone. | ✔ | ✔ | ✔ (Format) | ✔ (Expectations) |
| 5 | Separate the sections with delimiters (### or XML tags). | ✔ | ✔ (XML preferred) | ✔ | ✔ |
| 6 | Use examples (few-shot) when format or style matters. | ✔ | ✔ (3–5 examples) | ✔ | ✔ |
| 7 | Break complex tasks into ordered steps. | ✔ | ✔ (prompt chaining) | ✔ | ✔ |
| 8 | Say what to do, not only what to avoid. | ✔ | ✔ | ✔ | ✔ |
| 9 | Ground the answer in the source material and name the source. | ✔ | ✔ (quote first) | ✔ | ✔ (Source) |
| 10 | Iterate: test, refine, and use follow-up turns. | ✔ | ✔ | ✔ | ✔ |
| 11 | Avoid contradictory instructions. Modern models follow instructions literally. | ✔ (GPT-5 guide) | ✔ | — | — |

### Each lab's framework

- **Google Gemini: PTCF** = **P**ersona · **T**ask · **C**ontext · **F**ormat. Google reports that
  successful Workspace prompts average about 21 words, and that longer, more detailed prompts
  work better for complex requests.
- **Microsoft Copilot: GCES** = **G**oal · **C**ontext · **E**xpectations · **S**ource.
- **OpenAI**: identity → instructions → examples → context, with instructions placed first and
  sections separated by `###` or XML. GPT-5 follows instructions "with surgical precision", so
  contradictions cost more than they did with older models. Verbosity is steerable in plain language.
- **Anthropic Claude**: be clear and direct. Treat the model as "a brilliant but new employee who lacks
  context". Explain the *why* behind each rule, use XML tags, give 3–5 diverse examples, put long
  documents at the top and the question at the end (up to 30% better on long inputs), and ask the model
  to quote the source before it answers.
- **Medical literature** (JMIR 2025 clinician tutorial; digestive-surgery education paper): Role +
  Context + Task + Output spec, "think step by step" for clinical reasoning, and a warning about
  phantom citations: every reference has to be checked in PubMed or another verified database.

---

## 2. The master structure (R-C-T-S-F-Q)

The library standardises on one structure that satisfies all four frameworks.

```
ROLE        Who the AI should be                              (Persona / Identity)
CONTEXT     Who I am + my situation + why I need this          (Context / Goal)
TASK        The exact action, as numbered steps if multi-part  (Task / Instructions)
SPECIFICS   Constraints, standards, guidelines, source to use  (Constraints / Source)
FORMAT      Structure, length, tone, headings, tables          (Format / Expectations)
QUALITY     Accuracy guard + a follow-up question or next step (Verification / Iteration)
```

How it maps to each lab's framework:

| R-C-T-S-F-Q | Google PTCF | Microsoft GCES | OpenAI | Anthropic |
|---|---|---|---|---|
| Role | Persona | — | Identity | `<role>` |
| Context | Context | Context + Goal | Context | `<context>` |
| Task | Task | Goal | Instructions | `<task>` / `<instructions>` |
| Specifics | Context | Source | Instructions | `<constraints>` |
| Format | Format | Expectations | Output format | `<output_format>` |
| Quality | — | — | Self-check / reasoning | "quote first", "say if unsure" |

---

## 3. Length and context rules

The labs don't give a single word count. Google's ~21-word average describes quick everyday
requests, and every lab says complex tasks need more detail. The library therefore uses **three
tiers**:

| Tier | Words | When to use | Structure |
|------|-------|-------------|-----------|
| **Quick** | 30–60 | One focused output (a mnemonic, 10 MCQs, one differential) | Role + Task + Format in 2–4 sentences |
| **Standard** (default) | 80–150 | Most prompts: a section, a plan, a slide outline | Full R-C-T-S-F-Q as short labelled lines |
| **Deep** | 150–300 | Multi-step work: a full ROL framework, a thesis protocol, a mock viva | R-C-T-S-F-Q with numbered steps and an optional example |

**Rules for context**
1. **Enough to remove guesswork, and no more.** Give 2–5 facts the model can't infer: your level
   (MBBS / PG year / consultant), specialty, topic, deadline or exam, audience, and the guideline or
   style you need followed (ICMJE, CONSORT, STROBE, PRISMA, CARE, Vancouver).
2. **Explain the why.** "…because this is for my MD thesis committee" gives a better result than
   "be formal". (Anthropic)
3. **Put the variables in `[SQUARE BRACKETS]`** so users can see what to fill in:
   `[SPECIALTY]`, `[TOPIC]`, `[STUDY DESIGN]`, `[SAMPLE SIZE]`, `[EXAM: NEET-PG / USMLE / MRCP / FCPS]`.
   Keep it to 5 or fewer placeholders per prompt.
4. **Long pasted material goes first and the instruction goes last.** When a prompt asks the user
   to paste an abstract, paper or dataset, the paste slot sits above the final instruction. (Anthropic
   long-context rule)
5. **No contradictions.** Don't write "be concise" and "be exhaustive" in the same prompt. (OpenAI GPT-5)

---

## 4. Format rules (how each prompt is written)

- **Start with an action verb** in the Task line: *Draft, Build, Critique, Convert, Simulate, Compare, Tabulate.*
- **Phrase instructions positively**: "Write in formal academic prose", not "Don't be casual".
- **Number the steps** whenever order matters.
- **Name the output shape**: "a table with columns X | Y | Z", "8–10 slides with speaker notes",
  "300 words", "5 viva questions with model answers".
- **Use plain labelled lines** (`Role:`, `Context:`, `Task:`…) rather than XML in the library, since
  users paste the prompts into consumer chat apps where labels read naturally. Every model
  parses them reliably. XML is optional for advanced users.
- **One prompt, one job.** Split a big job into a chain (Prompt 1 → Prompt 2 → Prompt 3) rather than
  writing one enormous prompt. (Anthropic: chain complex prompts; OpenAI: separate tasks across turns)
- **End with an interaction hook** where it helps: "Ask me 3 clarifying questions before you start"
  or "End by suggesting the next step."

---

## 5. Medical safety and accuracy rules (mandatory)

Every research or clinical prompt must include at least one of these guards:

1. **Citation guard**: "Do not invent references. Only cite papers you are confident exist, give the
   DOI/PMID, and mark anything uncertain as [VERIFY]." Tell users to check every reference in PubMed.
2. **Uncertainty permission**: "If you are unsure or evidence is conflicting, say so explicitly." (Anthropic)
3. **Guideline anchoring**: name the standard, e.g. "as per the latest [ACC/AHA / NICE / WHO / ICMR] guideline".
4. **Reasoning request** for clinical tasks: "Reason step by step, showing how each finding changes the
   probability of each diagnosis."
5. **No patient identifiers**: prompts that use cases say "use de-identified details only".
6. **Academic integrity**: thesis and manuscript prompts help the user *structure, critique and
   improve* their own work. They don't ask the AI to fabricate data or results, and they remind users
   to follow their institution's and journal's AI-disclosure policy.
7. **Clinical disclaimer**: diagnostic prompts are for learning and decision support, not a
   substitute for clinical judgement.

---

## 6. Prompt card template (what every prompt in the PDF looks like)

```
#[NUMBER]  [SHORT TITLE]                         Tier: Quick | Standard | Deep
Section › Subsection                             Best for: [Student | Resident | Faculty]

Role: You are a [expert persona with relevant credentials].
Context: I am a [level] in [SPECIALTY] working on [TOPIC/GOAL] for [PURPOSE/AUDIENCE].
Task: [Action verb] … 1) … 2) … 3) …
Specifics: Follow [GUIDELINE/STANDARD]. [Constraints]. [Accuracy guard].
Format: [Structure], [length], [tone].
Next: [Clarifying-question hook or follow-up suggestion]

Tip: [one-line pro tip on how to use or chain this prompt]
```

---

## 7. Worked examples, one per library section

**A. Thesis & Research (Standard)**
```
Role: You are a senior medical research methodologist and thesis guide.
Context: I am a PG resident in [SPECIALTY]. My thesis topic is [TOPIC], a [STUDY DESIGN] with
[SAMPLE SIZE] patients. My committee wants a clear, well-justified methodology chapter.
Task: Draft the methodology outline: 1) study design and setting, 2) inclusion/exclusion criteria,
3) sample size justification, 4) variables and definitions, 5) data collection, 6) statistical plan,
7) ethics.
Specifics: Align with the [STROBE/CONSORT] checklist. Flag any gap in my design. Do not invent
references; mark uncertain ones [VERIFY].
Format: Numbered headings with 2–4 bullet points each, formal academic tone, about 400 words.
Next: Ask me for any missing details before finalising.
```

**B. Seminars, Journal Clubs & Presentations (Standard)**
```
Role: You are an experienced journal-club moderator and critical-appraisal expert.
Context: I am presenting the paper pasted below at our [SPECIALTY] department journal club to
residents and faculty.
[PASTE ABSTRACT / FULL TEXT HERE]
Task: 1) Summarise the PICO, 2) appraise it using the [CASP/JBI] checklist, 3) list 3 strengths and
3 limitations, 4) state the clinical bottom line, 5) suggest 5 discussion questions.
Format: 12–15 slide outline with slide titles, bullet content and one-line speaker notes.
Next: End with the 3 questions faculty are most likely to ask me, with short answers.
```

**C. Study & Exam Prep (Deep)**
```
Role: You are a strict but fair [SPECIALTY] examiner for the [EXAM] viva.
Context: I am a final-year PG preparing for my viva in [WEEKS] weeks. My weak area is [TOPIC].
Task: Conduct a mock viva. Ask one question at a time, starting basic and escalating to
examiner-level. After each of my answers: 1) score it /10, 2) give the ideal answer in 3–5 points,
3) name the gap in my reasoning, then ask the next question.
Specifics: Base standards on current guidelines ([GUIDELINE]). If a fact is guideline-dependent or
debated, say so.
Format: Conversational. Keep each question under 40 words.
Next: After 10 questions, give me a summary of weak areas and a 3-day revision plan.
```

---

## 8. Quality checklist (run on every prompt before it goes into the PDF)

- [ ] Has a Role, Context, Task and Format (the four elements every lab agrees on)
- [ ] Task starts with an action verb and is specific enough that a colleague could follow it (Anthropic's "golden rule")
- [ ] Falls in the right word tier (Quick 30–60 / Standard 80–150 / Deep 150–300)
- [ ] Placeholders are in `[BRACKETS]`, 5 or fewer
- [ ] No contradictory instructions
- [ ] Output shape named (table / slides / word count / number of items)
- [ ] Includes a medical accuracy guard where relevant (citations, guidelines, uncertainty)
- [ ] Works unchanged in ChatGPT, Claude, Gemini and Copilot
- [ ] Doesn't duplicate another prompt in the library
- [ ] Positive phrasing: says what to do

---

## 9. The 1,000-prompt library plan

| Part | Section | Prompts |
|---|---|---:|
| **1** | **Thesis, Research & Publication** | **400** |
| 1.1 | Topic selection & research question (PICO/FINER, gap finding) | 35 |
| 1.2 | Literature search strategy (PubMed/MeSH, Boolean, databases) | 30 |
| 1.3 | Writing the Introduction | 30 |
| 1.4 | Review of Literature (ROL) | 40 |
| 1.5 | Aims, objectives & hypotheses | 20 |
| 1.6 | Study design & methodology | 40 |
| 1.7 | Sample size & statistical analysis | 45 |
| 1.8 | Results, tables & figures | 25 |
| 1.9 | Discussion, conclusion & limitations | 30 |
| 1.10 | Protocol, ethics & synopsis | 20 |
| 1.11 | Thesis to manuscript & journal publication | 35 |
| 1.12 | Case reports & case series | 30 |
| 1.13 | Conference abstracts, posters & oral papers | 20 |
| **2** | **Seminars, Journal Clubs & Presentations** | **300** |
| 2.1 | Seminar preparation (any topic, any specialty) | 60 |
| 2.2 | Journal club: selection, critical appraisal, presentation | 60 |
| 2.3 | Slide design & PowerPoint structure | 40 |
| 2.4 | Conference oral presentations | 35 |
| 2.5 | Conference posters (e-posters & print) | 35 |
| 2.6 | Case presentations & grand rounds | 40 |
| 2.7 | Delivery, Q&A handling & teaching sessions | 30 |
| **3** | **Study, Exam & Viva Preparation** | **300** |
| 3.1 | Learning any topic (concept mastery, active recall) | 50 |
| 3.2 | Study planning & revision schedules | 30 |
| 3.3 | MCQ practice & exam strategy (NEET-PG, INI-CET, USMLE, PLAB, MRCP, etc.) | 50 |
| 3.4 | Long/short answer & essay writing | 30 |
| 3.5 | Viva & OSCE preparation | 50 |
| 3.6 | Clinical reasoning & differential diagnosis | 60 |
| 3.7 | Memory aids, flashcards & high-yield summaries | 30 |
| | **Total** | **1,000** |

---

## 10. Sources

- Anthropic, *Prompting best practices*, Claude Platform Docs:
  https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Anthropic, *Prompt engineering best practices for 2026*: https://claude.com/blog/best-practices-for-prompt-engineering
- OpenAI, *GPT-5 prompting guide* (Cookbook): https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/gpt-5_prompting_guide.ipynb
- OpenAI, *Prompt engineering guide*: https://developers.openai.com/api/docs/guides/prompt-engineering
- OpenAI Help Center, *Best practices for prompt engineering with the OpenAI API*: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api
- Google, *Prompt design strategies*, Gemini API: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Google, *5 ways to write better AI prompts for Gemini in Workspace*: https://blog.google/products-and-platforms/products/workspace/google-gemini-workspace-ai-prompt-tips/
- Microsoft, *Get started writing prompts in Microsoft 365 Copilot*: https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-writing-prompts-in-microsoft-365-copilot
- Microsoft, *Prompt engineering techniques*, Azure OpenAI / Foundry: https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/prompt-engineering
- JMIR (2025), *Prompt Engineering in Clinical Practice: Tutorial for Clinicians*: https://www.jmir.org/2025/1/e72644/PDF
- *Prompt engineering in medical education: digestive surgery* (PubMed): https://pubmed.ncbi.nlm.nih.gov/42417731/
