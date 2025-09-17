/*
  Cleanup responsive variants not referenced in the source code.
  - Scans src/ for usages of -300w.webp, -600w.webp, -900w.webp
  - Deletes any matching variants under /public that are not referenced
*/

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const srcDir = path.join(projectRoot, 'src');

const widthSuffixes = ['-300w.webp', '-600w.webp', '-900w.webp'];

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

function collectReferencedVariants() {
  const files = walk(srcDir, (p) => /\.(jsx?|tsx?|html|css|ts)$/.test(p));
  const referenced = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const suf of widthSuffixes) {
      const regex = new RegExp(`([\\\w\-/ %]+${suf.replace('.', '\\.')})`, 'g');
      let m;
      while ((m = regex.exec(content))) {
        const rel = m[1].replace(/^["'`]/, '').replace(/["'`]$/, '');
        // Normalize leading slash references to public
        const norm = rel.startsWith('/') ? rel.slice(1) : rel;
        referenced.add(norm);
      }
    }
  }
  return referenced;
}

function collectExistingVariants() {
  const files = walk(publicDir, (p) => widthSuffixes.some((s) => p.endsWith(s)));
  return files.map((abs) => ({ abs, rel: path.relative(publicDir, abs) }));
}

function main() {
  const referenced = collectReferencedVariants();
  const existing = collectExistingVariants();
  let removed = 0;
  for (const { abs, rel } of existing) {
    if (!referenced.has(rel)) {
      try {
        fs.unlinkSync(abs);
        removed++;
        console.log(`✗ removed ${rel}`);
      } catch (e) {
        console.warn(`Failed to remove ${rel}:`, e.message);
      }
    }
  }
  console.log(`Cleanup complete. Removed ${removed} files.`);
}

main();


