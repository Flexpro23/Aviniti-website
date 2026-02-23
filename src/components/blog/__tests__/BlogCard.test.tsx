import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BlogCard } from '../BlogCard';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_: unknown, tag: string) =>
      // eslint-disable-next-line react/display-name
      React.forwardRef(
        (
          {
            children,
            whileHover: _wh,
            whileTap: _wt,
            initial: _i,
            variants: _v,
            animate: _a,
            exit: _e,
            transition: _tr,
            ...props
          }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) => React.createElement(tag, { ...props, ref }, children)
      ),
  }),
}));

vi.mock('@/lib/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => React.createElement('img', { src, alt }),
}));

vi.mock('@/lib/utils/image', () => ({
  HERO_BLUR_URL:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultProps = {
  slug: 'my-first-post',
  title: 'My First Blog Post',
  excerpt: 'This is a great excerpt about the post content.',
  category: 'Technology',
  publishedAt: '2026-01-15T00:00:00.000Z',
  readingTime: 5,
  featuredImage: 'https://example.com/image.jpg',
  tags: ['AI', 'React', 'ShouldNotShow'],
  locale: 'en',
  readLabel: 'Read more',
  readingTimeLabel: '5 min read',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('BlogCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the blog post title', () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText('My First Blog Post')).toBeInTheDocument();
  });

  it('renders the excerpt text', () => {
    render(<BlogCard {...defaultProps} />);
    expect(
      screen.getByText('This is a great excerpt about the post content.')
    ).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders the read label link', () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText('Read more')).toBeInTheDocument();
  });

  it('renders formatted date that contains the year 2026', () => {
    render(<BlogCard {...defaultProps} />);
    // The formatted date for 2026-01-15 in en-US locale includes "2026"
    const dateEl = screen.getByText(/2026/);
    expect(dateEl).toBeInTheDocument();
  });

  it('renders reading time label text', () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders only the first 2 tags and not the third', () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.queryByText('ShouldNotShow')).not.toBeInTheDocument();
  });

  it('renders featured image with correct alt text when featuredImage is provided', () => {
    render(<BlogCard {...defaultProps} featuredImage="https://example.com/image.jpg" />);
    const img = screen.getByAltText('My First Blog Post');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders placeholder div (no img) when featuredImage is null', () => {
    render(<BlogCard {...defaultProps} featuredImage={null} />);
    // No <img> element should be present when there is no featured image
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    // The placeholder container should exist — the article itself is still rendered
    expect(screen.getByText('My First Blog Post')).toBeInTheDocument();
  });

  it('all post links point to /blog/my-first-post', () => {
    render(<BlogCard {...defaultProps} />);
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/blog/my-first-post');
    });
  });
});
