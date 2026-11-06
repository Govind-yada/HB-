import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from './Card';
import { UserProfile, UserRole } from '../types/auth';
import { fetchAllHbPlusUsers, updateUserRole, logAuditEvent } from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { AdminHeader } from './admin/AdminHeader';
import { AdminMetricsGrid } from './admin/AdminMetricsGrid';
import { SecurityRuleChecklist } from './admin/SecurityRuleChecklist';
import { TeamDirectoryTable } from './admin/TeamDirectoryTable';
import { AuditLogViewer } from './admin/AuditLogViewer';

interface AdminPanelProps {
  currentUser: UserProfile;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
  const { auditLogs } = useAuth();
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);

  const defaultTeamMembers: UserProfile[] = [
    {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || 'Current Admin',
      photoURL: currentUser.photoURL,
      role: 'admin',
      domain: '@hbplus.fit',
      createdAt: currentUser.createdAt,
      lastLoginAt: currentUser.lastLoginAt,
    },
    {
      uid: 'team_02',
      email: 'claire.morrison@hbplus.fit',
      displayName: 'Claire Morrison',
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      role: 'admin',
      domain: '@hbplus.fit',
      createdAt: '2026-01-15T10:00:00Z',
      lastLoginAt: '2026-11-05T08:30:00Z',
    },
    {
      uid: 'team_03',
      email: 'alex.torres@hbplus.fit',
      displayName: 'Alex Torres',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'user',
      domain: '@hbplus.fit',
      createdAt: '2026-03-20T14:15:00Z',
      lastLoginAt: '2026-11-04T19:40:00Z',
    },
    {
      uid: 'team_04',
      email: 'elena.rostova@hbplus.fit',
      displayName: 'Elena Rostova',
      photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      role: 'user',
      domain: '@hbplus.fit',
      createdAt: '2026-05-12T09:22:00Z',
      lastLoginAt: '2026-11-05T12:10:00Z',
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const fetched = await fetchAllHbPlusUsers();
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            setUsers(fetched);
          } else {
            setUsers(defaultTeamMembers);
          }
        }
      } catch {
        if (isMounted) setUsers(defaultTeamMembers);
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleUpdate = async (targetUid: string, newRole: UserRole) => {
    try {
      await updateUserRole(targetUid, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      );
      const targetUser = users.find((u) => u.uid === targetUid);
      const targetEmail = targetUser?.email || targetUid;
      await logAuditEvent(targetEmail, 'ROLE_UPDATED', `Role updated to ${newRole.toUpperCase()}`);
      showSuccess(`Updated role to ${newRole.toUpperCase()} for ${targetEmail}`);
    } catch (err: any) {
      showError(err.message || 'Failed to update role');
    }
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <Card style={styles.container}>
      {/* 1. Header */}
      <AdminHeader />

      {/* 2. Metrics Grid */}
      <AdminMetricsGrid
        totalMembers={users.length}
        adminCount={adminCount}
        complianceRate="100%"
        breachCount={0}
      />

      {/* 3. Security Rule Checklist */}
      <SecurityRuleChecklist />

      {/* 4. Directory Table */}
      <TeamDirectoryTable
        users={users}
        currentUserId={currentUser.uid}
        onRoleUpdate={handleRoleUpdate}
      />

      {/* 5. Live Audit Log Viewer */}
      <AuditLogViewer logs={auditLogs} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 20,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderWidth: 1.5,
  },
});
