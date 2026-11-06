import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useResponsive } from '../../hooks/useResponsive';

interface AdminMetricsGridProps {
  totalMembers: number;
  adminCount: number;
  complianceRate?: string;
  breachCount?: number;
}

export const AdminMetricsGrid: React.FC<AdminMetricsGridProps> = ({
  totalMembers,
  adminCount,
  complianceRate = '100%',
  breachCount = 0,
}) => {
  const { isMobile } = useResponsive();

  return (
    <View style={[styles.statsRow, isMobile && styles.statsRowMobile]}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{totalMembers}</Text>
        <Text style={styles.statLabel}>Verified Members</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: colors.adminBadgeText }]}>{adminCount}</Text>
        <Text style={styles.statLabel}>Security Admins</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: colors.success }]}>{complianceRate}</Text>
        <Text style={styles.statLabel}>Domain Compliance</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={[styles.statNumber, { color: colors.info }]}>{breachCount}</Text>
        <Text style={styles.statLabel}>Unauthorized Breaches</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statsRowMobile: {
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
