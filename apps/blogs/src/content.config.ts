import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      coverImage: image(),
      coverAlt: z.string(),
      draft: z.boolean().optional().default(false),
      readTime: z.string().optional(),
      canonicalURL: z.string().url().optional(),
      mediumURL: z.string().url().optional(),
      featured: z.boolean().optional().default(false),
    }),
});

export const collections = { blog };
