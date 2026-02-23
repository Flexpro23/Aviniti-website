/**
 * Route-level loading skeleton
 *
 * Shown by Next.js while a page segment is being streamed / fetched.
 * Keeps the layout stable (navbar + footer are already rendered) and
 * provides a visual heartbeat so the page never looks broken.
 */

export default function Loading() {
  return (
    <div
      className="min-h-[70vh] w-full px-4 py-20 animate-pulse"
      aria-hidden="true"
      role="presentation"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hero block */}
        <div className="space-y-4 text-center">
          <div className="h-4 w-24 bg-slate-blue-light/30 rounded-full mx-auto" />
          <div className="h-10 w-3/4 bg-slate-blue-light/20 rounded-lg mx-auto" />
          <div className="h-10 w-1/2 bg-slate-blue-light/20 rounded-lg mx-auto" />
          <div className="h-5 w-2/3 bg-slate-blue-light/15 rounded mx-auto mt-2" />
          <div className="h-5 w-1/2 bg-slate-blue-light/15 rounded mx-auto" />
        </div>

        {/* CTA buttons */}
        <div className="flex justify-center gap-4 pt-2">
          <div className="h-12 w-40 bg-bronze/20 rounded-full" />
          <div className="h-12 w-36 bg-slate-blue-light/20 rounded-full" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-slate-blue-light/10 overflow-hidden"
            >
              <div className="aspect-video bg-slate-blue-light/20" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-blue-light/20 rounded" />
                <div className="h-4 w-full bg-slate-blue-light/15 rounded" />
                <div className="h-4 w-5/6 bg-slate-blue-light/15 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
