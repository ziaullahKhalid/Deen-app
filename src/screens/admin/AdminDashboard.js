import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Typography, Spacing, BorderRadius } from '../../theme';
import IslamicHeader from '../../components/common/IslamicHeader';

const { width } = Dimensions.get('window');

const StatCard = ({ icon, title, value, trend, trendUp, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statIcon}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {trend && (
      <View style={styles.trendRow}>
        <Ionicons
          name={trendUp ? 'trending-up' : 'trending-down'}
          size={14}
          color={trendUp ? Colors.success : Colors.error}
        />
        <Text style={[styles.trendText, { color: trendUp ? Colors.success : Colors.error }]}>
          {trend}
        </Text>
      </View>
    )}
  </View>
);

const ActionCard = ({ icon, title, description, onPress, color }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.actionInfo}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
  </TouchableOpacity>
);

const RecentActivityItem = ({ icon, text, time, color }) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityDot, { backgroundColor: color }]} />
    <View style={styles.activityInfo}>
      <Text style={styles.activityText}>{text}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <View style={styles.container}>
      <IslamicHeader
        title="Admin Panel"
        subtitle="Dashboard & Management"
        rightIcon="notifications-outline"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.welcomeCard}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.welcomeGradient}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeTitle}>Welcome back, Admin</Text>
              <Text style={styles.welcomeSubtitle}>
                Here is your platform overview for today
              </Text>
            </View>
            <View style={styles.welcomeIcon}>
              <Ionicons name="shield-checkmark" size={50} color="rgba(255,255,255,0.2)" />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="people"
            title="Total Users"
            value="12,458"
            trend="+12.5%"
            trendUp
            color={Colors.primary}
          />
          <StatCard
            icon="document-text"
            title="Total Posts"
            value="45,672"
            trend="+8.3%"
            trendUp
            color={Colors.info}
          />
          <StatCard
            icon="videocam"
            title="Videos"
            value="3,284"
            trend="+15.7%"
            trendUp
            color={Colors.warning}
          />
          <StatCard
            icon="chatbubbles"
            title="Messages"
            value="89.2K"
            trend="+22.1%"
            trendUp
            color={Colors.accent}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <ActionCard
            icon="people-outline"
            title="Manage Users"
            description="View, edit, or remove user accounts"
            color={Colors.primary}
          />
          <ActionCard
            icon="flag-outline"
            title="Reported Content"
            description="Review flagged posts and videos"
            color={Colors.error}
          />
          <ActionCard
            icon="megaphone-outline"
            title="Announcements"
            description="Send platform-wide notifications"
            color={Colors.warning}
          />
          <ActionCard
            icon="analytics-outline"
            title="Analytics"
            description="View detailed platform analytics"
            color={Colors.info}
          />
          <ActionCard
            icon="settings-outline"
            title="App Settings"
            description="Configure app behavior and features"
            color={Colors.textSecondary}
          />
          <ActionCard
            icon="cloud-upload-outline"
            title="Storage Manager"
            description="Manage Google Drive storage usage"
            color={Colors.success}
          />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <RecentActivityItem
            icon="person-add"
            text="New user registration: Maryam Al-Hassan"
            time="2 minutes ago"
            color={Colors.success}
          />
          <RecentActivityItem
            icon="flag"
            text="Post flagged for review by community"
            time="15 minutes ago"
            color={Colors.error}
          />
          <RecentActivityItem
            icon="videocam"
            text="New video uploaded by Imam Khalid"
            time="1 hour ago"
            color={Colors.info}
          />
          <RecentActivityItem
            icon="chatbubbles"
            text="New group chat created: Ramadan 2025"
            time="2 hours ago"
            color={Colors.warning}
          />
          <RecentActivityItem
            icon="person"
            text="User profile updated: Ahmad Al-Farsi"
            time="3 hours ago"
            color={Colors.primary}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  welcomeCard: {
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeGradient: {
    flexDirection: 'row',
    padding: Spacing.lg,
    alignItems: 'center',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    ...Typography.h3,
    color: Colors.textOnPrimary,
  },
  welcomeSubtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: Spacing.xs,
  },
  welcomeIcon: {
    marginLeft: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    borderLeftWidth: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  statTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 4,
  },
  trendText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  actionsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionTitle: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
  },
  actionDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  activityContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: Spacing.md,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  activityTime: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: 2,
  },
  bottomSpacer: {
    height: Spacing.xxl,
  },
});

export default AdminDashboard;
