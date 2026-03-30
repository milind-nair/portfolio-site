import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export const BLOG_TITLE = 'Milind Nair | Blog';
export const BLOG_DESCRIPTION =
  'Engineering essays, systems thinking notes, and practical software lessons by Milind Nair.';

export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}

export function postPath(post: BlogEntry) {
  return `/blogs/${post.id}/`;
}

export function ensureBlogsBase(pathname: string) {
  return pathname.startsWith('/blogs/') ? pathname : `/blogs${pathname}`;
}
