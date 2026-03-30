import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blogRoot = path.join(rootDir, 'apps', 'blogs');
const contentDir = path.join(blogRoot, 'src', 'content', 'blog');
const assetsDir = path.join(blogRoot, 'src', 'assets', 'blog');
const publicCoversDir = path.join(blogRoot, 'public', 'covers');
const repoFeedSnapshotPath = path.join(blogRoot, 'data', 'medium-feed-snapshot.xml');
const feedUrl = 'https://medium.com/feed/@nairmilind3';
const cachedFeedPath = path.join('/tmp', 'nairmilind3-medium-feed.xml');
const forceRefresh = process.argv.includes('--refresh');

const legacyPosts = [
  {
    title: 'Why You Should Never Rename or Move Files!',
    slug: 'why-you-should-never-rename-or-move-files',
    description:
      'A practical Git note on preserving history correctly when files are moved or renamed.',
    pubDate: '2023-07-14T00:00:00.000Z',
    tags: ['git', 'version-control', 'developer-tooling'],
    readTime: '3 min read',
    mediumURL:
      'https://medium.com/@nairmilind3/why-you-should-never-rename-or-move-files-17bdebfcdf7a',
    coverImage:
      'https://cdn-images-1.medium.com/max/264/1*7FQZ83-0iGrxuQVRSP48rA.png',
    coverAlt: 'A file and folder themed illustration representing Git history',
    body: `
<p>This is one of the earlier pieces in the archive, and it has been preserved here as a short self-hosted edition so the full blog can live under <code>/blogs</code>.</p>

<p>The core lesson still holds: Git tracks content, not your intentions. When a file is renamed or moved, history is only easy to follow when the change is kept clean and the file contents are not simultaneously rewritten beyond recognition.</p>

<h3>The practical habit</h3>
<p>If a file needs a new name or a new location, make that change separately from large refactors whenever you can. Smaller diffs make history easier to inspect, reduce confusion in code review, and make future archaeology dramatically less painful.</p>

<h3>Why it matters</h3>
<p>Engineers often discover this the hard way when trying to answer basic questions later: when was this introduced, why was it moved, and what existed before the current structure?</p>

<p>Keeping moves, renames, and substantive code edits distinct gives Git a much better chance of preserving understandable history for your future self and your teammates.</p>

<p>If you want the original publication context, the original Medium post is still available.</p>
    `.trim(),
  },
];

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeHtml(value = '') {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '--')
    .replace(/&ndash;/g, '-')
    .replace(/&hellip;/g, '...')
    .replace(/&#xA0;/g, ' ')
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'");
}

function stripHtml(value = '') {
  return decodeHtml(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')).trim();
}

function normalizeMediumUrl(value = '') {
  if (!value) {
    return '';
  }

  try {
    const url = new URL(value);
    url.search = '';
    return url.toString();
  } catch {
    return value;
  }
}

function extract(block, pattern) {
  const match = block.match(pattern);
  return match ? decodeHtml(match[1].trim()) : '';
}

function quoteYaml(value) {
  return JSON.stringify(value);
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function fetchText(url) {
  if (!forceRefresh) {
    for (const snapshotPath of [repoFeedSnapshotPath, cachedFeedPath]) {
      if (fs.existsSync(snapshotPath)) {
        const cached = fs.readFileSync(snapshotPath, 'utf8');
        if (cached.includes('<rss')) {
          return cached;
        }
      }
    }
  }

  const response = execFileSync('curl', ['-Ls', url], {
    cwd: rootDir,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 20,
  });

  if (!response.includes('<rss')) {
    throw new Error('Expected an RSS feed from Medium but received a different HTML response.');
  }

  ensureDirectory(path.dirname(repoFeedSnapshotPath));
  fs.writeFileSync(repoFeedSnapshotPath, response);
  fs.writeFileSync(cachedFeedPath, response);
  return response;
}

function wordCount(value) {
  return stripHtml(value).split(/\s+/).filter(Boolean).length;
}

function readTimeLabel(value) {
  return `${Math.max(2, Math.ceil(wordCount(value) / 220))} min read`;
}

function getExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    return ext || '.png';
  } catch {
    return '.png';
  }
}

function toAbsoluteBlogsAsset(slug, fileName) {
  return `../../assets/blog/${slug}/${fileName}`;
}

