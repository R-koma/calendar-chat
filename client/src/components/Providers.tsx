'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { FriendsProvider } from '@/contexts/FriendsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const isAuthPage = ['/login', '/register'].includes(pathname);
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    // ログインページや新規登録ページでは、プロバイダーを適用しない
    return children;
  }

  return (
    <AuthProvider>
      <FriendsProvider>{children}</FriendsProvider>
    </AuthProvider>
  );
}
