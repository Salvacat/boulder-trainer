import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="peakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />

  <!-- Mountain Peaks / Bouldering Wall Shapes with Shadow -->
  <g filter="url(#shadow)">
    <!-- Back Mountain / Slab -->
    <polygon points="120,400 240,190 340,400" fill="#334155" opacity="0.6"/>

    <!-- Secondary Peak -->
    <polygon points="260,400 370,160 440,400" fill="url(#accentGrad)" opacity="0.85"/>

    <!-- Main Emerald Peak -->
    <polygon points="70,400 210,130 350,400" fill="url(#peakGrad)"/>
    <polygon points="210,130 260,230 350,400" fill="#047857" opacity="0.4"/>

    <!-- Snowcap / Summit Marker -->
    <polygon points="210,130 180,185 205,180 220,195 235,175 210,130" fill="#ffffff" opacity="0.9"/>
  </g>

  <!-- Climbing Carabiner / Hold Emblem Accent -->
  <circle cx="370" cy="160" r="16" fill="#38bdf8"/>
  <circle cx="210" cy="130" r="14" fill="#a7f3d0"/>

  <!-- Subtle Rim Glow -->
  <rect x="4" y="4" width="504" height="504" rx="108" fill="none" stroke="#334155" stroke-width="4" opacity="0.5" />
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon.trim());
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), svgIcon.trim());

async function generatePngs() {
  const svgBuffer = Buffer.from(svgIcon);

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));

  console.log('Icons generated successfully in public/ folder!');
}

generatePngs().catch(console.error);
