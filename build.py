#!/usr/bin/env python3
"""Une los archivos de src/ en un único index.html (funciona offline y en GitHub Pages)."""
import pathlib
root = pathlib.Path(__file__).parent
src = root / "src"
order = ["data.js", "art.js", "audio.js", "main.js", "ch1_tales.js", "ch2_socrates.js", "ch3_platon.js"]
js = "\n\n".join((src / f).read_text(encoding="utf-8") for f in order) + "\n\nboot();\n"
css = (src / "style.css").read_text(encoding="utf-8")
html = (src / "index.template.html").read_text(encoding="utf-8")
html = html.replace("/*@@CSS@@*/", css).replace("/*@@JS@@*/", js)
(root / "index.html").write_text(html, encoding="utf-8")
print("index.html", round(len(html.encode("utf-8")) / 1024, 1), "KB")
