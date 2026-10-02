# JioMausam · Reliance T.U.P XII

Every tower is a rain gauge. JioMausam maps weather street by street from Jio's own network, and Mausam Kavach pays workers automatically when extreme weather stops their work.

**Focus: rain first, riders first, Mumbai first.** Phase 1: a 90-day Mumbai coverage audit with one delivery app, payouts in shadow mode (simulated, no money moves). Phase 2: real payouts in the IRDAI sandbox, plus the heat module in Nagpur and Ahmedabad. Phase 3: Kavach Basic at every recharge. Phase 4: a national map and data API.

## Deliverables

| What | File |
|---|---|
| **Drill book: the master document** (48 pages, 199 cross-questions, including a five-page chapter answering the expert feedback) | `JioMausam_Drill_Book.pdf` |
| 3-minute presentation (9 slides), with Morph transitions and animations | `JioMausam_3min_Presentation.pptx` (static backup: `JioMausam_3min_Presentation.pdf`) |
| 3-minute pitch video, 2:54 | `JioMausam_Pitch_3min_clean.mp4` (for your voice-over), `JioMausam_Pitch_3min_captions.mp4` |
| Voice-over script and subtitles | `voiceover-script-3min.txt`, `JioMausam_Pitch_3min.srt` |
| **Pitch recorder** (open, type team name, press Start, 3-2-1, read captions while screen-recording) | `JioMausam_Pitch_Recorder_standalone.html` |
| Pitch video with a 5-second get-ready countdown, for speaking over while it plays | `JioMausam_Pitch_for_recording.mp4` |
| Pitch page (artifact source) | `jiomausam-pitch.html` |
| Phone-app prototype (Mausam Kavach) | `prototype/Mausam_Kavach_App_standalone.html` |
| Working model (Control Room, including the India layer) | `prototype/JioMausam_Control_Room_standalone.html` |
| Idea brief (19 pages, older: its pilot plan predates the Mumbai focus) | `JioMausam_Idea_Brief.pdf` |
| Beginner's guide (24 pages, superseded by the drill book) | `JioMausam_Explained_Simply.pdf` |

The standalone HTML files open offline in any browser. Fonts load from Google Fonts when you're online.

## Data and code

- Rain-sensing test: 500 commercial microwave links, 10–20 May 2018 (OpenSense / pycomlink sample), scored against German Weather Service radar. Code: `prototype/pipeline/rain_pipeline.py` (Python, built on the open-source pycomlink library from Karlsruhe Institute of Technology).
- India layer: IMD station reports 2000–2024 for Mumbai Santacruz, Mumbai Colaba, Nagpur and Ahmedabad (NOAA Global Summary of the Day). Code and results: `prototype/india/`.
- Stress test (25 years, worst year per product, loss ratios, cap options): `prototype/india/stress_test.py`, results in `prototype/india/stress_test.json`.
- Deck source: `deck-source/` (pptxgenjs builder plus the transition and animation step).
