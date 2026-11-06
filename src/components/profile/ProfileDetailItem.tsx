import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface ProfileDetailItemProps {
  label: string;
  value: string;
  valueColor?: string;
  isMonospace?: boolean;
}

export const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({
  label,
  value,
  valueColor = colors.textPrimary,
  isMonospace = false,
}) => {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          { color: valueColor },
          isMonospace && styles.monospace,
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailItem: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 16,
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
    fontWeight: '600',
  },
  monospace: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.textSecondary,
    fontSize: 13,
  },
});
