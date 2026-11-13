import asyncio, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--allow-file-access-from-files"])
        pg=await b.new_page(viewport={"width":1920,"height":1080})
        await pg.goto("file:///home/claude/video/film.html"); await pg.wait_for_timeout(800)
        for t in [float(x) for x in sys.argv[1].split(",")]:
            await pg.evaluate(f"draw({t})")
            await pg.screenshot(path=f"/home/claude/video/f_{t:06.1f}.jpg",type="jpeg",quality=80)
        await b.close()
asyncio.run(main())
