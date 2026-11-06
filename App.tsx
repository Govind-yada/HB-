import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ToastProvider } from './src/context/ToastContext';
import { Navigation } from './src/navigation/Navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <ToastProvider>
          <Navigation />
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
