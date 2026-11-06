import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { ALLOWED_DOMAIN } from '../../config/constants';

export const DomainSecurityBanner: React.FC = () => {
  return (
    <View style={styles.domainBanner}>
      <View style={styles.domainRow}>
        <Text style={styles.domainShield}>🔒</Text>
        <Text style={styles.domainBannerText}>
          Restricted Access: <Text style={styles.domainHighlight}>{ALLOWED_DOMAIN}</Text>
        </Text>
      </View>
      <Text style={styles.domainNotice}>
        Only verified corporate and athletic personnel with official domain accounts are permitted.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  domainBanner: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    padding: 14,
    marginBottom: 20,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainShield: {
    marginRight: 8,
    fontSize: 16,
  },
  domainBannerText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  domainHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  domainNotice: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
});
