import "./globals.css";

export const metadata = {
  title: "Аудит ТС — КТЖ / Самрук-Қазына",
  description: "Аудит технической спецификации на соответствие Порядку закупок Самрук-Қазына и Правилам КТЖ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