function createPlaceholderSvg({ title, subtitle, eyebrow }) {
  const safeTitle = decodeHtml(title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubtitle = decodeHtml(subtitle)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const safeEyebrow = decodeHtml(eyebrow)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="92" y1="78" x2="1454" y2="822" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FBFF"/>
      <stop offset="0.5" stop-color="#EAF1FB"/>
      <stop offset="1" stop-color="#FFF0F7"/>
    </linearGradient>
    <linearGradient id="accent" x1="219" y1="122" x2="1373" y2="773" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2A5599"/>
      <stop offset="1" stop-color="#F50057"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" rx="48" fill="url(#bg)"/>
  <circle cx="132" cy="130" r="220" fill="#2A5599" fill-opacity="0.1"/>
  <circle cx="1444" cy="790" r="280" fill="#F50057" fill-opacity="0.08"/>
  <rect x="88" y="88" width="1424" height="724" rx="36" fill="#FFFFFF" fill-opacity="0.68" stroke="#D7E1F1"/>
  <rect x="140" y="148" width="304" height="52" rx="26" fill="url(#accent)" fill-opacity="0.14"/>
  <text x="176" y="181" fill="#2A5599" font-size="24" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-weight="700" letter-spacing="5">${safeEyebrow}</text>
  <text x="140" y="320" fill="#102033" font-size="72" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-weight="800">
    <tspan x="140" dy="0">${safeTitle.slice(0, 36)}</tspan>
    <tspan x="140" dy="88">${safeTitle.slice(36, 72)}</tspan>
    <tspan x="140" dy="88">${safeTitle.slice(72, 108)}</tspan>
  </text>
  <text x="140" y="636" fill="#516074" font-size="34" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-weight="500">
    <tspan x="140" dy="0">${safeSubtitle.slice(0, 74)}</tspan>
    <tspan x="140" dy="48">${safeSubtitle.slice(74, 148)}</tspan>
  </text>
  <circle cx="1278" cy="262" r="96" fill="#2A5599" fill-opacity="0.1"/>
  <circle cx="1202" cy="566" r="156" fill="#F50057" fill-opacity="0.1"/>
  <path d="M1096 274C1158 206 1268 202 1332 264C1396 326 1392 434 1324 500" stroke="url(#accent)" stroke-width="22" stroke-linecap="round"/>
  <path d="M1110 642C1172 574 1276 566 1344 626C1412 686 1408 786 1338 852" stroke="#102033" stroke-opacity="0.1" stroke-width="22" stroke-linecap="round"/>
  <text x="140" y="752" fill="#2A5599" font-size="24" font-family="Avenir Next, Segoe UI, Arial, sans-serif" font-weight="700">milindnair.com/blogs</text>
</svg>`;
}

function writePlaceholderAsset(targetPath, options) {
  fs.writeFileSync(targetPath, createPlaceholderSvg(options));
}

function replaceFiguresWithLocalImports(title, slug, html, assetDir) {
  const figureRegex =
    /<figure>\s*(<img[^>]*\/?>)\s*(?:<figcaption>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/gi;
  const imports = [];
  const downloads = new Map();
  let imageIndex = 0;
  let coverRelativePath = '';
  let coverAlt = '';
  let firstFigureRemoved = false;

  const transformed = html
    .replace(/<img src="https:\/\/medium\.com\/_\/stat[^"]*"[^>]*>/g, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<pre>([\s\S]*?)<\/pre>/gi, (_fullMatch, codeContent = '') => {
      const normalized = decodeHtml(codeContent)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();

      return `\n\n\`\`\`text\n${normalized}\n\`\`\`\n\n`;
    })
    .replace(figureRegex, (_fullMatch, imageTag, caption = '') => {
      const src = extract(imageTag, /src="([^"]+)"/);
      const alt = extract(imageTag, /alt="([^"]*)"/);
      if (!src) {
        return '';
      }

      const cleanAlt = stripHtml(alt) || 'Article illustration';
      const captionText = stripHtml(caption);
      const cleanSrc = decodeHtml(src);
      let localFileName = downloads.get(cleanSrc);

      if (!localFileName) {
        imageIndex += 1;
        localFileName = imageIndex === 1 ? 'cover.svg' : `figure-${imageIndex - 1}.svg`;
        downloads.set(cleanSrc, localFileName);
      }

      if (!coverRelativePath) {
        coverRelativePath = toAbsoluteBlogsAsset(slug, localFileName);
        coverAlt = cleanAlt;
      }

      const localFilePath = path.join(assetDir, localFileName);
      if (!fs.existsSync(localFilePath)) {
        writePlaceholderAsset(localFilePath, {
          title,
          subtitle: captionText || cleanAlt,
          eyebrow: imageIndex === 1 ? 'COVER IMAGE' : `FIGURE ${imageIndex - 1}`,
        });
      }

      if (localFileName === path.basename(coverRelativePath) && !firstFigureRemoved) {
        firstFigureRemoved = true;
        return '';
      }

      const importName = `figure${imports.length + 1}`;
      imports.push(`import ${importName} from '${toAbsoluteBlogsAsset(slug, localFileName)}';`);

      return `

<figure>
  <img src={${importName}.src} alt=${quoteYaml(cleanAlt)} loading="lazy" />
  ${captionText ? `<figcaption>${captionText}</figcaption>` : ''}
</figure>

      `;
    })
    .trim();

  return {
    transformed,
    imports,
    coverRelativePath,
    coverAlt: coverAlt || 'Cover image for the article',
  };
}

