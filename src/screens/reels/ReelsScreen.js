import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import Avatar from '../../components/common/Avatar';

const { width, height } = Dimensions.get('window');
const REEL_HEIGHT = height - (Platform.OS === 'ios' ? 83 : 60);

const DEMO_REELS = [
  {
    id: '1',
    authorName: 'Imam Khalid',
    authorAvatar: null,
    description: 'Beautiful Quran recitation - Surah Ar-Rahman. The words of Allah bring peace to the heart.',
    likes: 5420,
    comments: 342,
    shares: 128,
    color: '#1B5E20',
    hashtags: ['#Quran', '#SurahArRahman', '#IslamicQadeem'],
  },
  {
    id: '2',
    authorName: 'Nasheed Studio',
    authorAvatar: null,
    description: 'New nasheed release - "Ya Nabi Salam Alayka". Share the love of the Prophet (PBUH).',
    likes: 12800,
    comments: 890,
    shares: 567,
    color: '#0D47A1',
    hashtags: ['#Nasheed', '#Prophet', '#IslamicMusic'],
  },
  {
    id: '3',
    authorName: 'Islamic Wisdom',
    authorAvatar: null,
    description: '5 habits of highly successful Muslims. Transform your daily routine with Sunnah practices.',
    likes: 8900,
    comments: 456,
    shares: 234,
    color: '#4A148C',
    hashtags: ['#IslamicWisdom', '#MuslimHabits', '#Sunnah'],
  },
  {
    id: '4',
    authorName: 'Travel Umrah',
    authorAvatar: null,
    description: 'Breathtaking views of Masjid Al-Haram during Fajr prayer. The house of Allah in all its glory.',
    likes: 34500,
    comments: 1200,
    shares: 890,
    color: '#BF360C',
    hashtags: ['#Makkah', '#MasjidAlHaram', '#Umrah'],
  },
  {
    id: '5',
    authorName: 'Chef Halal',
    authorAvatar: null,
    description: 'Easy iftar recipe: Traditional lamb biryani with saffron rice. Perfect for gathering!',
    likes: 6700,
    comments: 345,
    shares: 167,
    color: '#33691E',
    hashtags: ['#HalalFood', '#Iftar', '#Biryani'],
  },
];

const formatCount = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const ReelItem = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <View style={[styles.reelContainer, { height: REEL_HEIGHT }]}>
      <LinearGradient
        colors={[item.color, '#000000']}
        style={styles.reelBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.reelOverlayContent}>
          <View style={styles.centerContent}>
            <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.3)" />
            <Text style={styles.videoPlaceholder}>Video Content</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.topBar}>
        <Text style={styles.reelsTitle}>Deen Reels</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? Colors.error : '#FFF'}
          />
          <Text style={styles.actionCount}>{formatCount(item.likes + (liked ? 1 : 0))}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-ellipses" size={26} color="#FFF" />
          <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={26} color="#FFF" />
          <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={26} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfo}>
        <View style={styles.authorRow}>
          <Avatar name={item.authorName} size={36} />
          <Text style={styles.reelAuthor}>{item.authorName}</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reelDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.hashtagRow}>
          {item.hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>{tag} </Text>
          ))}
        </View>

        <View style={styles.musicRow}>
          <Ionicons name="musical-notes" size={14} color="#FFF" />
          <Text style={styles.musicText}>Original Audio - {item.authorName}</Text>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentsOverlay}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments ({formatCount(item.comments)})</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.commentsList}>
            <View style={styles.commentItem}>
              <Avatar name="User 1" size={32} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>Abdullah</Text>
                <Text style={styles.commentText}>MashaAllah, beautiful content!</Text>
              </View>
            </View>
            <View style={styles.commentItem}>
              <Avatar name="User 2" size={32} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>Maryam</Text>
                <Text style={styles.commentText}>JazakAllah Khair for sharing this</Text>
              </View>
            </View>
          </View>
          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Add a comment..."
              placeholderTextColor={Colors.textLight}
            />
            <TouchableOpacity>
              <Ionicons name="send" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const ReelsScreen = () => {
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    // Handle viewable items change for auto-play
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={DEMO_REELS}
        renderItem={({ item }) => <ReelItem item={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={REEL_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  reelContainer: {
    width,
    position: 'relative',
  },
  reelBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelOverlayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  videoPlaceholder: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.4)',
    marginTop: Spacing.sm,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    zIndex: 10,
  },
  reelsTitle: {
    ...Typography.h3,
    color: '#FFF',
    fontWeight: '700',
  },
  searchButton: {
    padding: Spacing.sm,
  },
  rightActions: {
    position: 'absolute',
    right: Spacing.md,
    bottom: 120,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    ...Typography.caption,
    color: '#FFF',
    fontWeight: '600',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.md,
    right: 80,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  reelAuthor: {
    ...Typography.label,
    color: '#FFF',
    fontWeight: '700',
    flex: 1,
  },
  followButton: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  followText: {
    ...Typography.caption,
    color: '#FFF',
    fontWeight: '700',
  },
  reelDescription: {
    ...Typography.bodySmall,
    color: '#FFF',
    marginBottom: Spacing.xs,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.xs,
  },
  hashtag: {
    ...Typography.caption,
    color: '#FFF',
    fontWeight: '700',
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  musicText: {
    ...Typography.caption,
    color: '#FFF',
  },
  commentsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  commentsTitle: {
    ...Typography.h4,
    color: Colors.text,
  },
  commentsList: {
    flex: 1,
    padding: Spacing.md,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
  },
  commentText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.sm,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.bodySmall,
  },
});

export default ReelsScreen;
