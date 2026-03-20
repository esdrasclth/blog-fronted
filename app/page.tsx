import Link from 'next/link';
import { getArticles, type Article } from '@/lib/strapi';
import { ArticleCard } from '@/components/ArticleCard';

export const revalidate = 60;

export default async function Home() {
  let articles: Article[];
  let fetchError: string | null = null;
  try {
    articles = await getArticles();
  } catch (err) {
    articles = [];
    fetchError = err instanceof Error ? err.message : 'Error al cargar artículos';
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            Mi Blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Artículos
        </h1>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-100/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
            {fetchError && (
              <p className="mb-3 rounded bg-amber-100 p-3 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {fetchError} — Comprueba los permisos en Strapi (ver abajo).
              </p>
            )}
            <p className="mb-2 text-zinc-600 dark:text-zinc-400">
              No hay artículos visibles todavía.
            </p>
            <ol className="mb-4 list-inside list-decimal space-y-1 text-left text-sm text-zinc-600 dark:text-zinc-400">
              <li>Strapi corriendo en <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">localhost:1337</code></li>
              <li>Artículos creados y <strong>publicados</strong> (no en borrador)</li>
              <li>
                En Strapi Admin → <strong>Settings</strong> → <strong>Users & Permissions</strong> → <strong>Roles</strong> → <strong>Public</strong> → en <strong>Article</strong> marcar <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">find</code> y <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">findOne</code> → <strong>Save</strong>
              </li>
            </ol>
            <a
              href="http://localhost:1337/admin/settings/users-permissions/roles"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Abrir Roles en Strapi Admin
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
