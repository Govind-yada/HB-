import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';
import { colors } from '../../theme/colors';

interface RoleGuardProps {
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
  showNoticeIfUnauthorized?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRole,
  children,
  fallback,
  showNoticeIfUnauthorized = false,
}) => {
  const { user } = useAuth();

  const isAuthorized = user && (user.role === requiredRole || (requiredRole === 'user' && user.role === 'admin'));

  if (isAuthorized) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showNoticeIfUnauthorized) {
    return (
      <View style={styles.restrictedNotice}>
        <Text style={styles.restrictedTitle}>Access Restricted to {requiredRole.toUpperCase()}s</Text>
        <Text style={styles.restrictedText}>
          Your verified account ({user?.email}) does not possess {requiredRole} privileges.
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  restrictedNotice: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    padding: 16,
    marginVertical: 10,
  },
  restrictedTitle: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  restrictedText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
