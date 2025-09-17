/*
  Safely remove original .webp files when -600w.webp exists and source is no longer referenced.
  - We keep responsive variants; we delete the original .webp only if:
    a) a -600w.webp variant exists alongside, and
    b) the original path is not referenced in src/.
*/

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const srcDir = path.join(projectRoot, 'src');

function walk(dir, filterFn) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) results.push(...walk(full, filterFn));
    else if (!filterFn || filterFn(full)) results.push(full);
  }
  return results;
}

function collectReferencedOriginals() {
  const files = walk(srcDir, (p) => /\.(jsx?|tsx?|html|css|ts)$/.test(p));
  const referenced = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /["'`]\/([\w\-\/ %]+\.webp)["'`]/g;
    let m;
    while ((m = regex.exec(content))) {
      const rel = m[1];
      // Only count originals (not ...-300w.webp etc.)
      if (!/-[0-9]+w\.webp$/.test(rel)) referenced.add(rel);
    }
  }
  return referenced;
}

function main() {
  const referencedOriginals = collectReferencedOriginals();
  const candidates = walk(publicDir, (p) => p.endsWith('.webp') && !/-[0-9]+w\.webp$/.test(p));
  let removed = 0;
  for (const abs of candidates) {
    const rel = path.relative(publicDir, abs).replace(/\\/g, '/');
    // Skip if still referenced anywhere
    if (referencedOriginals.has(rel)) continue;
    const base = abs.slice(0, -'.webp'.length);
    const has600 = fs.existsSync(`${base}-600w.webp`);
    if (has600) {
      try {
        fs.unlinkSync(abs);
        removed++;
        console.log(`✗ removed original ${rel}`);
      } catch (e) {
        console.warn(`Failed to remove ${rel}:`, e.message);
      }
    }
  }
  console.log(`Prune complete. Removed ${removed} originals.`);
}

main();


