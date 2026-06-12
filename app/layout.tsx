import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Central 4noobs",
  description:
    "Hub de apoio para iniciantes encontrarem materiais 4noobs, trilhas de estudo e links da comunidade He4rt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="remove-extension-hydration-attributes"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var blockedAttributes = ["cz-shortcut-listen"];

                function clean(node) {
                  if (!node || !node.removeAttribute) return;
                  blockedAttributes.forEach(function (attribute) {
                    node.removeAttribute(attribute);
                  });
                }

                clean(document.documentElement);
                clean(document.body);

                var observer = new MutationObserver(function (mutations) {
                  mutations.forEach(function (mutation) {
                    clean(mutation.target);
                  });
                });

                observer.observe(document.documentElement, {
                  attributes: true,
                  childList: true,
                  subtree: true
                });

                window.addEventListener("load", function () {
                  clean(document.documentElement);
                  clean(document.body);
                  observer.disconnect();
                });
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
