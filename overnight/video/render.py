"""Render film.html scene by scene: Playwright frames -> ffmpeg (one H.264 file per segment) -> concat -> soundtrack.
python3 render.py            # all segments, then assemble
python3 render.py G,H        # only these segments, then assemble"""
import asyncio, sys, subprocess, os
from playwright.async_api import async_playwright
FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
SC = f"{HERE}/scenes"
OUT = os.path.abspath(f"{HERE}/../deliverables/Ajoissa_pitch_video.mp4")
async def main(ids):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1920, "height": 1080})
        await pg.goto(f"file://{HERE}/film.html"); await pg.wait_for_timeout(2000)
        segs = await pg.evaluate("SEGMENTS")
        for sid, s, e in segs:
            if ids and sid not in ids: continue
            n = round((e - s) * FPS); tmp = f"{SC}/{sid}.tmp.mp4"
            ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                                   "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), tmp], stdin=subprocess.PIPE)
            for i in range(n):
                await pg.evaluate(f"draw({s + i / FPS})")
                ff.stdin.write(await pg.screenshot(type="jpeg", quality=92))
            ff.stdin.close(); rc = ff.wait()
            if rc == 0: os.replace(tmp, f"{SC}/{sid}.mp4"); print(sid, n, "frames ok", flush=True)
            else: print(sid, "FAILED", flush=True); sys.exit(1)
        await b.close()
    return [x[0] for x in segs]
os.makedirs(SC, exist_ok=True)
order = asyncio.run(main(sys.argv[1].split(",") if len(sys.argv) > 1 else []))
open(f"{SC}/list.txt", "w").write("".join(f"file '{sid}.mp4'\n" for sid in order))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", f"{SC}/list.txt", "-c", "copy", f"{SC}/silent.mp4"], check=True)
subprocess.run(["python3", f"{HERE}/music.py", f"{SC}/music.wav"], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"{SC}/silent.mp4", "-i", f"{SC}/music.wav", "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", OUT], check=True)
print("wrote", OUT)
