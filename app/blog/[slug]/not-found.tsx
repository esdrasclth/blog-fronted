import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Artículo no encontrado
      </h1>
      <Link
        href="/"
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
