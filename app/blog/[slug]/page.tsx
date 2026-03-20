import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getArticles, getStrapiMediaUrl, getArticleCoverUrl } from '@/lib/strapi';
import { ArticleContent } from '@/components/ArticleContent';

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const articles = await getArticles();
    return articles.map((article) => ({
      slug: article.attributes.slug,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { attributes } = article;
  const coverUrl = getArticleCoverUrl(article);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="text-lg font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Volver al inicio
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            {attributes.title}
          </h1>
          <time
            dateTime={attributes.publishedAt}
            className="text-zinc-500 dark:text-zinc-400"
          >
            {new Date(attributes.publishedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {coverUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800">
            <Image
              src={getStrapiMediaUrl(coverUrl)}
              alt={attributes.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="text-zinc-700 dark:text-zinc-300">
          <ArticleContent content={attributes.content} />
        </div>
      </article>
    </div>
  );
}
