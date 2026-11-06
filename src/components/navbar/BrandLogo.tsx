import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useResponsive } from '../../hooks/useResponsive';

export const BrandLogo: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <View style={styles.brandContainer}>
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
  );
};

const styles = StyleSheet.create({
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
});
