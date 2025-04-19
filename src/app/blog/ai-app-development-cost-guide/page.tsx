import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

export const metadata: Metadata = {
  title: 'The Complete Guide to AI App Development Costs in 2025 | Aviniti',
  description: 'Discover the key factors that influence AI app development costs in 2025, from complexity and features to maintenance and scalability considerations.',
  keywords: 'AI app development cost, custom AI application pricing, mobile app budget, software development expenses, AI integration cost',
};

export default function BlogPostPage() {
  return <BlogPostClient postId="costGuide" />;
} 