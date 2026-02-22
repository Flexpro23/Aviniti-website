'use client';

import Image from 'next/image';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { motion } from 'framer-motion';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  featuredImage: string | null;
  tags: string[];
  locale: string;
  readLabel: string;
  readingTimeLabel: string; // "{minutes} min read" already formatted
  index?: number;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  category,
  publishedAt,
  readingTime,
  featuredImage,
  tags,
  locale,
  readLabel,
  readingTimeLabel,
  index = 0,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString(
    locale === 'ar' ? 'ar-JO' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
    >
      {/* Featured Image */}
      <Link href={`/blog/${slug}`} className="block overflow-hidden aspect-video relative bg-slate-blue flex-shrink-0">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-blue to-slate-blue-light">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center opacity-40"
              style={{ background: 'rgba(192,132,96,0.2)' }}
            >
              <Tag className="h-6 w-6 text-bronze" />
            </div>
          </div>
        )}
        {/* Category badge overlay */}
        <div className="absolute top-3 start-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm"
            style={{
              background: 'rgba(15,20,25,0.75)',
              color: '#C08460',
              border: '1px solid rgba(192,132,96,0.3)',
            }}
          >
            {category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {formattedDate}
          </span>
          <span className="h-3 w-px bg-white/10" aria-hidden="true" />
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            {readingTimeLabel}
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${slug}`} className="block mb-2 flex-1">
          <h2 className="text-base font-semibold text-off-white leading-snug group-hover:text-white transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          {/* Tags */}
          <div className="flex gap-1.5 flex-wrap">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md text-muted"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/blog/${slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-bronze hover:text-bronze-light transition-colors duration-200 flex-shrink-0"
            aria-label={`${readLabel}: ${title}`}
          >
            {readLabel}
            <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
