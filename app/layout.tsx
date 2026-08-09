import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Everything Must Go | Luxury marketplace",
  description:
    "Everything Must Go is a luxury ecommerce marketplace for premium electronics, fashion, beauty, home, and studio essentials.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
