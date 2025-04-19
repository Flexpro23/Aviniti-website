import { Metadata } from 'next';
// Import the dynamic client (adjust path if necessary, assuming it's in the cost guide dir for now)
import BlogPostClient from '../ai-app-development-cost-guide/BlogPostClient'; 

export const metadata: Metadata = {
  title: 'How to Successfully Integrate AI into Legacy Business Systems | Aviniti',
  description: 'Learn practical strategies for incorporating AI capabilities into existing business systems without disrupting operations.',
  keywords: 'AI integration, legacy systems, business automation, digital transformation, AI strategy',
};

export default function AiIntegrationPage() {
  // Pass the postId to the dynamic client component
  return <BlogPostClient postId="integration" />;
} 