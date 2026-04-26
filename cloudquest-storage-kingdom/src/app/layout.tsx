import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudQuest: Storage Kingdom | Learn Cloud Storage Through Adventure",
  description: "An educational game where you become a Cloud Guardian, protecting and organizing a digital kingdom while learning cloud storage concepts through interactive missions.",
  keywords: "cloud storage, educational game, AWS S3, storage classes, bucket policy, learning game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Inter',sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
