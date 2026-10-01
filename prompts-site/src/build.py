"""Build the prompt finder: inject prompts.json into app.html.

Writes public/index.html (Firebase Hosting; served at / and at /prompts via rewrites) and
build/artifact.html (the same page without the document skeleton, for previews).
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
subprocess.run([sys.executable, str(HERE / "export.py")], check=True)
data = json.loads((HERE / "prompts.json").read_text(encoding="utf-8"))
blob = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
page = (HERE / "app.html").read_text(encoding="utf-8").replace("/*__DATA__*/", blob)

(ROOT / "build").mkdir(exist_ok=True)
(ROOT / "build" / "artifact.html").write_text(page, encoding="utf-8")
out = ROOT / "public" / "index.html"
out.parent.mkdir(parents=True, exist_ok=True)
head, body = page.split('<div class="wrap">', 1)
out.write_text('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
               '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
               f'{head}</head>\n<body>\n<div class="wrap">{body}\n</body>\n</html>\n', encoding="utf-8")
print("wrote", out.relative_to(ROOT), out.stat().st_size // 1024, "KB")
