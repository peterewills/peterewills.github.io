# pwills.com

Personal site: a terminal-styled React app with a file tree of writing, a data science study guide, links, and recipes, plus standalone phone-friendly recipe pages at `/recipes/`.

## Development

```bash
npm install
npm start            # dev server on http://localhost:3000
```

To check the site from a phone on the same wifi, run `npx webpack serve --mode development --host 0.0.0.0` and open `http://<mac-ip>:3000` (`ipconfig getifaddr en0`).

## Content

- `resources/` holds the markdown shown in the file tree. Top-level folder order and the `links/` entries are set in `scripts/generate-file-structure.js`.
- `resources/recipes/*.md` also feed the static `/recipes/` pages, built by `scripts/build-recipes.js`.
- `resources/resume.pdf` is linked from the top bar.
- `pbp/` is a separate static site served at `/pbp/` (built by `pbp/build_site.py`).
- `static/` is copied to the site root as-is (robots.txt, sitemap.xml, the `/flxrando/` redirect to flxrando.org).

`npm start` and `npm run build` regenerate `src/fileStructure.js` and the recipe pages. The dev server does not watch `resources/`; after editing content, run `npm run generate-files && npm run build-recipes` and reload.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds into `docs/` and deploys to GitHub Pages.
