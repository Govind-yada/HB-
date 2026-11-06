import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { AuditLogEntry } from '../../types/auth';
import { Badge } from '../Badge';

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return ts;
    }
  };

  const getStatusBadge = (status: AuditLogEntry['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge label="GRANTED" variant="user" size="sm" />;
      case 'REJECTED_UNAUTHORIZED_DOMAIN':
        return <Badge label="BLOCKED" variant="outline" size="sm" />;
      case 'LOGOUT':
        return <Badge label="LOGOUT" variant="outline" size="sm" />;
      case 'ROLE_UPDATED':
        return <Badge label="ROLE CHG" variant="admin" size="sm" />;
      default:
        return <Badge label={status} variant="outline" size="sm" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Live Domain Audit Log</Text>
        <Text style={styles.counter}>{logs.length} Recent Events</Text>
      </View>

      <View style={styles.logList}>
        {logs.slice(0, 5).map((log, idx) => (
          <View
            key={log.id || idx}
            style={[styles.logRow, idx === Math.min(logs.length, 5) - 1 && styles.logRowLast]}
          >
            <View style={styles.logLeft}>
              <View style={styles.statusCol}>{getStatusBadge(log.status)}</View>
              <View style={styles.metaCol}>
                <Text style={styles.emailText}>{log.email}</Text>
                <Text style={styles.detailsText}>{log.details}</Text>
              </View>
            </View>
            <Text style={styles.timestamp}>{formatTime(log.timestamp)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counter: {
    fontSize: 12,
    color: colors.textMuted,
  },
  logList: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  logRowLast: {
    borderBottomWidth: 0,
  },
  logLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusCol: {
    minWidth: 70,
  },
  metaCol: {
    flex: 1,
  },
  emailText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  detailsText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginLeft: 10,
  },
});
