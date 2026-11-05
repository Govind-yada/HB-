import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'admin' | 'user' | 'domain' | 'outline' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'user',
  size = 'md',
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'admin':
        return {
          bg: colors.adminBadgeBg,
          text: colors.adminBadgeText,
          border: colors.adminBadgeBorder,
        };
      case 'domain':
        return {
          bg: colors.infoBg,
          text: colors.info,
          border: colors.infoBorder,
        };
      case 'info':
        return {
          bg: colors.primaryLight,
          text: colors.primary,
          border: colors.primary,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.textSecondary,
          border: colors.cardBorder,
        };
      case 'user':
      default:
        return {
          bg: colors.userBadgeBg,
          text: colors.userBadgeText,
          border: colors.userBadgeBorder,
        };
    }
  };

  const badgeConfig = getBadgeStyle();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeConfig.bg,
          borderColor: badgeConfig.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 8 : 12,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: badgeConfig.text,
            fontSize: isSmall ? 11 : 13,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
