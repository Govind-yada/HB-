import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Card } from '../Card';
import { Badge } from '../Badge';
import { UserRole } from '../../types/auth';
import { useResponsive } from '../../hooks/useResponsive';

interface QuickMetricsBarProps {
  role: UserRole;
  domain?: string;
}

export const QuickMetricsBar: React.FC<QuickMetricsBarProps> = ({
  role,
  domain = '@hbplus.fit',
}) => {
  const { isMobile } = useResponsive();
  const isAdmin = role === 'admin';

  return (
    <View style={[styles.metricsGrid, isMobile && styles.metricsGridMobile]}>
      <Card style={styles.metricCard}>
        <Text style={styles.metricLabel}>Security Status</Text>
        <View style={styles.metricValueRow}>
          <Text style={[styles.metricValue, { color: colors.success }]}>Authenticated</Text>
          <Badge label="SSL/TLS" variant="user" size="sm" />
        </View>
        <Text style={styles.metricDesc}>Token validated via Firebase Auth</Text>
      </Card>

      <Card style={styles.metricCard}>
        <Text style={styles.metricLabel}>Authorized Domain</Text>
        <View style={styles.metricValueRow}>
          <Text style={[styles.metricValue, { color: '#38BDF8' }]}>{domain}</Text>
          <Badge label="Strict" variant="domain" size="sm" />
        </View>
        <Text style={styles.metricDesc}>Corporate email whitelist enforcement</Text>
      </Card>

      <Card style={styles.metricCard}>
        <Text style={styles.metricLabel}>Assigned Role</Text>
        <View style={styles.metricValueRow}>
          <Text
            style={[
              styles.metricValue,
              { color: isAdmin ? colors.adminBadgeText : colors.userBadgeText },
            ]}
          >
            {isAdmin ? 'Administrator' : 'Standard User'}
          </Text>
          <Badge
            label={isAdmin ? 'LEVEL 1' : 'LEVEL 3'}
            variant={isAdmin ? 'admin' : 'user'}
            size="sm"
          />
        </View>
        <Text style={styles.metricDesc}>
          {isAdmin ? 'Full database & user administration' : 'Standard athlete & workout portal'}
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metricsGridMobile: {
    flexDirection: 'column',
  },
  metricCard: {
    flex: 1,
    padding: 18,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
