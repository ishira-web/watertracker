// water-tracker-client/components/auth-guard.tsx

"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 1. Check for the token
    const token = localStorage.getItem('token');

    if (!token) {
      // 2. If token is NOT found, redirect to the login page
      router.push('/login');
    } else {
      // 3. If token IS found, allow the content to be rendered
      // NOTE: In a production app, you would also validate the token expiration here.
      setIsAuthenticated(true);
    }
  }, [router]);

  // While checking the token, render nothing or a loading spinner
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Redirecting to login...</div>;
  }

  // If authenticated, render the children (the protected page content)
  return <>{children}</>;
};