import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

export const Navigation: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Web direct URL route protection (Requirement 9)
  // FIXED: Do not prematurely redirect while initial session is still restoring!
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    if (isLoading) {
      return; // Wait until initial AsyncStorage / Firebase auth check concludes!
    }

    const enforceWebRouteSecurity = () => {
      const pathname = window.location.pathname;

      if (!user) {
        // User is unauthenticated: forbid direct access to /dashboard or any internal routes
        if (pathname !== '/' && pathname !== '/login') {
          console.warn('Unauthorized direct URL access intercepted. Redirecting to /login');
          window.history.replaceState(null, '', '/login');
        }
      } else {
        // User is authenticated: ensure they reside on /dashboard
        if (pathname === '/login' || pathname === '/') {
          window.history.replaceState(null, '', '/dashboard');
        }
      }
    };

    enforceWebRouteSecurity();

    window.addEventListener('popstate', enforceWebRouteSecurity);
    return () => {
      window.removeEventListener('popstate', enforceWebRouteSecurity);
    };
  }, [user, isLoading]);

  // Loading state with branded indicator
  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Protected Route Guard (Requirements 5 & 9)
  return (
    <ErrorBoundary fallbackTitle="Application Error">
      {!user ? <LoginScreen /> : <DashboardScreen />}
    </ErrorBoundary>
  );
};
