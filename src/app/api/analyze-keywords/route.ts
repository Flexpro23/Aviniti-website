import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description || description.trim().length < 10) {
      return NextResponse.json({ keywords: [] });
    }

    // Simple keyword extraction - you can enhance this with a more sophisticated NLP library
    const keywords = extractKeywords(description);
    
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("Keyword analysis error:", error);
    return NextResponse.json({ keywords: [] });
  }
}

function extractKeywords(text: string): string[] {
  // Common app-related keywords to highlight
  const appKeywords = [
    'tracking', 'payment', 'profile', 'dashboard', 'notification', 'chat', 'message',
    'user', 'admin', 'authentication', 'login', 'register', 'social', 'share',
    'map', 'location', 'gps', 'camera', 'photo', 'video', 'upload', 'download',
    'search', 'filter', 'rating', 'review', 'booking', 'reservation', 'calendar',
    'real-time', 'live', 'streaming', 'analytics', 'report', 'export', 'import',
    'subscription', 'premium', 'freemium', 'monetization', 'ads', 'revenue',
    'api', 'integration', 'sync', 'cloud', 'database', 'offline', 'push',
    'security', 'encryption', 'backup', 'restore', 'settings', 'preferences',
    'ecommerce', 'marketplace', 'shopping', 'cart', 'checkout', 'delivery',
    'fitness', 'health', 'education', 'learning', 'social media', 'dating',
    'food', 'restaurant', 'travel', 'hotel', 'transportation', 'rideshare',
    'gaming', 'entertainment', 'music', 'podcast', 'news', 'weather',
    'productivity', 'task', 'project', 'team', 'collaboration', 'workflow'
  ];

  const textLower = text.toLowerCase();
  const foundKeywords: string[] = [];

  appKeywords.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  // Also look for compound phrases
  const phrases = [
    'user authentication', 'push notifications', 'real-time chat', 'payment gateway',
    'social login', 'in-app purchases', 'offline mode', 'cloud sync',
    'admin dashboard', 'user profiles', 'content management', 'live streaming'
  ];

  phrases.forEach(phrase => {
    if (textLower.includes(phrase.toLowerCase())) {
      foundKeywords.push(phrase);
    }
  });

  // Remove duplicates and return first 8 keywords
  return [...new Set(foundKeywords)].slice(0, 8);
}