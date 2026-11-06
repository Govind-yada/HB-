import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile, UserRole } from '../../types/auth';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';

interface RoleUpdateModalProps {
  visible: boolean;
  targetUser: UserProfile | null;
  onConfirm: (targetUid: string, newRole: UserRole) => void;
  onCancel: () => void;
}

export const RoleUpdateModal: React.FC<RoleUpdateModalProps> = ({
  visible,
  targetUser,
  onConfirm,
  onCancel,
}) => {
  if (!targetUser) return null;

  const nextRole: UserRole = targetUser.role === 'admin' ? 'user' : 'admin';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modify Team Role</Text>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.closeBtn, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
            >
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userSummary}>
            <Avatar
              photoURL={targetUser.photoURL}
              name={targetUser.displayName || targetUser.email}
              size={52}
            />
            <View style={styles.summaryMeta}>
              <Text style={styles.userName}>{targetUser.displayName || 'Team Member'}</Text>
              <Text style={styles.userEmail}>{targetUser.email}</Text>
              <View style={styles.rolePreview}>
                <Text style={styles.previewLabel}>Current:</Text>
                <Badge
                  label={targetUser.role.toUpperCase()}
                  variant={targetUser.role === 'admin' ? 'admin' : 'user'}
                  size="sm"
                />
              </View>
            </View>
          </View>

          <View style={styles.changeNotice}>
            <Text style={styles.changeNoticeText}>
              Are you sure you want to promote/change this account to{' '}
              <Text style={styles.roleHighlight}>{nextRole.toUpperCase()}</Text>?
            </Text>
            <Text style={styles.changeNoticeSub}>
              {nextRole === 'admin'
                ? 'Admins possess full directory management & database access.'
                : 'Users have access to athlete programs and standard intranet features.'}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.cancelBtn, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(targetUser.uid, nextRole)}
              style={[
                styles.confirmBtn,
                nextRole === 'admin' ? styles.confirmBtnAdmin : styles.confirmBtnUser,
                Platform.OS === 'web' && ({ cursor: 'pointer' } as any),
              ]}
            >
              <Text style={styles.confirmBtnText}>Confirm {nextRole.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    width: '100%',
    maxWidth: 440,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 22,
    lineHeight: 22,
  },
  userSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surfaceSecondary,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 16,
  },
  summaryMeta: {
    flex: 1,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 6,
  },
  rolePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  changeNotice: {
    marginBottom: 20,
  },
  changeNoticeText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  roleHighlight: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  changeNoticeSub: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  confirmBtnAdmin: {
    backgroundColor: colors.adminBadgeBorder,
  },
  confirmBtnUser: {
    backgroundColor: colors.primary,
  },
  confirmBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
});
