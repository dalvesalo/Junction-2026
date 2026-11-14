"""Generated soundtrack (no samples, no licences): soft major-chord intro until the Ajoissa title (39 s), soft clicks on demo clicks,
then a warm pad + soft arpeggio under the demo, lifting at the evidence and resolving at the close.
python3 music.py out.wav [duration]"""
import sys, numpy as np, wave
SR = 44100; DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 117.6
N = int(SR * DUR); t = np.arange(N) / SR
L = np.zeros(N); Rr = np.zeros(N)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[:j - i] * gain
    L[i:j] += s * (1 - pan) / 2 * 2 ** .5 * .71; Rr[i:j] += s * (1 + pan) / 2 * 2 ** .5 * .71
def env(n, a, r):
    e = np.ones(n); na = int(a * SR); nr = int(r * SR)
    e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
rng = np.random.default_rng(7)
# 1) soft UI clicks at the demo's cursor clicks (times from film.html, written by render.py)
import json, os
CL = os.path.join(os.path.dirname(os.path.abspath(sys.argv[1])), "clicks.json")
for c in (json.load(open(CL)) if os.path.exists(CL) else []):
    n = int(0.06 * SR); x = np.arange(n) / SR
    clk = (np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 180) + 0.5 * np.sin(2 * np.pi * 900 * x) * np.exp(-x * 120)
           + rng.normal(0, .25, n) * np.exp(-x * 900))
    add(clk, c, gain=0.16)
for k in []:  # (clock ticks removed 14.11)
    n = int(0.03 * SR); x = np.arange(n) / SR
    f = 2600 if k % 2 else 2000
    tick = np.sin(2 * np.pi * f * x) * np.exp(-x * 260) + rng.normal(0, .3, n) * np.exp(-x * 600)
    add(tick, k - 0.4, pan=(-.3 if k % 2 else .3), gain=0.10 + 0.06 * (k > 32))
# 2) intro 0–39 s: soft pad with changing chords + a sparse piano-like line (replaces the old drone)
def tone(m, d, harm=(1, .35, .15, .08), det=0.0):
    x = np.arange(int(d * SR)) / SR
    return sum(a * np.sin(2 * np.pi * hz(m) * (h) * (1 + det) * x) for h, a in enumerate(harm, 1))
def piano(m, d=2.4):
    x = np.arange(int(d * SR)) / SR
    s = sum(a * np.sin(2 * np.pi * hz(m) * h * x) * np.exp(-x * (2.2 + h)) for h, a in [(1, 1), (2, .45), (3, .2), (4, .1)])
    return s * np.minimum(1, x * 300)
ICH = [[60, 64, 67], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]  # C – G – Am – F (brighter)
MEL = [[69, 72, 76, 72], [69, 72, 77, 72], [67, 72, 76, 79], [71, 67, 64, 67]]
ib = 4.8
for k in range(8):                                                     # 8 bars × 4.8 s = 38.4 s
    t0i = 0.6 + k * ib; ch = ICH[k % 4]
    n = int((ib + 1.2) * SR); p = np.zeros(n)
    for mm in ch:
        for det in (-.002, .002): p += tone(mm, ib + 1.2, harm=(1, .4, .15), det=det)[:n]
    add(p * env(n, 1.2, 1.4), t0i, gain=0.010 + 0.002 * (k >= 6))
    add(tone(ch[0] - 12, ib + 1.0, harm=(1, .25)) * env(int((ib + 1.0) * SR), .8, 1.2), t0i, gain=0.03)
# 3) reveal chime at 39
def bell(m, d=4.0):
    x = np.arange(int(d * SR)) / SR
    return sum(a * np.sin(2 * np.pi * hz(m) * r * x) * np.exp(-x * dk) for r, a, dk in [(1, 1, 1.2), (2.01, .5, 2), (3.0, .25, 3), (4.2, .12, 4)])
for m, dt in [(72, 0), (76, .12), (79, .24)]: add(bell(m), 39.05 + dt, pan=(dt * 2 - .25), gain=0.09)
# 4) pad progression from 39.5: Am – F – C – G (each 3.6 s)
CH = [[48, 55, 60, 64], [55, 59, 62], [57, 60, 64], [53, 57, 60]]   # C – G – Am – F
bar = 3.6; t0 = 39.5; tend = DUR - 4.4
def pad(notes, d, g):
    n = int(d * SR); s = np.zeros(n)
    for m in notes:
        for det in (-.003, .003): s += tone(m, d, harm=(1, .5, .25, .12, .06), det=det)[:n]
    return s * env(n, 0.9, 1.0) * g
k = 0; tt = t0
while tt < tend:
    d = min(bar + 0.9, tend - tt + 0.9)
    lift = 1.0 + 0.35 * (tt >= 96.5)
    add(pad(CH[k % 4], d, 0.016 * lift), tt)
    if tt >= 96.5:   # bass from the evidence on
        add(tone(CH[k % 4][0] - 12, d, harm=(1, .3)) * env(int(d * SR), .3, .8), tt, gain=0.05)
    k += 1; tt += bar
# 5) arpeggio under the demo and evidence (44–106), 8ths at 100 bpm
step = 0.3; tt = 44.0; i = 0
while tt < 104.9:
    c = CH[int((tt - t0) // bar) % 4]; m = (c + [c[0] + 12, c[1] + 12])[[0, 1, 2, 4, 3, 2, 1, 2][i % 8]] + 12
    x = np.arange(int(0.9 * SR)) / SR
    pl = (np.sin(2 * np.pi * hz(m) * x) + .3 * np.sin(4 * np.pi * hz(m) * x)) * np.exp(-x * 6) * np.minimum(1, x * 400)
    g = 0.035 * (0.75 if tt < 96.5 else 1.0) * min(1, (tt - 44) / 2)
    add(pl, tt, pan=.35 * np.sin(i * .7), gain=g); tt += step; i += 1
# 6) final chord + chime at 106 (close), long fade
def halo(notes, d):
    n = int(d * SR); x = np.arange(n) / SR; s = np.zeros(n)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * x)
    for mm in notes:
        for det in (-.004, -.0015, .0015, .004):                          # choir-like stack of detuned voices
            ph = 2 * np.pi * hz(mm) * (1 + det) * np.cumsum(vib) / SR
            s += np.sin(ph) + .3 * np.sin(2 * ph) + .12 * np.sin(3 * ph)
    e = np.minimum(1, x / 0.9) * np.clip((d - x) / 2.0, 0, 1)
    out = s * e
    for dl, g in [(0.11, .5), (0.23, .35), (0.37, .25), (0.53, .15)]:     # simple reverb tail
        k = int(dl * SR); out[k:] += s[:-k] * e[:-k] * g
    return out
END = DUR - 4.0   # end card starts
hd = DUR - (END - 0.1)
add(halo([48, 60, 64, 67, 72], hd), END - 0.1, gain=0.0065)               # C major "aah"
for m_, dt in [(84, 0.0), (88, .18), (91, .36), (96, .6)]:             # high shimmer
    add(bell(m_, 5), END + 0.1 + dt, pan=(dt - .3), gain=0.035)
# master: gentle fade-in/out, normalise
mix = np.stack([L, Rr], 1)
fi = np.minimum(1, t / 1.0); fo = np.clip((DUR - t) / 3.0, 0, 1)
mix *= (fi * fo)[:, None]
mix = np.tanh(mix / np.abs(mix).max() * 1.2) * 0.6
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype("<i2").tobytes())
print("music", DUR, "s")
