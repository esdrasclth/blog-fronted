const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  formats?: Record<string, { url: string }>;
}

export interface Article {
  id: number;
  documentId?: string;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    cover?: {
      data: {
        id: number;
        attributes: {
          url: string;
          alternativeText?: string;
          formats?: Record<string, { url: string }>;
        };
      } | null;
    };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function getStrapiUrl(path: string): string {
  return `${STRAPI_URL}${path}`;
}

export async function getArticles(): Promise<Article[]> {
  const url = getStrapiUrl('/api/articles?populate=*&sort=publishedAt:desc');
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch articles');
  }

  const json: StrapiResponse<Article[]> = await res.json();
  return json.data || [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const url = getStrapiUrl(
    `/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch article');
  }

  const json: StrapiResponse<Article[]> = await res.json();
  const articles = json.data || [];
  return articles[0] ?? null;
}

export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/** Extrae la URL de cover soportando múltiples formatos de respuesta de Strapi */
export function getArticleCoverUrl(article: Article): string | undefined {
  // Strapi puede devolver distintas formas según el `populate` y/o versión/config del endpoint.
  // Para no pelear con los tipos, trabajamos con `unknown` y luego tipamos mínimamente lo que necesitamos.
  const articleAny = article as unknown as {
    attributes?: Record<string, unknown>;
    cover?: Record<string, unknown>;
  };

  const attrs = articleAny.attributes ?? articleAny;
  const cover = (attrs as { cover?: unknown }).cover ?? articleAny.cover;
  if (!cover) return undefined;
  // Formato: cover.data.attributes.url
  const url =
    (cover as { data?: { attributes?: { url?: string } } })?.data?.attributes?.url ??
    // Formato: cover.attributes.url
    (cover as { attributes?: { url?: string } })?.attributes?.url ??
    // Formato plano: cover.url
    (cover as { url?: string })?.url;
  return url;
}
