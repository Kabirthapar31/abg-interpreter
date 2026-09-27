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
| 1.9 Discussion, conclusion & limitations | 30 | pending |
| 1.10 Protocol, ethics & synopsis | 20 | pending |
| 1.11 Thesis to manuscript & publication | 35 | pending |
| 1.12 Case reports & case series | 30 | pending |
| 1.13 Conference abstracts, posters & oral papers | 20 | pending |

## If the session was interrupted
Read this file, check `git log`, continue from the first `pending` section, then render and send the Volume 1 PDF.