function buildFrontmatter(entry) {
  const tags = JSON.stringify(entry.tags);
  const lines = [
    '---',
    `title: ${quoteYaml(entry.title)}`,
    `description: ${quoteYaml(entry.description)}`,
    `pubDate: ${quoteYaml(entry.pubDate)}`,
    entry.updatedDate ? `updatedDate: ${quoteYaml(entry.updatedDate)}` : null,
    `tags: ${tags}`,
    `coverImage: ${quoteYaml(entry.coverImage)}`,
    `coverAlt: ${quoteYaml(entry.coverAlt)}`,
    `draft: false`,
    `readTime: ${quoteYaml(entry.readTime)}`,
    `canonicalURL: ${quoteYaml(entry.canonicalURL)}`,
    entry.mediumURL ? `mediumURL: ${quoteYaml(entry.mediumURL)}` : null,
    `featured: ${entry.featured ? 'true' : 'false'}`,
    '---',
  ].filter(Boolean);

  return `${lines.join('\n')}\n`;
}

function createMediumEntries() {
  const feed = fetchText(feedUrl);
  const itemBlocks = feed.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return itemBlocks.map((block) => {
    const title = extract(block, /<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const mediumURL = normalizeMediumUrl(extract(block, /<link>(.*?)<\/link>/));
    const pubDateRaw = extract(block, /<pubDate>(.*?)<\/pubDate>/);
    const updatedDate = extract(block, /<atom:updated>(.*?)<\/atom:updated>/);
    const content = extract(block, /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    const tags = [...block.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)].map((match) =>
      slugify(decodeHtml(match[1])).replace(/-/g, ' ')
    );
    const firstParagraph = extract(content, /<p>([\s\S]*?)<\/p>/);

    return {
      title,
      slug: slugify(title),
      description: stripHtml(firstParagraph),
      pubDate: new Date(pubDateRaw).toISOString(),
      updatedDate: updatedDate || undefined,
      tags,
      readTime: readTimeLabel(content),
      mediumURL,
      canonicalURL: `https://milindnair.com/blogs/${slugify(title)}/`,
      featured: false,
      body: content,
    };
  });
}

function writePost(entry) {
  const assetDir = path.join(assetsDir, entry.slug);
  ensureDirectory(assetDir);

  let coverImage = entry.coverImage;
  let coverAlt = entry.coverAlt;
  let body = entry.body;
  let imports = [];

  if (body) {
    const transformed = replaceFiguresWithLocalImports(entry.title, entry.slug, body, assetDir);
    body = transformed.transformed;
    imports = transformed.imports;
    coverImage = coverImage || transformed.coverRelativePath;
    coverAlt = coverAlt || transformed.coverAlt;
  }

  if (entry.coverImage && /^https?:\/\//.test(entry.coverImage)) {
    const targetPath = path.join(assetDir, 'cover.svg');
    if (!fs.existsSync(targetPath)) {
      writePlaceholderAsset(targetPath, {
        title: entry.title,
        subtitle: entry.description,
        eyebrow: 'SELF-HOSTED POST',
      });
    }
    coverImage = toAbsoluteBlogsAsset(entry.slug, 'cover.svg');
  }

  if (!coverImage) {
    const targetPath = path.join(assetDir, 'cover.svg');
    writePlaceholderAsset(targetPath, {
      title: entry.title,
      subtitle: entry.description,
      eyebrow: 'SELF-HOSTED POST',
    });
    coverImage = toAbsoluteBlogsAsset(entry.slug, 'cover.svg');
  }

  const mdxPath = path.join(contentDir, `${entry.slug}.mdx`);
  const publicCoverPath = path.join(publicCoversDir, `${entry.slug}.svg`);
  fs.copyFileSync(path.join(assetDir, path.basename(coverImage)), publicCoverPath);
  const frontmatter = buildFrontmatter({
    ...entry,
    coverImage,
    coverAlt,
  });
  const intro = entry.mediumURL
    ? `> Originally published on [Medium](${entry.mediumURL}). This version is now archived under \`/blogs\`.\n\n`
    : '';
  const fileContents = `${frontmatter}${imports.length ? `${imports.join('\n')}\n\n` : ''}${intro}${body}\n`;

  fs.writeFileSync(mdxPath, fileContents);
  console.log(`Wrote ${path.relative(rootDir, mdxPath)}`);
}

const mediumEntries = createMediumEntries().map((entry, index) => ({
  ...entry,
  featured: index < 6,
}));

fs.rmSync(contentDir, { recursive: true, force: true });
fs.rmSync(assetsDir, { recursive: true, force: true });
fs.rmSync(publicCoversDir, { recursive: true, force: true });
ensureDirectory(contentDir);
ensureDirectory(assetsDir);
ensureDirectory(publicCoversDir);

for (const entry of mediumEntries) {
  writePost(entry);
}

for (const legacyEntry of legacyPosts) {
  writePost({
    ...legacyEntry,
    canonicalURL: `https://milindnair.com/blogs/${legacyEntry.slug}/`,
    featured: false,
  });
}
