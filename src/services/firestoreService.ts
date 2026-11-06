import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { configuredAdminEmails, isConfiguredWithRealFirebase } from '../config/env';
import { UserProfile, UserRole, AuditLogEntry, AuditEventStatus } from '../types/auth';

// In-memory audit log fallback for fast offline or development simulation
let inMemoryAuditLogs: AuditLogEntry[] = [
  {
    id: 'log_seed_1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    email: 'sarah.admin@hbplus.fit',
    status: 'SUCCESS',
    details: 'OAuth 2.0 PKCE handshake completed. Domain verified.',
    role: 'admin',
  },
  {
    id: 'log_seed_2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    email: 'intruder.test@gmail.com',
    status: 'REJECTED_UNAUTHORIZED_DOMAIN',
    details: 'Blocked attempt from unauthorized domain: @gmail.com',
  },
  {
    id: 'log_seed_3',
    timestamp: new Date().toISOString(),
    email: 'marcus.vance@hbplus.fit',
    status: 'SUCCESS',
    details: 'Authorized athlete portal access granted.',
    role: 'user',
  },
];

/**
 * Synchronize Google OAuth user details with Firestore collection `users`
 */
export async function syncUserProfile(
  uid: string,
  email: string,
  displayName: string | null,
  photoURL: string | null,
  providerId: string = 'google.com'
): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  let role: UserRole = configuredAdminEmails.includes(normalizedEmail) ? 'admin' : 'user';
  let createdAt = new Date().toISOString();

  if (isConfiguredWithRealFirebase() && db && typeof doc === 'function') {
    try {
      const userDocRef = doc(db, 'users', uid);
      const existingSnap = await getDoc(userDocRef);
      if (existingSnap.exists()) {
        const data = existingSnap.data();
        if (data.role) {
          role = data.role as UserRole;
        }
        if (data.createdAt) {
          createdAt = data.createdAt;
        }

        await updateDoc(userDocRef, {
          displayName: displayName || data.displayName || null,
          photoURL: photoURL || data.photoURL || null,
          lastLoginAt: new Date().toISOString(),
          serverLastLogin: serverTimestamp(),
        });
      } else {
        const newProfile: Record<string, any> = {
          uid,
          email: normalizedEmail,
          displayName: displayName || null,
          photoURL: photoURL || null,
          role,
          domain: '@hbplus.fit',
          providerId,
          createdAt,
          lastLoginAt: new Date().toISOString(),
          serverCreatedAt: serverTimestamp(),
          serverLastLogin: serverTimestamp(),
        };
        await setDoc(userDocRef, newProfile);
      }
    } catch (error) {
      console.warn('Firestore sync skipped/failed (using local profile):', error);
    }
  }

  return {
    uid,
    email: normalizedEmail,
    displayName,
    photoURL,
    role,
    createdAt,
    lastLoginAt: new Date().toISOString(),
    domain: '@hbplus.fit',
    providerId,
  };
}

/**
 * Fetch profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (isConfiguredWithRealFirebase() && db && typeof doc === 'function') {
    try {
      const userDocRef = doc(db, 'users', uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
    } catch (error) {
      console.warn('Error fetching user profile from Firestore:', error);
    }
  }
  return null;
}

/**
 * Admin action: Update role of a team member
 */
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  if (isConfiguredWithRealFirebase() && db && typeof doc === 'function') {
    try {
      const userDocRef = doc(db, 'users', targetUid);
      await updateDoc(userDocRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore updateUserRole warning:', err);
    }
  }
}

/**
 * Admin action: Fetch directory of users
 */
export async function fetchAllHbPlusUsers(): Promise<UserProfile[]> {
  if (isConfiguredWithRealFirebase() && db && typeof collection === 'function') {
    try {
      const usersCol = collection(db, 'users');
      const q = query(usersCol, limit(50));
      const snap = await getDocs(q);
      const users: UserProfile[] = [];
      snap.forEach((d) => {
        users.push(d.data() as UserProfile);
      });
      if (users.length > 0) return users;
    } catch (error) {
      console.warn('Could not fetch all users from Firestore:', error);
    }
  }
  return [];
}

/**
 * Record an audit log event
 */
export async function logAuditEvent(
  email: string,
  status: AuditEventStatus,
  details: string,
  role?: UserRole
): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    email,
    status,
    details,
    role,
  };

  inMemoryAuditLogs = [entry, ...inMemoryAuditLogs.slice(0, 49)];

  if (isConfiguredWithRealFirebase() && db && typeof collection === 'function') {
    try {
      const auditCol = collection(db, 'audit_logs');
      await addDoc(auditCol, {
        ...entry,
        serverTimestamp: serverTimestamp(),
      });
    } catch (err) {
      // Graceful fallback to memory log
    }
  }

  return entry;
}

/**
 * Fetch recent audit logs for the admin security console
 */
export async function fetchRecentAuditLogs(): Promise<AuditLogEntry[]> {
  if (isConfiguredWithRealFirebase() && db && typeof collection === 'function') {
    try {
      const auditCol = collection(db, 'audit_logs');
      const q = query(auditCol, orderBy('timestamp', 'desc'), limit(20));
      const snap = await getDocs(q);
      const logs: AuditLogEntry[] = [];
      snap.forEach((d) => {
        logs.push({ id: d.id, ...(d.data() as any) });
      });
      if (logs.length > 0) return logs;
    } catch (err) {
      // Fallback to in-memory logs
    }
  }
  return inMemoryAuditLogs;
}
