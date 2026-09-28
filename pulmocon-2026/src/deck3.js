const { Deck } = require("./lib");

module.exports = async function (dir) {
  const d = new Deck({ file: "03_Finding_and_Understanding_Research_Papers", session: "Finding & Understanding Research Papers", time: "8:00 PM", total: 18 });

  d.cover({
    kicker: "Live demonstration",
    title: "Finding & understanding *research papers.*",
    lead: "Search PubMed and 200 million papers from inside your chat, map the literature in minutes, and read any paper like a reviewer.",
    chips: ["Connectors", "Research tools", "Reading prompts", "Verify"],
    presenters: "Dr. Abhishek J. Benur",
    cred: "Pulmonologist · Co-Founder, Parabox AI · Author, The 1,000 Medical Prompts",
    notes: "20 minutes, live demonstration. Two halves: finding (connectors and tools) and understanding (prompts for reading a paper).",
  });

  d.stats({
    kicker: "The problem", title: "Too many papers, *too little time*",
    items: [
      { value: "1M+", label: "new PubMed citations a year", body: "No clinician can keep up by reading alone." },
      { value: "35M+", label: "citations in PubMed", body: "Now searchable from inside Claude through the PubMed connector." },
      { value: "220M+", label: "papers in Consensus", body: "Searchable from inside ChatGPT and Claude." },
    ],
    below: "AI doesn't read for you. It gets you to *the right 10 papers faster,* and helps you understand them.",
    note: "Figures from NLM and vendor pages, 2026; approximate.",
    notes: "PubMed adds over a million citations annually (NLM statistics). Claude's PubMed connector: 35M+ citations (Anthropic). Consensus: 220M+ papers (Consensus, 2026).",
  });

  d.flow({
    kicker: "The workflow", title: "Six steps from question *to understanding*",
    items: [
      { title: "Ask", body: "Turn the topic into a PICO question." },
      { title: "Search", body: "Connectors: PubMed and Consensus inside Claude or ChatGPT." },
      { title: "Map", body: "Semantic Scholar, ResearchRabbit, R Discovery for related work." },
      { title: "Screen", body: "Elicit tables; keep the 5–10 that matter." },
      { title: "Read", body: "Upload the PDF and question it with prompts." },
      { title: "Verify", body: "Open every source. Check the claim. Save to Zotero." },
    ],
    notes: "The map for the rest of the talk.",
  });

  d.section({ num: "01", kicker: "Finding", title: "Search from *inside your chat*", lead: "Connectors turn Claude and ChatGPT from 'remembering' papers into searching real databases.", notes: "Section break." });

  await d.cards({
    kicker: "Connector 1", title: "Claude + *PubMed*", cols: 2,
    items: [
      { icon: "FaPlug", tag: "What it does", title: "Live PubMed inside Claude", body: "- Searches 35M+ biomedical citations with real PMIDs\n- Reads abstracts and open-access full text (PMC)\n- Finds related articles to a paper you like\n- Part of Claude for Healthcare and life sciences connectors" },
      { icon: "FaCircleCheck", tag: "Set up in 30 seconds", title: "Settings → Connectors → PubMed", body: "- Switch it on in the chat's tools menu\n- Say 'search PubMed for…' so it uses the connector\n- Ask for PMIDs every time\n- Works in Claude on the web, desktop and mobile", hot: true },
    ],
    note: "Test it: ask for a paper and click the PMID. *If it opens and matches, the connector did its job.*",
    notes: "LIVE: enable the PubMed connector and run the prompt on the next slide.",
  });

  d.prompt({
    kicker: "Live demo", title: "A literature scan *with PMIDs*", label: "Prompt · Claude + PubMed",
    text: "Search PubMed for studies from [2020–2026] on [bronchiectasis exacerbations and long-term macrolides].\n\nReturn a table: first author, year, design, country, n, intervention, comparator, primary outcome, main result with effect size and 95% CI, PMID.\n\nThen:\n1. Group the studies by design.\n2. Say what is consistent and what conflicts.\n3. List 3 evidence gaps a resident could study in India.\n\nRULES: Include only papers retrieved in this search. Write [NOT REPORTED] for missing values. Flag any retracted paper.",
    size: 13,
    side: ["Date and topic scoped|Keeps it current and focused.", "Extraction table|Comparable fields for every study.", "Gaps for your thesis|Links reading to research ideas.", "Only what it retrieved|No references from memory."],
    notes: "Show the PMIDs, click two of them live.",
  });

  await d.cards({
    kicker: "Connector 2", title: "*Consensus* inside ChatGPT and Claude", cols: 3,
    items: [
      { icon: "FaScaleBalanced", title: "What does the evidence say?", body: "Ask a yes/no question; get a summary across studies with how many support or oppose it (the Consensus Meter)." },
      { icon: "FaFlask", title: "Filter by study quality", body: "Restrict to RCTs, meta-analyses or systematic reviews, by year, sample size or journal." },
      { icon: "FaPlug", title: "Where to switch it on", body: "ChatGPT: Apps → Consensus (listed since 2026). Claude: Settings → Connectors → Consensus." },
    ],
    note: "Use Consensus for *'is there evidence that…'* and PubMed for *'find me the papers on…'.*",
    notes: "Consensus in the ChatGPT app store as of April 2026. Covers 220M+ papers from PubMed, Semantic Scholar and arXiv.",
  });

  await d.cards({
    kicker: "Power feature", title: "*Deep Research*: an analyst on demand", cols: 2,
    items: [
      { icon: "FaBolt", tag: "Great for", title: "Scoping a new topic", body: "- A structured, cited report in 5–15 minutes\n- Background for an introduction or a seminar\n- Comparing guidelines across societies\n- Available in ChatGPT, Claude, Gemini and Perplexity" },
      { icon: "FaTriangleExclamation", tag: "Handle with care", title: "Not a systematic review", body: "- Can miss key papers or misread results\n- Mixes high- and low-quality sources\n- Verify every citation it returns\n- Never paste patient data into it", hot: true },
    ],
    notes: "Deep Research is the right first step for a topic you know nothing about. It is the wrong last step for anything you will cite.",
  });

  d.section({ num: "02", kicker: "The research toolkit", title: "Dedicated tools *worth knowing*", lead: "Each does one job better than a general chatbot.", notes: "Section break." });

  await d.cards({
    kicker: "Discover and map", title: "Find the papers, *see the connections*", cols: 4,
    items: [
      { icon: "FaMagnifyingGlass", tag: "Free · 200M+ papers", title: "Semantic Scholar", titleSize: 16, body: "AI search across the literature with one-line TLDR summaries and citation counts.", size: 13.5 },
      { icon: "FaBookmark", tag: "Free app", title: "R Discovery", titleSize: 16, body: "A personalised daily feed of new papers in your field, with audio and translated summaries.", size: 13.5 },
      { icon: "FaDiagramProject", tag: "Freemium", title: "ResearchRabbit", titleSize: 16, body: "Add a few seed papers; it builds a citation map and surfaces related and later work.", size: 13.5 },
      { icon: "FaSitemap", tag: "Visual graph", title: "Connected Papers", titleSize: 16, body: "One seed paper becomes a graph of similar work; spot the landmark papers fast.", size: 13.5 },
    ],
    note: "Start broad (Semantic Scholar or PubMed), then *expand your best 2–3 papers* with ResearchRabbit or Connected Papers.",
    notes: "ResearchRabbit moved to freemium in 2026 (free tier capped at 50 seed articles). R Discovery is by Cactus Communications, popular with Indian researchers.",
  });

  await d.cards({
    kicker: "Screen, read and check", title: "From 200 results to *the 10 that matter*", cols: 4,
    items: [
      { icon: "FaTableList", tag: "Screen and extract", title: "Elicit", titleSize: 16, body: "Screens many papers and pulls PICO, outcomes and results into a table you can export.", size: 13.5 },
      { icon: "FaFilePdf", tag: "Chat with a PDF", title: "SciSpace", titleSize: 16, body: "Ask plain-language questions of a paper: methods, tables, statistics.", size: 13.5 },
      { icon: "FaLink", tag: "Smart citations", title: "Scite", titleSize: 16, body: "Shows whether later papers support or contradict a finding.", size: 13.5 },
      { icon: "FaPenNib", tag: "Write with citations", title: "Jenni AI", titleSize: 16, body: "Drafting help with inline citations (Vancouver and others) from PubMed and Semantic Scholar.", size: 13.5 },
    ],
    notes: "Jenni is a writing tool; mention it here because it cites as you write. More writing tools in the final session.",
  });

  d.table({
    kicker: "Decision guide", title: "Which research tool *for which job?*",
    rows: [
      ["JOB", "FIRST CHOICE", "ALSO GOOD"],
      ["Find papers on a specific question", "Claude + PubMed connector", "PubMed directly · Semantic Scholar"],
      ["Is there evidence that…?", "Consensus (ChatGPT or Claude)", "OpenEvidence for clinical questions"],
      ["Scope a topic I don't know", "Deep Research", "Perplexity (academic focus)"],
      ["Map related and newer work", "ResearchRabbit", "Connected Papers · Litmaps"],
      ["Stay updated in my specialty", "R Discovery", "PubMed saved-search email alerts"],
      ["Screen and extract many papers", "Elicit", "Rayyan for systematic reviews"],
      ["Understand one paper deeply", "Claude or ChatGPT with the PDF", "NotebookLM · SciSpace"],
    ],
    colW: [4.3, 4.0, 3.83], fontSize: 14,
    notes: "Screenshot slide.",
  });

  d.section({ num: "03", kicker: "Understanding", title: "Read any paper *like a reviewer*", lead: "Upload the PDF, then ask the questions a good journal club would ask.", notes: "Section break." });

  d.flow({
    kicker: "Read a paper in 5 prompts", title: "The *five questions* for every paper",
    items: [
      { title: "What did they do?", body: "Plain-language summary in 5 lines: question, design, population, main result." },
      { title: "PICO and design", body: "Population, intervention, comparator, outcomes; the study design and why it fits." },
      { title: "Can I trust it?", body: "Risk of bias with the right checklist: CASP, RoB 2, Newcastle–Ottawa." },
      { title: "What do the numbers mean?", body: "Explain the tables: HR, OR, CI, p-values, NNT, in plain words." },
      { title: "So what for my patients?", body: "Applicability to Indian settings, and what would change practice." },
    ],
    notes: "Each of these is one prompt in Volume 2 of the 1,000 Medical Prompts (journal club section).",
  });

  d.prompt({
    kicker: "Prompt to use tonight", title: "Understand a paper *in 10 minutes*", label: "Prompt · upload the PDF first",
    text: "PERSONA: You are a clinical epidemiologist who runs our department journal club.\nMATERIAL: [Attached PDF of the paper]. My level: [MD resident, year 2].\n\nTASK:\n1. Summarise the paper in 5 plain-language lines.\n2. Give the PICO and the study design.\n3. Appraise it with the right checklist ([CASP / RoB 2 / Newcastle–Ottawa]); list the 3 biggest threats to validity.\n4. Explain Table 2 and the main result: what the effect size and 95% CI mean for a patient.\n5. Say whether it applies to [a government hospital in India], and why.\n\nRULES: Use only the attached paper; quote the sentence you rely on. Write [NOT REPORTED] if it isn't there.",
    size: 12,
    side: ["Grounded|'Use only the attached paper' plus quotes.", "Right checklist|The design decides the tool.", "Numbers explained|Effect size in patient terms.", "Applicability|The question examiners ask."],
    notes: "Demonstrate on a recent landmark paper. Show the quoted sentences.",
  });

  await d.cards({
    kicker: "Beyond one paper", title: "*NotebookLM*: read ten papers at once", cols: 4,
    items: [
      { icon: "FaBookOpen", title: "Grounded answers", body: "Answers only from the papers you upload, with a citation to the exact passage.", size: 13 },
      { icon: "FaTableList", title: "Compare across papers", body: "\"How do these 6 trials define exacerbation?\" in one table.", size: 13 },
      { icon: "FaHeadphones", title: "Audio overview", body: "A podcast-style discussion of your papers for the commute.", size: 13 },
      { icon: "FaDiagramProject", title: "Mind maps and guides", body: "A concept map and study guide from your sources. Free with a Google account.", size: 13 },
    ],
    note: "Best for journal club prep and literature reviews: *your sources only, every answer traceable.*",
    notes: "NotebookLM limits: up to 50 sources per notebook on the free tier (check current limits).",
  });

  await d.cards({
    kicker: "If you remember one thing", title: "Never cite a paper *you haven't opened*", cols: 3,
    items: [
      { icon: "FaTriangleExclamation", tag: "The failure", title: "Invented references", body: "Real-sounding authors, journals and years that don't exist, or real papers that don't say what's claimed." },
      { icon: "FaListCheck", tag: "The habit", title: "Open, check, save", body: "The PMID or DOI opens; the paper says what's claimed; it isn't retracted; save it to Zotero." },
      { icon: "FaShieldHalved", tag: "Why it matters", title: "Your name is on it", body: "A fabricated citation outlives the deadline that tempted you to skip the check.", hot: true },
    ],
    notes: "Retraction check: Retraction Watch database or the journal page. Zotero flags retracted items automatically.",
  });

  d.closing({
    kicker: "Take-home", title: "Search smarter. *Read deeper.*",
    lead: "Connectors to find, dedicated tools to map and screen, five questions to understand, and your own eyes to verify.",
    next: "From Research Question to Study Design · Dr. Saikat Banerjee · 8:20 PM",
    notes: "Hand over to Dr. Saikat.",
  });

  await d.save(dir);
};
