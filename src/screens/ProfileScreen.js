import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Typography, Spacing, BorderRadius } from '../theme';
import Avatar from '../components/common/Avatar';
import { getCurrentUser, getUserProfile, logoutUser } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      if (navigation && navigation.replace) {
        navigation.replace('Login');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, color = Colors.text }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}12` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || (
        <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={Gradients.header} style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Avatar name={user?.displayName || 'User'} size={80} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.displayName || 'Your Name'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'user@islamicqadeem.com'}</Text>
          <Text style={styles.profileBio}>{profile?.bio || 'Seeking knowledge, sharing light'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.profileStat}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.profileStat}>
            <Text style={styles.statNumber}>580</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.goldAccent} />
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            color={Colors.primary}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy"
            subtitle="Control who can see your content"
            color={Colors.info}
          />
          <SettingItem
            icon="key-outline"
            title="Security"
            subtitle="Password and two-factor authentication"
            color={Colors.warning}
          />
        </View>

        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push notification preferences"
            color={Colors.accent}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={notificationsEnabled ? Colors.primary : '#f4f3f4'}
              />
            }
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Toggle dark theme"
            color="#6C63FF"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={darkMode ? Colors.primary : '#f4f3f4'}
              />
            }
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle="English"
            color={Colors.success}
          />
        </View>

        <Text style={styles.sectionHeader}>Support</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            subtitle="Get help using the app"
            color={Colors.info}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Review our policies"
            color={Colors.textSecondary}
          />
          <SettingItem
            icon="star-outline"
            title="Rate the App"
            subtitle="Share your feedback"
            color={Colors.accent}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Deen App v2.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    position: 'relative',
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileName: {
    ...Typography.h3,
    color: '#FFF',
    marginTop: Spacing.md,
  },
  profileEmail: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  profileBio: {
    ...Typography.bodySmall,
    color: Colors.goldLight,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  profileStat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h3,
    color: '#FFF',
  },
  statLabel: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  goldAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.gold,
  },
  content: {
    padding: Spacing.md,
  },
  sectionHeader: {
    ...Typography.label,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  settingTitle: {
    ...Typography.label,
    color: Colors.text,
  },
  settingSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    ...Typography.button,
    color: Colors.error,
  },
  versionText: {
    ...Typography.caption,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
});

export default ProfileScreen;
