import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { useResponsive } from '../../hooks/useResponsive';

export const AthleteHub: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <Card style={styles.memberPortalCard}>
      <View style={styles.memberPortalHeader}>
        <Badge label="MEMBER PORTAL" variant="user" size="sm" />
        <Text style={styles.memberPortalTitle}>HB+ Athletic Program & Performance Hub</Text>
      </View>
      <Text style={styles.memberPortalDesc}>
        As a verified member of the <Text style={styles.highlightText}>hbplus.fit</Text> athletic ecosystem, your workout metrics, biometric schedules, and nutrition regimens are synchronized.
      </Text>

      <View style={[styles.programsGrid, isMobile && styles.programsGridMobile]}>
        <View style={styles.programItem}>
          <Text style={styles.programIcon}>🏃</Text>
          <Text style={styles.programTitle}>Endurance Tracking</Text>
          <Text style={styles.programStatus}>Active Sync</Text>
        </View>
        <View style={styles.programItem}>
          <Text style={styles.programIcon}>🥗</Text>
          <Text style={styles.programTitle}>Nutritional Plan</Text>
          <Text style={styles.programStatus}>Assigned</Text>
        </View>
        <View style={styles.programItem}>
          <Text style={styles.programIcon}>📊</Text>
          <Text style={styles.programTitle}>Body Composition</Text>
          <Text style={styles.programStatus}>Updated Today</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  memberPortalCard: {
    padding: 24,
    marginTop: 20,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1.5,
  },
  memberPortalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  memberPortalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  memberPortalDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
  },
  highlightText: {
    color: colors.success,
    fontWeight: '700',
  },
  programsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  programsGridMobile: {
    flexDirection: 'column',
  },
  programItem: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  programIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  programTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  programStatus: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
});
