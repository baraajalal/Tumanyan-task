// src/app/layout.tsx

import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'Example app using local IBMPlexSansArabic font',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
