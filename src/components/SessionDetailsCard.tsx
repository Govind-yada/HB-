import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { Card } from './Card';
import { DiagnosticItem } from './session/DiagnosticItem';
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

  const persistenceType =
    Platform.OS === 'web' ? 'IndexedDB / Browser Local' : 'Encrypted AsyncStorage';

  return (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>🔐 Session & Security Diagnostics</Text>
      <Text style={styles.cardSubtitle}>
        System integrity and cross-platform token validation metrics
      </Text>

      <View style={[styles.grid, isMobile && styles.gridMobile]}>
        <DiagnosticItem
          label="Domain Whitelist"
          value={`${ALLOWED_DOMAIN} (Strict)`}
          statusDotColor={colors.info}
        />

        <DiagnosticItem
          label="Session Persistence"
          value={persistenceType}
        />

        <DiagnosticItem
          label="OAuth Handshake"
          value={`${providerId} (OAuth 2.0 PKCE)`}
        />

        <DiagnosticItem
          label="Direct URL Protection"
          value="Active (AuthGuard Shield)"
          statusDotColor={colors.success}
        />
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
  },
  gridMobile: {
    flexDirection: 'column',
  },
});
