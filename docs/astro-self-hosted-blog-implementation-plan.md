# React Portfolio + Self-Hosted `/blogs` Implementation Plan

## Objective

Keep the existing React portfolio at `milindnair.com/` and add a self-hosted static blog at `milindnair.com/blogs/`.

This revised plan does **not** migrate the whole site away from React. Instead, it adds an Astro-powered blog as a focused sub-application while preserving the current React portfolio, current homepage structure, and most of the current deployment shape.

## Non-Goals

- Do not replace the React portfolio homepage.
- Do not rewrite `Hero`, `About`, `Projects`, or `Contact` in Astro.
- Do not force a full hosting migration unless deployment limitations require it later.
- Do not keep Medium as the primary reading destination for posts intended to live on `milindnair.com/blogs`.

## Current Repository Snapshot

### Existing app

- Root app: Create React App via `react-scripts`
- UI stack: React 18 + Material UI + Emotion
- Current homepage composition: `src/App.js`
- Current layout/navigation: `src/components/Layout.jsx`
- Current blog teaser UI: `src/components/Blogs.jsx`
- Current blog metadata source: `src/constants.js`
- Current static assets: `public/manifest.json`, `public/robots.txt`, `public/favicon.ico`, `public/brand-icon.png`, resume PDFs
- Current deployment workflow: `.github/workflows/deploy.yml`
- Current deploy target: GitHub Pages with custom domain via `homepage: "https://milindnair.com"` in `package.json`

### Current blog limitations

- Blog content is not stored locally.
- The React site only shows blog cards, then sends users to Medium.
- Cover images are remote Medium assets.
- There is no `/blogs` route or blog index.
- There is no RSS feed or self-hosted post detail page.

## Recommended Architecture

## Keep React at the root, add Astro only for `/blogs`

Recommended structure:

```text
/
  package.json
  src/                    # existing React portfolio
  public/                 # existing static assets
  apps/
    blogs/
      package.json
      astro.config.mjs
      src/
        content/
          config.ts
          blog/
            post-one.md
            post-two.md
        assets/
          blog/
        components/
        layouts/
        pages/
          index.astro
          [slug].astro
          rss.xml.js
          posts.json.ts
```

### Runtime behavior

- `milindnair.com/` continues serving the current React portfolio.
- `milindnair.com/blogs/` serves the Astro-generated blog index.
- `milindnair.com/blogs/<slug>/` serves individual blog posts.
- The React homepage keeps its current “Recent Thoughts” section, but those cards should point to `/blogs/<slug>/` instead of Medium.

### Why this is the best fit

- It respects the requirement to keep React.
- It isolates blog-specific concerns like Markdown, RSS, and image optimization.
- It avoids rewriting the whole portfolio for a problem that only affects blog publishing.
- It can work with the current one-site deployment model by merging the Astro build output under `/blogs`.

## Key Implementation Decision

## Use Astro as a nested static blog build, not as the main site framework

The cleanest approach for this repo is:

1. Keep the current root React app and existing CRA build.
2. Add a small Astro project under `apps/blogs`.
3. Build the Astro site with `base: '/blogs'`.
4. Copy Astro’s `dist/` output into the final React build under `build/blogs/`.
5. Deploy the combined artifact exactly as one website.

This gives you one deployed site with two internally separate build systems:

- React owns `/`
- Astro owns `/blogs`

## Why not full deployment splitting?

Serving React from one deployment and Astro from another behind path-based routing is possible, but it adds operational complexity that is unnecessary for the current repo. Since the existing site is already a static build deployed as one artifact, composing the final output into one `build/` directory is simpler.

## Phase 1: Add A Dedicated Astro Blog App

### Goal

Create a self-contained Astro app that only handles the `/blogs` section.

### Tasks

1. Create `apps/blogs/`.
2. Initialize Astro in that folder with the empty template.
3. Add Tailwind to the Astro app.
4. Install `@astrojs/sitemap` and `@astrojs/rss`.
5. Configure `apps/blogs/astro.config.mjs`:
   - `site: 'https://milindnair.com'`
   - `base: '/blogs'`
