import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/Navbar';
import { UserProfileCard } from '../components/UserProfileCard';
import { AdminPanel } from '../components/AdminPanel';
import { SessionDetailsCard } from '../components/SessionDetailsCard';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { QuickMetricsBar } from '../components/dashboard/QuickMetricsBar';
import { AthleteHub } from '../components/dashboard/AthleteHub';
import { RoleGuard } from '../components/common/RoleGuard';

export const DashboardScreen: React.FC = () => {
  const { user, signOut, isLoggingOut, refreshUserProfile } = useAuth();
  const { isDesktop } = useResponsive();
  const { showSuccess, showInfo } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!user) {
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUserProfile();
    setTimeout(() => {
      setIsRefreshing(false);
      showInfo('User profile synchronized with latest Firestore records');
    }, 400);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess('You have been signed out securely.');
    } catch {
      // safe fallback
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar onLogoutPress={handleSignOut} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
        ]}
      >
        <View style={styles.mainContainer}>
          {/* 1. Welcome Greeting & Actions */}
          <WelcomeBanner
            displayName={user.displayName}
            onRefresh={handleRefresh}
            onSignOut={handleSignOut}
            isRefreshing={isRefreshing}
            isLoggingOut={isLoggingOut}
          />

          {/* 2. Security & Role Metrics */}
          <QuickMetricsBar role={user.role} domain={user.domain} />

          {/* 3. Main User Profile */}
          <UserProfileCard user={user} />

          {/* 4. Declarative Role-Based Access Gate */}
          <RoleGuard requiredRole="admin" fallback={<AthleteHub />}>
            <AdminPanel currentUser={user} />
          </RoleGuard>

          {/* 5. Session & Diagnostic Information */}
          <SessionDetailsCard email={user.email} providerId={user.providerId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  scrollContentDesktop: {
    paddingHorizontal: 32,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 1080,
  },
});
