import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { UserProfile } from '../types/auth';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Card } from './Card';
import { useResponsive } from '../hooks/useResponsive';

interface UserProfileCardProps {
  user: UserProfile;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const { isMobile } = useResponsive();

  const formatDate = (dateStr?: string | number | null): string => {
    if (!dateStr) return 'Active session';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={[styles.headerRow, isMobile && styles.headerRowMobile]}>
        <View style={styles.avatarWrapper}>
          <Avatar
            photoURL={user.photoURL}
            name={user.displayName || user.email}
            size={isMobile ? 70 : 88}
          />
          <View style={styles.statusIndicator} />
        </View>

        <View style={[styles.metaContainer, isMobile && styles.metaContainerMobile]}>
          <View style={styles.badgeGroup}>
            <Badge
              label={user.role === 'admin' ? 'ADMINISTRATOR' : 'TEAM MEMBER'}
              variant={user.role === 'admin' ? 'admin' : 'user'}
            />
            <Badge label="DOMAIN VERIFIED" variant="domain" size="sm" />
          </View>

          <Text style={styles.displayName}>
            {user.displayName || user.email.split('@')[0]}
          </Text>

          <Text style={styles.emailText}>{user.email}</Text>

          <View style={styles.domainCallout}>
            <Text style={styles.domainCalloutText}>
              ✓ Verified Organization: <Text style={styles.domainHighlight}>hbplus.fit</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.detailsGrid, isMobile && styles.detailsGridMobile]}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Authentication Provider</Text>
          <Text style={styles.detailValue}>Google OAuth 2.0 (Firebase)</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>User Role</Text>
          <Text
            style={[
              styles.detailValue,
              { color: user.role === 'admin' ? colors.adminBadgeText : colors.userBadgeText },
            ]}
          >
            {user.role === 'admin' ? 'Super Administrator' : 'Standard Member'}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Last Sign In</Text>
          <Text style={styles.detailValue}>{formatDate(user.lastLoginAt)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Firestore Account UID</Text>
          <Text style={[styles.detailValue, styles.monospace]}>
            {user.uid.length > 20 ? `${user.uid.slice(0, 16)}...` : user.uid}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 20,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  metaContainer: {
    flex: 1,
  },
  metaContainerMobile: {
    alignItems: 'center',
    marginTop: 14,
  },
  badgeGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  domainCallout: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    alignSelf: 'flex-start',
  },
  domainCalloutText: {
    color: '#BAE6FD',
    fontSize: 12,
    fontWeight: '600',
  },
  domainHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: 20,
    width: '100%',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  detailsGridMobile: {
    flexDirection: 'column',
  },
  detailItem: {
    width: '50%',
    paddingRight: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  monospace: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textSecondary,
    fontSize: 13,
  },
});
