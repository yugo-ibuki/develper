import './globals.css';
import { Providers } from '@/app/Providers';
import NavigationHeader from '@/components/NavigationHeader';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'develper',
  description: 'Helper for all developers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          <NavigationHeader />
          {children}
        </body>
      </Providers>
    </html>
  );
}
