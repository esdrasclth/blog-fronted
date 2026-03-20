import { getArticles, type Article } from '@/lib/strapi';
import { BlogHomeClient } from '@/components/BlogHomeClient';

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

  return <BlogHomeClient articles={articles} fetchError={fetchError} />;
}
