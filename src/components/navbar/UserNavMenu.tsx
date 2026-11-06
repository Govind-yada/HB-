import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../types/auth';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { useResponsive } from '../../hooks/useResponsive';

interface UserNavMenuProps {
  user: UserProfile;
  onLogoutPress: () => void;
  isLoggingOut: boolean;
}

export const UserNavMenu: React.FC<UserNavMenuProps> = ({
  user,
  onLogoutPress,
  isLoggingOut,
}) => {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.userInfoWrapper}>
      {!isMobile && (
        <View style={styles.userDetails}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.displayName || user.email.split('@')[0]}
          </Text>
          <View style={styles.badgesRow}>
            <Badge
              label={user.role === 'admin' ? 'ADMIN' : 'MEMBER'}
              variant={user.role === 'admin' ? 'admin' : 'user'}
              size="sm"
            />
          </View>
        </View>
      )}

      <Avatar
        photoURL={user.photoURL}
        name={user.displayName || user.email}
        size={isMobile ? 36 : 40}
      />

      <TouchableOpacity
        onPress={onLogoutPress}
        disabled={isLoggingOut}
        activeOpacity={0.8}
        style={[
          styles.logoutButton,
          isLoggingOut && styles.logoutButtonDisabled,
          Platform.OS === 'web' && ({ cursor: isLoggingOut ? 'not-allowed' : 'pointer' } as any),
        ]}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="#F87171" style={styles.btnLoader} />
        ) : null}
        <Text style={styles.logoutButtonText}>
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  userInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userDetails: {
    alignItems: 'flex-end',
    marginRight: 2,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 160,
  },
  badgesRow: {
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 6,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  btnLoader: {
    marginRight: 6,
  },
  logoutButtonText: {
    color: '#F87171',
    fontWeight: '600',
    fontSize: 13,
  },
});
