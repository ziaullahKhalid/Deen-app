import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PostCard from '../../components/feed/PostCard';
import CreatePostCard from '../../components/feed/CreatePostCard';
import { getPosts } from '../../services/feedService';
import { getCurrentUser } from '../../services/authService';

const FeedScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
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

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <>
          <CreatePostCard
            onPress={() => navigation && navigation.navigate('CreatePost')}
            userName={user?.displayName || 'User'}
          />
          <PostCard post={item} />
        </>
      );
    }
    return <PostCard post={item} />;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D3B0F', '#1B5E20']} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Deen App</Text>
          <Text style={styles.headerSubtitle}>Your Community Feed</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation && navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
            colors={['#1B5E20']}
            tintColor="#1B5E20"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {initialLoading ? (
              <ActivityIndicator size="large" color="#1B5E20" />
            ) : (
              <>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="newspaper-outline" size={56} color="#1B5E20" />
                </View>
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>Be the first to share something!</Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation && navigation.navigate('CreatePost')}
                >
                  <Text style={styles.emptyBtnText}>Create Post</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 45,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#D4AF37',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 6,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1.5,
    borderColor: '#1B5E20',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(27, 94, 32, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptyBtn: {
    marginTop: 20,
    backgroundColor: '#1B5E20',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default FeedScreen;
