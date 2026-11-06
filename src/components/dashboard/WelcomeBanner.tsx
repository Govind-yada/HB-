import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface WelcomeBannerProps {
  displayName?: string | null;
  onRefresh: () => void;
  onSignOut: () => void;
  isRefreshing: boolean;
  isLoggingOut: boolean;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  displayName,
  onRefresh,
  onSignOut,
  isRefreshing,
  isLoggingOut,
}) => {
  const firstName = displayName ? displayName.split(' ')[0] : 'Team Member';

  return (
    <View style={styles.welcomeBanner}>
      <View style={styles.welcomeLeft}>
        <View style={styles.domainTag}>
          <Text style={styles.domainDot}>●</Text>
          <Text style={styles.domainTagText}>HB+ FIT SECURE INTRANET</Text>
        </View>
        <Text style={styles.welcomeTitle}>Welcome back, {firstName}!</Text>
        <Text style={styles.welcomeSubtitle}>
          Access granted to official athletic operations, member analytics, and enterprise resources.
        </Text>
      </View>

      <View style={styles.welcomeActions}>
        <TouchableOpacity
          onPress={onRefresh}
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
          onPress={onSignOut}
          disabled={isLoggingOut}
          activeOpacity={0.8}
          style={[
            styles.logoutActionButton,
            isLoggingOut && styles.logoutActionDisabled,
            Platform.OS === 'web' && ({ cursor: isLoggingOut ? 'not-allowed' : 'pointer' } as any),
          ]}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#F87171" style={styles.btnLoader} />
          ) : null}
          <Text style={styles.logoutActionText}>
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutActionDisabled: {
    opacity: 0.6,
  },
  btnLoader: {
    marginRight: 6,
  },
  logoutActionText: {
    color: '#F87171',
    fontWeight: '600',
    fontSize: 13,
  },
});
