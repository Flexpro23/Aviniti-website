import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { Components } from 'react-markdown';

interface BlogPostContentProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-0 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="text-2xl font-bold text-white mb-4 mt-10 leading-snug border-b pb-2"
      style={{ borderColor: 'rgba(192,132,96,0.2)' }}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="text-xl font-semibold text-off-white mb-3 mt-8 leading-snug">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-muted leading-relaxed mb-5 text-base">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-off-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-light">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-bronze hover:text-bronze-light underline underline-offset-2 transition-colors duration-200"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 mb-5 ms-4 list-disc marker:text-bronze">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 mb-5 ms-4 list-decimal marker:text-bronze">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-muted leading-relaxed ps-1">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="border-s-4 ps-5 py-2 my-6 italic"
      style={{
        borderColor: '#C08460',
        background: 'rgba(192,132,96,0.06)',
        borderRadius: '0 8px 8px 0',
      }}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code
          className={`block p-4 rounded-xl text-sm font-mono overflow-x-auto mb-5 text-green-300 ${className}`}
          style={{ background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1.5 py-0.5 rounded text-sm font-mono text-bronze"
        style={{ background: 'rgba(192,132,96,0.12)' }}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-5 overflow-x-auto">{children}</pre>
  ),
  hr: () => (
    <hr className="my-10 border-0 h-px" style={{ background: 'rgba(192,132,96,0.2)' }} />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ background: 'rgba(192,132,96,0.08)' }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-start px-4 py-3 font-semibold text-off-white border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-muted border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      {children}
    </td>
  ),
};

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose-blog max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
