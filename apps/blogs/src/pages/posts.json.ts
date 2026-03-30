import { getPublishedPosts, formatDate, postPath } from '../lib/posts';

export const prerender = true;

export async function GET() {
  const posts = await getPublishedPosts();

  const items = await Promise.all(
    posts.map(async (post, index) => {
      return {
        title: post.data.title,
        slug: post.id,
        path: postPath(post),
        description: post.data.description,
        pubDate: post.data.pubDate.toISOString(),
        dateLabel: formatDate(post.data.pubDate),
        readTime: post.data.readTime,
        coverAlt: post.data.coverAlt,
        coverImage: `/blogs/covers/${post.id}.svg`,
        tags: post.data.tags,
        featured: post.data.featured ?? index < 6,
      };
    })
  );

  return new Response(JSON.stringify(items, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
