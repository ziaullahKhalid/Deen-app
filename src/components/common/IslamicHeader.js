import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Gradients, Typography, Spacing } from '../../theme';

const IslamicPattern = () => (
  <View style={styles.patternContainer}>
    {[...Array(8)].map((_, i) => (
      <View
        key={i}
        style={[
          styles.patternDot,
          {
            left: `${(i * 14) + 2}%`,
            opacity: 0.15,
          },
        ]}
      />
    ))}
  </View>
);

const IslamicHeader = ({ title, subtitle, leftIcon, rightIcon, onLeftPress, onRightPress, showPattern = true }) => {
  return (
    <LinearGradient colors={Gradients.header} style={styles.container}>
      {showPattern && <IslamicPattern />}
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftIcon && (
            <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
              <Ionicons name={leftIcon} size={24} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              <Ionicons name={rightIcon} size={24} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.goldAccent} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patternDot: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    ...Typography.h3,
    color: Colors.textOnPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.goldLight,
    marginTop: 2,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  goldAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.gold,
  },
});

export default IslamicHeader;
