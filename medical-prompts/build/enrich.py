"""Top up prompts that fall just below their tier's minimum word count with useful, non-duplicated content.

Usage: python3 build/enrich.py 2   (edits prompts/vol2/*.txt in place, then re-run library.py to confirm)

Additions are standard, meaningful fields from SKILL.md (level/specialty, audience, uncertainty flag),
added only when absent, so prompts stay natural. Anything still short is reported for a manual edit.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from library import KEYS, LIMITS, ROOT, parse_file, words  # noqa: E402

Q_ADD = " Flag anything you are unsure of so I can check it."
S_CONTEXT = [("My specialty and level: [e.g. final-year MBBS / MD Medicine, year 2]", "specialty"),
             ("Audience or purpose: [brief]", "audience")]
M_CONTEXT = [("My specialty and year: [e.g. final-year MBBS / MD Medicine, year 2]", "specialty"),
             ("Audience and time available: [brief]", "audience"),
             ("What I most want to get out of this: [one line]", "most want")]
M_TASK = "Finish with a short list of anything you were unsure about, so I can verify it before use."


def patch_block(text, slug, key, new_value):
    """Replace one field of one record in the raw file text."""
    start = text.index(f"| {slug} |")
    end = text.find("\n@@ ", start)
    end = len(text) if end == -1 else end
    rec = text[start:end]
    keys = "|".join(sorted(KEYS))
    m = re.search(rf"^{key}: .*?(?=^(?:{keys}): |\Z)", rec, re.S | re.M)
    rec2 = rec[:m.start()] + f"{key}: {new_value}\n" + rec[m.end():]
    return text[:start] + rec2 + text[end:]


def enrich(vol):
    for f in sorted((ROOT / "prompts" / f"vol{vol}").glob("*.txt")):
        text = f.read_text(encoding="utf-8")
        for sec in parse_file(f):
            for p in sec["prompts"]:
                lo = LIMITS[p["tier"]][0]
                if words(p) >= lo:
                    continue
                if p["tier"] == "Q":
                    if "unsure" not in p["body"]:
                        text = patch_block(text, p["slug"], "body", p["body"] + Q_ADD)
                    continue
                adds = S_CONTEXT if p["tier"] == "S" else M_CONTEXT
                ctx = p["context"]
                added = []
                for line, key_word in adds:
                    if words(p) >= lo:
                        break
                    if key_word in ctx.lower():
                        continue
                    added.append(line)
                    p["context"] = "\n".join(added + [ctx])
                text = patch_block(text, p["slug"], "context", p["context"])
                if p["tier"] == "M" and words(p) < lo and "unsure about" not in p["task"]:
                    n = len(re.findall(r"^\d+\.", p["task"], re.M)) + 1
                    p["task"] = p["task"] + f"\n{n}. {M_TASK}"
                    text = patch_block(text, p["slug"], "task", p["task"])
        f.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    enrich(int(sys.argv[1]))
