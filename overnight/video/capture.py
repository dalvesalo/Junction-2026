"""Drive the real demo (app/index.html) and save each state as a full-page screenshot
plus the page-coordinates of the elements the film's cursor clicks/zooms on.
Output: assets/st_*.jpg + assets/boxes.json (used by film.html). Assets are generated, not committed."""
import asyncio, json, os
from playwright.async_api import async_playwright
VW, VH, DPR = 1440, 810, 2.5
HERE = os.path.dirname(os.path.abspath(__file__))
APP = "file://" + os.path.abspath(os.path.join(HERE, "../../app/index.html"))
boxes = {}
async def box(pg, sel, i=0):
    return await pg.evaluate("""([s,i])=>{const els=[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null);const e=els[i];if(!e)return null;
      const r=e.getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.width,r.height]}""", [sel, i])
async def textbox(pg, sel, text):
    return await pg.evaluate("""([s,t])=>{const e=[...document.querySelectorAll(s)].find(e=>e.textContent.includes(t)&&e.offsetParent!==null);if(!e)return null;
      const r=e.getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.width,r.height]}""", [sel, text])
async def deepest(pg, text):  # deepest visible element containing the text (or all texts of a list)
    return await pg.evaluate("""t=>{const ts=Array.isArray(t)?t:[t];let best=null;for(const e of document.querySelectorAll('body *')){if(e.offsetParent===null||!ts.every(x=>e.textContent.includes(x)))continue;if(!best||best.contains(e))best=e;}
      if(!best)return null;const r=best.getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.width,r.height]}""", text)
# Video wording rule (14.11): no personal pronouns on screen. The app's panel title
# "Why he/she is on your list" is shown in the film as "Why on your list".
NOPRONOUN = [["Why he is on your list", "Why on your list"], ["Why she is on your list", "Why on your list"],
             ["would have flagged him", "would have flagged Matti"], ["would have flagged her", "would have flagged the patient"],
             ["in the record system they already use", "in the record system already in use"],
             ["Added up, they give", "Added up, the timestamps give"]]
async def scrub(pg):
    await pg.evaluate("""rep=>{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
      while(n=w.nextNode()){let v=n.nodeValue;for(const [a,b] of rep)v=v.split(a).join(b);if(v!==n.nodeValue)n.nodeValue=v;}}""", NOPRONOUN)
    left = await pg.evaluate("""()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
      while(n=w.nextNode()){const e=n.parentElement;if(!e||e.offsetParent===null)continue;const m=n.nodeValue.match(/\\b(he|she|his|her|him|hers|they|them|their)\\b/i);if(m)out.push(n.nodeValue.trim().slice(0,90));}return out}""")
    for x in left: print("  pronoun left:", x)
async def shot(pg, name, targets):
    await pg.wait_for_timeout(900)
    await scrub(pg)
    await pg.evaluate("window.scrollTo(0,0)")
    h = await pg.evaluate("document.documentElement.scrollHeight")
    b = {"h": h}
    for k, (sel, arg) in targets.items():
        if sel == "TEXT": b[k] = await deepest(pg, arg)
        else: b[k] = await (textbox(pg, sel, arg) if isinstance(arg, str) else box(pg, sel, arg))
        if b[k] is None: print("  MISSING", name, k)
    boxes[name] = b
    await pg.screenshot(path=f"{HERE}/assets/{name}.jpg", type="jpeg", quality=92, full_page=True)
    print(name, h)
async def click(pg, sel, text=None):
    if text: await pg.locator(sel, has_text=text).first.click()
    else: await pg.locator(sel).first.click()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": VW, "height": VH}, device_scale_factor=DPR)
        await pg.goto(APP); await pg.wait_for_timeout(1500)
        # disable the read-aloud / any animations for clean frames
        await pg.add_style_tag(content="*{transition:none!important;animation:none!important}")
        rows = {"kalevi": (".prow", "Kalevi"), "eero": (".prow", "Eero"), "aino": (".prow", "Aino"), "matti": (".prow", "Matti")}
        await shot(pg, "st_list", {**rows, "plist": ("#plist", 0), "why": ("#pm-body .panel", 0), "footer": ("TEXT", "Last overnight run")})
        await click(pg, ".prow", "Aino")
        await shot(pg, "st_aino", {**rows, "why": ("#pm-body .panel", 0), "order": ("#pright", 0)})
        await click(pg, ".prow", "Matti")
        await shot(pg, "st_matti", {**rows, "why": ("#pm-body .panel", 0), "thr": ("#pm-body .panel", 1), "risk": ("TEXT", "21.5 %"),
                                    "note": ("#pm-body .panel", 3), "veri": ("TEXT", "Ei veriyskää"), "exam": ("TEXT", "Thorax CT"), "order": ("#pright", 0), "sign": ("#o-sign", 0)})
        await click(pg, "#o-sign")
        await pg.wait_for_timeout(3500)
        await shot(pg, "st_signed", {"order": ("#pright", 0), "clock": ("#clock", 0), "bin": ("#bin", 0), "tobehind": (".tobehind", 0), "olog": (".olog", 0)})
        await click(pg, ".tobehind")
        await shot(pg, "st_behind", {"start": ("#bh-start", 0), "pipeline": ("#pipeline", 0), "bar": ("#behindbar", 0)})
        await click(pg, "#bh-start")
        for i in range(5):
            await shot(pg, f"st_w{i+1}", {"cur": (".walk .panel.cur", 0), "next": ("#bh-next", 0), "walk": (".walk", 0), "earlier": ("TEXT", "35 days earlier"), "notebox": ("TEXT", ["Tulosyy", "Suunnitelma"]),
                                      "ordbox": ("TEXT", ["Order thorax CT directly", "Level 2"]), "timeline": ("TEXT", ["Agent flag", "35 days earlier"])})
            if i < 4: await click(pg, "#bh-next")
        boxes["st_w5"]["countytab"] = await textbox(pg, ".menubar button", "County view")
        await click(pg, ".menubar button", "County view")
        await shot(pg, "st_county", {"rowD": ("[data-centre]", 3), "steps": ("#centre-steps", 0), "flow": ("#ehr-flow", 0)})
        await click(pg, "[data-centre='3']")
        await shot(pg, "st_countyD", {"rowD": ("[data-centre]", 3), "steps": ("#centre-steps", 0), "why": ("TEXT", ["Why per health centre?", "Two-thirds"])})
        await b.close()
    d = {"vw": VW, "vh": VH, "dpr": DPR, "states": boxes}
    json.dump(d, open(f"{HERE}/assets/boxes.json", "w"), indent=1)
    open(f"{HERE}/assets/boxes.js", "w").write("window.BOXES=" + json.dumps(d) + ";")
asyncio.run(main())
