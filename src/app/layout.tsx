import "./globals.css";

export const metadata = {
  title: "بودكاست",
  description: "واجهة بحث وعرض البودكاستات",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body style={{ fontFamily: "IBMPlexSansArabic, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
