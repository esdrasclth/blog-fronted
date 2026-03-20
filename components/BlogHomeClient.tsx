"use client";

import Image from "next/image";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/strapi";
import { ArticleGridCard } from "@/components/ArticleGridCard";

type Category = "Todos" | "Logística" | "Análisis de Datos" | "Desarrollo";

const CATEGORY_RULES: Array<{
  category: Exclude<Category, "Todos">;
  keywords: string[];
}> = [
  {
    category: "Logística",
    keywords: ["logística", "rutas", "flotas", "inventario", "operativos", "puerto"],
  },
  {
    category: "Análisis de Datos",
    keywords: ["datos", "kpi", "dashboard", "métricas", "sql", "python"],
  },
  {
    category: "Desarrollo",
    keywords: ["desarrollo", "software", "microservicios", "código", "api", "programación"],
  },
];

function inferCategory(article: Article): Exclude<Category, "Todos"> {
  const text = [
    article.attributes.title,
    article.attributes.excerpt,
    article.attributes.content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }

  return "Desarrollo";
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function BlogHomeClient({
  articles,
  fetchError,
}: {
  articles: Article[];
  fetchError: string | null;
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");

  const filteredArticles = useMemo(() => {
    const q = normalize(query);

    return articles.filter((article) => {
      const inferred = inferCategory(article);

      const categoryOk =
        activeCategory === "Todos" ? true : inferred === activeCategory;

      const queryOk = !q
        ? true
        : normalize(
            [
              article.attributes.title,
              article.attributes.excerpt,
              article.attributes.content,
            ]
              .filter(Boolean)
              .join(" ")
          ).includes(q);

      return categoryOk && queryOk;
    });
  }, [activeCategory, articles, query]);

  const distinctCategoriesCount = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) set.add(inferCategory(a));
    return set.size;
  }, [articles]);

  const totalArticles = articles.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* SECTION 1: STICKY NAVIGATION BAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-white/5">
        <nav className="w-full flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-headline text-white tracking-tight font-black">
              ESDRAS CLOTHER<span className="text-slate-400">.</span>
            </span>
          </div>

          <div className="hidden md:flex gap-8 items-center">
          <a
            className="text-primary font-bold font-sans text-[10px] md:text-xs uppercase tracking-widest"
            href="/"
          >
            Inicio
          </a>
          <a
            className="text-slate-400 hover:text-primary transition-colors font-sans text-[10px] md:text-xs uppercase tracking-widest"
            href="/"
          >
            Artículos
          </a>
          <a
            className="text-slate-400 hover:text-primary transition-colors font-sans text-[10px] md:text-xs uppercase tracking-widest"
            href="#about"
          >
            Sobre mí
          </a>
          <a
            className="text-slate-400 hover:text-primary transition-colors font-sans text-[10px] md:text-xs uppercase tracking-widest"
            href="#contact"
          >
            Contacto
          </a>
        </div>

        <button className="bg-primary text-white px-6 py-2.5 font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-colors">
          Suscribirse
        </button>
        </nav>
      </header>

      <main className="pt-32">
        {/* SECTION 2: HERO / AUTHOR BIO */}
        <section className="px-6 md:px-12 py-16 flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-7xl mx-auto">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="font-sans text-primary text-xs tracking-widest font-bold uppercase">
                LOGISTICS MANAGEMENT ENGINEER
              </span>
              <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[0.95] tracking-tight text-white italic pb-2">
                Logística,<br />
                Datos &amp; Código
              </h1>
            </div>
            <p className="text-lg md:text-xl font-sans font-light text-slate-300 max-w-2xl leading-relaxed">
              Optimización de flujos operativos mediante ingeniería de precisión y desarrollo de software personalizado. Un diario técnico sobre sistemas eficientes en Honduras.
            </p>

            <div className="flex gap-12 pt-6">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-3xl font-bold text-primary">
                  {totalArticles.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Artículos
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans text-3xl font-bold text-primary">
                  {distinctCategoriesCount.toString().padStart(2, "0")}
                </span>
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Categorías
                </span>
              </div>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative w-64 h-80 md:w-80 md:h-96 group pt-4 pr-4">
            <div className="absolute inset-0 border border-slate-400/30 transform translate-x-4 translate-y-4" />
            <div className="absolute inset-0 bg-[#e2e8f0]" />
            <div className="absolute inset-0 bg-[#162222] flex items-center justify-center overflow-hidden">
              <Image 
                src="/profile.png" 
                alt="Esdras Clother" 
                fill 
                className="object-cover object-[center_10%]" 
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: FILTER/CATEGORY BAR */}
        <section className="py-8 md:py-12 mt-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row justify-between lg:items-center gap-6 border-b border-white/5 pb-8">
            <div className="flex flex-wrap gap-3">
              {(
                ["Todos", "Logística", "Análisis de Datos", "Desarrollo"] as Category[]
              ).map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={
                      isActive
                        ? "bg-primary text-white px-5 py-2 font-sans text-[10px] uppercase tracking-widest font-bold"
                        : "bg-[#18211c] text-slate-400 px-5 py-2 font-sans text-[10px] uppercase tracking-widest hover:text-white transition-colors border border-white/5"
                    }
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-80">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-[#18211c] border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary pl-12 py-2.5 font-sans text-[10px] uppercase tracking-widest text-white outline-none rounded-none"
                placeholder="BUSCAR ARTÍCULO..."
                type="text"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: BLOG POSTS GRID */}
        <section className="px-6 md:px-12 py-8 max-w-7xl mx-auto min-h-[40vh]">
          {fetchError && articles.length === 0 ? (
            <div className="rounded-none border border-red-500 bg-red-500/10 p-6 text-sm text-red-200 mb-10">
              {fetchError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article) => {
              const category = inferCategory(article);
              return (
                <ArticleGridCard
                  key={article.id}
                  article={article}
                  category={category}
                />
              );
            })}
          </div>

          {filteredArticles.length === 0 ? (
            <div className="mt-12 text-center text-slate-400 font-sans">
              No hay resultados para tu búsqueda.
            </div>
          ) : null}
        </section>

        {/* SECTION 5: PAGINATION MOCKUP */}
        <section className="py-12 flex justify-center items-center gap-2">
           <button className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-primary text-slate-400 transition-colors">
             &lt;
           </button>
           <button className="w-10 h-10 flex items-center justify-center bg-primary text-white font-sans text-xs">
             01
           </button>
           <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white font-sans text-xs">
             02
           </button>
           <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white font-sans text-xs">
             03
           </button>
           <button className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-primary text-slate-400 transition-colors">
             &gt;
           </button>
        </section>

        {/* SECTION 6: ABOUT BLOCK */}
        <section id="about" className="bg-[#121815] py-24 mt-20 mb-12 border-y border-white/5">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
            <div className="space-y-8">
              <div className="flex justify-center mb-2">
                 <div className="w-12 h-[2px] bg-primary"></div>
              </div>
              <h2 className="text-5xl font-headline font-bold text-white italic">
                Sobre el Autor
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light font-sans mx-auto">
                Soy Esdras Clother, Ingeniero en Gestión Logística con raíces en operaciones reales de manufactura y distribución en Honduras. Combino análisis de datos, desarrollo de software y visión logística para construir herramientas que resuelven problemas que conozco de primera mano. Aquí documento lo que aprendo en ese cruce entre procesos operativos y tecnología.
              </p>
              <div className="pt-6">
                <a
                  className="inline-block bg-primary hover:bg-green-700 text-white px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-widest transition-colors"
                  href="#"
                >
                  Leer más sobre mí
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id="contact" className="sr-only">
          Contacto
        </div>

        {/* SECTION 7: FOOTER */}
        <footer className="bg-background pt-16 pb-12 px-6 md:px-12 border-t mt-auto border-t-primary/30 relative">
          {/* Subtle top border highlight */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="w-full flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="space-y-4 max-w-sm">
                <span className="text-2xl md:text-3xl font-headline text-white italic font-black tracking-tight">
                  ESDRAS CLOTHER
                </span>
                <p className="font-sans font-light text-slate-400 text-[13px] leading-relaxed">
                  Explorando las fronteras de la logística y la tecnología desde el corazón de Centroamérica.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-16 md:gap-24">
                <div className="flex flex-col gap-5">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-bold">
                    Navegación
                  </span>
                  <div className="flex flex-col gap-3">
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="/">Inicio</a>
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="/">Artículos</a>
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="#about">Sobre mí</a>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-primary font-bold">
                    Social
                  </span>
                  <div className="flex flex-col gap-3">
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="#">LinkedIn</a>
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="#">GitHub</a>
                    <a className="text-slate-400 hover:text-white font-sans text-[10px] uppercase tracking-widest transition-colors" href="#">RSS</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-slate-500">
                © {new Date().getFullYear()} ESDRAS CLOTHER. All Rights Reserved.
              </span>
              <div className="flex gap-8">
                <a className="font-sans text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors" href="#">Privacy Policy</a>
                <a className="font-sans text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors" href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

