export default function manifest() {
  return {
    name: "Minha Bíblia Diária",
    short_name: "Bíblia Diária",
    description: "Leitura de 30 dias, orações e lembretes às 7h e às 23h.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1d2a5c",
    theme_color: "#1d2a5c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [{ name: "Orações", url: "/?tab=oracoes", icons: [{ src: "/icon-192.png", sizes: "192x192" }] }],
  };
}
