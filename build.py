#!/usr/bin/env python3
"""Inline src/ into one self-contained HTML file: dist/Yggdrasil-Guild-Hall.html"""
import json, pathlib
src = pathlib.Path(__file__).parent / "src"
dist = pathlib.Path(__file__).parent / "dist"; dist.mkdir(exist_ok=True)
read = lambda f: (src / f).read_text(encoding="utf-8")
notice = read("notice.css")
styles = read("styles.css") + "\n" + notice
scripts = "\n".join(read(f) for f in ["core.js", "access.js", "jobtables.js", "upgtables.js", "jobboard.js", "standing.js", "upgrades.js", "roster.js", "shoptables.js", "shops.js", "npctables.js", "npcs.js", "tableeditor.js", "app.js"])
scripts = scripts.replace('/*NOTICE_CSS*/""', json.dumps(notice))
html = read("index.html").replace("/*STYLES*/", styles).replace("/*SCRIPTS*/", scripts.replace("</script>", "<\\/script>"))
out = dist / "Yggdrasil-Guild-Hall.html"
out.write_text(html, encoding="utf-8")
print(f"built {out} ({len(html)//1024} KB)")
