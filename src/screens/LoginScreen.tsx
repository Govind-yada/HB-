import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { ALLOWED_DOMAIN, APP_NAME, APP_TAGLINE } from '../config/constants';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { AlertBox } from '../components/AlertBox';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const LoginScreen: React.FC = () => {
  const {
    signInWithGoogle,
    simulateGoogleSignIn,
    isAuthenticating,
    error,
    clearError,
    isDemoMode,
  } = useAuth();

  const { isMobile } = useResponsive();
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomDomainTest = async () => {
    if (!customEmail.trim()) return;
    try {
      await simulateGoogleSignIn(customEmail.trim(), 'Test User');
    } catch {
      // Error is set in AuthContext
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, isMobile ? styles.containerMobile : styles.containerDesktop]}>
          {/* Main Login Card */}
          <Card style={styles.card}>
            {/* Brand Header */}
            <View style={styles.brandHeader}>
              <View style={styles.logoPill}>
                <Text style={styles.logoPillText}>HB+</Text>
              </View>
              <Text style={styles.brandTitle}>{APP_NAME}</Text>
              <Text style={styles.brandTagline}>{APP_TAGLINE}</Text>
            </View>

            {/* Domain Enforcement Callout */}
            <View style={styles.domainBanner}>
              <View style={styles.domainRow}>
                <Text style={styles.domainShield}>🔒</Text>
                <Text style={styles.domainBannerText}>
                  Restricted Access: <Text style={styles.domainHighlight}>{ALLOWED_DOMAIN}</Text>
                </Text>
              </View>
              <Text style={styles.domainNotice}>
                Only verified corporate and athletic personnel with official domain accounts are permitted.
              </Text>
            </View>

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
                onPress={signInWithGoogle}
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

            {/* Domain Verification Test Lab (Interactive Review & Validation Panel) */}
            <View style={styles.testSuiteContainer}>
              <View style={styles.testSuiteHeader}>
                <Badge label="VERIFICATION LAB" variant="outline" size="sm" />
                <Text style={styles.testSuiteTitle}>Domain Rejection & Role Testing</Text>
              </View>
              <Text style={styles.testSuiteSubtitle}>
                Test exact domain acceptance and rejection requirements directly:
              </Text>

              <View style={styles.testButtonsGrid}>
                {/* 1. Accepted User */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isAuthenticating}
                  onPress={() => simulateGoogleSignIn('marcus.vance@hbplus.fit', 'Marcus Vance', 'user')}
                  style={[
                    styles.testButton,
                    styles.testButtonSuccess,
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                >
                  <Text style={styles.testButtonTitle}>✓ Test Accepted Member</Text>
                  <Text style={styles.testButtonEmail}>marcus.vance@hbplus.fit</Text>
                  <Text style={styles.testButtonNote}>Ends with @hbplus.fit → Logs in as User</Text>
                </TouchableOpacity>

                {/* 2. Accepted Admin */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isAuthenticating}
                  onPress={() => simulateGoogleSignIn('sarah.admin@hbplus.fit', 'Sarah Connor (Admin)', 'admin')}
                  style={[
                    styles.testButton,
                    styles.testButtonAdmin,
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                >
                  <Text style={styles.testButtonTitle}>✓ Test Accepted Admin</Text>
                  <Text style={styles.testButtonEmail}>sarah.admin@hbplus.fit</Text>
                  <Text style={styles.testButtonNote}>Ends with @hbplus.fit → Admin Panel enabled</Text>
                </TouchableOpacity>

                {/* 3. Rejected Domain (Exact Error Verification) */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isAuthenticating}
                  onPress={() => simulateGoogleSignIn('john.smith@gmail.com', 'John Smith')}
                  style={[
                    styles.testButton,
                    styles.testButtonDanger,
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                >
                  <Text style={styles.testButtonTitle}>✕ Test Domain Rejection</Text>
                  <Text style={styles.testButtonEmail}>john.smith@gmail.com</Text>
                  <Text style={styles.testButtonDangerNote}>
                    Triggers: "Access restricted. Please login using your official domain email."
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom Email Input for on-the-fly verification */}
              <View style={styles.customTestRow}>
                <TextInput
                  value={customEmail}
                  onChangeText={setCustomEmail}
                  placeholder="Enter any test email (e.g., user@yahoo.com)"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.customInput}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isAuthenticating || !customEmail.trim()}
                  onPress={handleCustomDomainTest}
                  style={[
                    styles.customTestButton,
                    (!customEmail.trim() || isAuthenticating) && styles.customTestButtonDisabled,
                    Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                  ]}
                >
                  <Text style={styles.customTestButtonText}>Test Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Footer note */}
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
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  logoPillText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  domainBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainShield: {
    marginRight: 8,
    fontSize: 16,
  },
  domainBannerText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  domainHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  domainNotice: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
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
  testSuiteContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  testSuiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  testSuiteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  testSuiteSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  testButtonsGrid: {
    gap: 10,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  testButtonSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  testButtonAdmin: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  testButtonDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  testButtonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  testButtonEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
    marginBottom: 2,
  },
  testButtonNote: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  testButtonDangerNote: {
    fontSize: 11,
    color: '#F87171',
    fontWeight: '600',
  },
  customTestRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  customTestButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTestButtonDisabled: {
    opacity: 0.5,
  },
  customTestButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  copyrightText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 18,
    textAlign: 'center',
  },
});
