import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';
import Avatar from '../components/common/Avatar';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: 'Ahmad Al-Farsi',
    text: 'liked your post',
    time: '2m ago',
    read: false,
    icon: 'heart',
    iconColor: '#E53935',
  },
  {
    id: '2',
    type: 'comment',
    user: 'Fatima Zahra',
    text: 'commented on your post: "MashAllah, beautiful reminder!"',
    time: '15m ago',
    read: false,
    icon: 'chatbubble',
    iconColor: '#1976D2',
  },
  {
    id: '3',
    type: 'follow',
    user: 'Omar Ibn Abdullah',
    text: 'started following you',
    time: '1h ago',
    read: false,
    icon: 'person-add',
    iconColor: '#2E7D32',
  },
  {
    id: '4',
    type: 'share',
    user: 'Aisha Begum',
    text: 'shared your post',
    time: '2h ago',
    read: true,
    icon: 'share-social',
    iconColor: '#7B1FA2',
  },
  {
    id: '5',
    type: 'like',
    user: 'Yusuf Al-Qahtani',
    text: 'liked your reel',
    time: '3h ago',
    read: true,
    icon: 'heart',
    iconColor: '#E53935',
  },
  {
    id: '6',
    type: 'comment',
    user: 'Khadija Bint Walid',
    text: 'replied to your comment',
    time: '5h ago',
    read: true,
    icon: 'chatbubble',
    iconColor: '#1976D2',
  },
  {
    id: '7',
    type: 'follow',
    user: 'Ibrahim Hassan',
    text: 'started following you',
    time: 'Yesterday',
    read: true,
    icon: 'person-add',
    iconColor: '#2E7D32',
  },
];

const NotificationItem = ({ item }) => (
  <TouchableOpacity
    style={[styles.notifItem, !item.read && styles.unreadItem]}
  >
    <View style={styles.notifLeft}>
      <View style={styles.avatarWrap}>
        <Avatar name={item.user} size={48} />
        <View style={[styles.iconBadge, { backgroundColor: item.iconColor }]}>
          <Ionicons name={item.icon} size={12} color="#FFF" />
        </View>
      </View>
    </View>
    <View style={styles.notifContent}>
      <Text style={styles.notifText}>
        <Text style={styles.notifUser}>{item.user} </Text>
        {item.text}
      </Text>
      <Text style={styles.notifTime}>{item.time}</Text>
    </View>
    {!item.read && <View style={styles.unreadDot} />}
  </TouchableOpacity>
);

const NotificationsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'like', label: 'Likes' },
    { key: 'comment', label: 'Comments' },
    { key: 'follow', label: 'Follows' },
  ];

  const filtered = activeFilter === 'all'
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter((n) => n.type === activeFilter);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D3B0F', '#1B5E20']} style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Ionicons name="checkmark-done" size={22} color="#D4AF37" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.activeChip]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.activeFilterText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 45,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeChip: {
    backgroundColor: '#1B5E20',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 12,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
  unreadItem: {
    backgroundColor: '#F0F8F0',
  },
  notifLeft: {
    marginRight: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notifContent: {
    flex: 1,
  },
  notifText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  notifUser: {
    fontWeight: '700',
  },
  notifTime: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 3,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1B5E20',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 12,
  },
});

export default NotificationsScreen;
