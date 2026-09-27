"""Parse, QA and render the Parabox 1,000-prompt library.

Source format (prompts/volN/*.txt):

    # 1.1 | Section title | One-line WHY for the section opener
    @@ Q | slug | Prompt title
    aud: Student / Resident
    body: ...                      (Quick only)
    try: ...
    @@ S | slug | Prompt title
    aud: ... / use: ... / persona: ... / context: ... / task: ... / rules: ...
    output: ... / tip: ... / try: ... / next: slug
    @@ M | slug | Prompt title
    aud / use / why / persona / context / task / rules / output / tweak / tips / next

A value continues on following lines until the next `key:` line or record.
"""
import html
import re
import sys
from pathlib import Path

KEYS = {"aud", "use", "why", "persona", "context", "task", "rules", "output",
        "tweak", "tips", "try", "tip", "next", "body"}
TIERS = {"Q": "Quick", "S": "Standard", "M": "Master"}
LIMITS = {"Q": (40, 80), "S": (100, 200), "M": (250, 450)}
BODY_KEYS = {"Q": ["body"], "S": ["persona", "context", "task", "rules", "output"],
             "M": ["persona", "context", "task", "rules", "output", "tweak"]}
REQUIRED = {"Q": ["aud", "body", "try"],
            "S": ["aud", "use", "persona", "context", "task", "rules", "output", "tip"],
            "M": ["aud", "use", "why", "persona", "context", "task", "rules", "output", "tweak", "tips"]}

ROOT = Path(__file__).resolve().parent.parent


def parse_file(path):
    sections, cur_sec, cur, key = [], None, None, None
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if line.startswith("# "):
            num, title, why = [p.strip() for p in line[2:].split("|")]
            cur_sec = {"num": num, "title": title, "why": why, "prompts": []}
            sections.append(cur_sec)
            cur, key = None, None
            continue
        if line.startswith("@@ "):
            tier, slug, title = [p.strip() for p in line[3:].split("|", 2)]
            cur = {"tier": tier, "slug": slug, "title": title, "section": cur_sec["num"],
                   "section_title": cur_sec["title"], "file": path.name}
            cur_sec["prompts"].append(cur)
            key = None
            continue
        m = re.match(r"^([a-z]+):\s?(.*)$", line)
        if cur is not None and m and m.group(1) in KEYS:
            key = m.group(1)
            cur[key] = m.group(2)
            continue
        if cur is not None and key:
            cur[key] = (cur[key] + "\n" + line) if cur[key] else line
    for sec in sections:
        for p in sec["prompts"]:
            for k in list(p):
                if isinstance(p[k], str):
                    p[k] = p[k].strip()
    return sections


def load_volume(vol, start):
    sections = []
    for f in sorted((ROOT / "prompts" / f"vol{vol}").glob("*.txt")):
        sections += parse_file(f)
    n = start
    for sec in sections:
        for p in sec["prompts"]:
            p["n"] = n
            n += 1
    return sections


def words(p):
    text = " ".join(p.get(k, "") for k in BODY_KEYS[p["tier"]])
    return len(re.findall(r"\S+", text))


def qa(sections, targets=None):
    problems, slugs, titles = [], {}, {}
    allp = [p for s in sections for p in s["prompts"]]
    for p in allp:
        tag = f"#{p['n']} {p['slug']}"
        if p["tier"] not in TIERS:
            problems.append(f"{tag}: bad tier {p['tier']}")
            continue
        for k in REQUIRED[p["tier"]]:
            if not p.get(k):
                problems.append(f"{tag}: missing {k}")
        lo, hi = LIMITS[p["tier"]]
        w = words(p)
        if not lo <= w <= hi:
            problems.append(f"{tag}: {w} words (tier {p['tier']} {lo}-{hi})")
        if p["slug"] in slugs:
            problems.append(f"{tag}: duplicate slug")
        slugs[p["slug"]] = p
        t = p["title"].lower()
        if t in titles:
            problems.append(f"{tag}: duplicate title")
        titles[t] = p
        if p["tier"] == "Q" and len(re.findall(r"\[[^\]]+\]", p.get("body", ""))) > 5:
            problems.append(f"{tag}: more than 5 placeholders in a Quick prompt")
        body = " ".join(p.get(k, "") for k in BODY_KEYS[p["tier"]])
        if p["tier"] != "Q" and "[PASTE" in p.get("task", ""):
            problems.append(f"{tag}: paste slot inside TASK (must sit in MY CONTEXT)")
        if body.count("[") != body.count("]"):
            problems.append(f"{tag}: unbalanced brackets")
    for p in allp:
        if p.get("next") and p["next"] not in slugs:
            problems.append(f"#{p['n']} {p['slug']}: unknown next -> {p['next']}")
    if targets:
        for s in sections:
            want = targets.get(s["num"])
            if want is not None and len(s["prompts"]) != want:
                problems.append(f"section {s['num']}: {len(s['prompts'])} prompts, target {want}")
    return problems, slugs


def fmt(text):
    """Escape, colour placeholders, keep line breaks."""
    t = html.escape(text)
    t = re.sub(r"\[([^\]]+)\]", r'<span class="ph">[\1]</span>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return t.replace("\n", "<br>")


def stats(sections):
    allp = [p for s in sections for p in s["prompts"]]
    c = {k: sum(1 for p in allp if p["tier"] == k) for k in TIERS}
    return len(allp), c


if __name__ == "__main__":
    vol = int(sys.argv[1])
    start = {1: 1, 2: 401, 3: 701}[vol]
    secs = load_volume(vol, start)
    probs, _ = qa(secs)
    total, c = stats(secs)
    print(f"Volume {vol}: {total} prompts {c}")
    for s in secs:
        print(f"  {s['num']:5} {len(s['prompts']):3}  {s['title']}")
    print("\n".join(probs) or "QA clean")
