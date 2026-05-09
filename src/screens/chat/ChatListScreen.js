import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import IslamicHeader from '../../components/common/IslamicHeader';
import Avatar from '../../components/common/Avatar';

const DEMO_CHATS = [
  {
    id: '1',
    name: 'Ahmad Al-Farsi',
    lastMessage: 'Assalamu Alaikum! How are you doing today?',
    time: '2m ago',
    unread: 3,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Islamic Study Group',
    lastMessage: 'Omar: We will continue with Chapter 5 tomorrow',
    time: '15m ago',
    unread: 12,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    lastMessage: 'JazakAllah Khair for the help!',
    time: '1h ago',
    unread: 0,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Family Group',
    lastMessage: 'Mom: Dinner is ready, come home',
    time: '2h ago',
    unread: 5,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Yusuf Al-Qahtani',
    lastMessage: 'See you at Jummah prayer inshaaAllah',
    time: '3h ago',
    unread: 0,
    isOnline: false,
  },
  {
    id: '6',
    name: 'Khadija Bint Walid',
    lastMessage: 'The event has been rescheduled to next week',
    time: '5h ago',
    unread: 1,
    isOnline: true,
  },
  {
    id: '7',
    name: 'Mosque Announcements',
    lastMessage: 'Admin: Eid prayer timing has been updated',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '8',
    name: 'Ibrahim Hassan',
    lastMessage: 'Can you share the notes from the lecture?',
    time: 'Yesterday',
    unread: 0,
    isOnline: false,
  },
];

const ChatItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={() => onPress(item)}>
    <View style={styles.avatarContainer}>
      <Avatar
        name={item.name}
        size={52}
        showOnline={!item.isGroup}
        isOnline={item.isOnline}
      />
    </View>
    <View style={styles.chatInfo}>
      <View style={styles.chatTopRow}>
        <Text style={[styles.chatName, item.unread > 0 && styles.unreadName]} numberOfLines={1}>
          {item.isGroup && <Ionicons name="people" size={14} color={Colors.textSecondary} />}
          {item.isGroup ? ' ' : ''}{item.name}
        </Text>
        <Text style={[styles.chatTime, item.unread > 0 && styles.unreadTime]}>
          {item.time}
        </Text>
      </View>
      <View style={styles.chatBottomRow}>
        <Text
          style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ChatListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats] = useState(DEMO_CHATS);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    if (navigation) {
      navigation.navigate('ChatRoom', { chatId: chat.id, chatName: chat.name });
    }
  };

  return (
    <View style={styles.container}>
      <IslamicHeader
        title="Messages"
        subtitle="Stay Connected"
        rightIcon="create-outline"
      />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusTitle}>Online Now</Text>
        <FlatList
          horizontal
          data={chats.filter((c) => c.isOnline)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.onlineUser}>
              <Avatar name={item.name} size={48} showOnline isOnline />
              <Text style={styles.onlineName} numberOfLines={1}>
                {item.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.onlineList}
        />
      </View>

      <View style={styles.divider} />

      <FlatList
        data={filteredChats}
        renderItem={({ item }) => <ChatItem item={item} onPress={handleChatPress} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    ...Typography.bodySmall,
    color: Colors.text,
    paddingVertical: Spacing.sm + 2,
    marginLeft: Spacing.sm,
  },
  statusBar: {
    paddingHorizontal: Spacing.md,
  },
  statusTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  onlineList: {
    gap: Spacing.md,
  },
  onlineUser: {
    alignItems: 'center',
    width: 60,
  },
  onlineName: {
    ...Typography.caption,
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.md,
  },
  chatList: {
    paddingBottom: Spacing.xxl,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  chatInfo: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    paddingBottom: Spacing.md,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    ...Typography.label,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadName: {
    fontWeight: '700',
  },
  chatTime: {
    ...Typography.caption,
    color: Colors.textLight,
  },
  unreadTime: {
    color: Colors.primary,
    fontWeight: '600',
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    ...Typography.caption,
    color: Colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});

export default ChatListScreen;
