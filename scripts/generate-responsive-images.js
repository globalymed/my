/*
  Generates responsive image variants for assets in /public.
  - Creates 300w, 600w, 900w WebP variants alongside originals.
  - Skips if variant already exists and is newer than source.
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

const targets = [
  // root files
  'google review.webp',
  'logo.webp',
  'logoDark.webp',
  'logoWhite.webp',
  // folders
  'reviews_post',
  'doctors',
  'treatmentExperience',
];

const sizes = [300, 600, 900];

function isImage(file) {
  return /\.(webp|png|jpe?g|gif)$/i.test(file);
}

function toVariantName(filePath, width) {
  const ext = path.extname(filePath);
  const base = filePath.slice(0, -ext.length);
  return `${base}-${width}w.webp`;
}

async function ensureVariantsForFile(absFilePath) {
  const rel = path.relative(publicDir, absFilePath);
  const stat = fs.statSync(absFilePath);
  const buffer = fs.readFileSync(absFilePath);
  for (const width of sizes) {
    const variantRel = toVariantName(rel, width);
    const variantAbs = path.join(publicDir, variantRel);
    try {
      if (fs.existsSync(variantAbs)) {
        const vStat = fs.statSync(variantAbs);
        if (vStat.mtimeMs >= stat.mtimeMs) continue; // up to date
      }
    } catch (_) {}
    const dir = path.dirname(variantAbs);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(variantAbs);
    console.log(`✓ ${variantRel}`);
  }
}

async function run() {
  let processed = 0;
  for (const target of targets) {
    const abs = path.join(publicDir, target);
    if (!fs.existsSync(abs)) continue;
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      const files = fs.readdirSync(abs);
      for (const f of files) {
        const absFile = path.join(abs, f);
        if (fs.statSync(absFile).isFile() && isImage(f)) {
          await ensureVariantsForFile(absFile);
          processed++;
        }
      }
    } else if (stat.isFile() && isImage(abs)) {
      await ensureVariantsForFile(abs);
      processed++;
    }
  }
  console.log(`Done. Processed ${processed} source images.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


