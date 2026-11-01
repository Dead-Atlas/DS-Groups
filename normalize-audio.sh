set -e
dir="${1:?پوشه را بدهید، مثلا audio/01}"
i=1
find "$dir" -maxdepth 1 -type f \( -iname '*.mp3' -o -iname '*.m4a' -o -iname '*.flac' -o -iname '*.wav' \) ! -name 'track-*.mp3' -print0 | sort -z | while IFS= read -r -d '' f; do
  ffmpeg -loglevel error -y -i "$f" -vn -map_metadata -1 -c:a libmp3lame -b:a 128k "$dir/track-$i.mp3"
  echo "$f  →  $dir/track-$i.mp3"
  i=$((i+1))
done
