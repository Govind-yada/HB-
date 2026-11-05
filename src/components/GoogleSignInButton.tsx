import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';

interface GoogleSignInButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  title = 'Sign in with Google',
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        Platform.OS === 'web' && ({ cursor: isDisabled ? 'not-allowed' : 'pointer' } as any),
      ]}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator color="#1F2937" size="small" style={styles.loader} />
        ) : (
          <GoogleIcon />
        )}
        <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
          {loading ? 'Authenticating...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Clean 4-color Google "G" Icon rendered with pure React Native components
 */
const GoogleIcon: React.FC = () => {
  return (
    <View style={styles.iconContainer}>
      {/* Outer container */}
      <View style={styles.googleG}>
        {/* Blue bar */}
        <View style={styles.blueBar} />
        {/* Red arc */}
        <View style={styles.redArc} />
        {/* Yellow arc */}
        <View style={styles.yellowArc} />
        {/* Green arc */}
        <View style={styles.greenArc} />
        {/* Center cutout */}
        <View style={styles.centerCutout}>
          <Text style={styles.gText}>G</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.googleButtonBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.googleButtonBorder,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 12,
  },
  buttonText: {
    color: colors.googleButtonText,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginLeft: 12,
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
  iconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  blueBar: {
    position: 'absolute',
    right: 0,
    top: 7,
    width: 12,
    height: 6,
    backgroundColor: '#4285F4',
    zIndex: 2,
  },
  redArc: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 11,
    backgroundColor: '#EA4335',
  },
  yellowArc: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 11,
    height: 11,
    backgroundColor: '#FBBC05',
  },
  greenArc: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    backgroundColor: '#34A853',
  },
  centerCutout: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  gText: {
    color: '#4285F4',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -1,
  },
});
