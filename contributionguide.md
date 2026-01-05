# Contribution Guide

This guide explains what each part of the project holds and how to edit or add content.

## Repository Map

- `config.yaml` - Site-wide config: base URL, menu, homepage section toggles, and form/newsletter URLs.
- `assets/css/style.css` - Main stylesheet; Hugo pipes minifies on build.
- `assets/js/countdown.js` - Countdown + tab UI logic; bundled via Hugo pipes.
- `content/` - All pages and section content in Markdown.
- `data/` - Structured data used in templates (stats and social links).
- `layouts/` - Hugo templates and partials that render pages.
- `static/` - Static assets copied as-is (images and CMS admin).
- `public/` - Generated build output from `hugo` (do not edit by hand).
- `README.md` - Quick start and overview.
- `static/admin/` - Decap CMS UI + config (only used if you manage content via `/admin`).

## Content and Template Files

### Content Pages

- `content/_index.md` - Home page body content (used by Hugo as the home page content).
- `content/events/_index.md` - Events landing page metadata.
- `content/events/*.md` - Individual event pages.
- `content/series/_index.md` - Study series landing page metadata.
- `content/series/*.md` - Individual series pages (single-page series).
- `content/series/<series-slug>/_index.md` - Series overview for multi-session series.
- `content/series/<series-slug>/<session-slug>/index.md` - Individual series session pages.
- `content/blog/_index.md` - Blog landing page metadata.
- `content/blog/*.md` - Individual blog posts.
- `content/register-to-speak.md` - Register-to-speak page content.
- `content/privacy.md` and `content/terms.md` - Legal pages.

### Data

- `data/stats.yaml` - About section stats cards.
- `data/social.yaml` - Social links and icon keys (icons live in `static/images/icons/`).

### Templates

- `layouts/index.html` - Home page layout (includes homepage sections).
- `layouts/_default/baseof.html` - Base layout (head, header, footer, and asset pipeline).
- `layouts/_default/list.html` and `layouts/_default/single.html` - Defaults for list and single pages.
- `layouts/_default/register-to-speak.html` - Custom template for the register-to-speak page.
- `layouts/events/list.html` and `layouts/events/single.html` - Events list and detail pages.
- `layouts/series/list.html` and `layouts/series/single.html` - Series list and detail pages.
- `layouts/blog/list.html` and `layouts/blog/single.html` - Blog list and detail pages.
- `layouts/partials/` - Reusable sections (hero, about, cards, footer, etc.).

### Assets and Static

- `static/images/` - Images referenced by content or templates.
- `static/admin/config.yml` - Decap CMS collections (if CMS is used).
- `static/admin/index.html` - Decap CMS app loader.

## Editing Existing Pages

1. Edit Markdown in `content/` for page copy and metadata. For example:
   - Update event details in `content/events/*.md`.
   - Update a blog post in `content/blog/*.md`.
1. Update site-wide sections or layout text in `layouts/partials/`.
   - Hero headline/lead text: `layouts/partials/hero.html`
   - About section copy: `layouts/partials/about-community.html`
1. Update stats and social links in `data/`.
1. Update images in `static/images/` and reference them with `/images/...` in front matter.

## Creating New Pages

### New Event

1. Create a new file in `content/events/` (e.g., `content/events/my-event.md`).
1. Use front matter fields used by templates:

```yaml
---
title: "Event Title"
date: 2025-03-20T18:00:00+01:00
end_date: 2025-03-20T20:00:00+01:00
location: "Virtual or City"
speaker: "Speaker Name"
speaker_title: "Role"
speaker_company: "Company"
speaker_image: "/images/speakers/someone.svg"
speaker_bio: "Short bio."
event_type: "webinar"
status: "upcoming"
registration_url: "https://meetup.com/..."
recording_url: ""
featured_image: "/images/events/event-image.svg"
tags: ["Azure", "AI"]
description: "One-line summary used on cards."
youtube_url: ""
slides_url: ""
github_url: ""
---
```

1. Add event body content below the front matter.

### New Series

1. Create a new file in `content/series/` for single-page series.
1. Use fields referenced by `layouts/partials/series-card.html` and `layouts/series/single.html`:

