import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const AdminHeader: React.FC = () => {
  return (
    <View style={styles.headerRow}>
      <View style={styles.titleBadge}>
        <Text style={styles.titleBadgeText}>ADMIN PRIVILEGES ACTIVE</Text>
      </View>
      <Text style={styles.headerTitle}>Domain Management & Security Console</Text>
      <Text style={styles.headerSubtitle}>
        Real-time oversight for users authenticated with the official{' '}
        <Text style={styles.domainHighlight}>@hbplus.fit</Text> domain.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    marginBottom: 20,
  },
  titleBadge: {
    backgroundColor: colors.adminBadgeBg,
    borderColor: colors.adminBadgeBorder,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  titleBadgeText: {
    color: colors.adminBadgeText,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  domainHighlight: {
    color: colors.adminBadgeText,
    fontWeight: '700',
  },
});
