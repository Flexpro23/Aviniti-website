'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { BlogCard } from './BlogCard';
import type { BlogPostSummary } from '@/lib/firebase/blog';

interface BlogGridProps {
  posts: BlogPostSummary[];
  categories: string[];
}

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  const allCategories = ['all', ...categories];

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('page.search_placeholder')}
            className="w-full rounded-xl ps-11 pe-11 py-3 text-sm text-off-white placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50 transition-all"
            style={{
              background: 'rgba(26,35,50,0.6)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              aria-label={t('page.aria_clear_search')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      {allCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat;
            const labelKey = `page.categories.${cat.toLowerCase()}`;
            let label: string;
            try {
              label = t(labelKey);
            } catch {
              label = cat;
            }
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
                style={
                  isActive
                    ? { background: '#C08460', color: '#0F1419' }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        color: '#9CA3AF',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, i) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              publishedAt={post.publishedAt}
              readingTime={post.readingTime}
              featuredImage={post.featuredImage}
              tags={post.tags}
              locale={locale}
              readLabel={t('post.read')}
              readingTimeLabel={t('post.reading_time', { minutes: post.readingTime })}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted text-lg">
            {searchQuery ? t('page.search_no_results') : t('empty.title')}
          </p>
          {!searchQuery && (
            <p className="text-muted/70 text-sm mt-2">{t('empty.description')}</p>
          )}
        </div>
      )}
    </div>
  );
}
