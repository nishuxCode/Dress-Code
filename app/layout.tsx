import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Uniform Scanner',
  description: 'College Uniform Compliance System',
};
