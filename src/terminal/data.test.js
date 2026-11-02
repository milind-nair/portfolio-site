import { fallbackBlogs, normalizeBlogs, buildData, kebab } from './data';
import { about, projects } from '../constants';

describe('data', () => {
  test('kebab', () => {
    expect(kebab("What's Missing: When  Nothing!")).toBe('whats-missing-when-nothing');
  });

  test('fallbackBlogs maps about.blogs with slug and external', () => {
    expect(fallbackBlogs).toHaveLength(about.blogs.length);
    expect(fallbackBlogs[1]).toMatchObject({
      slug: 'the-quick-call-tax',
      path: about.blogs[1].link,
      description: about.blogs[1].snippet,
      external: true,
    });
  });

  test('normalizeBlogs maps posts.json', () => {
    const out = normalizeBlogs([
      { slug: 'a-post', title: 'A Post', pubDate: 'Jan 1, 2025', readTime: '1 min', description: 'd' },
      { title: 'No Slug Here', path: '/blogs/x/', dateLabel: 'Feb 2' },
    ]);
    expect(out[0]).toEqual({
      slug: 'a-post', title: 'A Post', path: '/blogs/a-post/', dateLabel: 'Jan 1, 2025',
      readTime: '1 min', description: 'd', external: false,
    });
    expect(out[1].slug).toBe('no-slug-here');
    expect(out[1].path).toBe('/blogs/x/');
  });

  test('normalizeBlogs falls back on empty/invalid', () => {
    expect(normalizeBlogs([])).toBe(fallbackBlogs);
    expect(normalizeBlogs(null)).toBe(fallbackBlogs);
  });

  test('buildData', () => {
    const d = buildData({ about, projects, blogs: fallbackBlogs });
    expect(d.projects[0].slug).toBe('mock-server-generator');
    expect(d.resumeUrl).toMatch(/\/Milind_Nair\.pdf$/);
    expect(d.sections).toEqual(['hero', 'about', 'projects', 'blogs', 'contact']);
  });
});
