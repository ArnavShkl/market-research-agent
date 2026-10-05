import json, re, sys, numpy as np, soundfile as sf, logging
logging.disable(logging.WARNING)
import onnxruntime as ort
from kokoro_onnx import Kokoro
VOICE = sys.argv[1]; SPEED = float(sys.argv[2]) if len(sys.argv) > 2 else 1.0
T = json.load(open('timing.json'))
k = Kokoro.from_session(ort.InferenceSession('model_q8.onnx'), 'voices.npz')
SR = 24000
SAY = [("JioMausam", "Jio Mausam"), ("JioPay", "Jio Pay"), ("JioMart", "Jio Mart"), ("3.3 million", "three point three million"),
       ("2030", "twenty thirty"), ("45 degrees", "forty-five degrees"), ("170 crore", "one hundred and seventy crore"),
       ("500 million", "five hundred million"), (" — ", ", "), ("—", ""), ("Here's the insight:", "Here's the insight."), ("Meet Jio Mausam:", "Meet Jio Mausam.")]
PHON = [("kˈævætʃ", "kəvˈʌtʃ"), ("vˈɪdɑːɹbhə", "vɪdˈɑːɹbə")]
def clean(t):
    for a, b in SAY: t = t.replace(a, b)
    return t.strip().rstrip(',')
clips = []
for L in T['lines']:
    ph = k.tokenizer.phonemize(clean(L['text']), 'en-us')
    for a, b in PHON: ph = ph.replace(a, b)
    audio, sr = k.create(ph, voice=VOICE, speed=SPEED, lang='en-us', is_phonemes=True)
    assert sr == SR
    d = len(audio) / SR
    if d > L['slot'] + 0.05:   # longer than its caption slot: say it a little faster (max 1.2x)
        sp = min(1.2, SPEED * d / L['slot'] * 1.02)
        audio, sr = k.create(ph, voice=VOICE, speed=sp, lang='en-us', is_phonemes=True)
    clips.append(audio.astype(np.float32))
total = 104.79
track = np.zeros(int(total * SR) + SR, np.float32)
prev_end = 0.0; report = []; slide_end = T['starts'][1:] + [T['total']]
for L, c in zip(T['lines'], clips):
    st = max(L['start'] + 0.08, prev_end + 0.15)
    d = len(c) / SR; en = st + d
    track[int(st * SR):int(st * SR) + len(c)] += c
    over = en - slide_end[L['slide']]
    report.append((L['slide'], L['line'], round(L['start'], 2), round(st, 2), round(d, 2), round(L['slot'], 2), round(over, 2)))
    prev_end = en
track = track[:int(total * SR)]
sf.write(f'voice_{VOICE}.wav', track, SR)
for r in report: print(r, '<-- spills past slide' if r[6] > 0 else '')
print('speech ends at', round(prev_end, 2), 's of', total)
