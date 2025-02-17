import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meme Archieve",
  description: "Universal meme storage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
