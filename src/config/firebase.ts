import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { firebaseConfig } from './env';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Cross-platform authentication persistence & popup resolver configuration
  if (Platform.OS === 'web') {
    // Web: initialize with browser local persistence AND explicit browserPopupRedirectResolver
    try {
      auth = initializeAuth(app, {
        persistence: [browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    } catch {
      auth = getAuth(app);
    }
  } else {
    // Native (Android / iOS): Secure AsyncStorage persistence
    try {
      const authModule = require('@firebase/auth');
      if (typeof authModule.getReactNativePersistence === 'function') {
        auth = initializeAuth(app, {
          persistence: authModule.getReactNativePersistence(AsyncStorage),
        });
      } else {
        auth = getAuth(app);
      }
    } catch {
      auth = getAuth(app);
    }
  }

  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization warning:', error);
  try {
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch {
    app = {} as FirebaseApp;
    auth = {} as Auth;
    db = {} as Firestore;
  }
}

// Google OAuth Provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: 'hbplus.fit', // Hint to Google OAuth to prefer/highlight hbplus.fit accounts
});

export { app, auth, db, googleProvider, browserPopupRedirectResolver };
