"""Render the YouTube thumbnail: python3 thumb.py -> ../deliverables/Ajoissa_thumbnail.png (1280×720)"""
import asyncio, os
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1280, "height": 720})
        await pg.goto(f"file://{HERE}/thumb.html"); await pg.wait_for_timeout(1500)
        await pg.screenshot(path=f"{HERE}/../deliverables/Ajoissa_thumbnail.png")
        await b.close()
asyncio.run(main())
