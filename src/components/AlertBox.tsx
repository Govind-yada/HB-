import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../theme/colors';

interface AlertBoxProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
}

export const AlertBox: React.FC<AlertBoxProps> = ({
  type = 'error',
  title,
  message,
  onDismiss,
}) => {
  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: colors.successBg,
          border: colors.successBorder,
          text: colors.success,
          title: '#34D399',
          icon: '✓',
        };
      case 'warning':
        return {
          bg: colors.warningBg,
          border: colors.warningBorder,
          text: colors.warning,
          title: '#FBBF24',
          icon: '⚠',
        };
      case 'info':
        return {
          bg: colors.infoBg,
          border: colors.infoBorder,
          text: colors.info,
          title: '#38BDF8',
          icon: 'ℹ',
        };
      case 'error':
      default:
        return {
          bg: colors.errorBg,
          border: colors.errorBorder,
          text: '#FCA5A5',
          title: '#EF4444',
          icon: '✕',
        };
    }
  };

  const styleConfig = getColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: styleConfig.bg, borderColor: styleConfig.border },
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.iconText, { color: styleConfig.title }]}>{styleConfig.icon}</Text>
      </View>

      <View style={styles.textContainer}>
        {title ? (
          <Text style={[styles.title, { color: styleConfig.title }]}>{title}</Text>
        ) : null}
        <Text style={[styles.message, { color: styleConfig.text }]}>{message}</Text>
      </View>

      {onDismiss ? (
        <TouchableOpacity
          onPress={onDismiss}
          style={[
            styles.dismissButton,
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
    width: '100%',
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  dismissButton: {
    marginLeft: 8,
    padding: 2,
  },
  dismissText: {
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '600',
  },
});
