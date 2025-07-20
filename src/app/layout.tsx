import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import AuthGuard from './AuthGuard';
import { MainLayout } from '@/components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Petstore',
  description: 'Petstore application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthGuard>
            <MainLayout>
              {children}
            </MainLayout>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}