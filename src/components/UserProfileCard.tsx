import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { UserProfile } from '../types/auth';
import { Card } from './Card';
import { ProfileHeader } from './profile/ProfileHeader';
import { ProfileDetailItem } from './profile/ProfileDetailItem';
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

  const roleColor = user.role === 'admin' ? colors.adminBadgeText : colors.userBadgeText;

  return (
    <Card style={styles.card}>
      {/* Modular Profile Header */}
      <ProfileHeader user={user} />

      <View style={styles.divider} />

      {/* Modular Details Grid */}
      <View style={[styles.detailsGrid, isMobile && styles.detailsGridMobile]}>
        <ProfileDetailItem
          label="Authentication Provider"
          value="Google OAuth 2.0 (Firebase)"
        />

        <ProfileDetailItem
          label="User Role"
          value={user.role === 'admin' ? 'Super Administrator' : 'Standard Member'}
          valueColor={roleColor}
        />

        <ProfileDetailItem
          label="Last Sign In"
          value={formatDate(user.lastLoginAt)}
        />

        <ProfileDetailItem
          label="Firestore Account UID"
          value={user.uid.length > 20 ? `${user.uid.slice(0, 16)}...` : user.uid}
          isMonospace
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 24,
    width: '100%',
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
  },
  detailsGridMobile: {
    flexDirection: 'column',
  },
});
