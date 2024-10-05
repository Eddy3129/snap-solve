// app/(dashboard)/layout.tsx

'use client'; // Correct placement at the top

import { Analytics } from '@vercel/analytics/react';
import { Wallet } from '@/components/wallet/Wallet';
import Navbar from './navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <Wallet>
        <main className="flex min-h-screen w-full flex-col bg-darkBg font-cyberpunk">
          <Navbar onSearch={handleSearch} onLocateUser={handleLocateUser} />
          <div className="flex flex-col flex-1">{children}</div>
          <Analytics />
        </main>
      </Wallet>
  );
}

// Define the handler functions
function handleSearch(query: string): void {
  // Implement your search logic here
  console.log('Search query:', query);
}

function handleLocateUser(): void {
  // Implement your locate user logic here
  console.log('Locate user triggered');
}
