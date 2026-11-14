# Renders the deck to PDF + thumbnails. Run after build.py:  python3 overnight/deck/render.py
import json, re, asyncio, os, shutil
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(HERE + '/../..')
P = HERE + '/project'
deck = json.load(open(P + '/deck.json')); css = open(P + '/deck.css').read()
assets = json.load(open(HERE + '/assets.json'))
THUMBS = os.environ.get('THUMBS', '/tmp/deck_thumbs'); os.makedirs(THUMBS, exist_ok=True)
slides = []
for i in deck['order']:
    h = open(f'{P}/slides/{i}.html').read()
    h = re.sub(r'<aside>.*?</aside>', '', h, flags=re.S)
    for blob, f in assets.values(): h = h.replace(blob, 'file://' + HERE + '/' + f)
    slides.append(h)
F = 'file://' + ROOT + '/app/fonts/'
fonts = f'''@font-face{{font-family:'Source Sans 3';src:url({F}source-sans-3-latin-wght-normal.woff2);font-weight:200 900}}
@font-face{{font-family:'Source Sans 3';src:url({F}source-sans-3-latin-ext-wght-normal.woff2);font-weight:200 900;unicode-range:U+0100-024F}}
@font-face{{font-family:'Source Sans 3';font-style:italic;src:url({F}source-sans-3-latin-wght-italic.woff2);font-weight:200 900}}'''
html = f'''<!doctype html><html><head><meta charset="utf-8"><style>{fonts}
@page{{size:1920px 1080px;margin:0}} html,body{{margin:0}} section{{width:1920px;height:1080px;position:relative;overflow:hidden;page-break-after:always}}
{css} *{{animation:none!important}}</style></head><body>{"".join(slides)}</body></html>'''
open(THUMBS + '/deck_local.html', 'w').write(html)
PDF = ROOT + '/overnight/deliverables/Ajoissa_pitch_deck.pdf'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto('file://' + THUMBS + '/deck_local.html'); await pg.wait_for_timeout(1500)
        await pg.pdf(path=PDF, width='1920px', height='1080px', print_background=True)
        # overflow check: any element extending beyond its slide
        over = await pg.evaluate('''() => [...document.querySelectorAll('section')].map(s => { const r = s.getBoundingClientRect(); let bad = [];
          s.querySelectorAll('*').forEach(e => { const q = e.getBoundingClientRect(); if (q.width && (q.bottom > r.bottom - 60 + 1 || q.right > r.right - 100)) bad.push(e.tagName + '.' + e.className + ' ' + Math.round(q.bottom - r.top)); });
          return s.id + ': ' + (bad.length ? bad.slice(0, 4).join(' | ') : 'ok'); })''')
        print('\n'.join(over))
        n = await pg.locator('section').count()
        for k in range(n):
            await pg.locator('section').nth(k).screenshot(path=f'{THUMBS}/thumb_{k:02d}.png')
        await b.close()
asyncio.run(main())
shutil.copy(PDF, ROOT + '/overnight/Ajoissa_pitch_deck.pdf')
print('PDF:', PDF)
