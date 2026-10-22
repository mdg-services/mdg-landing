#!/usr/bin/env bash
# Cuts one still per chapter of the full film into public/film/ch/kavach-<n>.webp,
# the small pictures on the film page's chapter list (96x60 shown, 192x120 stored).
#
# Each line below is: chapter number, the second of the film to take the frame
# from (a few seconds into the chapter, past its title card, on a photograph
# where there is one), and where the picture's middle sits in the tall frame
# (0 = top, 1 = bottom). A new cut of the film needs new seconds: look at the
# frames first. Needs ffmpeg, ImageMagick (magick) and cwebp.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC="${1:-$(node -e "const f=require('./src/film/films.json').kavach;console.log(f.base+'/'+f.mp4)")}"
OUT=public/film/ch
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
while read -r n t yc; do
  ffmpeg -nostdin -loglevel error -y -ss "$t" -i "$SRC" -frames:v 1 "$TMP/f.png"
  W=$(magick identify -format %w "$TMP/f.png"); H=$(magick identify -format %h "$TMP/f.png")
  CH=$(( W * 10 / 16 ))
  Y=$(python3 -c "print(max(0, min($H - $CH, round($H * $yc - $CH / 2))))")
  magick "$TMP/f.png" -crop "${W}x${CH}+0+${Y}" +repage -resize 192x120 -strip "$TMP/t.png"
  cwebp -quiet -q 72 -m 6 "$TMP/t.png" -o "$OUT/kavach-$n.webp"
  echo "chapter $n: $OUT/kavach-$n.webp"
done <<'PICKS'
0 3 0.62
1 27.34 0.60
2 383.37 0.45
3 444.04 0.55
4 647.57 0.48
5 761.95 0.40
6 967.3 0.45
7 1167.66 0.52
8 1209.94 0.45
9 1466.35 0.50
10 1519.25 0.48
PICKS

# The About card's wider picture (540x300): the dealer under his pump's canopy.
ffmpeg -nostdin -loglevel error -y -ss 383.37 -i "$SRC" -frames:v 1 "$TMP/f.png"
H=$(magick identify -format %h "$TMP/f.png")
magick "$TMP/f.png" -crop "540x300+0+$(python3 -c "print(max(0, min($H - 300, round($H * 0.45 - 150))))")" +repage -strip "$TMP/a.png"
cwebp -quiet -q 70 -m 6 "$TMP/a.png" -o "$OUT/kavach-about.webp"
echo "about: $OUT/kavach-about.webp"
