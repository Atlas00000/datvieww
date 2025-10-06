import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataViz Proto - Interactive Data Visualization',
  description: 'Interactive WebGL + D3.js data visualization application',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
