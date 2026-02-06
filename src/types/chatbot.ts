// Chatbot types for the Avi assistant

/** Chat message interface */
export interface ChatMessage {
  /** Unique message ID */
  id: string;

  /** Message sender role */
  role: 'user' | 'assistant';

  /** Message text content */
  content: string;

  /** Unix timestamp in milliseconds */
  timestamp: number;

  /** Optional quick reply button options */
  quickReplies?: string[];

  /** Optional suggested link cards */
  suggestedLinks?: ChatSuggestedLink[];
}

/** Suggested link for chat messages */
export interface ChatSuggestedLink {
  /** Link display label */
  label: string;

  /** Link URL (internal or external) */
  href: string;
}

/** Chatbot widget state */
export type ChatbotState = 'idle' | 'open' | 'minimized' | 'typing';
