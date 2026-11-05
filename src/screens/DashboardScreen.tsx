import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { Navbar } from '../components/Navbar';
import { UserProfileCard } from '../components/UserProfileCard';
import { AdminPanel } from '../components/AdminPanel';
import { SessionDetailsCard } from '../components/SessionDetailsCard';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const DashboardScreen: React.FC = () => {
  const { user, signOut, isAuthenticating, refreshUserProfile } = useAuth();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) {
    return null; // Protected route will redirect to Login
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserProfile();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isAdmin = user.role === 'admin';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar onLogoutPress={signOut} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        <View style={styles.mainContainer}>
          {/* Welcome Banner */}
          <View style={styles.welcomeBanner}>
            <View style={styles.welcomeLeft}>
              <View style={styles.domainTag}>
                <Text style={styles.domainDot}>●</Text>
                <Text style={styles.domainTagText}>HB+ FIT SECURE INTRANET</Text>
              </View>
              <Text style={styles.welcomeTitle}>
                Welcome back, {user.displayName ? user.displayName.split(' ')[0] : 'Team Member'}!
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Access granted to official athletic operations, member analytics, and enterprise resources.
              </Text>
            </View>

            <View style={styles.welcomeActions}>
              <TouchableOpacity
                onPress={handleRefresh}
                disabled={isRefreshing}
                style={[
                  styles.actionButton,
                  Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                ]}
              >
                {isRefreshing ? (
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                ) : (
                  <Text style={styles.actionButtonText}>↻ Refresh Data</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={signOut}
                disabled={isAuthenticating}
                style={[
                  styles.logoutActionButton,
                  Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
                ]}
              >
                <Text style={styles.logoutActionText}>
                  {isAuthenticating ? 'Exiting...' : 'Sign Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsGrid, isMobile && styles.metricsGridMobile]}>
            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Security Status</Text>
              <View style={styles.metricValueRow}>
                <Text style={[styles.metricValue, { color: colors.success }]}>Authenticated</Text>
                <Badge label="SSL/TLS" variant="user" size="sm" />
              </View>
              <Text style={styles.metricDesc}>Token validated via Firebase Auth</Text>
            </Card>

            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Authorized Domain</Text>
              <View style={styles.metricValueRow}>
                <Text style={[styles.metricValue, { color: '#38BDF8' }]}>@hbplus.fit</Text>
                <Badge label="Strict" variant="domain" size="sm" />
              </View>
              <Text style={styles.metricDesc}>Corporate email whitelist enforcement</Text>
            </Card>

            <Card style={styles.metricCard}>
              <Text style={styles.metricLabel}>Assigned Role</Text>
              <View style={styles.metricValueRow}>
                <Text
                  style={[
                    styles.metricValue,
                    { color: isAdmin ? colors.adminBadgeText : colors.userBadgeText },
                  ]}
                >
                  {isAdmin ? 'Administrator' : 'Standard User'}
                </Text>
                <Badge
                  label={isAdmin ? 'LEVEL 1' : 'LEVEL 3'}
                  variant={isAdmin ? 'admin' : 'user'}
                  size="sm"
                />
              </View>
              <Text style={styles.metricDesc}>
                {isAdmin ? 'Full database & user administration' : 'Standard athlete & workout portal'}
              </Text>
            </Card>
          </View>

          {/* Main User Profile Card (Core Requirement) */}
          <UserProfileCard user={user} />

          {/* Role-Based Section */}
          {isAdmin ? (
            /* Admin Panel Bonus Feature */
            <AdminPanel currentUser={user} />
          ) : (
            /* Standard Member Portal View */
            <Card style={styles.memberPortalCard}>
              <View style={styles.memberPortalHeader}>
                <Badge label="MEMBER PORTAL" variant="user" size="sm" />
                <Text style={styles.memberPortalTitle}>HB+ Athletic Program & Performance Hub</Text>
              </View>
              <Text style={styles.memberPortalDesc}>
                As a verified member of the <Text style={styles.highlightText}>hbplus.fit</Text> athletic ecosystem, your workout metrics, biometric schedules, and nutrition regimens are synchronized.
              </Text>

              <View style={[styles.programsGrid, isMobile && styles.programsGridMobile]}>
                <View style={styles.programItem}>
                  <Text style={styles.programIcon}>🏃</Text>
                  <Text style={styles.programTitle}>Endurance Tracking</Text>
                  <Text style={styles.programStatus}>Active Sync</Text>
                </View>
                <View style={styles.programItem}>
                  <Text style={styles.programIcon}>🥗</Text>
                  <Text style={styles.programTitle}>Nutritional Plan</Text>
                  <Text style={styles.programStatus}>Assigned</Text>
                </View>
                <View style={styles.programItem}>
                  <Text style={styles.programIcon}>📊</Text>
                  <Text style={styles.programTitle}>Body Composition</Text>
                  <Text style={styles.programStatus}>Updated Today</Text>
                </View>
              </View>
            </Card>
          )}

          {/* Session & Architecture Diagnostics Card */}
          <SessionDetailsCard email={user.email} providerId={user.providerId} />
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
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scrollContentDesktop: {
    paddingHorizontal: 32,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1080,
  },
  welcomeBanner: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  welcomeLeft: {
    flex: 1,
    minWidth: 280,
  },
  domainTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  domainDot: {
    color: colors.success,
    fontSize: 10,
  },
  domainTagText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  welcomeActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: colors.surfaceHover,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  logoutActionButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutActionText: {
    color: '#F87171',
    fontWeight: '600',
    fontSize: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metricsGridMobile: {
    flexDirection: 'column',
  },
  metricCard: {
    flex: 1,
    padding: 18,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  memberPortalCard: {
    padding: 24,
    marginTop: 20,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1.5,
  },
  memberPortalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  memberPortalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  memberPortalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
  },
  highlightText: {
    color: colors.success,
    fontWeight: '700',
  },
  programsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  programsGridMobile: {
    flexDirection: 'column',
  },
  programItem: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  programIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  programStatus: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
});
