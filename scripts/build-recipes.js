// Builds the phone-friendly recipe pages served at /recipes/.
// Reads resources/recipes/*.md and writes static HTML to build/recipes/,
// which webpack copies into the site.

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'resources', 'recipes');
const OUT = path.join(ROOT, 'build', 'recipes');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
:root {
  --bg: #fbfaf7;
  --text: #1f1d1a;
  --muted: #6b665e;
  --rule: #e4e0d8;
  --accent: #9a4a1c;
  --done: #a8a399;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 19px;
  line-height: 1.55;
}
main {
  max-width: 40rem;
  margin: 0 auto;
  padding: 16px 20px 64px;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  padding: 4px 0 12px;
  border-bottom: 1px solid var(--rule);
}
a { color: var(--accent); }
nav a { text-decoration: none; padding: 8px 0; }
h1 { font-size: 1.7rem; line-height: 1.2; margin: 24px 0 12px; }
h2 {
  font-size: 1.15rem;
  margin: 32px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--rule);
}
h3 { font-size: 1.05rem; margin: 24px 0 8px; }
ul, ol { padding-left: 1.4em; margin: 8px 0; }
li { margin: 6px 0; }
ol > li { margin: 14px 0; }
ul > li { cursor: pointer; -webkit-tap-highlight-color: transparent; }
li.done { color: var(--done); text-decoration: line-through; }
strong { font-weight: 650; }
table { border-collapse: collapse; width: 100%; font-size: 17px; margin: 12px 0; }
th, td { border-bottom: 1px solid var(--rule); padding: 6px 8px; text-align: left; }
.index { list-style: none; padding: 0; margin: 16px 0; }
.index li { margin: 0; border-bottom: 1px solid var(--rule); }
.index a { display: block; padding: 14px 0; text-decoration: none; color: var(--text); font-size: 1.1rem; }
.wake {
  font: inherit;
  font-size: 15px;
  color: var(--accent);
  background: none;
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 6px 12px;
}
.wake[aria-pressed="true"] { background: var(--accent); color: var(--bg); border-color: var(--accent); }
`;

// Tap an ingredient to cross it off; optional button keeps the screen awake while cooking.
const RECIPE_JS = `
document.querySelectorAll('ul > li').forEach(function (li) {
  li.addEventListener('click', function () { li.classList.toggle('done'); });
});
var btn = document.querySelector('.wake');
if (!('wakeLock' in navigator)) { btn.hidden = true; }
var lock = null;
btn.addEventListener('click', async function () {
  if (lock) { await lock.release(); lock = null; btn.setAttribute('aria-pressed', 'false'); return; }
  try {
    lock = await navigator.wakeLock.request('screen');
    btn.setAttribute('aria-pressed', 'true');
    lock.addEventListener('release', function () { lock = null; btn.setAttribute('aria-pressed', 'false'); });
  } catch (e) { btn.hidden = true; }
});
`;

const page = ({ title, body, nav, script = '' }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#fbfaf7">
<meta name="apple-mobile-web-app-title" content="Recipes">
<title>${escapeHtml(title)}</title>
<style>${CSS}</style>
</head>
<body>
<main>
<nav>${nav}</nav>
${body}
</main>
${script ? `<script>${script}</script>` : ''}
</body>
</html>
`;

const recipes = fs
  .readdirSync(SRC)
  .filter((f) => f.endsWith('.md'))
  .map((file) => {
    const md = fs.readFileSync(path.join(SRC, file), 'utf8').replace(/\r\n/g, '\n');
    const h1 = md.match(/^#\s+(.+)$/m);
    return {
      slug: file.replace(/\.md$/, ''),
      title: h1 ? h1[1].trim() : file.replace(/\.md$/, ''),
      md,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const r of recipes) {
  const dir = path.join(OUT, r.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'index.html'),
    page({
      title: r.title,
      nav: `<a href="../">← All recipes</a><button class="wake" type="button" aria-pressed="false">Keep screen on</button>`,
      body: marked.parse(r.md),
      script: RECIPE_JS,
    })
  );
}

const list = recipes
  .map((r) => `<li><a href="${r.slug}/">${escapeHtml(r.title)}</a></li>`)
  .join('\n');
fs.writeFileSync(
  path.join(OUT, 'index.html'),
  page({
    title: 'Recipes',
    nav: `<a href="/">pwills.com</a>`,
    body: `<h1>Recipes</h1>\n<ul class="index">\n${list}\n</ul>`,
  })
);

console.log(`✓ Built ${recipes.length} recipe pages in build/recipes`);
