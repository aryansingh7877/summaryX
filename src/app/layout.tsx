import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Triage • Local-First AI Chat Dashboard',
  description: 'Minimalist 2D triage dashboard solving the unread chat problem with local NLP and auto-extracted action items.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased overflow-hidden selection:bg-zinc-800 selection:text-white dark:selection:bg-zinc-200 dark:selection:text-zinc-900">
        {children}
      </body>
    </html>
  );
}
