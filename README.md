# Azure Nigeria Hugo Site

Hugo static site for the Azure Nigeria Community. Content lives in Markdown and is deployed via GitHub + Cloudflare Pages.

## Quick Start

1. Install Hugo (extended edition recommended).
2. From this folder, run:

```bash
hugo server -D
```

Site runs at `http://localhost:1313`.

## Repository Map

- `config.yaml` - Site config, menu, homepage toggles
- `assets/css/style.css` - Main stylesheet (Hugo Pipes minifies)
- `assets/js/countdown.js` - Countdown + tab UI logic (hero live session timer)
- `content/` - Pages, events, series, blog content
- `data/` - Community stats and social links
- `layouts/` - Hugo templates and partials (hero + live session card)
- `static/` - Images and Decap CMS admin
- `public/` - Build output (do not edit by hand)

## Contribution Workflow (GitOps)

1. Create a feature branch from `main`.
2. Make content or layout changes.
3. Open a PR and request reviews.
4. Merge after approvals (main is protected).

## Local Validation (Pre-commit)

1. Install pre-commit (choose one):
   - macOS (Homebrew): `brew install pre-commit`
   - Python via pipx: `pipx install pre-commit`
   - Python via pip: `pip install pre-commit`
2. Enable hooks: `pre-commit install`.
3. Run checks locally: `pre-commit run --all-files`.
4. Ensure Node.js is installed (required for JS/CSS/HTML/Markdown hooks).

## Editing Content

- Events: `content/events/*.md`
- Series: `content/series/*.md` and `content/series/<series>/<session>/index.md`
- Blog: `content/blog/*.md`
- Homepage text: `layouts/partials/`
- Stats and social links: `data/stats.yaml`, `data/social.yaml`

## Using Decap CMS (Optional)

If you prefer editing via `/admin`, ensure the repo and OAuth settings in `static/admin/config.yml` are correct.

## Build and Deploy

- Local build: `hugo --minify`
- Cloudflare Pages build command: `hugo --minify`
- Output directory: `public`

For full deployment steps, see `deploymentguide.md` in the repo root.

## Author

Olu Olofinyo
LinkedIn: [oluwaseyeolofinyo](https://www.linkedin.com/in/oluwaseyeolofinyo/)
