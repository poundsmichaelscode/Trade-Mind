import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TradeMind',
  description: 'Smart finance and trading journal app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
