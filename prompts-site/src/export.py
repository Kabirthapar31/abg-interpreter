"""Export the 1,000-prompt library to JSON for the prompt finder website."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "medical-prompts" / "build"))
from library import load_volume, qa  # noqa: E402

VOLS = {1: (1, "Thesis, Research & Publication"), 2: (401, "Seminars, Journal Clubs & Presentations"),
        3: (701, "Study, Exam & Viva Prep")}
LABELS = [("Persona", "persona"), ("My context", "context"), ("Task", "task"), ("Rules", "rules"),
          ("Output", "output"), ("Tweak", "tweak")]


def prompt_text(p):
    if p["tier"] == "Q":
        return p["body"].strip()
    out = []
    for lbl, k in LABELS:
        if p.get(k):
            v = p[k].strip()
            out.append(v if k == "persona" else f"{lbl.upper()}:\n{v}")
    return "\n\n".join(out)


sections, prompts = [], []
for v, (start, vname) in VOLS.items():
    secs = load_volume(v, start)
    _, slugs = qa(secs)
    for s in secs:
        sections.append({"id": s["num"], "v": v, "t": s["title"], "why": s["why"],
                         "a": s["prompts"][0]["n"], "b": s["prompts"][-1]["n"]})
        for p in s["prompts"]:
            nx = slugs.get(p.get("next") or "", None)
            prompts.append({
                "n": p["n"], "s": s["num"], "tier": p["tier"], "t": p["title"], "aud": p.get("aud", ""),
                "use": p.get("use", ""), "why": p.get("why", ""), "p": prompt_text(p),
                "tips": [x.lstrip("- ").strip() for x in p.get("tips", "").splitlines() if x.strip()]
                        or ([p["tip"]] if p.get("tip") else []),
                "try": p.get("try", ""), "next": nx["n"] if nx else None, "slug": p["slug"],
            })
data = {"vols": {str(k): v[1] for k, v in VOLS.items()}, "sections": sections, "prompts": prompts}
out = Path(__file__).resolve().parent / "prompts.json"
out.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(prompts), "prompts,", out.stat().st_size // 1024, "KB")
