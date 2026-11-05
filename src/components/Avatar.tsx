import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface AvatarProps {
  photoURL?: string | null;
  name?: string | null;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  photoURL,
  name,
  size = 56,
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (text?: string | null): string => {
    if (!text) return 'HB';
    const parts = text.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const hasValidPhoto = Boolean(photoURL && !imageError);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {hasValidPhoto ? (
        <Image
          source={{ uri: photoURL! }}
          onError={() => setImageError(true)}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: Math.max(14, Math.floor(size * 0.38)),
              },
            ]}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceHover,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: colors.surfaceHover,
  },
  placeholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
