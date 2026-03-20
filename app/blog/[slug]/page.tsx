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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="sticky top-0 w-full z-50 bg-background/90 backdrop-blur-md flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-headline text-white tracking-tight font-black transition-opacity group-hover:opacity-80">
              ESDRAS CLOTHER<span className="text-slate-400">.</span>
            </span>
          </Link>
          <div className="flex gap-8 items-center">
            <Link
              className="text-primary font-bold font-sans text-[10px] md:text-xs uppercase tracking-widest hover:text-green-400 transition-colors"
              href="/"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-16 sm:px-6 flex-1 w-full">
        <header className="mb-12">
          <time
            dateTime={attributes.publishedAt}
            className="font-sans text-[10px] uppercase tracking-widest text-slate-400 mb-4 block"
          >
            {new Date(attributes.publishedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white italic leading-tight">
            {attributes.title}
          </h1>
        </header>

        {coverUrl && (
          <div className="relative mb-12 aspect-video w-full overflow-hidden bg-[#18211c]">
            <Image
              src={getStrapiMediaUrl(coverUrl)}
              alt={attributes.title}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              priority
              unoptimized
            />
          </div>
        )}

        <div className="text-slate-300 font-sans text-base md:text-lg leading-relaxed font-light">
          <ArticleContent content={attributes.content} />
        </div>
      </article>

      <footer className="mt-12 border-t border-white/5 py-8 text-center bg-background relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-primary"></div>
        <span className="font-sans text-[10px] uppercase tracking-widest text-slate-500">
          © {new Date().getFullYear()} ESDRAS CLOTHER. All Rights Reserved.
        </span>
      </footer>
    </div>
  );
}
