import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import Avatar from '../common/Avatar';

const CreatePostCard = ({ onPress, userName = 'User' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Avatar name={userName} size={40} />
        <TouchableOpacity style={styles.inputButton} onPress={onPress}>
          <Text style={styles.inputPlaceholder}>What's on your mind?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
          <Ionicons name="videocam" size={20} color={Colors.error} />
          <Text style={styles.actionText}>Live</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
          <Ionicons name="image" size={20} color={Colors.success} />
          <Text style={styles.actionText}>Photo</Text>
        </TouchableOpacity>
        <View style={styles.verticalDivider} />
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
          <Ionicons name="happy" size={20} color={Colors.warning} />
          <Text style={styles.actionText}>Feeling</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  inputButton: {
    flex: 1,
    marginLeft: Spacing.md,
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputPlaceholder: {
    ...Typography.bodySmall,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    gap: 6,
  },
  actionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.divider,
  },
});

export default CreatePostCard;
