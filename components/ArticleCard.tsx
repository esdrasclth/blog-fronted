import Image from 'next/image';
import Link from 'next/link';
import type { Article } from '@/lib/strapi';
import { getStrapiMediaUrl, getArticleCoverUrl } from '@/lib/strapi';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { attributes } = article;
  const coverUrl = getArticleCoverUrl(article);

  return (
    <article className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link href={`/blog/${attributes.slug}`} className="block">
        {coverUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={getStrapiMediaUrl(coverUrl)}
              alt={attributes.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
        )}
        <div className="p-5">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {attributes.title}
          </h2>
          {attributes.excerpt && (
            <p className="mb-3 line-clamp-2 text-zinc-600 dark:text-zinc-400">
              {attributes.excerpt}
            </p>
          )}
          <time
            dateTime={attributes.publishedAt}
            className="text-sm text-zinc-500 dark:text-zinc-500"
          >
            {new Date(attributes.publishedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </Link>
    </article>
  );
}
