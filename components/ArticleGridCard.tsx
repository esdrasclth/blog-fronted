"use client";

import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/strapi";
import { getArticleCoverUrl, getStrapiMediaUrl } from "@/lib/strapi";

function estimateReadingTimeMinutes(text: string | undefined): number {
  const words = (text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return 1;
  return Math.max(1, Math.ceil(words.length / 200));
}

function formatSpanishDate(isoDate: string): string {
  const d = new Date(isoDate);
  const parts = d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short", // e.g. "may."
    year: "numeric",
  });
  // 15 mayo, 2024
  return parts.replace(" de ", " ").replace(".", "").toUpperCase() + ", " + d.getFullYear();
}

export function ArticleGridCard({
  article,
  category,
}: {
  article: Article;
  category: string;
}) {
  const coverUrl = getArticleCoverUrl(article);
  const { attributes } = article;
  const readingMinutes = estimateReadingTimeMinutes(attributes.content);

  return (
    <article className="group cursor-pointer flex flex-col gap-4">
      <div className="relative overflow-hidden mb-2 aspect-video bg-[#18211c]">
        {coverUrl ? (
          <Image
            src={getStrapiMediaUrl(coverUrl)}
            alt={attributes.title}
            fill
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-[#18211c]" />
        )}

        <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 text-[9px] uppercase tracking-widest font-bold">
          {category}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400">
          <span>{formatSpanishDate(attributes.publishedAt)}</span>
          <span>{readingMinutes} MIN LECTURA</span>
        </div>

        <Link
          href={`/blog/${attributes.slug}`}
          className="block"
          aria-label={`Leer ${attributes.title}`}
        >
          <h3 className="text-3xl font-headline font-bold leading-tight text-white group-hover:text-primary transition-colors italic">
            {attributes.title}
          </h3>
        </Link>

        {attributes.excerpt ? (
          <p className="text-slate-300 font-body text-sm leading-relaxed line-clamp-2">
            {attributes.excerpt}
          </p>
        ) : (
          <p className="text-slate-300 font-body text-sm leading-relaxed line-clamp-2">
            {attributes.content}
          </p>
        )}
      </div>
    </article>
  );
}

