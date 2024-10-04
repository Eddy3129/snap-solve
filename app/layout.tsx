import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Wallet } from '@/components/wallet/Wallet';
import { Orbitron } from 'next/font/google';

export const metadata = {
  title: 'SnapSolve',
  description: 'A blockchain powered urban petition app.'
};

// Load the Orbitron font using next/font
const orbitron = Orbitron({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply orbitron.className to body */}
      <body className={`flex min-h-screen w-full flex-col ${orbitron.className}`}>
        <Wallet>{children}</Wallet>
        <Analytics />
      </body>
    </html>
  );
}
