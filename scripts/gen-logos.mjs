/**
 * Turn the supplied black-on-white logo PNGs into web assets:
 *   - trimmed, transparent BLACK variants (for light surfaces)
 *   - trimmed, transparent WHITE variants (for navy surfaces)
 *   - a navy favicon with the white mark
 *
 * Usage: node scripts/gen-logos.mjs <full-logo.png> <mark.png>
 * (sources live outside the repo; the generated PNGs in public/ are committed.)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";

const [srcFull, srcMark] = process.argv.slice(2);
if (!srcFull || !srcMark) {
  console.error("usage: node scripts/gen-logos.mjs <full-logo.png> <mark.png>");
  process.exit(1);
}

const decode = (p) => PNG.sync.read(readFileSync(p));
const write = (png, p) => writeFileSync(p, PNG.sync.write(png));

/** Bounding box of non-white content. */
function trim(png, thresh = 240, padPct = 0.02) {
  const { width: W, height: H, data } = png;
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const a = data[i + 3] / 255;
      const eff = ((data[i] + data[i + 1] + data[i + 2]) / 3) * a + 255 * (1 - a);
      if (255 - eff > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const padX = Math.round((maxX - minX) * padPct);
  const padY = Math.round((maxY - minY) * padPct);
  return {
    minX: Math.max(0, minX - padX),
    minY: Math.max(0, minY - padY),
    w: Math.min(W - 1, maxX + padX) - Math.max(0, minX - padX) + 1,
    h: Math.min(H - 1, maxY + padY) - Math.max(0, minY - padY) + 1,
  };
}

/**
 * Crop + recolor. Works for both source kinds (ink-on-transparent and
 * ink-on-white): composite the source over white, then make alpha the
 * resulting darkness (white bg → transparent, ink → opaque, edges ramp).
 */
function variant(png, box, color) {
  const out = new PNG({ width: box.w, height: box.h });
  for (let y = 0; y < box.h; y++) {
    for (let x = 0; x < box.w; x++) {
      const si = ((y + box.minY) * png.width + (x + box.minX)) * 4;
      const di = (y * box.w + x) * 4;
      const a = png.data[si + 3] / 255;
      const eff = ((png.data[si] + png.data[si + 1] + png.data[si + 2]) / 3) * a + 255 * (1 - a);
      out.data[di] = color[0];
      out.data[di + 1] = color[1];
      out.data[di + 2] = color[2];
      out.data[di + 3] = Math.max(0, Math.min(255, Math.round(255 - eff)));
    }
  }
  return out;
}

/** Area-average downscale to a target width (preserves alpha). */
function resizeW(png, tw) {
  const scale = tw / png.width;
  const th = Math.max(1, Math.round(png.height * scale));
  const out = new PNG({ width: tw, height: th });
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      const sx0 = Math.floor(x / scale);
      const sx1 = Math.min(png.width, Math.floor((x + 1) / scale) + 1);
      const sy0 = Math.floor(y / scale);
      const sy1 = Math.min(png.height, Math.floor((y + 1) / scale) + 1);
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        for (let sx = sx0; sx < sx1; sx++) {
          const si = (sy * png.width + sx) * 4;
          const al = png.data[si + 3];
          r += png.data[si] * al;
          g += png.data[si + 1] * al;
          b += png.data[si + 2] * al;
          a += al;
          n++;
        }
      }
      const di = (y * tw + x) * 4;
      if (a > 0) {
        out.data[di] = Math.round(r / a);
        out.data[di + 1] = Math.round(g / a);
        out.data[di + 2] = Math.round(b / a);
      }
      out.data[di + 3] = Math.round(a / n);
    }
  }
  return out;
}

const full = decode(srcFull);
const mark = decode(srcMark);
const bf = trim(full);
const bm = trim(mark);

write(resizeW(variant(full, bf, [0, 0, 0]), 640), "public/logo-full.png");
write(resizeW(variant(full, bf, [255, 255, 255]), 640), "public/logo-full-white.png");
write(resizeW(variant(mark, bm, [0, 0, 0]), 384), "public/logo-mark.png");
const markWhite = variant(mark, bm, [255, 255, 255]);
write(resizeW(markWhite, 384), "public/logo-mark-white.png");

// Favicon: navy square with the white mark centered.
const NAVY = [0x2c, 0x2e, 0x80];
const S = 256;
const fav = new PNG({ width: S, height: S });
for (let i = 0; i < S * S; i++) {
  fav.data[i * 4] = NAVY[0];
  fav.data[i * 4 + 1] = NAVY[1];
  fav.data[i * 4 + 2] = NAVY[2];
  fav.data[i * 4 + 3] = 255;
}
const m = resizeW(markWhite, Math.round(S * 0.74));
const ox = Math.round((S - m.width) / 2);
const oy = Math.round((S - m.height) / 2);
for (let y = 0; y < m.height; y++) {
  for (let x = 0; x < m.width; x++) {
    const si = (y * m.width + x) * 4;
    const a = m.data[si + 3] / 255;
    if (a <= 0) continue;
    const X = ox + x, Y = oy + y;
    if (X < 0 || Y < 0 || X >= S || Y >= S) continue;
    const di = (Y * S + X) * 4;
    for (let c = 0; c < 3; c++) {
      fav.data[di + c] = Math.round(m.data[si + c] * a + fav.data[di + c] * (1 - a));
    }
  }
}
write(fav, "public/favicon.png");
write(resizeW(fav, 180), "public/apple-touch-icon.png");

console.log("Logos generated into public/ (full + mark, black + white, favicon).");
