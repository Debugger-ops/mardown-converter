import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter',
  description: 'Convert Markdown to HTML easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>{children}</body>
    </html>
  );
}