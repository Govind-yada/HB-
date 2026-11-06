import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile } from '../../types/auth';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { useResponsive } from '../../hooks/useResponsive';

interface TeamMemberRowProps {
  member: UserProfile;
  isLast: boolean;
  onEditRole: (member: UserProfile) => void;
  isSelf: boolean;
}

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  isLast,
  onEditRole,
  isSelf,
}) => {
  const { isMobile } = useResponsive();

  return (
    <View
      style={[
        styles.memberRow,
        isLast && styles.memberRowLast,
        isMobile && styles.memberRowMobile,
      ]}
    >
      <View style={styles.memberLeft}>
        <Avatar
          photoURL={member.photoURL}
          name={member.displayName || member.email}
          size={40}
        />
        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName}>
              {member.displayName || member.email.split('@')[0]}
            </Text>
            {isSelf && (
              <Badge label="YOU" variant="outline" size="sm" />
            )}
          </View>
          <Text style={styles.memberEmail}>{member.email}</Text>
        </View>
      </View>

      <View style={[styles.memberRight, isMobile && styles.memberRightMobile]}>
        <Badge
          label={member.role === 'admin' ? 'ADMIN' : 'MEMBER'}
          variant={member.role === 'admin' ? 'admin' : 'user'}
          size="sm"
        />

        <TouchableOpacity
          onPress={() => onEditRole(member)}
          style={[styles.editRoleBtn, Platform.OS === 'web' && ({ cursor: 'pointer' } as any)]}
          activeOpacity={0.8}
        >
          <Text style={styles.editRoleBtnText}>
            {member.role === 'admin' ? 'Demote' : 'Promote'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.memberUid}>
          {member.uid.length > 12 ? `${member.uid.slice(0, 10)}...` : member.uid}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  memberRowLast: {
    borderBottomWidth: 0,
  },
  memberRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInfo: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  memberEmail: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  memberRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberRightMobile: {
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 52,
  },
  editRoleBtn: {
    backgroundColor: colors.surfaceHover,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  editRoleBtnText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  memberUid: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
