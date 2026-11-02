import { kebab } from './data';

// ---- Line helpers (shared with commands.js) ----
export const seg = (text, color, extra) => ({ text, ...(color ? { color } : {}), ...(extra || {}) });
export const line = (...segments) => ({
  segments: segments.map((s) => (typeof s === 'string' ? { text: s } : s)),
});
export const blank = () => line('');
export const errorLine = (text) => line(seg(text, 'error'));

export const WIDTH = 70;

export function wrap(text, width = WIDTH) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  words.forEach((w) => {
    if (cur && cur.length + 1 + w.length > width) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

export const wrapLines = (text, width, color) =>
  wrap(text, width).map((l) => line(seg(l, color)));

export function columns(items, width = WIDTH) {
  const colW = Math.max(...items.map((s) => s.length)) + 2;
  const perRow = Math.max(1, Math.floor(width / colW));
  const rows = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(line(items.slice(i, i + perRow).map((s) => s.padEnd(colW)).join('').trimEnd()));
  }
  return rows;
}

// ---- Content renderers (used by commands and by files) ----
export const renderAbout = (data) => [
  ...data.about.bio.flatMap((p) => [...wrapLines(p), blank()]),
  line(seg('Location: ', 'muted'), data.about.location),
];

export const renderSkills = (data) => columns(data.about.skills);

export const renderContact = (data) => {
  const { email, social } = data.about;
  return [
    line(seg('email:    ', 'muted'), seg(email, 'accent', { href: `mailto:${email}` })),
    line(seg('github:   ', 'muted'), seg(social.github, 'accent', { href: social.github })),
    line(seg('linkedin: ', 'muted'), seg(social.linkedin, 'accent', { href: social.linkedin })),
    line(seg('medium:   ', 'muted'), seg(social.medium, 'accent', { href: social.medium })),
  ];
};

export const renderExperience = (exp) => [
  line(seg(exp.role, 'accent', { bold: true })),
  line(seg(`${exp.company}  |  ${exp.duration}`, 'muted')),
  ...wrapLines(exp.description),
];

export const renderProject = (p) => {
  const d = p.details || {};
  const out = [
    line(seg(p.title, 'accent', { bold: true })),
    ...wrapLines(d.summary || p.description),
    blank(),
  ];
  if (d.role) out.push(line(seg('Role:  ', 'muted'), d.role));
  if (d.stack) out.push(line(seg('Stack: ', 'muted'), d.stack.join(', ')));
  if (d.impact) {
    out.push(blank(), line(seg('Impact', 'path', { bold: true })), ...wrapLines(d.impact));
  }
  if (d.features) {
    out.push(blank(), line(seg('Features', 'path', { bold: true })));
    d.features.forEach((f) => wrapLines(f, WIDTH - 2).forEach((l, i) => out.push(line(i ? '  ' : '- ', ...l.segments))));
  }
  out.push(blank(), ...renderProjectLinks(p));
  return out;
};

export const renderProjectLinks = (p) => {
  const out = [];
  if (p.codeUrl) out.push(line(seg('code: ', 'muted'), seg(p.codeUrl, 'accent', { href: p.codeUrl })));
  if (p.demoUrl) out.push(line(seg('demo: ', 'muted'), seg(p.demoUrl, 'accent', { href: p.demoUrl })));
  if (out.length === 0) out.push(line(seg('No public links.', 'muted')));
  return out;
};

export const blogHref = (blog) => blog.path;

export const renderBlog = (blog) => [
  line(seg(blog.title, 'accent', { bold: true })),
  line(seg(`${blog.dateLabel || ''}${blog.readTime ? `  |  ${blog.readTime}` : ''}`, 'muted')),
  ...wrapLines(blog.description || ''),
  line(seg(blog.path, 'accent', { href: blog.path })),
];

// ---- Virtual filesystem ----
const file = (lines) => ({ type: 'file', lines });
const dir = (children) => ({ type: 'dir', children });

export function buildFs(data) {
  const experience = {};
  data.about.experiences.forEach((exp) => {
    let name = `${kebab(`${exp.company} ${exp.role}`)}.txt`;
    let n = 2;
    while (experience[name]) {
      name = `${kebab(`${exp.company} ${exp.role}`)}-${n}.txt`;
      n += 1;
    }
    experience[name] = file(renderExperience(exp));
  });

  const projects = {};
  data.projects.forEach((p) => {
    projects[p.slug] = dir({
      'README.md': file(renderProject(p)),
      'links.txt': file(renderProjectLinks(p)),
    });
  });

  const blogs = {};
  data.blogs.forEach((b) => {
    blogs[`${b.slug}.md`] = file(renderBlog(b));
  });

  return dir({
    'about.txt': file(renderAbout(data)),
    'skills.txt': file(renderSkills(data)),
    'contact.txt': file(renderContact(data)),
    'resume.pdf': file([
      line(seg('%PDF-1.7 ~~ 0xDEADBEEF ?? binary data, better opened in a viewer:', 'muted')),
      line(seg(data.resumeUrl, 'accent', { href: data.resumeUrl })),
    ]),
    experience: dir(experience),
    projects: dir(projects),
    blogs: dir(blogs),
  });
}

// Normalizes a path against cwd. Returns '~' or '~/a/b'. '..' past root stays at '~'.
export function resolvePath(cwd, path) {
  let p = path === undefined || path === null || path === '' ? '~' : String(path);
  let base;
  if (p === '~' || p.startsWith('~/')) {
    base = [];
    p = p.slice(1);
  } else if (p.startsWith('/')) {
    base = [];
  } else {
    base = cwd === '~' ? [] : cwd.replace(/^~\//, '').split('/');
  }
  p.split('/').forEach((part) => {
    if (part === '' || part === '.') return;
    if (part === '..') base.pop();
    else base.push(part);
  });
  return base.length ? `~/${base.join('/')}` : '~';
}

export function getNode(fs, path) {
  if (path === '~') return fs;
  let node = fs;
  const parts = path.replace(/^~\//, '').split('/');
  for (let i = 0; i < parts.length; i += 1) {
    if (!node || node.type !== 'dir' || !Object.prototype.hasOwnProperty.call(node.children, parts[i])) {
      return null;
    }
    node = node.children[parts[i]];
  }
  return node;
}

// -> [{ name, type }] sorted (dirs first), or null if path is not a directory
export function listDir(fs, path) {
  const node = getNode(fs, path);
  if (!node || node.type !== 'dir') return null;
  return Object.keys(node.children)
    .map((name) => ({ name, type: node.children[name].type }))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1));
}

// -> Line[] or null if not a file
export function readFile(fs, path) {
  const node = getNode(fs, path);
  return node && node.type === 'file' ? node.lines : null;
}
