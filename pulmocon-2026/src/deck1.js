const { Deck } = require("./lib");

module.exports = async function (dir) {
  const d = new Deck({ file: "01_AI_in_Clinical_Practice", session: "AI in Clinical Practice", time: "6:10 PM", total: 19 });

  d.cover({
    kicker: "Pre-conference workshop · AI in Clinical Practice and Research",
    title: "AI in *Clinical Practice.*",
    lead: "Which tools are built for medicine, how to ground a chatbot in real evidence, and the bedside workflows worth adopting this week.",
    chips: ["Clinical-grade tools", "Connectors", "Bedside workflows", "Guardrails"],
    presenters: "Dr. Abhishek J. Benur  ·  Dr. Saikat Banerjee",
    cred: "Pulmonologist · Co-Founder, Parabox AI",
    notes: "15-minute talk with rapid demonstrations. Frame: not 'is AI coming' but 'which AI, for which job, with which guardrails'. The next three sessions go deep on difficult cases, tests and reports, and medicines, so this one sets up the toolkit.",
  });

  await d.cards({
    kicker: "The next 15 minutes", title: "Four questions every clinician is asking", cardH: 3.3,
    note: "The promise: *every tool in this talk works on your phone tonight,* and each one comes with a guardrail.",
    items: [
      { icon: "FaStethoscope", tag: "01", title: "Which tools are made for medicine?", body: "Clinical-grade answer engines versus general chatbots.", size: 15 },
      { icon: "FaPlug", tag: "02", title: "How do I stop it making things up?", body: "Connect ChatGPT and Claude to PubMed and Consensus.", size: 15 },
      { icon: "FaNotesMedical", tag: "03", title: "Where does it help on the ward?", body: "Differentials, discharge summaries, letters, patient education.", size: 15 },
      { icon: "FaShieldHalved", tag: "04", title: "What must I never do?", body: "Privacy, verification and accountability, in one checklist.", size: 15 },
    ],
    notes: "Agenda. Keep it moving: one minute here.",
  });

  await d.cards({
    kicker: "The landscape", title: "Two families of *clinical AI*", cols: 2,
    items: [
      { icon: "FaRobot", tag: "General-purpose assistants", title: "ChatGPT · Claude · Gemini", body: "- Brilliant at drafting, explaining, summarising and reasoning\n- Trained on the open internet: answers sound right even when they're not\n- Become evidence tools only when you **connect them to sources**" },
      { icon: "FaBookMedical", tag: "Clinical-grade answer engines", title: "OpenEvidence · UpToDate Expert AI · Vera · Glass", body: "- Built for clinicians, searching curated literature and guidelines\n- Every answer cited, so you can open the source\n- Verified-clinician access; some are free, some are institutional", hot: true },
    ],
    note: "Rule of thumb: *a clinical question goes to a clinical-grade tool first;* a writing or thinking task goes to an assistant.",
    notes: "The key distinction. General assistants are generalists; clinical-grade tools restrict themselves to curated medical sources and show citations. The assistants can be upgraded with connectors, which we will see in a moment.",
  });

  await d.cards({
    kicker: "Clinical-grade tools", title: "The line-up at the *point of care*", cols: 4,
    items: [
      { icon: "FaMagnifyingGlass", tag: "OpenEvidence", title: "Cited clinical answers", titleSize: 15, body: "Searches peer-reviewed journals and guidelines; free for verified clinicians. A free version is rolling out to ~100 low- and middle-income countries (2026).", size: 13.5 },
      { icon: "FaBookOpen", tag: "UpToDate Expert AI", title: "Answers from UpToDate", titleSize: 15, body: "GenAI answers drawn only from UpToDate's expert-authored content, with Lexidrug drug information. Institutional licence; Pro Plus for individuals.", size: 13.5 },
      { icon: "FaListCheck", tag: "Vera Health", title: "Evidence-graded answers", titleSize: 15, body: "Retrieves from 60M+ papers and guidelines, grades the evidence, cites it. Free for licensed clinicians and medical students.", size: 13.5 },
      { icon: "FaBrain", tag: "Glass Health", title: "DDx and A&P drafting", titleSize: 15, body: "Keeps an evolving differential and drafts an assessment and plan with citations. Includes an ambient scribe. Free Lite tier.", size: 13.5 },
    ],
    note: "Access, pricing and availability in India change often. *Check each tool's current terms before you rely on it.*",
    notes: "Sources: vendor pages and press releases, 2025–2026. OpenEvidence LMIC rollout announced with Anthropic, Sept 2026; India not explicitly named in coverage, so tell the audience to check. UpToDate Expert AI launched 2025; closed to the open web. Vera Health: free for licensed clinicians and students (vendor claim). Glass Health: Lite tier free (vendor).",
  });

  await d.cards({
    kicker: "The big assistants, made clinical", title: "Healthcare editions of *Claude and ChatGPT*", cols: 3,
    items: [
      { icon: "FaHospital", tag: "Anthropic · Jan 2026", title: "Claude for Healthcare", body: "- Native connectors: **PubMed**, **ICD-10**, CMS Coverage Database\n- HIPAA-ready enterprise offering\n- Agent Skills for repeatable clinical workflows" },
      { icon: "FaUserDoctor", tag: "OpenAI · Apr 2026", title: "ChatGPT for Clinicians", body: "- Free for **verified US** physicians, NPs, PAs and pharmacists\n- Cited clinical search, documentation, reusable skills\n- Not yet a default option for Indian clinicians" },
      { icon: "FaHeartPulse", tag: "OpenAI · Jul 2026", title: "ChatGPT Health", body: "- Consumer health space inside ChatGPT (US first)\n- Your patients are already using it\n- Ask them what it told them" },
    ],
    note: "What you can use in India today: *Claude or ChatGPT with the PubMed and Consensus connectors.* That's next.",
    notes: "Dates from press coverage: Claude for Healthcare announced at JPM, January 2026 (connectors to CMS Coverage Database, ICD-10, PubMed). ChatGPT for Clinicians launched 23 April 2026 for verified US clinicians. ChatGPT Health launched to US users July 2026. Emphasise that patients are consulting AI too.",
  });

  d.section({ num: "01", kicker: "Grounding", title: "Connect the chatbot to *real evidence*", lead: "A connector lets ChatGPT or Claude search PubMed or Consensus while it answers, so you get PMIDs you can open, not references it remembers.", notes: "Section break: connectors." });

  d.flow({
    kicker: "How a connector works", title: "From a memory to a *search*",
    items: [
      { title: "You ask", body: "A focused clinical question, with the population and the outcome you care about." },
      { title: "The assistant plans", body: "It turns your question into search terms and calls the connector." },
      { title: "PubMed / Consensus search", body: "Real records come back: titles, abstracts, PMIDs, DOIs, study types." },
      { title: "It answers from them", body: "A summary that cites the retrieved papers, which you can open and check." },
      { title: "You verify", body: "Open the key papers. Check that each claim matches what the paper says." },
    ],
    note: "Without a connector, the model answers from memory. *That's where invented references come from.*",
    notes: "Explain Model Context Protocol simply: a plug that lets the assistant use another service. Claude's PubMed connector searches 35M+ citations; Consensus covers 220M+ papers.",
  });

  d.table({
    kicker: "Switch them on", title: "Set up once, use *every day*",
    rows: [
      ["ASSISTANT", "CONNECTOR", "HOW TO ENABLE", "BEST FOR"],
      ["Claude", "PubMed", "Settings → Connectors → PubMed → Connect", "PMID-level searches, recent trials, full text where open access"],
      ["Claude", "Consensus", "Settings → Connectors → Consensus → Connect", "What does the evidence say? Yes/no questions across studies"],
      ["ChatGPT", "Consensus app", "Apps (connectors) → search Consensus → Connect", "Evidence summaries and study lists inside ChatGPT"],
      ["ChatGPT / Claude", "Deep Research", "Choose Deep Research / Research in the chat box", "Multi-source reports in 5–10 minutes; verify every citation"],
    ],
    colW: [1.9, 1.9, 4.2, 4.13], fontSize: 13.5,
    note: "Menu names move between app versions. *Look for 'Connectors' or 'Apps' in Settings.*",
    notes: "Live demo if Wi-Fi allows: show the Connectors screen in Claude and the Consensus app in ChatGPT. Menu paths are as of September 2026; they change often.",
  });

  d.prompt({
    kicker: "Rapid demo", title: "A clinical question, *answered from PubMed*", label: "Prompt · Claude + PubMed connector",
    text: "Search PubMed for randomised trials and meta-analyses from the last 5 years on [high-flow nasal oxygen vs non-invasive ventilation in acute hypoxaemic respiratory failure].\n\nFor each study give: design, population, n, primary outcome, main result with effect size and 95% CI, and the PMID.\n\nThen summarise what the evidence shows in 5 bullets, and say where the studies disagree.\n\nRULES: Cite only papers you retrieved in this search. If a detail is not in the abstract, write [NOT REPORTED]. Do not recommend treatment for an individual patient.",
    size: 14,
    side: ["Scoped search|Design filter and a 5-year window keep it current.", "Fixed extraction|The same fields for every paper make them comparable.", "Honest gaps|[NOT REPORTED] instead of an invented number.", "Your judgement stays|It summarises evidence; you apply it."],
    notes: "Run this live in Claude with the PubMed connector on. Point out the PMIDs, then click one to show it is real.",
  });

  d.section({ num: "02", kicker: "At the bedside", title: "Workflows worth *adopting this week*", lead: "The tasks where AI already saves time: thinking wider, writing faster, explaining better.", notes: "Section break: workflows." });

  d.prompt({
    kicker: "Differential diagnosis", title: "A Claude *Skill* for the differential", label: "Saved as a Claude Skill · runs every time",
    text: "ROLE: Senior physician teaching diagnostic reasoning.\nINPUT: De-identified case: [age, sex, presenting complaint, duration, key positives and negatives, vitals, labs, imaging].\n\nSTEPS:\n1. One-line problem representation.\n2. Prioritised differential: most likely, and the can't-miss diagnoses.\n3. For each: findings for, findings against.\n4. The next 3 tests that best separate them, and why.\n5. Red flags that need action now.\n\nRULES: Mark guideline thresholds [VERIFY]. Say what information would change the ranking.",
    size: 13,
    side: ["What a Skill is|Saved instructions Claude loads automatically whenever the task fits.", "Same structure, every case|No re-typing the prompt on a busy ward.", "Built-in safety|Can't-miss diagnoses and red flags are always listed.", "Decision support only|You examine the patient and decide."],
    note: "Create one: *Settings → Capabilities → Skills,* or ask Claude to 'turn this prompt into a skill'.",
    notes: "Show the differential-diagnosis skill we use. The skill carries the structure; the clinician brings the findings. Dr. Saikat's next session takes difficult cases live.",
  });

  d.prompt({
    kicker: "Documentation", title: "Discharge summary in *minutes, not an hour*", label: "Prompt · discharge summary",
    text: "Act as a senior resident writing a discharge summary for a [government teaching hospital] in [India].\n\nMATERIAL (de-identified): [paste admission notes, daily progress, key labs and imaging, procedures, discharge medications]\n\nWrite it under these headings: diagnosis; presenting complaint; course in hospital; key investigations (with dates as Day 1, Day 2…); procedures; condition at discharge; discharge medications (name, dose, frequency, duration); follow-up and red-flag symptoms for the patient.\n\nRULES: Use only the material I pasted. Write [MISSING] where information is absent. Do not change any drug or dose; flag apparent errors instead.\nAdd a 5-line patient version in simple [Hindi / Kannada / English].",
    size: 12.5,
    side: ["No identifiers|Day 1, Day 2 instead of dates; no name or ID number.", "Grounded|'Use only the material' stops invented events.", "[MISSING] flags|Gaps become visible, not papered over.", "Two audiences|The chart version and the patient version together."],
    notes: "The single biggest time-saver on the ward. Stress the de-identification and that the resident signs the summary.",
  });

  await d.cards({
    kicker: "More domains", title: "Six more places AI *earns its keep*", cols: 3,
    items: [
      { icon: "FaLanguage", title: "Patient education", body: "Explain inhaler technique or a new diagnosis in the patient's language, at a 6th-grade level.", size: 13 },
      { icon: "FaEnvelope", title: "Referral and letters", body: "Referral letters, fitness certificates, insurance and pre-authorisation drafts from your notes.", size: 13 },
      { icon: "FaPills", title: "Medicines", body: "Interaction and renal-dose checks via UpToDate Expert AI or OpenEvidence; always confirm in a formulary.", size: 13 },
      { icon: "FaFileMedical", title: "Reports and results", body: "Summarise a long PFT, CT or lab trend into what changed and what matters.", size: 13 },
      { icon: "FaComments", title: "Handover", body: "Turn a ward list into structured SBAR handover, with pending tasks flagged.", size: 13 },
      { icon: "FaGraduationCap", title: "Teaching rounds", body: "Case-based MCQs and viva questions from today's patients, de-identified.", size: 13 },
    ],
    notes: "Rapid tour. Medicines and tests/reports are covered in depth in Dr. Saikat's sessions later this evening, so keep these brief.",
  });

  d.table({
    kicker: "Decision guide", title: "Which tool do I *actually open?*",
    rows: [
      ["TASK", "FIRST CHOICE", "WHY"],
      ["A clinical question at the bedside", "OpenEvidence · Vera · UpToDate Expert AI", "Curated sources, cited answers, built for clinicians"],
      ["What does the latest evidence say?", "Claude / ChatGPT + PubMed or Consensus", "Live search with PMIDs you can open"],
      ["Thinking wider on a differential", "Claude Skill · Glass Health", "Structured, can't-miss diagnoses always listed"],
      ["Discharge summary or letter", "Claude · ChatGPT", "Strong writers; you paste de-identified notes"],
      ["Patient explanation in Hindi or a regional language", "ChatGPT · Claude · Gemini", "Good multilingual drafts; check the medical terms"],
      ["Drug interaction or dose", "UpToDate Expert AI (Lexidrug) · formulary", "Drug-database backed; never a general chatbot alone"],
    ],
    colW: [3.9, 3.9, 4.33], fontSize: 13.5,
    notes: "The slide to photograph. Walk through two rows only, given time.",
  });

  d.section({ num: "03", kicker: "Guardrails", title: "Use it *without getting hurt*", lead: "Three failure modes and one checklist.", notes: "Section break: guardrails." });

  await d.cards({
    kicker: "Know the failure modes", title: "Where clinical AI *goes wrong*", cols: 3,
    items: [
      { icon: "FaTriangleExclamation", title: "Confident fabrication", body: "Plausible doses, trials and references that don't exist. Most likely when there's no connector or source." },
      { icon: "FaRotate", title: "Out of date or out of place", body: "Old guidelines, US-centric drugs and doses, no ICMR or NTEP context unless you give it." },
      { icon: "FaScaleBalanced", title: "Automation bias", body: "A fluent answer makes us stop thinking. Ask 'what else could this be?' before you accept it." },
    ],
    note: "Counter-move for all three: *ask for sources, state your setting, and keep the final decision yours.*",
    notes: "Automation bias is the subtle one: seniors fall for it too.",
  });

  await d.cards({
    kicker: "Non-negotiable", title: "Patient data *never goes into a public chatbot*", cols: 2,
    items: [
      { icon: "FaLock", tag: "The rule", title: "De-identify before you paste", body: "- No names, UHID or IP numbers, phone numbers, addresses or exact dates\n- Crop identifiers from scans and photos\n- India's DPDP Act 2023 makes health data your legal responsibility" },
      { icon: "FaCircleCheck", tag: "Do this instead", title: "Safe habits", body: "- '62-year-old man, Day 3 of admission'\n- Prefer enterprise or HIPAA-ready tools where your hospital provides them\n- Follow your institution's AI policy; ask if none exists", hot: true },
    ],
    notes: "DPDP Act 2023 (Digital Personal Data Protection Act). Rules notified 2025. Keep the message simple: de-identify, always.",
  });

  await d.cards({
    kicker: "Before it reaches a patient", title: "The clinician's *verification checklist*", cols: 3,
    items: [
      { icon: "FaLink", title: "Sources are real", body: "Each PMID or DOI opens, and the paper says what's claimed." },
      { icon: "FaPills", title: "Doses are checked", body: "Against a formulary or guideline, never the chatbot alone." },
      { icon: "FaRotate", title: "It's current", body: "The latest guideline version, not last decade's." },
      { icon: "FaHospital", title: "It fits your setting", body: "Indian epidemiology, drug availability, local protocols." },
      { icon: "FaBrain", title: "You understand it", body: "If you can't explain it, you can't act on it." },
      { icon: "FaUserDoctor", title: "A human signs off", body: "Accountability stays with the clinician. Always." },
    ],
    notes: "Six checks. Suggest they screenshot this slide.",
  });

  d.closing({
    kicker: "Take-home", title: "AI drafts. *You decide.*",
    lead: "Use clinical-grade tools for clinical questions, connect your assistant to real evidence, and keep your judgement and your patient's privacy at the centre.",
    next: "Difficult Cases: How AI Can Help (live cases) · Dr. Saikat Banerjee · 6:25 PM",
    notes: "Close in 30 seconds and hand over to Dr. Saikat for difficult cases.",
  });

  await d.save(dir);
};
