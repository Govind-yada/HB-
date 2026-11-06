import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { colors } from '../../theme/colors';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -16,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss(toast.id);
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const getConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#064E3B',
          border: '#059669',
          text: '#A7F3D0',
          titleColor: '#34D399',
          icon: '✓',
        };
      case 'error':
        return {
          bg: '#7F1D1D',
          border: '#DC2626',
          text: '#FECACA',
          titleColor: '#F87171',
          icon: '✕',
        };
      case 'info':
      default:
        return {
          bg: '#0C4A6E',
          border: '#0284C7',
          text: '#BAE6FD',
          titleColor: '#38BDF8',
          icon: 'ℹ',
        };
    }
  };

  const config = getConfig();

  return (
    <Animated.View
      style={[
        styles.toastCard,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconCircle}>
        <Text style={[styles.iconText, { color: config.titleColor }]}>{config.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        {toast.title ? (
          <Text style={[styles.title, { color: config.titleColor }]}>{toast.title}</Text>
        ) : null}
        <Text style={[styles.message, { color: config.text }]}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4,
    minWidth: 280,
    maxWidth: 420,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 13,
    fontWeight: '800',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});
