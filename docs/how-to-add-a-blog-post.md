# How To Add A Blog Post

This repo serves the portfolio from React at `/` and the blog from Astro at `/blogs`.

For a normal new post, you should add it manually as an MDX file inside the Astro app.

## Recommended Workflow

## 1. Pick a slug

Use a lowercase, hyphenated slug.

Example:

```text
my-new-post
```

That slug becomes the URL:

```text
/blogs/my-new-post/
```

## 2. Create the asset folder

Create a folder for the post assets:

```text
apps/blogs/src/assets/blog/my-new-post/
```

Add at least a cover image:

```text
apps/blogs/src/assets/blog/my-new-post/cover.svg
```

You can also add inline figures there:

```text
apps/blogs/src/assets/blog/my-new-post/figure-1.svg
apps/blogs/src/assets/blog/my-new-post/figure-2.svg
```

## 3. Copy the cover into `public/covers`

Right now the React homepage feed at [`apps/blogs/src/pages/posts.json.ts`](/home/nairmi/portfolio-site/apps/blogs/src/pages/posts.json.ts) expects covers at:

```text
/blogs/covers/<slug>.svg
```

So also copy the same cover to:

```text
apps/blogs/public/covers/my-new-post.svg
```

This duplication is required by the current implementation.

## 4. Create the MDX file

Create:

```text
apps/blogs/src/content/blog/my-new-post.mdx
```

Use frontmatter that matches the schema in [`apps/blogs/src/content.config.ts`](/home/nairmi/portfolio-site/apps/blogs/src/content.config.ts).

Example:

```mdx
---
title: "My New Post"
description: "One-line summary used for cards, RSS, and SEO."
pubDate: "2026-03-31T00:00:00.000Z"
updatedDate: "2026-03-31T00:00:00.000Z"
tags: ["ai", "systems"]
coverImage: "../../assets/blog/my-new-post/cover.svg"
coverAlt: "Cover image description"
draft: false
readTime: "5 min read"
canonicalURL: "https://milindnair.com/blogs/my-new-post/"
featured: false
---

Write your post here.
```

## 5. Add inline images with MDX imports

If the post uses figures, import them at the top of the file after the frontmatter.

Example:

```mdx
import figure1 from '../../assets/blog/my-new-post/figure-1.svg';

<figure>
  <img src={figure1.src} alt="Figure description" loading="lazy" />
  <figcaption>Optional caption</figcaption>
</figure>
```

## 6. Preview locally

Run:

```bash
npm start
```

Then check:

```text
http://localhost:3000/blogs/
http://localhost:3000/blogs/my-new-post/
```

The React homepage section at [`src/components/Blogs.jsx`](/home/nairmi/portfolio-site/src/components/Blogs.jsx) reads from `/blogs/posts.json`, so it should also pick up the new post during local dev.

## 7. Build before committing

Run:

```bash
npm run build
```

This verifies:

- the Astro blog pages compile
- `/blogs/posts.json` is generated
- the combined `build/blogs` output is produced for deployment

## Drafts

Set:

```yaml
draft: true
```

to keep a post out of the published blog.

Published routes and feeds only include posts where `draft` is not true.

## Important Caveat About `npm run import:medium`

The Medium import script is not a safe everyday publishing workflow for manual local posts.

[`scripts/import-medium-posts.mjs`](/home/nairmi/portfolio-site/scripts/import-medium-posts.mjs) currently deletes and regenerates:

- `apps/blogs/src/content/blog`
- `apps/blogs/src/assets/blog`
- `apps/blogs/public/covers`

That means running:

```bash
npm run import:medium
```

or:

```bash
npm run import:medium:refresh
```

can wipe manually added local posts unless they are also represented in the import source.

Use the import script only when you intentionally want to regenerate the Medium-backed archive.

## Quick Checklist

- Create `apps/blogs/src/content/blog/<slug>.mdx`
- Add `apps/blogs/src/assets/blog/<slug>/cover.svg`
- Copy cover to `apps/blogs/public/covers/<slug>.svg`
- Fill out frontmatter correctly
- Import any inline figures from `src/assets/blog/<slug>/`
- Run `npm start`
- Run `npm run build`
