'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Loader2 } from 'lucide-react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const { fetchUser, isAuthenticated, isHydrated } = useAuthStore();
  const [authInitialized, setAuthInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize auth state after hydration
  useEffect(() => {
    const initAuth = async () => {
      if (isHydrated && mounted) {
        if (isAuthenticated) {
          try {
            await fetchUser();
          } catch {
            // Token expired or invalid, user will be logged out
          }
        }
        setAuthInitialized(true);
      }
    };
    initAuth();
  }, [isHydrated, isAuthenticated, fetchUser, mounted]);

  // Show loading state until auth is initialized (only on client)
  if (!mounted || !authInitialized) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5]">
          <Loader2 className="h-8 w-8 animate-spin text-[#F5C94C]" />
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
