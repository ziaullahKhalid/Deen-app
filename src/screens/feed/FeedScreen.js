import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import IslamicHeader from '../../components/common/IslamicHeader';
import PostCard from '../../components/feed/PostCard';
import CreatePostCard from '../../components/feed/CreatePostCard';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';

const DEMO_POSTS = [
  {
    id: '1',
    authorName: 'Ahmad Al-Farsi',
    authorAvatar: null,
    content: 'SubhanAllah! The beauty of the morning sky reminds us of the greatness of our Creator. Every sunrise is a blessing and a new opportunity to do good deeds. Let us make the most of this beautiful day. #IslamicQadeem #MorningBlessings',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    likesCount: 142,
    commentsCount: 23,
    sharesCount: 8,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    authorName: 'Fatima Zahra',
    authorAvatar: null,
    content: 'Just finished reading Surah Al-Kahf. The stories in this surah are timeless and so relevant to our modern lives. May Allah guide us all to the straight path.',
    imageUrl: null,
    likesCount: 89,
    commentsCount: 15,
    sharesCount: 12,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    authorName: 'Omar Ibn Abdullah',
    authorAvatar: null,
    content: 'Beautiful mosque architecture from around the world. The craftsmanship and dedication that went into building these sacred spaces is truly inspiring.',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600',
    likesCount: 256,
    commentsCount: 34,
    sharesCount: 45,
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: '4',
    authorName: 'Aisha Begum',
    authorAvatar: null,
    content: 'Reminder: "The best among you are those who have the best manners and character." - Prophet Muhammad (PBUH). Let us strive to embody this hadith in our daily lives.',
    imageUrl: null,
    likesCount: 312,
    commentsCount: 41,
    sharesCount: 67,
    createdAt: new Date(Date.now() - 28800000),
  },
  {
    id: '5',
    authorName: 'Yusuf Al-Qahtani',
    authorAvatar: null,
    content: 'Alhamdulillah for another blessed Friday. Jummah Mubarak to all the brothers and sisters around the world!',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600',
    likesCount: 478,
    commentsCount: 56,
    sharesCount: 89,
    createdAt: new Date(Date.now() - 43200000),
  },
];

const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState('');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now().toString(),
      authorName: 'You',
      authorAvatar: null,
      content: newPostText,
      imageUrl: null,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowCreatePost(false);
  };

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <>
          <CreatePostCard onPress={() => setShowCreatePost(true)} />
          <PostCard post={item} />
        </>
      );
    }
    return <PostCard post={item} />;
  };

  return (
    <View style={styles.container}>
      <IslamicHeader
        title="Islamic Qadeem"
        subtitle="Your Community Feed"
        rightIcon="search-outline"
      />

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={64} color={Colors.textLight} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share something!</Text>
          </View>
        }
      />

      <Modal
        visible={showCreatePost}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreatePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={handleCreatePost}>
                <Text style={styles.postButton}>Post</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <View style={styles.authorRow}>
                <Avatar name="You" size={40} />
                <Text style={styles.authorLabel}>You</Text>
              </View>
              <TextInput
                style={styles.postInput}
                placeholder="What's on your mind?"
                placeholderTextColor={Colors.textLight}
                multiline
                value={newPostText}
                onChangeText={setNewPostText}
                autoFocus
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalAction}>
                <Ionicons name="image" size={24} color={Colors.success} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAction}>
                <Ionicons name="videocam" size={24} color={Colors.error} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAction}>
                <Ionicons name="location" size={24} color={Colors.info} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAction}>
                <Ionicons name="happy" size={24} color={Colors.warning} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalTitle: {
    ...Typography.h4,
    color: Colors.text,
  },
  postButton: {
    ...Typography.button,
    color: Colors.primary,
  },
  modalBody: {
    flex: 1,
    padding: Spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  authorLabel: {
    ...Typography.label,
    color: Colors.text,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  postInput: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  modalActions: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.lg,
  },
  modalAction: {
    padding: Spacing.xs,
  },
});

export default FeedScreen;
