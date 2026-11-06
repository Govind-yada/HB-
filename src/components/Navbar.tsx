import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from './navbar/BrandLogo';
import { UserNavMenu } from './navbar/UserNavMenu';

interface NavbarProps {
  onLogoutPress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogoutPress }) => {
  const { user, signOut, isAuthenticating } = useAuth();

  const handleLogout = () => {
    if (onLogoutPress) {
      onLogoutPress();
    } else {
      signOut();
    }
  };

  return (
    <View style={styles.header}>
      {/* Modular Brand Logo Mark */}
      <BrandLogo />

      <View style={styles.actionsContainer}>
        {user ? (
          /* Modular User Profile Menu & Sign Out */
          <UserNavMenu
            user={user}
            onLogoutPress={handleLogout}
            isAuthenticating={isAuthenticating}
          />
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
