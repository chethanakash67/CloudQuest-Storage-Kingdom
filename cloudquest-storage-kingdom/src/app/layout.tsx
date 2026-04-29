import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudQuest: Storage Kingdom | Learn GCP Cloud Storage Through Adventure",
  description: "An educational game where you become a GCP Storage Guardian, protecting and organizing a digital kingdom while learning Google Cloud Storage concepts through interactive missions.",
  keywords: "GCP Cloud Storage, Google Cloud Storage, educational game, storage classes, GCP IAM, learning game",
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
