#!/bin/bash
# usage: mux.sh voice_name output.mp4
set -e
F=/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2
V=/root/.claude/uploads/e8d4caac-b1a5-588e-8461-832ca62ca567/b4080dd3-JioMausam_Pitch_Short_1.mp4
cd /tmp/claude-0/-home-user-market-research-agent/e8d4caac-b1a5-588e-8461-832ca62ca567/scratchpad/tts
$F -y -loglevel error -i "$V" -i voice_$1.wav -map 0:v -map 1:a -c:v copy \
  -af "highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000" -c:a aac -b:a 192k -ac 2 -movflags +faststart -shortest "$2"
echo "$2 $(du -k "$2" | cut -f1) KB"
