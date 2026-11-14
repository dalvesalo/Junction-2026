"""Draw single frames for checking: python3 frames.py 5,64,85 -> check/f_XXX.jpg"""
import asyncio, sys, os
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
async def main():
    os.makedirs(f"{HERE}/check", exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto(f"file://{HERE}/film.html"); await pg.wait_for_timeout(1500)
        for t in [float(x) for x in sys.argv[1].split(",")]:
            await pg.evaluate(f"draw({t})")
            await pg.screenshot(path=f"{HERE}/check/f_{t:06.1f}.jpg", type="jpeg", quality=85)
        await b.close()
asyncio.run(main())
