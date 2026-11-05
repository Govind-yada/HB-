import { ALLOWED_DOMAIN, DEFAULT_ADMIN_EMAILS } from './constants';

export interface FirebaseConfigType {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfigType = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKeyHBPlusFit123456',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'hbplus-auth-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'hbplus-auth-app',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'hbplus-auth-app.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '102938475610',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:102938475610:web:9876543210abcdef',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-DEMOHBPLUS01',
};

// Check if credentials are live vs mock placeholder
export const isConfiguredWithRealFirebase = (): boolean => {
  const apiKey = firebaseConfig.apiKey;
  return Boolean(apiKey && !apiKey.includes('Placeholder') && apiKey.startsWith('AIzaSy'));
};

export const oauthConfig = {
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
};

export const configuredAllowedDomain = process.env.EXPO_PUBLIC_ALLOWED_DOMAIN || ALLOWED_DOMAIN;

export const configuredAdminEmails: string[] = process.env.EXPO_PUBLIC_INITIAL_ADMIN_EMAILS
  ? process.env.EXPO_PUBLIC_INITIAL_ADMIN_EMAILS.split(',').map((e: string) => e.trim().toLowerCase())
  : DEFAULT_ADMIN_EMAILS;
