import React, { useState, useCallback, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import IslamicHeader from '../../components/common/IslamicHeader';
import PostCard from '../../components/feed/PostCard';
import CreatePostCard from '../../components/feed/CreatePostCard';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { createPost, getPosts, likePost, unlikePost } from '../../services/feedService';
import { getCurrentUser } from '../../services/authService';

const FeedScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const user = getCurrentUser();

  const loadPosts = async () => {
    try {
      const fetchedPosts = await getPosts(50);
      const formattedPosts = fetchedPosts.map((post) => ({
        ...post,
        authorName: post.authorName || post.displayName || 'User',
        authorAvatar: post.authorAvatar || post.photoURL || null,
        createdAt: post.createdAt?.toDate ? post.createdAt.toDate() : new Date(),
      }));
      setPosts(formattedPosts);
    } catch (err) {
      console.log('Error loading posts:', err);
    }
  };

  useEffect(() => {
    loadPosts().finally(() => setInitialLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, []);

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    try {
      await createPost({
        authorId: user?.uid || 'anonymous',
        authorName: user?.displayName || 'You',
        authorAvatar: user?.photoURL || null,
        content: newPostText.trim(),
        imageUrl: null,
      });
      setNewPostText('');
      setShowCreatePost(false);
      await loadPosts();
    } catch (err) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
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
            {initialLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <>
                <Ionicons name="newspaper-outline" size={64} color={Colors.textLight} />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>Be the first to share something!</Text>
              </>
            )}
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
                <Avatar name={user?.displayName || 'You'} size={40} />
                <Text style={styles.authorLabel}>{user?.displayName || 'You'}</Text>
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