6. Keep Astro dependencies inside the blog app package.
7. Decide whether to use npm workspaces.

### Recommended choice

Use npm workspaces so the repo stays manageable:

```json
{
  "workspaces": ["apps/blogs"]
}
```

This is optional, but it makes blog-specific package management cleaner than mixing Astro dependencies directly into the root CRA package.

## Phase 2: Define The Blog Content Model

### Goal

Move blog content into Markdown files stored locally in the repo.

### Tasks

1. Add `apps/blogs/src/content/config.ts`.
2. Define a `blog` content collection with Zod validation.
3. Create `apps/blogs/src/content/blog/`.
4. Create one Markdown file per post.
5. Store blog assets under `apps/blogs/src/assets/blog/`.

### Recommended schema

```ts
title
description
pubDate
updatedDate?
tags
coverImage
coverAlt
draft?
readTime?
canonicalURL?
mediumURL?
featured?
```

### Why this schema fits this repo

- `mediumURL` preserves the original Medium source.
- `featured` helps drive the homepage teaser section.
- `coverAlt` improves accessibility.
- `draft` supports unpublished work without deleting files.

## Phase 3: Build The `/blogs` Experience

### Goal

Create a real blog index and individual post pages under `/blogs`.

### Tasks

1. Create `apps/blogs/src/pages/index.astro`.
   - Route: `/blogs/`
   - Purpose: all posts listing
2. Create `apps/blogs/src/pages/[slug].astro`.
   - Route: `/blogs/<slug>/`
   - Purpose: individual post pages
3. Create `apps/blogs/src/layouts/BaseLayout.astro`.
4. Create `apps/blogs/src/layouts/PostLayout.astro`.
5. Create reusable blog components:
   - `BlogCard.astro`
   - `PostMeta.astro`
   - `TagList.astro`
   - `Giscus.astro`

### UX guidance

- Keep the blog visually close enough to the portfolio that the domain feels consistent.
- It does not need to reuse React or MUI directly.
- Match the current brand colors from `src/theme.js` where useful.
- Use a clean top-level blog navigation with a link back to `/`.

## Phase 4: Migrate Existing Medium Posts

### Goal

Import the current Medium-backed posts into local Markdown.

### Tasks

1. Audit the existing `about.blogs` entries in `src/constants.js`.
2. For each entry:
   - Create a stable slug
   - Copy the title
   - Copy or rewrite the description
   - Normalize the publication date
   - Add tags
   - Add read time
3. Download each cover image and store it locally.
4. Convert the article body into Markdown.
5. Move inline images into `apps/blogs/src/assets/blog/<slug>/`.
6. Decide whether each article remains canonical on Medium or becomes canonical on `milindnair.com`.

### Important SEO decision

If you republish existing Medium content on `/blogs`, choose the canonical strategy before launch:

- Option A: `milindnair.com/blogs/<slug>/` becomes canonical
- Option B: Medium remains canonical, and the self-hosted copy points back to Medium

## Phase 5: Add The Image Optimization Pipeline

### Goal

Ensure all blog images are local, optimized, and responsive.

### Tasks

1. Store all cover and inline images inside `apps/blogs/src/assets/blog/`.
2. Use Astro content collection `image()` support for `coverImage`.
3. Render cover images with `<Image />` from `astro:assets`.
4. Keep inline post images local rather than linking to Medium CDN URLs.
5. Verify responsive behavior on mobile and desktop.

### Why this matters here

The current React site depends on remote Medium cover images in `src/constants.js`. Localizing those assets removes that dependency and gives you predictable performance and caching.

## Phase 6: Keep The React Homepage, But Repoint It To Self-Hosted Posts

### Goal

Preserve the existing “Recent Thoughts” section in React, but make it advertise the new self-hosted blog.

### Current state

- `src/components/Blogs.jsx` sorts `about.blogs` from `src/constants.js`
- Each card links to Medium
- Card images are remote URLs

### Target state

