import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { Badge } from '../Badge';
import { UserRole } from '../../types/auth';

interface VerificationLabProps {
  onTestEmail: (email: string, name?: string, role?: UserRole) => Promise<void>;
  isAuthenticating: boolean;
}

export const VerificationLab: React.FC<VerificationLabProps> = ({
  onTestEmail,
  isAuthenticating,
}) => {
  const [customEmail, setCustomEmail] = useState('');

  const handleCustomTest = () => {
    if (!customEmail.trim() || isAuthenticating) return;
    onTestEmail(customEmail.trim(), 'Test User');
  };

  return (
    <View style={styles.testSuiteContainer}>
      <View style={styles.testSuiteHeader}>
        <Badge label="VERIFICATION LAB" variant="outline" size="sm" />
        <Text style={styles.testSuiteTitle}>Domain Rejection & Role Testing</Text>
      </View>
      <Text style={styles.testSuiteSubtitle}>
        Test exact domain acceptance and rejection requirements directly:
      </Text>

      <View style={styles.testButtonsGrid}>
        {/* 1. Accepted User */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isAuthenticating}
          onPress={() => onTestEmail('marcus.vance@hbplus.fit', 'Marcus Vance', 'user')}
          style={[
            styles.testButton,
            styles.testButtonSuccess,
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
          ]}
        >
          <Text style={styles.testButtonTitle}>✓ Test Accepted Member</Text>
          <Text style={styles.testButtonEmail}>marcus.vance@hbplus.fit</Text>
          <Text style={styles.testButtonNote}>Ends with @hbplus.fit → Logs in as User</Text>
        </TouchableOpacity>

        {/* 2. Accepted Admin */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isAuthenticating}
          onPress={() => onTestEmail('sarah.admin@hbplus.fit', 'Sarah Connor (Admin)', 'admin')}
          style={[
            styles.testButton,
            styles.testButtonAdmin,
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
          ]}
        >
          <Text style={styles.testButtonTitle}>✓ Test Accepted Admin</Text>
          <Text style={styles.testButtonEmail}>sarah.admin@hbplus.fit</Text>
          <Text style={styles.testButtonNote}>Ends with @hbplus.fit → Admin Panel enabled</Text>
        </TouchableOpacity>

        {/* 3. Rejected Domain (Exact Error Verification) */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isAuthenticating}
          onPress={() => onTestEmail('john.smith@gmail.com', 'John Smith')}
          style={[
            styles.testButton,
            styles.testButtonDanger,
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
          ]}
        >
          <Text style={styles.testButtonTitle}>✕ Test Domain Rejection</Text>
          <Text style={styles.testButtonEmail}>john.smith@gmail.com</Text>
          <Text style={styles.testButtonDangerNote}>
            Triggers: "Access restricted. Please login using your official domain email."
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Email Input for on-the-fly verification */}
      <View style={styles.customTestRow}>
        <TextInput
          value={customEmail}
          onChangeText={setCustomEmail}
          placeholder="Enter any email (e.g. user@yahoo.com)"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.customInput}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isAuthenticating || !customEmail.trim()}
          onPress={handleCustomTest}
          style={[
            styles.customTestButton,
            (!customEmail.trim() || isAuthenticating) && styles.customTestButtonDisabled,
            Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
          ]}
        >
          <Text style={styles.customTestButtonText}>Test Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  testSuiteContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  testSuiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  testSuiteTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  testSuiteSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  testButtonsGrid: {
    gap: 10,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  testButtonSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  testButtonAdmin: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
  },
  testButtonDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  testButtonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  testButtonEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
    marginBottom: 2,
  },
  testButtonNote: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  testButtonDangerNote: {
    fontSize: 11,
    color: '#F87171',
    fontWeight: '600',
  },
  customTestRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  customInput: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  customTestButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTestButtonDisabled: {
    opacity: 0.5,
  },
  customTestButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
});
