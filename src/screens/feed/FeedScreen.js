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
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PostCard from '../../components/feed/PostCard';
import Avatar from '../../components/common/Avatar';
import { getPosts } from '../../services/feedService';
import { getCurrentUser } from '../../services/authService';

const { width } = Dimensions.get('window');

const STORIES = [
  { id: 'add', name: 'Your Story', isAdd: true },
  { id: '1', name: 'Ahmad', hasNew: true },
  { id: '2', name: 'Fatima', hasNew: true },
  { id: '3', name: 'Yusuf', hasNew: false },
  { id: '4', name: 'Khadija', hasNew: true },
  { id: '5', name: 'Omar', hasNew: true },
  { id: '6', name: 'Aisha', hasNew: false },
];

const StoryItem = ({ story }) => (
  <TouchableOpacity style={styles.storyItem}>
    {story.isAdd ? (
      <View style={styles.storyAddCircle}>
        <View style={styles.storyAddInner}>
          <Ionicons name="add" size={28} color="#1B5E20" />
        </View>
      </View>
    ) : (
      <LinearGradient
        colors={story.hasNew ? ['#D4AF37', '#1B5E20', '#D4AF37'] : ['#CCC', '#CCC']}
        style={styles.storyRing}
      >
        <View style={styles.storyAvatarWrap}>
          <Avatar name={story.name} size={58} />
        </View>
      </LinearGradient>
    )}
    <Text style={styles.storyName} numberOfLines={1}>
      {story.name}
    </Text>
  </TouchableOpacity>
);

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

  const renderHeader = () => (
    <View>
      {/* Stories */}
      <View style={styles.storiesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        >
          {STORIES.map((story) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </ScrollView>
      </View>

      {/* Create Post Card */}
      <View style={styles.createPostCard}>
        <View style={styles.createPostRow}>
          <Avatar name={user?.displayName || 'User'} size={42} />
          <TouchableOpacity
            style={styles.createPostInput}
            onPress={() => navigation && navigation.navigate('CreatePost')}
          >
            <Text style={styles.createPostPlaceholder}>What's on your mind?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.createPostDivider} />
        <View style={styles.createPostActions}>
          <TouchableOpacity style={styles.createPostAction}>
            <Ionicons name="videocam" size={20} color="#E53935" />
            <Text style={styles.createPostActionText}>Live</Text>
          </TouchableOpacity>
          <View style={styles.createPostActionDivider} />
          <TouchableOpacity
            style={styles.createPostAction}
            onPress={() => navigation && navigation.navigate('CreatePost')}
          >
            <Ionicons name="images" size={20} color="#43A047" />
            <Text style={styles.createPostActionText}>Photo</Text>
          </TouchableOpacity>
          <View style={styles.createPostActionDivider} />
          <TouchableOpacity style={styles.createPostAction}>
            <Ionicons name="happy" size={20} color="#FB8C00" />
            <Text style={styles.createPostActionText}>Feeling</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#0D3B0F', '#1B5E20']} style={styles.header}>
        <Text style={styles.headerTitle}>Deen App</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation && navigation.navigate('CreatePost')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
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
              <View style={styles.emptyInner}>
                <Ionicons name="newspaper-outline" size={48} color="#B0BEC5" />
                <Text style={styles.emptyText}>No posts yet</Text>
                <Text style={styles.emptySubtext}>Be the first to share with the community!</Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation && navigation.navigate('CreatePost')}
                >
                  <Text style={styles.emptyBtnText}>Create Post</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#ECEEF1',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 4,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storiesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginBottom: 8,
  },
  storiesList: {
    paddingHorizontal: 12,
    gap: 10,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAvatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAddCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyAddInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B5E20',
    borderStyle: 'dashed',
  },
  storyName: {
    fontSize: 11,
    color: '#333',
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  createPostCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  createPostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  createPostInput: {
    flex: 1,
    backgroundColor: '#F5F6F8',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  createPostPlaceholder: {
    color: '#9E9E9E',
    fontSize: 14,
  },
  createPostDivider: {
    height: 0.5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 14,
  },
  createPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  createPostAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  createPostActionText: {
    fontSize: 13,
    color: '#616161',
    fontWeight: '500',
  },
  createPostActionDivider: {
    width: 0.5,
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyInner: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#424242',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 6,
    textAlign: 'center',
  },
  emptyBtn: {
    backgroundColor: '#1B5E20',
    borderRadius: 22,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default FeedScreen;
