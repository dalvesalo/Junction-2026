# Screenshots of the demo (app/index.html) for the pitch deck. Run: python3 overnight/deck/shoot.py
import asyncio
from playwright.async_api import async_playwright
import os
HERE=os.path.dirname(os.path.abspath(__file__)); O=HERE+'/img/'; os.makedirs(O,exist_ok=True)
def C(x0,y0,x1,y1): return dict(x=x0,y=y0,width=x1-x0,height=y1-y0)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1600,"height":1100},device_scale_factor=2)
        await pg.goto('file://'+os.path.abspath(HERE+'/../../app/index.html')); await pg.wait_for_timeout(900)
        await pg.screenshot(path=O+'level0.png',clip=C(99,182,1108,760))
        await pg.click('#plist >> text=Matti K.'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=O+'matti_list.png',clip=C(99,182,1108,760))
        r=await pg.locator('#pright').bounding_box()
        await pg.screenshot(path=O+'matti_order.png',clip=C(r['x'],r['y'],r['x']+r['width'],r['y']+720))
        await pg.click('button[data-view=behind]'); await pg.wait_for_timeout(500)
        await pg.click('text=Walk through it step by step'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=O+'step1.png',full_page=True)
        for k in range(2):
            await pg.locator('#view-behind button:visible', has_text='Next').first.click(); await pg.wait_for_timeout(400)
        await pg.screenshot(path=O+'behind.png',clip=C(99,204,1501,866))
        await pg.click('button[data-view=county]'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=O+'county.png',clip=C(856,446,1501,1346),full_page=True)
        await pg.click('button[data-view=gap]'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=O+'gap.png',clip=C(99,438,1500,1140),full_page=True)
        await b.close()
asyncio.run(main())
# post-crop (same as used for the deck)
from PIL import Image
for f,h in [('level0.png',1085),('matti_list.png',1035)]:
    im=Image.open(O+f); im.crop((0,0,im.size[0],h)).save(O+f)
im=Image.open(O+'step1.png'); im.crop((198,640,3002,1648)).save(O+'note.png'); os.remove(O+'step1.png')
