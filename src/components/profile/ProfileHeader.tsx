import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../types/auth';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { useResponsive } from '../../hooks/useResponsive';

interface ProfileHeaderProps {
  user: UserProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { isMobile } = useResponsive();

  return (
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
  );
};

const styles = StyleSheet.create({
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
});
