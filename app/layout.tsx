import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Quizlet usa Hurme Geometric Sans No.2 (fuente comercial); Outfit es la
// geométrica libre más parecida y se usa para títulos y texto por igual.
const font = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mise en Place · Inglés de cocina",
  description:
    "Aprende inglés de cocina nivel principiante con tarjetas, quiz, parejas, dictado y glosario en español.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mise en Place" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a092d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={font.variable} suppressHydrationWarning>
      <head>
        <script
          // Aplica el tema guardado antes del primer pintado para evitar el parpadeo.
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("chefen.theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
