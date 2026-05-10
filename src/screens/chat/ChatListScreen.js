import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Avatar from '../../components/common/Avatar';

const DEMO_CHATS = [
  {
    id: '1',
    name: 'Ahmad Al-Farsi',
    lastMessage: 'Assalamu Alaikum! How are you doing today?',
    time: '2:45 PM',
    unread: 3,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Islamic Study Group',
    lastMessage: 'Omar: We will continue with Chapter 5 tomorrow',
    time: '1:30 PM',
    unread: 12,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    lastMessage: 'JazakAllah Khair for the help!',
    time: '12:15 PM',
    unread: 0,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Family Group',
    lastMessage: 'Mom: Dinner is ready, come home',
    time: '11:00 AM',
    unread: 5,
    isOnline: false,
    isGroup: true,
  },
  {
    id: '5',
    name: 'Yusuf Al-Qahtani',
    lastMessage: 'See you at Jummah prayer inshaaAllah',
    time: '10:30 AM',
    unread: 0,
    isOnline: false,
  },
  {
    id: '6',
    name: 'Khadija Bint Walid',
    lastMessage: 'The event has been rescheduled to next week',
    time: '9:15 AM',
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

const NOTIFICATIONS = [
  { id: '1', type: 'like', user: 'Ahmad Al-Farsi', text: 'liked your post', time: '2m ago', read: false },
  { id: '2', type: 'comment', user: 'Fatima Zahra', text: 'commented on your post: "MashaAllah!"', time: '15m ago', read: false },
  { id: '3', type: 'follow', user: 'Yusuf Al-Qahtani', text: 'started following you', time: '1h ago', read: false },
  { id: '4', type: 'like', user: 'Khadija Bint Walid', text: 'liked your reel', time: '2h ago', read: true },
  { id: '5', type: 'share', user: 'Islamic Study Group', text: 'shared your post', time: '3h ago', read: true },
  { id: '6', type: 'comment', user: 'Ibrahim Hassan', text: 'replied to your comment', time: '5h ago', read: true },
];

const getNotifIcon = (type) => {
  switch (type) {
    case 'like': return { name: 'heart', color: '#E53935' };
    case 'comment': return { name: 'chatbubble', color: '#1B5E20' };
    case 'follow': return { name: 'person-add', color: '#1565C0' };
    case 'share': return { name: 'arrow-redo', color: '#D4AF37' };
    default: return { name: 'notifications', color: '#999' };
  }
};

const ChatItem = ({ item, onPress, onLongPress }) => (
  <TouchableOpacity
    style={styles.chatItem}
    onPress={() => onPress(item)}
    onLongPress={() => onLongPress(item)}
    delayLongPress={500}
  >
    <View style={styles.avatarWrap}>
      <Avatar name={item.name} size={52} />
      {!item.isGroup && item.isOnline && <View style={styles.onlineDot} />}
    </View>
    <View style={styles.chatInfo}>
      <View style={styles.chatTopRow}>
        <View style={styles.chatNameRow}>
          {item.isGroup && <Ionicons name="people" size={14} color="#999" style={{ marginRight: 4 }} />}
          <Text style={[styles.chatName, item.unread > 0 && styles.unreadName]} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <Text style={[styles.chatTime, item.unread > 0 && styles.unreadTime]}>
          {item.time}
        </Text>
      </View>
      <View style={styles.chatBottomRow}>
        <View style={styles.messagePreview}>
          {item.unread === 0 && (
            <Ionicons name="checkmark-done" size={16} color="#53BDEB" style={{ marginRight: 4 }} />
          )}
          <Text
            style={[styles.lastMessage, item.unread > 0 && styles.unreadMessage]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
        </View>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{item.unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const NotifItem = ({ item }) => {
  const icon = getNotifIcon(item.type);
  return (
    <View style={[styles.notifItem, !item.read && styles.notifUnread]}>
      <View style={styles.notifAvatarWrap}>
        <Avatar name={item.user} size={46} />
        <View style={[styles.notifIconBadge, { backgroundColor: icon.color }]}>
          <Ionicons name={icon.name} size={12} color="#FFF" />
        </View>
      </View>
      <View style={styles.notifInfo}>
        <Text style={styles.notifText}>
          <Text style={styles.notifUser}>{item.user}</Text> {item.text}
        </Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.notifDot} />}
    </View>
  );
};

const ChatListScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [chats, setChats] = useState(DEMO_CHATS);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    if (navigation) {
      navigation.navigate('ChatRoom', { chatId: chat.id, chatName: chat.name });
    }
  };

  const handleDeleteChat = (chat) => {
    Alert.alert(
      'Delete Chat',
      `Delete conversation with ${chat.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setChats((prev) => prev.filter((c) => c.id !== chat.id)),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* WhatsApp-style Header */}
      <LinearGradient colors={['#075E54', '#128C7E']} style={styles.header}>
        <Text style={styles.headerTitle}>Deen App</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Ionicons name="search" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs: Chats | Notifications */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chats' && styles.activeTab]}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            CHATS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            NOTIFICATIONS
          </Text>
          <View style={styles.notifTabBadge}>
            <Text style={styles.notifTabBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'chats' ? (
        <FlatList
          data={filteredChats}
          renderItem={({ item }) => (
            <ChatItem
              item={item}
              onPress={handleChatPress}
              onLongPress={handleDeleteChat}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={56} color="#CCC" />
              <Text style={styles.emptyText}>No conversations yet</Text>
              <Text style={styles.emptySubtext}>Start chatting with the community</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={NOTIFICATIONS}
          renderItem={({ item }) => <NotifItem item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatList}
        />
      )}

      {/* FAB - New Chat */}
      {activeTab === 'chats' && (
        <TouchableOpacity style={styles.fab}>
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            style={styles.fabGradient}
          >
            <Ionicons name="chatbubble" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#075E54',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  notifTabBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  notifTabBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  chatList: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 14,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#25D366',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatInfo: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 12,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    flex: 1,
  },
  unreadName: {
    fontWeight: '700',
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadTime: {
    color: '#25D366',
    fontWeight: '600',
  },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  unreadMessage: {
    color: '#666',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  notifUnread: {
    backgroundColor: '#E8F5E9',
  },
  notifAvatarWrap: {
    position: 'relative',
  },
  notifIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notifInfo: {
    flex: 1,
  },
  notifText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  notifUser: {
    fontWeight: '700',
  },
  notifTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#25D366',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ChatListScreen;
