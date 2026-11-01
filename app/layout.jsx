import "./globals.css";

export const metadata = {
  title: "Minha Bíblia Diária",
  description: "Plano de leitura de 30 dias com o texto completo, orações e lembretes.",
  applicationName: "Minha Bíblia Diária",
  appleWebApp: { capable: true, title: "Bíblia Diária", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};
export const viewport = { themeColor: "#1d2a5c", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
