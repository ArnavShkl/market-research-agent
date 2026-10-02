# JioMausam · Reliance T.U.P XII

Every tower is a rain gauge, every phone a thermometer. JioMausam maps weather street by street from Jio's own network, and Mausam Kavach pays workers automatically when extreme rain or heat stops their work.

## Deliverables

| What | File |
|---|---|
| Drill book (read and rehearse from this) | `JioMausam_Drill_Book.pdf` |
| 3-minute presentation, with Morph transitions and animations | `JioMausam_3min_Presentation.pptx` (static backup: `JioMausam_3min_Presentation.pdf`) |
| 3-minute pitch video, 2:53 | `JioMausam_Pitch_3min_clean.mp4` (for your voice-over), `JioMausam_Pitch_3min_captions.mp4` |
| Voice-over script and subtitles | `voiceover-script-3min.txt`, `JioMausam_Pitch_3min.srt` |
| Pitch page you can record live with your voice | `jiomausam-pitch.html` |
| Phone-app prototype (Mausam Kavach) | `prototype/Mausam_Kavach_App_standalone.html` |
| Working model (Control Room, including the India layer) | `prototype/JioMausam_Control_Room_standalone.html` |
| Idea brief (19 pages) | `JioMausam_Idea_Brief.pdf` |
| Beginner's guide (24 pages, superseded by the drill book) | `JioMausam_Explained_Simply.pdf` |

The standalone HTML files open offline in any browser. Fonts load from Google Fonts when you're online.

## Data and code

- Rain-sensing test: 500 commercial microwave links, 10–20 May 2018 (OpenSense / pycomlink sample), scored against German Weather Service radar. Code: `prototype/pipeline/rain_pipeline.py`.
- India layer: IMD station reports 2000–2024 for Mumbai Santacruz, Mumbai Colaba, Nagpur and Ahmedabad (NOAA Global Summary of the Day). Code and results: `prototype/india/`.
- Deck source: `deck-source/` (pptxgenjs builder plus the transition and animation step).