- The section still lives on the homepage
- Cards link to `/blogs/<slug>/`
- Card metadata comes from the Astro blog content, not a separate hard-coded duplicate list

### Recommended implementation

Generate a lightweight posts manifest from Astro:

- Add an Astro endpoint such as `apps/blogs/src/pages/posts.json.ts`
- Output a JSON file at `/blogs/posts.json`
- Include only the metadata React needs:
  - `title`
  - `slug`
  - `description`
  - `pubDate`
  - `readTime`
  - `coverImage`
  - `featured`

Then refactor `src/components/Blogs.jsx` to fetch `/blogs/posts.json` and render recent posts from that response.

### Why this is better than keeping two sources of truth

- Blog content stays owned by the blog app.
- The React homepage becomes a consumer of generated metadata.
- You avoid editing both `src/constants.js` and Markdown every time a post changes.

## Phase 7: Build Integration Between Astro And CRA

### Goal

Produce one deployable static site that contains both the React portfolio and the Astro blog.

### Recommended build flow

1. Build the Astro blog app.
2. Build the React app.
3. Copy the Astro `dist/` contents into the React output under `build/blogs/`.
4. Deploy the combined `build/` directory.

### Example output shape

```text
build/
  index.html              # React homepage
  static/
  blogs/
    index.html            # Astro blog index
    some-post/
      index.html
    rss.xml
    posts.json
```

### Root script changes

Add root scripts similar to:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build:site": "react-scripts build",
    "build:blogs": "npm run build --workspace apps/blogs",
    "build": "npm run build:blogs && npm run build:site && npm run copy:blogs",
    "copy:blogs": "copy Astro dist into build/blogs"
  }
}
```

### Cross-platform note

Use a copy utility that works reliably in CI:

- `shx cp -r`
- `cpy-cli`
- a small Node script in `scripts/copy-blogs.mjs`

A small Node script is usually the most predictable option for GitHub Actions.

## Phase 8: Routing, Linking, And Asset Details

### Goal

Make sure `/blogs` behaves like a true subsite and not a hacked static folder.

### Tasks

1. Set Astro `base: '/blogs'` so CSS, JS, and internal links resolve correctly.
2. Use directory-style output so post routes become `/blogs/<slug>/`.
3. Add a “View all posts” link from the React homepage to `/blogs/`.
4. Add a “Back to portfolio” link in the Astro blog layout pointing to `/`.
5. Confirm internal blog links never assume the site root is `/`.

## Phase 9: SEO, RSS, Sitemap, And Comments

### Goal

Make the self-hosted blog discoverable and interactive while keeping the main portfolio untouched.

### Tasks

1. Add metadata handling in the Astro `BaseLayout.astro`.
2. Create `apps/blogs/src/pages/rss.xml.js`.
   - Final route: `/blogs/rss.xml`
3. Enable Astro sitemap generation.
   - Final route will live under `/blogs`, not the site root
4. Update root `public/robots.txt` to reference the blog sitemap and feed.
5. Add Giscus only to blog post pages.
6. Add Plausible only if desired for the blog, or share the same sitewide domain config.

### `robots.txt` update

The current `public/robots.txt` is minimal:

```text
User-agent: *
Disallow:
```

After the blog is added, update it to reference the blog sitemap, for example:

```text
User-agent: *
Disallow:
Sitemap: https://milindnair.com/blogs/sitemap-index.xml
```

If Astro outputs a different sitemap filename, use that exact filename.

## Phase 10: Deployment Strategy

## Recommended MVP: keep one deployment artifact

Because the current site already deploys a single static `build/` directory, the easiest path is:

- Keep the existing React deployment workflow shape
- Change the build pipeline so `build/` also contains `build/blogs/`
- Continue deploying one static site artifact

### Why this is likely enough

GitHub Pages can serve static files from subdirectories. If the combined artifact contains:

- `build/index.html`
- `build/blogs/index.html`
- `build/blogs/<slug>/index.html`

then `milindnair.com/blogs/` can work without splitting the site into separate deployments.

### What changes in CI

Update `.github/workflows/deploy.yml` so it:

1. Installs workspace dependencies
2. Builds the Astro blog app
3. Builds the React site
4. Copies Astro output into `build/blogs`
5. Deploys the final `build/` directory

### When Cloudflare Pages becomes worth it

Consider Cloudflare only if you later want:

- preview deployments for the combined site
- path-based routing between separate services
- edge redirects or middleware
- more advanced caching and headers

For the current requirement, it is optional rather than required.

## Phase 11: QA Checklist

### Functional checks

1. `https://milindnair.com/` still serves the current React homepage.
2. `https://milindnair.com/blogs/` loads the Astro blog index.
3. `https://milindnair.com/blogs/<slug>/` loads individual posts.
4. Homepage blog teaser cards point to `/blogs/<slug>/`.
5. `/blogs/posts.json` returns the expected metadata.
6. `/blogs/rss.xml` is reachable.
7. Giscus renders only on post pages.

