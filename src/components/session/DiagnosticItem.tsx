import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface DiagnosticItemProps {
  label: string;
  value: string;
  statusDotColor?: string;
}

export const DiagnosticItem: React.FC<DiagnosticItemProps> = ({
  label,
  value,
  statusDotColor,
}) => {
  return (
    <View style={styles.gridItem}>
      <Text style={styles.itemLabel}>{label}</Text>
      <View style={styles.valueRow}>
        {statusDotColor ? (
          <Text style={[styles.statusDot, { color: statusDotColor }]}>●</Text>
        ) : null}
        <Text style={styles.itemValue}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridItem: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 14,
  },
  itemLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    fontSize: 10,
  },
  itemValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
