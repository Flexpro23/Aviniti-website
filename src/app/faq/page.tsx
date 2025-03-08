import { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions About AI & App Development | Aviniti',
  description: 'Get answers to common questions about AI app development, custom software solutions, and mobile app development services provided by Aviniti.',
  keywords: 'AI app development FAQ, software development questions, mobile app cost, AI integration, custom software FAQ',
};

export default function FAQPage() {
  return <FAQClient />;
} 