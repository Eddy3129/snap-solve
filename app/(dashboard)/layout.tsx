// DashboardLayout.tsx
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import Providers from './providers';
import { Wallet } from '@/components/Wallet';
import { DesktopNav, MobileNav } from './Navigation';

const WalletClient = dynamic(() => import('@/components/WalletClient'), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Wallet>
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
          <DesktopNav />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <MobileNav />
              <div className="flex items-center gap-4">
                <WalletClient />
              </div>
            </header>
            <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
              {children}
            </main>
          </div>
          <Analytics />
        </main>
      </Wallet>
    </Providers>
  );
}