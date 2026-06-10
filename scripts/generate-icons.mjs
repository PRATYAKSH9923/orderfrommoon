// Generates PWA icon PNGs without any image dependency.
// Draws a brand-amber rounded square with a darker "waffle" grid + center dot.
// Run: node scripts/generate-icons.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const OUT = new URL("../public/", import.meta.url);
mkdirSync(OUT, { recursive: true });

// Brand colours
const AMBER = [217, 119, 6]; // #d97706
const BROWN = [91, 58, 26]; // #5b3a1a
const CREAM = [255, 248, 235];

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(size, pixelFn, { maskable = false } = {}) {
  // RGBA raw, one filter byte (0) per row.
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  const corner = maskable ? 0 : size * 0.22; // maskable = full bleed square

  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter type
    for (let x = 0; x < size; x++) {
      const o = y * (stride + 1) + 1 + x * 4;
      // rounded-rect alpha
      let inside = true;
      if (!maskable) {
        const dx = Math.max(corner - x, x - (size - 1 - corner), 0);
        const dy = Math.max(corner - y, y - (size - 1 - corner), 0);
        inside = dx * dx + dy * dy <= corner * corner;
      }
      const [cr, cg, cb] = inside ? pixelFn(x, y, size) : [0, 0, 0];
      raw[o] = cr;
      raw[o + 1] = cg;
      raw[o + 2] = cb;
      raw[o + 3] = inside ? 255 : 0;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// A waffle-ish look: amber field, brown grid lines, cream center circle.
function wafflePixel(x, y, size) {
  const cx = size / 2;
  const cy = size / 2;
  const d = Math.hypot(x - cx, y - cy);

  // center cream "waffle"
  const plate = size * 0.30;
  if (d < plate) {
    const cell = size * 0.10;
    const gx = Math.floor((x - (cx - plate)) / cell) % 2;
    const gy = Math.floor((y - (cy - plate)) / cell) % 2;
    return gx === gy ? CREAM : [240, 220, 190];
  }
  if (d < plate + size * 0.02) return BROWN;
  return AMBER;
}

const targets = [
  ["icon-96.png", 96, false],
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["icon-maskable-192.png", 192, true],
  ["icon-maskable-512.png", 512, true],
  ["apple-icon.png", 180, false],
];

for (const [name, size, maskable] of targets) {
  const png = encodePNG(size, wafflePixel, { maskable });
  writeFileSync(new URL(name, OUT), png);
  console.log("wrote", name, `${size}x${size}`, png.length, "bytes");
}
