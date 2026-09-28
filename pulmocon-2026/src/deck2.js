const { Deck } = require("./lib");

module.exports = async function (dir) {
  const d = new Deck({ file: "02_Ask_Better_Questions", session: "Ask Better Questions", time: "7:20 PM", total: 17 });

  d.cover({
    kicker: "Live prompt-refinement exercise",
    title: "Ask better *questions.*",
    lead: "The same AI gives a textbook answer or a useless one. The difference is the prompt, and prompting is a skill you can learn in ten minutes.",
    chips: ["What the labs say", "P-R-O-M-P-T", "Bad vs good", "Live exercise"],
    presenters: "Dr. Abhishek J. Benur",
    cred: "Pulmonologist · Co-Founder, Parabox AI · Author, The 1,000 Medical Prompts",
    notes: "10 minutes, live exercise. Energy up: ask the room how many used ChatGPT or Claude this week, then how many were disappointed by an answer.",
  });

  d.compare({
    kicker: "Same model, same minute", title: "The answer is only as good as *the question*",
    left: { label: "What most of us type", prompt: "Tell me about COPD exacerbation treatment.", promptSize: 15,
      body: "- A generic textbook paragraph\n- No patient, no setting, no severity\n- US or European drugs and doses\n- No sources you can check\n- You still have to do all the thinking" },
    right: { label: "A prompt with context", good: true, promptSize: 12.5, 
      prompt: "Act as a pulmonologist in an Indian district hospital. 68-year-old man, known COPD, 3 days of increased breathlessness and purulent sputum, SpO2 86% on room air, no NIV available. Give a stepwise management plan for the first 6 hours with drugs and doses [VERIFY], when to refer, and 3 red flags. Cite GOLD 2025 where relevant.",
      body: "- A plan for this patient, in this setting\n- Doses flagged for you to check\n- Referral triggers and red flags\n- A source you can open" },
    note: "Nothing changed in the model. *Everything changed in the question.*",
    notes: "Read both aloud. The right-hand prompt took 40 seconds longer to write and saves 10 minutes of back-and-forth.",
  });

  await d.cards({
    kicker: "Why prompts matter", title: "The AI *doesn't know your patient*", cols: 3,
    items: [
      { icon: "FaBrain", title: "It predicts, it doesn't know", body: "A language model writes the most likely next words. With a vague question, 'most likely' means the average textbook answer." },
      { icon: "FaHospital", title: "It fills gaps with defaults", body: "No setting given? It assumes a well-resourced Western hospital: drugs, doses, investigations you may not have." },
      { icon: "FaQuoteLeft", title: "It sounds sure either way", body: "A confident tone is not evidence. Unless you ask for sources and uncertainty, it won't volunteer them." },
    ],
    note: "Your job is to supply *what only you know:* the patient, the setting, the purpose, and the format you need.",
    notes: "Core mental model. One sentence each.",
  });

  d.section({ num: "01", kicker: "The rules", title: "What *every AI lab* agrees on", lead: "Anthropic, OpenAI, Google and Microsoft publish prompting guides. They use different words for the same six ideas.", notes: "Section break." });

  await d.cards({
    kicker: "Four labs, one consensus", title: "Six principles from the *official guides*", cols: 3,
    items: [
      { icon: "FaUserDoctor", title: "Give it a role", body: "A senior expert with a clear level and style. Google: Persona. OpenAI: Identity.", size: 13 },
      { icon: "FaFileLines", title: "Give context and why", body: "The patient, setting and purpose. Explaining why helps it generalise (Anthropic).", size: 13 },
      { icon: "FaListCheck", title: "One clear task, in steps", body: "Numbered steps beat a paragraph. Break big jobs into a chain of prompts.", size: 13 },
      { icon: "FaTableList", title: "Name the output", body: "Format, length, audience and tone. Google: Format. Microsoft: Expectations.", size: 13 },
      { icon: "FaBookMedical", title: "Ground it in a source", body: "Paste or connect the guideline or paper; ask it to quote before it answers.", size: 13 },
      { icon: "FaRotate", title: "Iterate", body: "Refine in the same chat: shorter, add a case, cite that, make it a table.", size: 13 },
    ],
    notes: "Sources: Anthropic prompting best practices; OpenAI GPT-5 prompting guide; Google Gemini prompt design strategies; Microsoft 365 Copilot prompt guidance. All accessed 2026.",
  });

  d.table({
    kicker: "Same ideas, different labels", title: "Each lab's *formula*",
    rows: [
      ["LAB", "THEIR FORMULA", "THE TIP THAT MATTERS MOST"],
      ["Google (Gemini)", "Persona · Task · Context · Format", "Write in full sentences; most good prompts are ~20+ words, not 5"],
      ["Microsoft (Copilot)", "Goal · Context · Expectations · Source", "Name the source you want it to use"],
      ["OpenAI (ChatGPT)", "Identity · Instructions · Examples · Context", "Newer models follow instructions literally: never contradict yourself"],
      ["Anthropic (Claude)", "Clear, direct, with context, examples and structure", "Put long documents first and your question last; use labelled sections"],
    ],
    colW: [2.4, 4.3, 5.43], fontSize: 13.5,
    note: "Our version for medicine combines all four: *P-R-O-M-P-T.*",
    notes: "Don't read the table; highlight the right-hand column. The Anthropic long-context tip reports up to ~30% better answers when the question comes after the documents.",
  });

  await d.cards({
    kicker: "The framework", title: "Every good medical prompt is *P-R-O-M-P-T*", cols: 3,
    items: [
      { tag: "P · Persona", title: "Who the AI should be", body: "\"A pulmonologist in a government teaching hospital who teaches residents.\"" },
      { tag: "R · Request", title: "One task, numbered steps", body: "\"1. Problem representation. 2. Differential. 3. Next tests.\"" },
      { tag: "O · Output", title: "Shape, length, audience", body: "\"A table, then 5 bullets, for final-year MBBS students.\"" },
      { tag: "M · Material", title: "Your context and sources", body: "The de-identified case, the guideline, the paper. Always before the task." },
      { tag: "P · Parameters", title: "Rules and guardrails", body: "\"Mark doses [VERIFY]. Say [NOT REPORTED] if it isn't in the paper.\"" },
      { tag: "T · Tweak", title: "Refine and self-check", body: "\"Now critique your answer as a strict examiner.\"" },
    ],
    notes: "This is the framework behind the 1,000 Medical Prompts library. Order inside a prompt: Persona, Material, Request, Parameters, Output, then Tweak in follow-ups.",
  });

  d.prompt({
    kicker: "Anatomy of a clinical prompt", title: "One prompt, *every block labelled*", label: "Prompt · approach to a symptom",
    text: "PERSONA: You are a senior pulmonologist who teaches MD residents.\n\nMY CONTEXT:\nSetting: [tertiary government hospital, India]\nPatient (de-identified): [45-year-old woman, 2 months of haemoptysis, 5 kg weight loss, non-smoker]\nWhat I need: [a teaching-ward approach, not a final diagnosis]\n\nTASK:\n1. Confirm true haemoptysis versus mimics.\n2. Prioritised differential with Indian epidemiology (TB first).\n3. Stepwise investigations.\n4. Red flags for massive haemoptysis.\n\nRULES: Mark thresholds [VERIFY]. Ask me for missing details with [ASK ME].\nOUTPUT: Headings, then a 60-second summary I can say on rounds.",
    size: 12.5,
    side: ["Persona|Sets level, tone and specialty.", "Context before task|The model reads the patient first, then the question.", "Numbered task|Nothing gets skipped.", "Rules with tags|Uncertainty becomes visible.", "Output|Built for how you'll use it."],
    notes: "Walk top to bottom: each label is one letter of P-R-O-M-P-T.",
  });

  d.section({ num: "02", kicker: "Bad vs good", title: "Three clinical *before-and-afters*", notes: "Section break." });

  d.compare({
    kicker: "Before and after · differential diagnosis", title: "From a list of causes to *a reasoning partner*",
    left: { label: "Bad", prompt: "Causes of fever with low platelets?", promptSize: 15,
      body: "- 40 causes, alphabetical, no priorities\n- Nothing about your season or region\n- No 'can't-miss' flag\n- No next step" },
    right: { label: "Good", good: true, promptSize: 13.5, 
      prompt: "Act as an internal-medicine consultant in [coastal Karnataka, monsoon season]. 24-year-old man, 5 days of fever, myalgia, platelets 48,000, mild transaminitis, no bleeding. Give a prioritised differential (dengue, leptospirosis, scrub typhus, malaria and others), the one test that best separates each, red flags for admission, and what would change your ranking.",
      body: "- Ranked for this patient, place and season\n- Tests that actually discriminate\n- Safety net built in" },
    notes: "Tropical fever is a perfect example: context changes the ranking completely.",
  });

  d.compare({
    kicker: "Before and after · patient education", title: "From jargon to *words the patient can use*",
    left: { label: "Bad", prompt: "Explain asthma to a patient.", promptSize: 15,
      body: "- A Wikipedia-style paragraph\n- Medical terms left unexplained\n- English only\n- Nothing on what to actually do" },
    right: { label: "Good", good: true, promptSize: 13.5, 
      prompt: "Explain asthma to a 35-year-old mother of two who studied till class 8, in simple [Hindi]. Use 6 short points: what asthma is, why the inhaler is daily, how to use a spacer, 3 warning signs to come to hospital, and one myth to correct ('inhalers are addictive'). Under 150 words. No medical jargon.",
      body: "- Right language and reading level\n- Behaviour, not just facts\n- Addresses a real Indian myth" },
    notes: "Always ask a colleague who speaks the language to check the medical terms.",
  });

  d.compare({
    kicker: "Before and after · evidence question", title: "From an opinion to *a cited answer*",
    left: { label: "Bad", prompt: "Is prone positioning good?", promptSize: 15,
      body: "- Good for whom? For what outcome?\n- Answers from memory, may invent trials\n- No effect sizes, no uncertainty" },
    right: { label: "Good", good: true, promptSize: 13.5, 
      prompt: "Using the PubMed connector, find RCTs and meta-analyses on prone positioning in [awake, non-intubated adults with COVID-19 or ARDS] for the outcome [intubation]. For each: design, n, effect size with 95% CI, PMID. Then summarise in 4 bullets, noting where results conflict. Write [NOT REPORTED] for missing data.",
      body: "- PICO-shaped question\n- Real papers with PMIDs\n- Honest about conflicting results" },
    note: "Turn every clinical question into *PICO:* Population, Intervention, Comparison, Outcome.",
    notes: "Links to the next session on finding and understanding research papers.",
  });

  await d.cards({
    kicker: "Make it admit uncertainty", title: "Accuracy tags that *stop fabrication*", cols: 4,
    items: [
      { tag: "[VERIFY]", title: "Numbers to check", body: "Doses, cut-offs, statistics you must confirm in a primary source.", size: 15 },
      { tag: "[CITE]", title: "Claims needing a source", body: "Only from a paper you uploaded or a real PMID or DOI.", size: 15 },
      { tag: "[NOT REPORTED]", title: "Honest gaps", body: "Instead of inventing a value the paper doesn't give.", size: 15 },
      { tag: "[ASK ME]", title: "Missing information", body: "It asks you instead of assuming.", size: 15 },
    ],
    cardH: 3.1,
    note: "Add one line to any prompt: *\"If you are unsure, say so and mark it [VERIFY].\"*",
    notes: "These tags are used across all 1,000 prompts in the library.",
  });

  await d.cards({
    kicker: "Don't restart, refine", title: "Five follow-ups that *upgrade any answer*", cols: 5, cardH: 3.3,
    note: "The best users treat the first answer as *a draft to interrogate,* not a verdict.",
    items: [
      { icon: "FaComments", title: "\"Ask me 3 questions first.\"", titleSize: 14, body: "It gathers context before answering.", size: 14 },
      { icon: "FaScaleBalanced", title: "\"Critique your answer.\"", titleSize: 14, body: "As a strict examiner or reviewer.", size: 14 },
      { icon: "FaTableList", title: "\"Make it a table.\"", titleSize: 14, body: "Or 5 bullets, or a one-liner.", size: 14 },
      { icon: "FaMagnifyingGlass", title: "\"What did you assume?\"", titleSize: 14, body: "Hidden assumptions come out.", size: 14 },
      { icon: "FaLink", title: "\"Show your sources.\"", titleSize: 14, body: "Then open them yourself.", size: 14 },
    ],
    notes: "Iteration is where experts differ from beginners.",
  });

  d.flow({
    kicker: "Live exercise · your turn", title: "Refine this prompt in *three rounds*",
    intro: "Starting prompt: \"Write about pneumonia.\" Shout out what to add at each round.",
    items: [
      { title: "Round 1: add Persona and Material", body: "Who should answer? Which patient, which setting? Community-acquired, 70-year-old, CURB-65 of 3, district hospital." },
      { title: "Round 2: add Request", body: "What exactly do we need? Admit or not, empirical antibiotics, investigations, monitoring." },
      { title: "Round 3: add Parameters and Output", body: "Doses marked [VERIFY], cite the guideline, a one-page table for the ward, then a 3-line handover." },
      { title: "Compare", body: "Run round 0 and round 3 side by side on screen. Same model. Which would you trust on a night shift?" },
    ],
    notes: "LIVE: type the prompt in Claude or ChatGPT on the projector, add the audience's suggestions each round, and run it. Keep to 4 minutes.",
  });

  await d.cards({
    kicker: "Before you press Enter", title: "The *six-second* checklist", cols: 3,
    items: [
      { icon: "FaUserDoctor", title: "Who should answer?", body: "Role and level." },
      { icon: "FaFileMedical", title: "What does it need to know?", body: "Patient, setting, source, de-identified." },
      { icon: "FaListCheck", title: "What exactly is the task?", body: "Numbered steps." },
      { icon: "FaTableList", title: "What should come out?", body: "Format, length, audience." },
      { icon: "FaTags", title: "What must it not do?", body: "Tags: [VERIFY], [CITE], [NOT REPORTED]." },
      { icon: "FaRotate", title: "How will I refine it?", body: "Critique, sources, assumptions." },
    ],
    notes: "Screenshot slide.",
  });

  d.closing({
    kicker: "Take-home", title: "Better questions. *Better medicine.*",
    lead: "Give the AI what only you know, ask for exactly what you need, and make it show its uncertainty. 1,000 ready-made clinical prompts: paraboxai.com.",
    next: "Break · then Finding Ideas & Research Questions · Dr. Saikat Banerjee · 7:40 PM",
    notes: "Mention the 1,000 Medical Prompts library for residents and students.",
  });

  await d.save(dir);
};
