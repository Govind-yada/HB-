import { Platform } from 'react-native';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, googleProvider } from '../config/firebase';
import { ALLOWED_DOMAIN, DOMAIN_RESTRICTION_ERROR, STORAGE_KEYS } from '../config/constants';
import { syncUserProfile } from './firestoreService';
import { UserProfile } from '../types/auth';

/**
 * Domain validation check:
 * Returns true exclusively if email ends with @hbplus.fit
 */
export function validateHbPlusDomain(email?: string | null): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith(ALLOWED_DOMAIN.toLowerCase());
}

/**
 * Immediate Domain Enforcement:
 * If the user's email domain does not match @hbplus.fit,
 * the session is terminated immediately and the exact required error is thrown.
 */
export async function enforceDomainOrSignOut(user: FirebaseUser | { email?: string | null }): Promise<void> {
  const email = user.email || '';
  if (!validateHbPlusDomain(email)) {
    try {
      if (auth && typeof auth.signOut === 'function') {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Error during immediate signout for unauthorized domain:', e);
    }
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);

    throw new Error(DOMAIN_RESTRICTION_ERROR);
  }
}

/**
 * Sign in with Google (Web platform)
 * Uses browserPopupRedirectResolver explicitly to prevent auth/argument-error
 */
export async function signInWithGoogleWeb(): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }

  // 1. Trigger Google OAuth popup with explicit popup resolver
  const userCredential = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
  const firebaseUser = userCredential.user;

  // 2. Strict Domain Validation (Requirements 2 & 3)
  await enforceDomainOrSignOut(firebaseUser);

  // 3. Store user profile in Firestore (Bonus Feature)
  const profile = await syncUserProfile(
    firebaseUser.uid,
    firebaseUser.email!,
    firebaseUser.displayName,
    firebaseUser.photoURL,
    'google.com'
  );

  // 4. Cache verified session
  await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(profile));

  return profile;
}

/**
 * Sign in with Google Credential (Native / AuthSession)
 */
export async function signInWithGoogleNativeCredential(idToken: string, accessToken?: string): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }

  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  const userCredential = await signInWithCredential(auth, credential);
  const firebaseUser = userCredential.user;

  await enforceDomainOrSignOut(firebaseUser);

  const profile = await syncUserProfile(
    firebaseUser.uid,
    firebaseUser.email!,
    firebaseUser.displayName,
    firebaseUser.photoURL,
    'google.com'
  );

  await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(profile));
  return profile;
}

/**
 * Comprehensive Sign Out
 */
export async function signOutUser(): Promise<void> {
  try {
    if (auth && typeof auth.signOut === 'function') {
      await firebaseSignOut(auth);
    }
  } catch (err) {
    console.warn('Firebase signOut error:', err);
  } finally {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  }
}
