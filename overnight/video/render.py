import asyncio, sys, subprocess, os
from playwright.async_api import async_playwright
FPS=30
async def main(ids):
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox","--allow-file-access-from-files"])
        pg=await b.new_page(viewport={"width":1920,"height":1080})
        await pg.goto("file:///home/claude/video/film.html"); await pg.wait_for_timeout(800)
        scenes=await pg.evaluate("[...document.querySelectorAll('.scene')].map(e=>[e.id,+e.dataset.s,+e.dataset.e])")
        for sid,s,e in scenes:
            if ids and sid not in ids: continue
            n=round((e-s)*FPS)
            tmp=f"scenes/{sid}.tmp.mp4"
            ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-preset","veryfast","-crf","18","-pix_fmt","yuv420p","-r",str(FPS),tmp],stdin=subprocess.PIPE)
            for i in range(n):
                await pg.evaluate(f"draw({s+i/FPS})")
                ff.stdin.write(await pg.screenshot(type="jpeg",quality=92))
            ff.stdin.close(); rc=ff.wait()
            if rc==0: os.replace(tmp,f"scenes/{sid}.mp4"); print(sid,n,"frames ok",flush=True)
            else: print(sid,"FAILED",flush=True)
        await b.close()
os.makedirs("scenes",exist_ok=True)
asyncio.run(main(sys.argv[1].split(",") if len(sys.argv)>1 else []))
