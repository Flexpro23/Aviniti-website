import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" dir="ltr" className="dark" suppressHydrationWarning>
      <body className="bg-navy text-off-white antialiased">{children}</body>
    </html>
  );
}
