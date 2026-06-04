---
title: Welcome to the site
date: 2026-06-05
tags: [meta]
---

This is a **post**. Posts are longer-form writing — essays, tutorials, anything that needs more than a paragraph.

## Edit on GitHub

Every page on this site links back to its source markdown file. Click the small pencil icon at the top of any post to edit it in the GitHub web editor. Commit, and the site rebuilds automatically.

## How it works

- Content lives in `content/entries/`, `content/posts/`, and `content/external/`.
- Each file is a markdown file with YAML frontmatter (`title`, `date`, `tags`).
- A prebuild script reads all markdown, renders it to HTML, and writes a search index to `public/index.json`.
- `next build` prerenders every page.
- GitHub Actions deploys the resulting `out/` folder to GitHub Pages.

That's it. No CMS, no database, no auth — just text files in a repo.
