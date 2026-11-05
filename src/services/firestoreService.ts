import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { configuredAdminEmails } from '../config/env';
import { UserProfile, UserRole } from '../types/auth';

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
  const userDocRef = doc(db, 'users', uid);

  let role: UserRole = configuredAdminEmails.includes(normalizedEmail) ? 'admin' : 'user';
  let createdAt = new Date().toISOString();

  try {
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      const data = existingSnap.data();
      if (data.role) {
        role = data.role as UserRole;
      }
      if (data.createdAt) {
        createdAt = data.createdAt;
      }

      // Update existing document with latest login and profile photo/name
      await updateDoc(userDocRef, {
        displayName: displayName || data.displayName || null,
        photoURL: photoURL || data.photoURL || null,
        lastLoginAt: new Date().toISOString(),
        serverLastLogin: serverTimestamp(),
      });
    } else {
      // First-time user document creation
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
    console.warn('Firestore sync failed (using local profile cache):', error);
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
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
  }
  return null;
}

/**
 * Admin action: Update role of a team member
 */
export async function updateUserRole(targetUid: string, newRole: UserRole): Promise<void> {
  const userDocRef = doc(db, 'users', targetUid);
  await updateDoc(userDocRef, {
    role: newRole,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Admin action: Fetch directory of users
 */
export async function fetchAllHbPlusUsers(): Promise<UserProfile[]> {
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, limit(50));
    const snap = await getDocs(q);
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      users.push(d.data() as UserProfile);
    });
    return users;
  } catch (error) {
    console.warn('Could not fetch all users from Firestore:', error);
    return [];
  }
}
