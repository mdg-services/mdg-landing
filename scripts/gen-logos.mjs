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
const markBlack = variant(mark, bm, [0, 0, 0]);
write(resizeW(markBlack, 384), "public/logo-mark.png");
write(resizeW(variant(mark, bm, [255, 255, 255]), 384), "public/logo-mark-white.png");

/**
 * Favicon = the black mark on a white square.
 * `radius` rounds the corners (transparent outside); radius 0 = full opaque
 * square (used for apple-touch, which iOS masks itself).
 */
function makeIcon(size, radius) {
  const half = size / 2;
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cov = 1;
      if (radius > 0) {
        const px = x + 0.5 - half;
        const py = y + 0.5 - half;
        const qx = Math.abs(px) - (half - radius);
        const qy = Math.abs(py) - (half - radius);
        const dx = Math.max(qx, 0);
        const dy = Math.max(qy, 0);
        const sdf = Math.sqrt(dx * dx + dy * dy) + Math.min(Math.max(qx, qy), 0) - radius;
        cov = Math.max(0, Math.min(1, 0.5 - sdf));
      }
      const di = (y * size + x) * 4;
      png.data[di] = 255;
      png.data[di + 1] = 255;
      png.data[di + 2] = 255;
      png.data[di + 3] = Math.round(cov * 255);
    }
  }
  const m = resizeW(markBlack, Math.round(size * 0.72));
  const ox = Math.round((size - m.width) / 2);
  const oy = Math.round((size - m.height) / 2);
  for (let y = 0; y < m.height; y++) {
    for (let x = 0; x < m.width; x++) {
      const si = (y * m.width + x) * 4;
      const a = m.data[si + 3] / 255;
      if (a <= 0) continue;
      const X = ox + x, Y = oy + y;
      if (X < 0 || Y < 0 || X >= size || Y >= size) continue;
      const di = (Y * size + X) * 4;
      for (let c = 0; c < 3; c++) {
        png.data[di + c] = Math.round(m.data[si + c] * a + png.data[di + c] * (1 - a));
      }
      png.data[di + 3] = Math.max(png.data[di + 3], m.data[si + 3]);
    }
  }
  return png;
}

write(makeIcon(256, Math.round(256 * 0.2)), "public/favicon.png");
write(makeIcon(180, 0), "public/apple-touch-icon.png");

console.log("Logos generated into public/ (full + mark, black + white, favicon).");
