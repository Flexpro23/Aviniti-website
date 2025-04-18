import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'AI & App Development Insights | Aviniti Blog',
  description: 'Explore the latest trends, insights, and best practices in AI app development, custom software solutions, and digital transformation.',
  keywords: 'AI app development blog, software development insights, mobile app trends, AI technology, digital transformation',
};

export default function BlogPage() {
  return <BlogClient />;
} 