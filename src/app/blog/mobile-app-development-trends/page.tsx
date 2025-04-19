import { Metadata } from 'next';
// Import the dynamic client (adjust path if necessary)
import BlogPostClient from '../ai-app-development-cost-guide/BlogPostClient';

export const metadata: Metadata = {
  title: 'Mobile App Development Trends Reshaping User Experience in 2025 | Aviniti',
  description: 'Discover the latest trends in mobile app development that are creating more engaging and personalized user experiences.',
  keywords: 'mobile app trends, user experience, app development 2025, personalized apps, mobile technology',
};

export default function MobileTrendsPage() {
  // Pass the postId to the dynamic client component
  return <BlogPostClient postId="trends" />;
} 