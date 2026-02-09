import type { ReactNode } from 'react';
import type { Metadata } from 'next';

type Props = {
  children: ReactNode;
};

export const metadata: Metadata = {
  alternates: {
    languages: {
      'en': 'https://www.aviniti.app/en',
      'ar': 'https://www.aviniti.app/ar',
    },
  },
};

export default function RootLayout({ children }: Props) {
  return children;
}
