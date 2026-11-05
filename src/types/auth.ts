export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string | null;
  lastLoginAt: string | null;
  domain: string;
  providerId?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: any | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  simulateGoogleSignIn: (email: string, displayName?: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  isDemoMode: boolean;
  refreshUserProfile: () => Promise<void>;
}

export interface ResponsiveInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}
