# 1,000 Medical Prompts: progress

Approved decisions (user, Step 2):
- Three volumes plus a combined edition. **Exactly 1,000 prompts in total**: 400 Thesis / 300 Seminars / 300 Study.
- Reuse and refresh the existing Parabox prompts as Master anchors (counted inside the 1,000).
- Exam defaults: **NEET-PG and UPSC CMS** for MBBS students and graduates; the **residency university exams
  (MD/MS/DNB)** for residents. USMLE / PLAB / MRCP are optional, offered inside brackets.
- Tiers: about 300 Quick / 580 Standard / 120 Master.
- Build Volume 1 (Thesis) first and send it for review.

Workflow: write `prompts/volN/*.txt` → `python3 build/library.py N` (QA) → `python3 build/render.py N` (PDF).
Commit and push after every section file.

## Volume 1: Thesis, Research & Publication (#1–400)

| Section | Target | Status |
|---|---:|---|
| 1.1 Topic selection & research question | 35 | done |
| 1.2 Literature search strategy | 30 | done |
| 1.3 Writing the Introduction | 30 | done |
| 1.4 Review of Literature | 40 | done |
| 1.5 Aims, objectives & hypotheses | 20 | done |
| 1.6 Study design & methodology | 40 | done |
| 1.7 Sample size & statistics | 45 | done |
| 1.8 Results, tables & figures | 25 | done |
| 1.9 Discussion, conclusion & limitations | 30 | done |
| 1.10 Protocol, ethics & synopsis | 20 | done |
| 1.11 Thesis to manuscript & publication | 35 | done |
| 1.12 Case reports & case series | 30 | done |
| 1.13 Conference abstracts, posters & oral papers | 20 | done |

**Volume 1 complete:** 400 prompts (48 Master / 229 Standard / 123 Quick), QA clean, rendered to
`Vol1_Thesis_Research_Publication.pdf` (210 pages) and sent to the user for review.

## Volume 2: Seminars, Journal Clubs & Presentations (#401–700)

| Section | Target | Status |
|---|---:|---|
| 2.1 Seminar preparation | 60 | done |
| 2.2 Journal club | 60 | done |
| 2.3 Slide design & structure | 40 | pending |
| 2.4 Talks & oral presentations | 35 | pending |
| 2.5 Posters & visual teaching aids | 35 | pending |
| 2.6 Case presentations & grand rounds | 40 | pending |
| 2.7 Delivery, Q&A & teaching | 30 | pending |

## Volume 3: Study, Exam & Viva Prep (#701–1000)

| Section | Target | Status |
|---|---:|---|
| 3.1 Learning any topic | 50 | pending |
| 3.2 Study planning & revision | 30 | pending |
| 3.3 MCQ practice & exam strategy | 50 | pending |
| 3.4 Long & short answer writing | 30 | pending |
| 3.5 Viva, OSCE & practical exams | 50 | pending |
| 3.6 Clinical reasoning & differential diagnosis | 60 | pending |
| 3.7 Memory aids & high-yield summaries | 30 | pending |

## Sparse-page check (run after rendering)
```
python3 -c "import pymupdf; d=pymupdf.open('VolN_….pdf'); [print(i+1) for i,p in enumerate(d) if len(p.get_text().split())<60]"
```

## If the session was interrupted
Read HANDOFF.md and this file, check `git log`, continue from the first `pending` section, render each finished volume
and send the PDF to the user.
