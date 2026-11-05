import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { Card } from './Card';
import { ALLOWED_DOMAIN } from '../config/constants';
import { useResponsive } from '../hooks/useResponsive';

interface SessionDetailsCardProps {
  email: string;
  providerId?: string;
}

export const SessionDetailsCard: React.FC<SessionDetailsCardProps> = ({
  email,
  providerId = 'google.com',
}) => {
  const { isMobile } = useResponsive();

  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>🔐 Session & Security Diagnostics</Text>
      <Text style={styles.cardSubtitle}>
        System integrity and cross-platform token validation metrics
      </Text>

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        <View style={styles.gridItem}>
          <Text style={styles.itemLabel}>Domain Whitelist</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.itemValue}>{ALLOWED_DOMAIN} (Strict)</Text>
          </View>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.itemLabel}>Session Persistence</Text>
          <Text style={styles.itemValue}>
            {Platform.OS === 'web' ? 'IndexedDB / Browser Local' : 'Encrypted AsyncStorage'}
          </Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.itemLabel}>OAuth Handshake</Text>
          <Text style={styles.itemValue}>{providerId} (OAuth 2.0)</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.itemLabel}>Direct URL Protection</Text>
          <View style={styles.statusRow}>
            <Text style={[styles.statusDot, { color: colors.success }]}>●</Text>
            <Text style={styles.itemValue}>Active (AuthGuard Shield)</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 22,
    marginTop: 20,
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
  },
  gridMobile: {
    flexDirection: 'column',
    rowGap: 12,
  },
  gridItem: {
    width: '50%',
    paddingRight: 10,
  },
  itemLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    color: colors.info,
    fontSize: 10,
  },
});
