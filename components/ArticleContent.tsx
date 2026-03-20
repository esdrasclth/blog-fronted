import ReactMarkdown from 'react-markdown';

interface ArticleContentProps {
  content: string;
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-6 mt-12 text-3xl font-headline font-bold text-white italic">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-4 mt-10 text-2xl font-headline font-bold text-white italic">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-3 mt-8 text-xl font-headline font-bold text-white">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-6 leading-relaxed text-slate-300 font-sans font-light">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-primary hover:text-green-400 transition-colors underline decoration-primary/30 underline-offset-4"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-6 list-inside list-disc space-y-2 text-slate-300 font-sans font-light marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-6 list-inside list-decimal space-y-2 text-slate-300 font-sans font-light marker:text-primary">
      {children}
    </ol>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-white">{children}</strong>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-primary pl-6 my-8 italic text-slate-400">
      {children}
    </blockquote>
  )
};

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  );
}
