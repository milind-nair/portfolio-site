import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'Milind Nair Blog',
    description:
      'Engineering essays, systems thinking notes, and practical software lessons by Milind Nair.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blogs/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
