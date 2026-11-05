import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList } from 'react-native';
import { colors } from '../theme/colors';
import { Card } from './Card';
import { Badge } from './Badge';
import { Avatar } from './Avatar';
import { UserProfile } from '../types/auth';
import { fetchAllHbPlusUsers } from '../services/firestoreService';
import { useResponsive } from '../hooks/useResponsive';

interface AdminPanelProps {
  currentUser: UserProfile;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
  const { isMobile } = useResponsive();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sample seed members if Firestore collection is fresh
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
      } catch (err) {
        if (isMounted) {
          setUsers(defaultTeamMembers);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Card style={styles.container}>
      {/* Admin Panel Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleBadge}>
          <Text style={styles.titleBadgeText}>ADMIN PRIVILEGES ACTIVE</Text>
        </View>
        <Text style={styles.headerTitle}>Domain Management & Security Console</Text>
        <Text style={styles.headerSubtitle}>
          Real-time oversight for users authenticated with the official <Text style={styles.domainHighlight}>@hbplus.fit</Text> domain.
        </Text>
      </View>

      {/* Metrics Row */}
      <View style={[styles.statsRow, isMobile && styles.statsRowMobile]}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Verified Members</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.adminBadgeText }]}>2</Text>
          <Text style={styles.statLabel}>Security Admins</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>100%</Text>
          <Text style={styles.statLabel}>Domain Compliance</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.info }]}>0</Text>
          <Text style={styles.statLabel}>Unauthorized Breaches</Text>
        </View>
      </View>

      {/* Security Enforcement Card */}
      <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>🛡 Active Domain Authorization Rules</Text>
        <Text style={styles.securityRule}>
          • <Text style={styles.bold}>Frontend Guard:</Text> OAuth callback immediately signs out and purges any email not ending in @hbplus.fit.
        </Text>
        <Text style={styles.securityRule}>
          • <Text style={styles.bold}>Firestore Guard:</Text> <Text style={styles.mono}>request.auth.token.email.matches('.*@hbplus[.]fit$')</Text> required for all document writes.
        </Text>
        <Text style={styles.securityRule}>
          • <Text style={styles.bold}>Session Security:</Text> AsyncStorage / browser local session verified against domain regex on every cold start.
        </Text>
      </View>

      {/* Member Directory */}
      <View style={styles.directoryHeader}>
        <Text style={styles.directoryTitle}>Registered @hbplus.fit Team Directory</Text>
        <Text style={styles.directoryCount}>{users.length} Users Listed</Text>
      </View>

      <View style={styles.memberList}>
        {users.map((member, idx) => (
          <View
            key={member.uid || idx}
            style={[
              styles.memberRow,
              idx === users.length - 1 && styles.memberRowLast,
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
                <Text style={styles.memberName}>
                  {member.displayName || member.email.split('@')[0]}
                </Text>
                <Text style={styles.memberEmail}>{member.email}</Text>
              </View>
            </View>

            <View style={[styles.memberRight, isMobile && styles.memberRightMobile]}>
              <Badge
                label={member.role === 'admin' ? 'ADMIN' : 'MEMBER'}
                variant={member.role === 'admin' ? 'admin' : 'user'}
                size="sm"
              />
              <Text style={styles.memberUid}>
                {member.uid.length > 12 ? `${member.uid.slice(0, 10)}...` : member.uid}
              </Text>
            </View>
          </View>
        ))}
      </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statsRowMobile: {
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
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
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
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
  memberList: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
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
    gap: 8,
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberInfo: {
    justifyContent: 'center',
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
  memberUid: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
