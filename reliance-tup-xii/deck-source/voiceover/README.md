# Voice-over for the short pitch video

Offline neural narration of `JioMausam_Pitch_Short.mp4`, reading the video's own captions at the moment each appears.

- Voice model: Kokoro-82M (Apache-2.0). The q8 ONNX weights come from the npm package `kokoro-q8-shards` (6 parts, joined sha256 `fbae9257…a1478`); the 54 voice styles come from the npm package `kokoro-js` (`voices/*.bin`).
- Phonemes: `kokoro-onnx` (PyPI) with its bundled espeak-ng. Pronunciation overrides: Kavach → kəvˈʌtʃ, Vidarbha → vɪdˈɑːɹbə; "JioMausam" read as "Jio Mausam".
- Timing: `timing.json` holds each caption's start and slot (computed from the page's engine at 140 wpm, and checked against the video frames to within 0.1 s). A line longer than its slot is spoken up to 1.2× faster.
- Voices used: `af_heart` (female) and `am_michael` (male). Mixed to about −16 LUFS with ffmpeg `loudnorm`.

Rebuild: `python3 voice_video.py af_heart 1.0` then `./mux.sh af_heart out.mp4` (paths inside point at our working copy).
