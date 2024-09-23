'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { FriendsProvider } from '@/contexts/FriendsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return children;
  }

  return (
    <AuthProvider>
      <FriendsProvider>{children}</FriendsProvider>
    </AuthProvider>
  );
}
