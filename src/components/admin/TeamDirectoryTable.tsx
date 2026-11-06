import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { colors } from '../../theme/colors';
import { UserProfile, UserRole } from '../../types/auth';
import { TeamMemberRow } from './TeamMemberRow';
import { RoleUpdateModal } from './RoleUpdateModal';

interface TeamDirectoryTableProps {
  users: UserProfile[];
  currentUserId: string;
  onRoleUpdate: (targetUid: string, newRole: UserRole) => Promise<void>;
}

export const TeamDirectoryTable: React.FC<TeamDirectoryTableProps> = ({
  users,
  currentUserId,
  onRoleUpdate,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [modalUser, setModalUser] = useState<UserProfile | null>(null);

  const filtered = users.filter((u) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleConfirmRole = async (targetUid: string, newRole: UserRole) => {
    setModalUser(null);
    await onRoleUpdate(targetUid, newRole);
  };

  return (
    <View style={styles.container}>
      <View style={styles.directoryHeader}>
        <View>
          <Text style={styles.directoryTitle}>Registered @hbplus.fit Team Directory</Text>
          <Text style={styles.directoryCount}>{filtered.length} Users Listed</Text>
        </View>

        <TextInput
          value={filterQuery}
          onChangeText={setFilterQuery}
          placeholder="Search team member..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.memberList}>
        {filtered.map((member, idx) => (
          <TeamMemberRow
            key={member.uid || idx}
            member={member}
            isLast={idx === filtered.length - 1}
            onEditRole={(target) => setModalUser(target)}
            isSelf={member.uid === currentUserId}
          />
        ))}
      </View>

      <RoleUpdateModal
        visible={Boolean(modalUser)}
        targetUser={modalUser}
        onConfirm={handleConfirmRole}
        onCancel={() => setModalUser(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 10,
  },
  directoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  directoryCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  searchInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: colors.textPrimary,
    fontSize: 12,
    minWidth: 180,
  },
  memberList: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
});
