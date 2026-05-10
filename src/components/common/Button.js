import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Typography, Spacing, BorderRadius } from '../../theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.textOnPrimary} />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.text,
              variant === 'outline' && styles.outlineText,
              variant === 'accent' && styles.accentText,
              size === 'sm' && styles.smallText,
              size === 'lg' && styles.largeText,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[style]}>
        <LinearGradient
          colors={disabled ? ['#999', '#888'] : Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, size === 'sm' && styles.small, size === 'lg' && styles.large]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'accent') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[style]}>
        <LinearGradient
          colors={disabled ? ['#999', '#888'] : Gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, size === 'sm' && styles.small, size === 'lg' && styles.large]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        size === 'sm' && styles.small,
        size === 'lg' && styles.large,
        disabled && styles.disabled,
        style,
      ]}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  accentText: {
    color: Colors.textOnAccent,
  },
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    marginRight: Spacing.sm,
  },
});

export default Button;
