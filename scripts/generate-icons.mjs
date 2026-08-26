import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";

const outDir = path.join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#f4ead9"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#c2673c" stroke-width="20"/>
  <circle cx="256" cy="256" r="78" fill="#f0ddd0"/>
  <circle cx="256" cy="256" r="18" fill="#c2673c"/>
</svg>`;

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "icon-maskable-512.png", size: 512, maskable: true },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const t of targets) {
  const s = t.maskable ? 512 : 512;
  await sharp(Buffer.from(svg(s)))
    .resize(t.size, t.size)
    .png()
    .toFile(path.join(outDir, t.file));
  console.log("generated", t.file);
}
