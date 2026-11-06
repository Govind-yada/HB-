import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

export const SecurityRuleChecklist: React.FC = () => {
  return (
    <View style={styles.securityBox}>
      <Text style={styles.securityTitle}>🛡 Active Domain Authorization Rules</Text>
      <Text style={styles.securityRule}>
        • <Text style={styles.bold}>Frontend Guard:</Text> OAuth callback immediately signs out and purges any email not ending in @hbplus.fit.
      </Text>
      <Text style={styles.securityRule}>
        • <Text style={styles.bold}>Firestore Guard:</Text>{' '}
        <Text style={styles.mono}>request.auth.token.email.matches('.*@hbplus[.]fit$')</Text> required for all document writes.
      </Text>
      <Text style={styles.securityRule}>
        • <Text style={styles.bold}>Session Security:</Text> AsyncStorage / browser local session verified against domain regex on every cold start.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  securityBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 16,
    marginBottom: 20,
  },
  securityTitle: {
    color: colors.info,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  securityRule: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  bold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#38BDF8',
  },
});
