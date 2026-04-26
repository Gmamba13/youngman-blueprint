import sharp from "sharp";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Premium YMBP icon: dark bg, gold "Y", subtle blueprint grid
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">

  <!-- Background -->
  <rect width="1024" height="1024" rx="200" ry="200" fill="#0D0D0D"/>

  <!-- Y: calligraphic thick/thin contrast, slight italic lean, curved arms -->
  <!-- Left arm: thick downstroke with curve, tapers toward junction -->
  <path d="
    M 122,230
    C 130,230 148,238 158,252
    L 304,510
    L 288,528
    C 275,525 260,518 252,504
    L 108,248
    C 100,234 110,230 122,230 Z
  " fill="#FFFFFF"/>

  <!-- Right arm: thin upstroke with curve -->
  <path d="
    M 480,230
    C 494,230 498,238 490,252
    L 330,510
    L 316,494
    L 468,244
    C 474,234 472,230 480,230 Z
  " fill="#FFFFFF"/>

  <!-- Stem: thick, slight taper, with bracketed serifs -->
  <path d="
    M 282,536
    L 304,510
    L 330,510
    L 352,536
    L 352,756
    C 352,762 348,768 342,768
    L 292,768
    C 286,768 282,762 282,756 Z
  " fill="#FFFFFF"/>

  <!-- Stem top serif -->
  <path d="M 268,762 L 366,762 L 366,775 L 268,775 Z" fill="#FFFFFF"/>
  <!-- Stem bottom serif -->
  <path d="M 258,756 L 376,756 L 376,768 L 258,768 Z" fill="#FFFFFF"/>

  <!-- Left arm top serif -->
  <path d="
    M 96,228 L 158,228 L 152,248 L 90,248 Z
  " fill="#FFFFFF"/>

  <!-- Right arm top serif -->
  <path d="
    M 466,228 L 508,228 L 502,248 L 460,248 Z
  " fill="#FFFFFF"/>

  <!-- M: classic editorial M with thick outer strokes, thin diagonals, serifs -->
  <!-- Left outer leg (thick) -->
  <path d="
    M 548,756
    C 548,762 552,768 558,768
    L 608,768
    C 614,768 618,762 618,756
    L 618,272
    L 548,272 Z
  " fill="#FFFFFF"/>

  <!-- Right outer leg (thick) -->
  <path d="
    M 876,756
    C 876,762 880,768 886,768
    L 936,768
    C 942,768 946,762 946,756
    L 946,272
    L 876,272 Z
  " fill="#FFFFFF"/>

  <!-- Left diagonal (thin upstroke): left top to center peak -->
  <path d="
    M 618,272 L 748,520 L 730,542 L 584,280 Z
  " fill="#FFFFFF"/>

  <!-- Right diagonal (thin upstroke): right top to center peak -->
  <path d="
    M 876,272 L 910,278 L 766,542 L 748,520 Z
  " fill="#FFFFFF"/>

  <!-- Top serif - left leg -->
  <path d="M 532,258 L 634,258 L 634,272 L 532,272 Z" fill="#FFFFFF"/>
  <!-- Bottom serif - left leg -->
  <path d="M 528,766 L 628,766 L 628,778 L 528,778 Z" fill="#FFFFFF"/>

  <!-- Top serif - right leg -->
  <path d="M 860,258 L 962,258 L 962,272 L 860,272 Z" fill="#FFFFFF"/>
  <!-- Bottom serif - right leg -->
  <path d="M 860,766 L 960,766 L 960,778 L 860,778 Z" fill="#FFFFFF"/>

</svg>
`;

async function generate() {
  const iconDir = resolve(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset");
  const publicDir = resolve(root, "public");

  mkdirSync(iconDir, { recursive: true });

  const buf = Buffer.from(svg);

  // 1024×1024 for Xcode (universal icon)
  await sharp(buf, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(resolve(iconDir, "AppIcon-512@2x.png"));
  console.log("✓ ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png");

  // 1024×1024 for public (web / App Store Connect upload)
  await sharp(buf, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toFile(resolve(publicDir, "app-icon-1024.png"));
  console.log("✓ public/app-icon-1024.png");

  // 180×180 for PWA manifest apple-touch-icon
  await sharp(buf, { density: 300 })
    .resize(180, 180)
    .png()
    .toFile(resolve(publicDir, "apple-touch-icon.png"));
  console.log("✓ public/apple-touch-icon.png");

  console.log("\nDone. app-icon-1024.png is what you upload to App Store Connect.");
}

generate().catch(console.error);
