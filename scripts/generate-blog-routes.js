/*
  Generates a list of blog routes for prerendering with react-snap.
  Sources slugs from one of (in order):
  - ENV BLOG_SLUGS (comma-separated)
  - scripts/blog-slugs.json (array of strings)
  - ENV BLOG_INDEX_URL (returns JSON array of slugs)
  Falls back to an empty list if none available.
  Writes include routes into package.json under reactSnap.include.
*/

const fs = require('fs');
const path = require('path');

async function fetchFromUrl(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const res = await fetch(url, { headers: { 'accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data)) return data.map(String);
    if (Array.isArray(data.slugs)) return data.slugs.map(String);
  } catch (e) {
    console.warn('Failed to fetch BLOG_INDEX_URL:', e.message);
  }
  return [];
}

async function getSlugs(projectRoot) {
  // 1) ENV BLOG_SLUGS
  if (process.env.BLOG_SLUGS) {
    return process.env.BLOG_SLUGS.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // 2) Local file
  const localFile = path.join(projectRoot, 'scripts', 'blog-slugs.json');
  if (fs.existsSync(localFile)) {
    try {
      const arr = JSON.parse(fs.readFileSync(localFile, 'utf8'));
      if (Array.isArray(arr)) return arr.map(String);
    } catch (e) {
      console.warn('Invalid scripts/blog-slugs.json:', e.message);
    }
  }

  // 3) Remote index URL
  if (process.env.BLOG_INDEX_URL) {
    return await fetchFromUrl(process.env.BLOG_INDEX_URL);
  }

  return [];
}

async function run() {
  const projectRoot = path.resolve(__dirname, '..');
  const pkgPath = path.join(projectRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const slugs = await getSlugs(projectRoot);
  const baseRoutes = [
    '/',
    '/treatment/blog',
    '/treatment/dental',
    '/treatment/ivf',
    '/treatment/hair',
    '/treatment/cosmetics'
  ];
  const blogRoutes = slugs.map((s) => `/treatment/${s}`);

  pkg.reactSnap = pkg.reactSnap || {};
  pkg.reactSnap.include = Array.from(new Set([...(pkg.reactSnap.include || []), ...baseRoutes, ...blogRoutes]));

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`react-snap include routes: ${pkg.reactSnap.include.length}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


