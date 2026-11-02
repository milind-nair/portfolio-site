import { about as aboutConst, projects as projectsConst } from '../constants';

export const SECTIONS = ['hero', 'about', 'projects', 'blogs', 'contact'];

export function kebab(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const fallbackBlogs = aboutConst.blogs.map((blog) => ({
  slug: kebab(blog.title),
  title: blog.title,
  path: blog.link,
  dateLabel: blog.date,
  readTime: blog.readTime,
  description: blog.snippet,
  external: true,
}));

export function normalizeBlogs(json) {
  if (!Array.isArray(json) || json.length === 0) {
    return fallbackBlogs;
  }
  return json.map((blog) => ({
    slug: blog.slug || kebab(blog.title),
    title: blog.title,
    path: blog.path || `/blogs/${blog.slug}/`,
    dateLabel: blog.dateLabel || blog.pubDate,
    readTime: blog.readTime,
    description: blog.description,
    external: false,
  }));
}

export function buildData({ about = aboutConst, projects = projectsConst, blogs = fallbackBlogs } = {}) {
  return {
    about,
    projects: projects.map((p) => ({ ...p, slug: kebab(p.title) })),
    blogs,
    resumeUrl: `${process.env.PUBLIC_URL || ''}/Milind_Nair.pdf`,
    sections: SECTIONS,
  };
}
