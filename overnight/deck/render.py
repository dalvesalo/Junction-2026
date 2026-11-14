import json, re, asyncio
from playwright.async_api import async_playwright
deck=json.load(open('/home/claude/junction-2026/overnight/deck/project/deck.json')); css=open('/home/claude/junction-2026/overnight/deck/project/deck.css').read()
blob={"6d256670c532ab156209cc6c6d6ae41a":"river","7af55f19ad64b0a2e876fd29c2815258":"agent_top","7e000f0718199d9c05dee215ed65e121":"notepanel","c5f90bc3f53d4ad70ee9fe6fe7317d80":"county_right","bb04f8dfeb3c7f7220edfbe8b745ea19":"river","6836499a35f2303112e97707b82ccd59":"river","5651713adc9a79518279c3d4b45ba3c4":"agent_top","47a18937f47f82799df5f72368ef2a43":"reason_top","b28b28528b7659f50a3557a279a99f17":"note","73c3d49ab898a23ac37a14aa3472073b":"county_right","382d74eea6a70fa026197170f900082c":"county_table","0d8ccec171839fc03498967c56cd73a4":"impact","2a308f08ffb93bce1c088eeb44fa5081":"runbar"}
slides=[]
for i in deck['order']:
    h=open(f'/home/claude/junction-2026/overnight/deck/project/slides/{i}.html').read()
    h=re.sub(r'<aside>.*?</aside>','',h,flags=re.S)
    for k,v in blob.items(): h=h.replace(f'/_blob/{k}',f'file:///home/claude/deck/img/{v}.png')
    slides.append(h)
fonts='''@font-face{font-family:'Archivo';src:url(file:///home/claude/junction-2026/app/fonts/archivo-latin-standard-normal.woff2);font-weight:100 900}
@font-face{font-family:'Archivo';src:url(file:///home/claude/junction-2026/app/fonts/archivo-latin-ext-standard-normal.woff2);font-weight:100 900;unicode-range:U+0100-024F}
@font-face{font-family:'Source Serif 4';src:url(file:///home/claude/junction-2026/app/fonts/source-serif-4-latin-standard-normal.woff2);font-weight:200 900}'''
html=f'''<!doctype html><html><head><meta charset="utf-8"><style>{fonts}
@page{{size:1920px 1080px;margin:0}} html,body{{margin:0}} section{{width:1920px;height:1080px;position:relative;overflow:hidden;page-break-after:always}}
{css} *{{animation:none!important}}</style></head><body>{"".join(slides)}</body></html>'''
open('/home/claude/deck/deck_local.html','w').write(html)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--allow-file-access-from-files"])
        pg=await b.new_page(viewport={"width":1920,"height":1080})
        await pg.goto('file:///home/claude/deck/deck_local.html'); await pg.wait_for_timeout(1500)
        await pg.pdf(path='/home/claude/junction-2026/overnight/Ajoissa_pitch_deck.pdf',width='1920px',height='1080px',print_background=True)
        n=await pg.locator('section').count()
        for k in range(n):
            await pg.locator('section').nth(k).screenshot(path=f'/home/claude/deck/thumb_{k:02d}.png')
        await b.close()
asyncio.run(main())
