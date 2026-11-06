import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { useToast } from '../hooks/useToast';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { AlertBox } from '../components/AlertBox';
import { Card } from '../components/Card';
import { BrandHeader } from '../components/login/BrandHeader';
import { DomainSecurityBanner } from '../components/login/DomainSecurityBanner';
import { VerificationLab } from '../components/login/VerificationLab';
import { UserRole } from '../types/auth';

export const LoginScreen: React.FC = () => {
  const {
    signInWithGoogle,
    simulateGoogleSignIn,
    isAuthenticating,
    error,
    clearError,
  } = useAuth();

  const { isMobile } = useResponsive();
  const { showSuccess, showError } = useToast();

  const handleTestEmail = async (email: string, name?: string, role?: UserRole) => {
    try {
      await simulateGoogleSignIn(email, name, role);
      showSuccess(`Welcome back, ${name || email}!`, 'Authentication Success');
    } catch (err: any) {
      showError(err.message, 'Domain Blocked');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      showSuccess('Google identity verified with @hbplus.fit', 'Access Granted');
    } catch (err: any) {
      showError(err.message, 'Sign-In Failed');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, isMobile ? styles.containerMobile : styles.containerDesktop]}>
          <Card style={styles.card}>
            {/* Modular Brand Header */}
            <BrandHeader />

            {/* Modular Domain Whitelist Banner */}
            <DomainSecurityBanner />

            {/* Error Message Box (Requirement 3: Exact error display) */}
            {error ? (
              <AlertBox
                type="error"
                title="Authentication Error"
                message={error}
                onDismiss={clearError}
              />
            ) : null}

            {/* Official Google Sign-In Button */}
            <View style={styles.actionSection}>
              <Text style={styles.sectionLabel}>Sign In with Google Workspace</Text>
              <GoogleSignInButton
                onPress={handleGoogleSignIn}
                loading={isAuthenticating}
                disabled={isAuthenticating}
                title="Continue with Google"
              />
            </View>

            {/* Security Guarantee */}
            <View style={styles.securityFooter}>
              <Text style={styles.securityFooterText}>
                🔐 Secured by Firebase Authentication & OAuth 2.0 PKCE protocol. All sessions are cryptographically validated.
              </Text>
            </View>

            {/* Modular Verification Test Lab */}
            <VerificationLab
              onTestEmail={handleTestEmail}
              isAuthenticating={isAuthenticating}
            />
          </Card>

          <Text style={styles.copyrightText}>
            © 2026 HB+ Fit Inc. Single Codebase for Android, iOS & Web.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  containerMobile: {
    maxWidth: '100%',
  },
  containerDesktop: {
    maxWidth: 540,
  },
  card: {
    width: '100%',
    padding: 28,
  },
  actionSection: {
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  securityFooter: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  securityFooterText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  copyrightText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
  },
});
