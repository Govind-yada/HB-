import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { APP_NAME, APP_TAGLINE } from '../../config/constants';

export const BrandHeader: React.FC = () => {
  return (
    <View style={styles.brandHeader}>
      <View style={styles.logoPill}>
        <Text style={styles.logoPillText}>HB+</Text>
      </View>
      <Text style={styles.brandTitle}>{APP_NAME}</Text>
      <Text style={styles.brandTagline}>{APP_TAGLINE}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  logoPillText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
