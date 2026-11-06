import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import {
  ALLOWED_DOMAIN,
  DOMAIN_RESTRICTION_ERROR,
  STORAGE_KEYS,
} from '../config/constants';
import { isConfiguredWithRealFirebase, configuredAdminEmails } from '../config/env';
import {
  validateHbPlusDomain,
  enforceDomainOrSignOut,
  signInWithGoogleWeb,
  signOutUser,
} from '../services/authService';
import {
  syncUserProfile,
  fetchUserProfile,
  logAuditEvent,
  fetchRecentAuditLogs,
} from '../services/firestoreService';
import { AuthContextType, UserProfile, UserRole, AuditLogEntry } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const isDemoMode = !isConfiguredWithRealFirebase();

  const clearError = () => setError(null);

  /**
   * Load audit logs safely without blocking UI
   */
  const loadAuditHistory = async () => {
    try {
      const logs = await fetchRecentAuditLogs();
      setAuditLogs(logs);
    } catch {
      // safe fallback
    }
  };

  /**
   * Restore cached session and initialize Firebase Auth listener
   */
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
        if (cached && isMounted) {
          const parsed: UserProfile = JSON.parse(cached);
          if (validateHbPlusDomain(parsed.email)) {
            setUser(parsed);
          } else {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
          }
        }
      } catch (e) {
        console.warn('Failed to restore cached session:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();
    loadAuditHistory();

    // Firebase Auth State Listener
    let unsubscribe = () => {};
    if (auth && typeof onAuthStateChanged === 'function') {
      try {
        unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
          if (!isMounted) return;

          if (currentFirebaseUser) {
            const email = currentFirebaseUser.email || '';
            // Strict Domain Validation (Requirements 2 & 3)
            if (!validateHbPlusDomain(email)) {
              console.warn(`Unauthorized domain detected: ${email}. Terminating session.`);
              logAuditEvent(
                email,
                'REJECTED_UNAUTHORIZED_DOMAIN',
                `Attempted login with unauthorized domain. Expected ${ALLOWED_DOMAIN}`
              ).then(() => loadAuditHistory()).catch(() => {});

              await enforceDomainOrSignOut(currentFirebaseUser);
              if (isMounted) {
                setUser(null);
                setFirebaseUser(null);
                setError(DOMAIN_RESTRICTION_ERROR);
                setIsLoading(false);
              }
              return;
            }

            // Valid @hbplus.fit domain
            setFirebaseUser(currentFirebaseUser);
            try {
              const profile = await syncUserProfile(
                currentFirebaseUser.uid,
                currentFirebaseUser.email!,
                currentFirebaseUser.displayName,
                currentFirebaseUser.photoURL
              );
              if (isMounted) {
                setUser(profile);
                await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(profile));
                logAuditEvent(
                  profile.email,
                  'SUCCESS',
                  'Firebase Auth token validated. Domain confirmed.',
                  profile.role
                ).then(() => loadAuditHistory()).catch(() => {});
              }
            } catch (err) {
              console.warn('Profile sync error in auth listener:', err);
            }
          } else {
            if (isMounted && isConfiguredWithRealFirebase()) {
              setUser(null);
              setFirebaseUser(null);
            }
          }
          if (isMounted) {
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.warn('onAuthStateChanged setup warning:', err);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  /**
   * Primary Google OAuth Sign-In (Directly launches Google's account selection modal)
   */
  const signInWithGoogle = async (): Promise<void> => {
    clearError();
    setIsAuthenticating(true);

    try {
      // Direct call to Google OAuth popup
      const profile = await signInWithGoogleWeb();
      setUser(profile);
      logAuditEvent(profile.email, 'SUCCESS', 'Signed in via Google OAuth 2.0 Web popup', profile.role)
        .then(() => loadAuditHistory())
        .catch(() => {});
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      const code = err.code || '';
      const msg = err.message || '';

      if (msg === DOMAIN_RESTRICTION_ERROR || msg.includes('official domain email')) {
        setError(DOMAIN_RESTRICTION_ERROR);
      } else if (code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In was closed before selecting an account. Please try again.');
      } else if (code === 'auth/popup-blocked') {
        setError('Google Sign-In popup was blocked by your browser. Please allow popups for this site.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized in Firebase Console > Authentication > Settings > Authorized domains.');
      } else if (
        code === 'auth/invalid-api-key' ||
        code === 'auth/api-key-not-valid' ||
        msg.includes('api-key') ||
        msg.includes('Placeholder')
      ) {
        setError(
          'Firebase Configuration Notice: Your .env file contains placeholder Firebase keys. To perform live Google sign-in with your real account, add your actual Firebase API keys in .env. In the meantime, use the Verification Lab below to test all scenarios.'
        );
      } else {
        setError(msg || 'An error occurred during Google authentication.');
      }
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Simulated Google Sign-In for testing domain rejection and roles interactively
   */
  const simulateGoogleSignIn = async (
    email: string,
    displayName: string = 'HB+ Team Member',
    roleOverride?: UserRole
  ): Promise<void> => {
    clearError();
    setIsAuthenticating(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Strict Domain Validation (Requirements 2 & 3)
      if (!validateHbPlusDomain(normalizedEmail)) {
        await signOutUser();
        setUser(null);
        setFirebaseUser(null);
        setError(DOMAIN_RESTRICTION_ERROR);
        logAuditEvent(
          normalizedEmail,
          'REJECTED_UNAUTHORIZED_DOMAIN',
          `Access restricted: Domain ${normalizedEmail.split('@')[1] || 'unknown'} is not permitted.`
        ).then(() => loadAuditHistory()).catch(() => {});
        throw new Error(DOMAIN_RESTRICTION_ERROR);
      }

      // 2. Determine Role (Admin vs User)
      const role: UserRole =
        roleOverride ||
        (configuredAdminEmails.includes(normalizedEmail) || normalizedEmail.startsWith('admin')
          ? 'admin'
          : 'user');

      const mockProfile: UserProfile = {
        uid: `sim_${Date.now()}`,
        email: normalizedEmail,
        displayName: displayName || normalizedEmail.split('@')[0],
        photoURL:
          role === 'admin'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        role,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        domain: ALLOWED_DOMAIN,
        providerId: 'google.com',
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(mockProfile));
      setUser(mockProfile);

      logAuditEvent(
        mockProfile.email,
        'SUCCESS',
        `Authenticated successfully as ${role.toUpperCase()} (@hbplus.fit)`,
        role
      ).then(() => loadAuditHistory()).catch(() => {});
    } catch (err: any) {
      if (err.message === DOMAIN_RESTRICTION_ERROR) {
        setError(DOMAIN_RESTRICTION_ERROR);
      } else {
        setError(err.message || 'Authentication failed');
      }
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Fast, reliable Sign Out (Immediate state clear, non-blocking network cleanup)
   */
  const signOut = async (): Promise<void> => {
    setIsLoggingOut(true);
    setIsAuthenticating(false); // Ensure login button is NEVER in loading state on signout!
    const prevEmail = user?.email || 'authenticated user';

    try {
      // 1. Clear session immediately so app navigates to LoginScreen instantly
      setUser(null);
      setFirebaseUser(null);
      clearError();
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);

      // 2. Clear Firebase Auth session in background without blocking
      await signOutUser();

      // 3. Log audit event in background
      logAuditEvent(prevEmail, 'LOGOUT', 'User signed out. Local tokens and session cleared.')
        .then(() => loadAuditHistory())
        .catch(() => {});
    } catch (err: any) {
      console.warn('Sign out warning:', err);
      setUser(null);
      setFirebaseUser(null);
    } finally {
      setIsLoggingOut(false);
      setIsAuthenticating(false);
    }
  };

  /**
   * Refresh user profile from Firestore
   */
  const refreshUserProfile = async (): Promise<void> => {
    if (!user?.uid) return;
    try {
      const refreshed = await fetchUserProfile(user.uid);
      if (refreshed && validateHbPlusDomain(refreshed.email)) {
        setUser(refreshed);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(refreshed));
      }
      loadAuditHistory();
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticating,
        isLoggingOut,
        error,
        signInWithGoogle,
        simulateGoogleSignIn,
        signOut,
        clearError,
        isDemoMode,
        refreshUserProfile,
        auditLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
