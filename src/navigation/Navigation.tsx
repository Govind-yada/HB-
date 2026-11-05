import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { colors } from '../theme/colors';
import { APP_NAME } from '../config/constants';

export const Navigation: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Web direct URL route protection (Requirement 9)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
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

    // Listen to browser forward/back buttons
    window.addEventListener('popstate', enforceWebRouteSecurity);
    return () => {
      window.removeEventListener('popstate', enforceWebRouteSecurity);
    };
  }, [user]);

  // Loading state with branded indicator
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoPill}>
          <Text style={styles.logoPillText}>HB+</Text>
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
        <Text style={styles.loadingText}>Verifying domain session & security credentials...</Text>
      </View>
    );
  }

  // Protected Route Guard (Requirement 5 & 9)
  // If user is null or email domain is unverified, strictly show LoginScreen
  if (!user) {
    return <LoginScreen />;
  }

  // Authorized user present: grant access to DashboardScreen
  return <DashboardScreen />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoPill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
  },
  logoPillText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  appName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