```yaml
---
title: "Series Title"
theme: "Theme Name"
status: "ongoing"
total_sessions: 6
instructor: "Instructor Name"
instructor_image: "/images/speakers/someone.svg"
thumbnail: "/images/series/series-image.svg"
next_session_date: 2025-04-05T18:00:00+01:00
youtube_playlist: "https://youtube.com/..."
linkedin_discussion: "https://linkedin.com/..."
description: "One-line summary used on cards."
---
```

1. Add series overview content below the front matter.

### New Series With Sessions (Sub-Series Pages)

1. Create a folder at `content/series/<series-slug>/` and add `_index.md`.
1. Use `layout: "series-detail"` and add scheduling metadata for the overall series:

```yaml
---
title: "Series Title"
layout: "series-detail"
theme: "Theme Name"
status: "upcoming"
total_sessions: 6
current_session: 0
start_date: 2026-01-31
end_date: 2026-03-21
next_session_date: 2026-01-31T11:00:00+01:00
instructor: "Instructor Name"
instructor_image: "/images/speakers/someone.svg"
youtube_playlist: "https://youtube.com/..."
linkedin_discussion: "https://linkedin.com/..."
thumbnail: "/images/series/series-image.svg"
description: "One-line summary used on cards."
---
```

1. Create a subfolder per session at `content/series/<series-slug>/<session-slug>/index.md`.
1. Use `layout: "series-session"` with the session-specific fields:

```yaml
---
title: "Session Title"
layout: "series-session"
date: 2026-01-31T11:00:00+01:00
end_date: 2026-01-31T12:00:00+01:00
location: "Virtual"
speaker: "Speaker Name"
speaker_title: "Role"
speaker_company: "Company"
speaker_image: "/images/speakers/someone.svg"
speaker_bio: "Short bio."
registration_url: "https://meetup.com/..."
recording_url: ""
featured_image: "/images/series/series-image.svg"
description: "Short summary used in session lists."
tags: ["Tag1", "Tag2"]
---
```

1. Add the session body content below the front matter and keep dates in chronological order.

### New Blog Post

1. Create a new file in `content/blog/`.
1. Use fields referenced by `layouts/partials/blog-card.html` and `layouts/blog/single.html`:

```yaml
---
title: "Post Title"
date: 2025-03-10T12:00:00+01:00
author: "Author Name"
author_image: "/images/team/team.svg"
category: "Community"
featured_image: "/images/blog/some-image.svg"
excerpt: "Short summary for the card."
tags: ["Azure", "Career"]
---
```

1. Add post content below the front matter.

### New Standalone Page

1. Add a Markdown file in `content/` (e.g., `content/faq.md`).
1. Hugo will render it with the default template in `layouts/_default/single.html`.
1. Add a menu link in `config.yaml` under `menu.main`.

## Editing Content Within Existing Pages

- Homepage sections are controlled in `config.yaml` under `params.homepage`.
- If you need to change the wording of a section, edit the corresponding partial in `layouts/partials/`.
- If you need to change the stats or social links, edit `data/stats.yaml` or `data/social.yaml`.

## Pre-commit Checks Before Raising an MR

1. Install pre-commit (choose one):
   - macOS (Homebrew): `brew install pre-commit`
   - Python via pipx: `pipx install pre-commit`
   - Python via pip: `pip install pre-commit`
1. Enable git hooks: `pre-commit install`.
1. Run checks locally before opening a PR: `pre-commit run --all-files`.
1. Ensure Node.js is installed (required for JS/CSS/HTML/Markdown hooks).

## Images

- Place new images in `static/images/` and reference them as `/images/...` in Markdown front matter or templates.
- Keep filenames lowercase with dashes for consistency (e.g., `azure-event.svg`).

## Past Events and Previous Speakers

1. Add a new file to `content/events/` or update an existing event.
1. Set `status: "past"` and ensure `date`/`end_date` are in the past.
1. Include speaker details and post-event resources:

```yaml
---
status: "past"
speaker: "Speaker Name"
speaker_title: "Role"
speaker_company: "Company"
speaker_image: "/images/speakers/someone.svg"
speaker_bio: "Short bio."
youtube_url: "https://youtube.com/..."
slides_url: "https://speakerdeck.com/..."
github_url: "https://github.com/..."
---
```

1. Add recap notes or key takeaways in the body content.

## Recordings

- Add `recording_url` to event or series session front matter to show a “Watch Recording” button in the sidebar.
- Leave it blank for upcoming sessions; add the link after the event is complete.
