import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

interface NavbarProps {
  onLogoutPress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoutPress }) => {
  const { user, signOut, isAuthenticating } = useAuth();
  const { isMobile } = useResponsive();

  const handleLogout = () => {
    if (onLogoutPress) {
      onLogoutPress();
    } else {
      signOut();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.brandContainer}>
        {/* Logo mark */}
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>HB+</Text>
        </View>
        <View style={styles.brandTitleContainer}>
          <Text style={styles.brandName}>HB+ FIT</Text>
          {!isMobile && (
            <Text style={styles.brandSub}>Corporate & Athlete Access</Text>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        {user ? (
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
              onPress={handleLogout}
              disabled={isAuthenticating}
              activeOpacity={0.8}
              style={[
                styles.logoutButton,
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
            >
              <Text style={styles.logoutButtonText}>
                {isAuthenticating ? 'Exiting...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.secureTag}>
            <Text style={styles.secureDot}>●</Text>
            <Text style={styles.secureText}>Official Domain Portal</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
  },
  logoText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  brandTitleContainer: {
    justifyContent: 'center',
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSub: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 6,
  },
  logoutButtonText: {
    color: '#F87171',
    fontWeight: '600',
    fontSize: 13,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  secureDot: {
    color: colors.success,
    fontSize: 10,
    marginRight: 6,
  },
  secureText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
});
