const { Deck } = require("./lib");

module.exports = async function (dir) {
  const d = new Deck({ file: "04_AI_for_Data_Writing_and_Presentation", session: "AI for Data, Writing & Presentation", time: "8:40 PM", total: 16 });

  d.cover({
    kicker: "End-to-end demonstration",
    title: "AI for data, writing *& presentation.*",
    lead: "From a spreadsheet to a manuscript to a conference deck, with the right tool at each step and your judgement at every checkpoint.",
    chips: ["Analyse", "Write", "Present", "Integrity"],
    presenters: "Dr. Abhishek J. Benur  ·  Dr. Saikat Banerjee",
    cred: "Pulmonologist · Co-Founder, Parabox AI · Author, The 1,000 Medical Prompts",
    notes: "15-minute end-to-end demonstration. One running example: a de-identified dataset of patients with COPD exacerbation, taken from analysis to abstract to slides.",
  });

  d.flow({
    kicker: "The pipeline", title: "One dataset, *five stops*",
    items: [
      { title: "Clean and de-identify", body: "Remove identifiers; build a data dictionary." },
      { title: "Analyse", body: "Plan the tests, run them in chat, confirm in a stats package." },
      { title: "Tables and figures", body: "Publication-ready Table 1, results tables, charts from code." },
      { title: "Write", body: "IMRaD draft from your results; you own the argument." },
      { title: "Present", body: "Abstract, poster and slides from the same verified content." },
    ],
    note: "At every arrow: *a human checkpoint.* AI speeds each stop; you sign off before the next.",
    notes: "The map for the demonstration.",
  });

  d.section({ num: "01", kicker: "Data", title: "Statistics *without the syntax*", lead: "AI can write and run the analysis code. You still choose the question and check the answer.", notes: "Section break." });

  await d.cards({
    kicker: "The tools", title: "Where to *run the analysis*", cols: 4,
    items: [
      { icon: "FaChartColumn", tag: "Runs real Python", title: "ChatGPT data analysis", titleSize: 15, body: "Upload a CSV or Excel file; it writes and runs code you can inspect, and draws charts." },
      { icon: "FaCode", tag: "Analysis and files", title: "Claude", titleSize: 15, body: "Runs code on uploaded data and builds real Excel, Word and PowerPoint files from the results." },
      { icon: "FaDatabase", tag: "Purpose-built", title: "Julius AI", titleSize: 15, body: "Chat-to-chart for larger datasets; Python and R behind a simple interface." },
      { icon: "FaCircleCheck", tag: "Free · validate here", title: "JASP · Jamovi · R", titleSize: 15, body: "Point-and-click, publication-grade output. Confirm every key result here.", hot: true },
    ],
    note: "Upload *de-identified data only,* and check your ethics approval allows it to leave the institution.",
    notes: "Emphasise the privacy rule: no names, hospital numbers or exact dates in uploaded datasets.",
  });

  d.prompt({
    kicker: "Demo prompt", title: "From a CSV to *a statistical analysis plan*", label: "Prompt · upload the de-identified CSV",
    text: "PERSONA: You are a biostatistician who supports MD thesis students and is strict about test assumptions.\nMATERIAL: [De-identified CSV]. Research question: [Is eosinophil count ≥300 associated with 90-day readmission in COPD exacerbation?]. Design: [retrospective cohort, n=212].\n\nTASK:\n1. Describe the variables and missing data.\n2. Propose the analysis plan: tests for each objective, and why.\n3. Check the assumptions, then run the analysis; show the code.\n4. Build Table 1 and the main results table (effect size, 95% CI, p).\n5. List the limitations of this analysis.\n\nRULES: Don't switch tests to get significance. Flag small cells and multiple comparisons. Write [CHECK IN JASP] next to each key result.",
    size: 12,
    side: ["Plan before running|The analysis plan comes first.", "Assumptions checked|The wrong test is the commonest AI error.", "Code shown|You can reproduce and audit it.", "Validation flag|Every key number is re-run in JASP."],
    notes: "LIVE: upload the practice dataset in ChatGPT or Claude. Show the code it ran.",
  });

  await d.cards({
    kicker: "Before a number goes in your paper", title: "The *analysis sanity check*", cols: 3,
    items: [
      { icon: "FaListCheck", title: "Right test?", body: "Matches the data type, distribution and design." },
      { icon: "FaScaleBalanced", title: "Effect size and CI", body: "Not just a p-value: what the difference is and how sure." },
      { icon: "FaCode", title: "Reproducible", body: "Save the code or the JASP file with your data." },
      { icon: "FaRotate", title: "Re-run independently", body: "The same result in JASP, Jamovi or R." },
      { icon: "FaTriangleExclamation", title: "No p-hacking", body: "Tests fixed in advance; no switching to get p < 0.05." },
      { icon: "FaUserDoctor", title: "A statistician's eye", body: "For your thesis or a paper, show it to one before submitting." },
    ],
    notes: "Six checks.",
  });

  d.section({ num: "02", kicker: "Writing", title: "AI as *editor, not author*", lead: "You bring the results and the argument; AI helps with structure, clarity and journal fit.", notes: "Section break." });

  await d.cards({
    kicker: "The writing stack", title: "The right tool *for each writing job*", cols: 3,
    items: [
      { tag: "Long-form drafting", title: "Claude", body: "Structures IMRaD sections, tightens prose, matches a target journal's style." },
      { tag: "Fast rewrites", title: "ChatGPT", body: "Titles, abstract versions, cover letters, responses to reviewers." },
      { tag: "Cite as you write", title: "Jenni AI", body: "Inline citations in Vancouver and other styles, from PubMed and Semantic Scholar." },
      { tag: "Academic polish", title: "Paperpal", body: "Language editing and pre-submission checks built for manuscripts." },
      { tag: "References", title: "Zotero", body: "Free. Saves papers, formats citations, flags retracted papers." },
      { tag: "Citation check", title: "Scite", body: "Does later work support or contradict what you're citing?" },
    ],
    notes: "Name one tool per job; nobody needs all six.",
  });

  d.prompt({
    kicker: "Demo prompt", title: "Draft the discussion *from your results*", label: "Prompt · paste your results and key papers",
    text: "PERSONA: You are a senior respiratory physician and journal reviewer who writes concise discussions.\nMATERIAL: My results: [paste Table 2 and main findings]. Key papers (abstracts or PDFs): [paste 5–8]. Target journal: [Lung India].\n\nTASK: Draft a 700-word discussion in this order:\n1. Main finding in one sentence.\n2. Comparison with each key paper: agree or disagree, and why.\n3. Possible mechanisms.\n4. Strengths, then limitations (honestly).\n5. Implications for Indian practice and research.\n\nRULES: Cite only the papers I pasted, as [Author, year]. Don't overstate causation from observational data. Mark any claim without a source [CITATION NEEDED].",
    size: 12,
    side: ["Your evidence only|No invented references.", "Fixed structure|The order reviewers expect.", "Honest limits|Reviewers look here first.", "[CITATION NEEDED]|Gaps are visible, not filled."],
    notes: "Show the draft, then show how to make it yours: rewrite the first sentence in your own voice.",
  });

  await d.cards({
    kicker: "Publication integrity", title: "The rules *journals now enforce*", cols: 2,
    items: [
      { icon: "FaScaleBalanced", tag: "ICMJE and COPE", title: "AI is never an author", body: "- AI can't take responsibility, so it can't be listed as an author\n- You are accountable for every sentence\n- Disclose AI use as the journal requires (methods or acknowledgements)" },
      { icon: "FaLock", tag: "Don't do this", title: "Common violations", body: "- Uploading a manuscript you're peer reviewing to a chatbot\n- AI-generated images presented as data\n- References you haven't read\n- Paraphrasing tools used to hide copying", hot: true },
    ],
    note: "Check the target journal's AI policy *before* you start writing, not after acceptance.",
    notes: "ICMJE recommendations (updated 2023 onwards) address AI-assisted technologies explicitly. Peer review confidentiality: never upload manuscripts under review.",
  });

  d.section({ num: "03", kicker: "Presentation", title: "From manuscript to *slides and posters*", lead: "The same verified content becomes an abstract, a poster and a talk, in a fraction of the time.", notes: "Section break." });

  await d.cards({
    kicker: "Deck-building routes", title: "Five ways to *build the deck*", cols: 5,
    items: [
      { icon: "FaFilePowerpoint", title: "Claude", titleSize: 15, body: "Builds real, editable PowerPoint files. This deck was made this way." },
      { icon: "FaWandMagicSparkles", title: "Claude Design", titleSize: 15, body: "A visual canvas: refine slides and posters by chatting." },
      { icon: "FaBolt", title: "Gamma", titleSize: 15, body: "Fastest prompt-to-deck; connects to ChatGPT and Claude." },
      { icon: "FaBookOpen", title: "NotebookLM", titleSize: 15, body: "Slides grounded only in your uploaded sources." },
      { icon: "FaPersonChalkboard", title: "Copilot in PowerPoint", titleSize: 15, body: "Generates inside PowerPoint for Office users." },
    ],
    note: "Need a .pptx file for the venue? *Build in Claude or Copilot,* and test any web-tool export the day before.",
    notes: "Meta moment: tonight's four decks were built with Claude from a written brief and our existing design system.",
  });

  d.prompt({
    kicker: "Demo prompt", title: "Paper to *conference talk*", label: "Prompt · Claude · attach the manuscript",
    text: "PERSONA: You are a medical educator who designs clear, visual conference talks.\nMATERIAL: [Attached manuscript]. Talk: [8 minutes, Pulmocon free-paper session]. Audience: [pulmonologists and residents]. Style: [dark background, one accent colour, minimal text].\n\nTASK: Build a [10]-slide PowerPoint:\n1. Title; 2. Why this question matters (one statistic); 3. Objective; 4. Methods as a flow diagram; 5–7. One result per slide as a chart or table; 8. Limitations; 9. Take-home message; 10. Thank you and contact.\nAdd speaker notes to every slide, about 50 seconds each.\n\nRULES: Use only numbers from the manuscript. One idea per slide, 30 words maximum.",
    size: 12,
    side: ["Time drives length|8 minutes means ~10 slides.", "Slide-by-slide plan|No generic 'make slides'.", "Speaker notes|Your script, timed.", "Numbers from the paper|No drift in the data."],
    notes: "LIVE: run it in Claude and open the .pptx.",
  });

  await d.cards({
    kicker: "Posters and figures", title: "Make the *visuals* earn their place", cols: 3, cardH: 3.1,
    note: "The line you never cross: *an AI-generated image is never data.*",
    items: [
      { icon: "FaImage", title: "Posters", body: "Ask for a 3-column layout with a one-line headline finding and a QR code to the full abstract. Refine in Claude Design or PowerPoint." },
      { icon: "FaChartColumn", title: "Charts from data", body: "Generate charts with code from your actual dataset, never from an image model. Check the axes and the n." },
      { icon: "FaDiagramProject", title: "Schematics", body: "Image models are fine for concept diagrams and mechanisms, labelled as illustrations, never as data or clinical images." },
    ],
    notes: "Key integrity point: AI-generated images must never masquerade as patient or experimental data.",
  });

  d.table({
    kicker: "Save this slide", title: "The *cheat sheet*",
    rows: [
      ["STEP", "PRIMARY TOOL", "YOUR CHECKPOINT"],
      ["Analysis plan and code", "ChatGPT data analysis · Claude", "Right tests, assumptions met"],
      ["Validate the results", "JASP · Jamovi · R", "Same numbers, independently"],
      ["Draft the manuscript", "Claude · ChatGPT", "Your argument, your voice"],
      ["Citations and references", "Jenni AI · Zotero · Scite", "Every reference opened and read"],
      ["Polish and submit", "Paperpal", "Journal AI policy and disclosure"],
      ["Slides and poster", "Claude · Claude Design · Gamma", "Numbers match the paper"],
    ],
    colW: [3.8, 4.3, 4.03], fontSize: 15,
    notes: "The end-to-end summary.",
  });

  d.closing({
    kicker: "Take-home", title: "Faster work. *Same integrity.*",
    lead: "AI can compress weeks of analysis, writing and slide-making into days. The question, the checks and the name on the paper stay yours.",
    next: "Using AI Safely: Check Before You Trust · interactive closing · 8:55 PM",
    notes: "Close and hand over to the joint safety session.",
  });

  await d.save(dir);
};