### Visual checks

1. Blog cards on the React homepage still look consistent with the portfolio.
2. Blog pages look intentional on mobile and desktop.
3. Cover images crop correctly.
4. Typography and colors feel related to the root portfolio brand.

### SEO checks

1. Post pages have correct canonical URLs.
2. Open Graph metadata is present.
3. `robots.txt` references the blog sitemap.
4. The feed contains expected published posts.

### Performance checks

1. Astro pages ship minimal JavaScript.
2. Local images are optimized.
3. The React homepage does not block on slow blog metadata fetching.

## File-By-File Impact Map

### Files to keep

- `src/App.js`
- `src/components/Layout.jsx`
- `src/components/Hero.jsx`
- `src/components/About.jsx`
- `src/components/Projects.jsx`
- `src/components/Contact.jsx`
- `public/manifest.json`
- `public/favicon.ico`
- `public/brand-icon.png`
- `public/resume.pdf`
- `public/Milind_Nair.pdf`

### Files to update

- `package.json`
  - add workspace/build orchestration
- `.github/workflows/deploy.yml`
  - build both apps before deploy
- `src/components/Blogs.jsx`
  - switch from Medium links to `/blogs`
  - stop depending on hard-coded blog metadata
- `src/constants.js`
  - remove or reduce the `about.blogs` data once React starts reading generated blog metadata
- `public/robots.txt`
  - add blog sitemap reference

### New directories and files

- `apps/blogs/package.json`
- `apps/blogs/astro.config.mjs`
- `apps/blogs/src/content/config.ts`
- `apps/blogs/src/content/blog/*.md`
- `apps/blogs/src/assets/blog/*`
- `apps/blogs/src/layouts/BaseLayout.astro`
- `apps/blogs/src/layouts/PostLayout.astro`
- `apps/blogs/src/pages/index.astro`
- `apps/blogs/src/pages/[slug].astro`
- `apps/blogs/src/pages/rss.xml.js`
- `apps/blogs/src/pages/posts.json.ts`
- optional `scripts/copy-blogs.mjs`

## Suggested Execution Order

1. Scaffold `apps/blogs` and get a placeholder `/blogs/` page building locally.
2. Add the content collection and import one pilot post.
3. Build the post detail page and blog index.
4. Add image optimization and local assets.
5. Generate `/blogs/posts.json`.
6. Refactor `src/components/Blogs.jsx` to use that metadata and point to self-hosted posts.
7. Integrate the build pipeline so Astro output lands in `build/blogs`.
8. Update CI and `robots.txt`.
9. Import the remaining posts.
10. Add Giscus, RSS, and final SEO metadata.
11. QA on desktop and iPhone.

## Definition Of Done

This work is complete when:

- the React portfolio still serves `milindnair.com/`
- the Astro blog serves `milindnair.com/blogs/`
- blog posts live in local Markdown files
- blog images are local and optimized
- the React homepage links to self-hosted posts instead of Medium
- blog metadata is not duplicated manually in two places
- the combined build deploys as one static site
- RSS, sitemap, and comments work for the blog
