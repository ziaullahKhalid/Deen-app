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
import Avatar from '../../components/common/Avatar';

const { width, height } = Dimensions.get('window');

const DEMO_REELS = [
  {
    id: '1',
    authorName: 'Imam Khalid',
    description: 'Beautiful Quran recitation - Surah Ar-Rahman. The words of Allah bring peace to the heart.',
    likes: 5420,
    comments: 342,
    shares: 128,
    color: '#1B5E20',
    hashtags: ['#Quran', '#SurahArRahman', '#DanApp'],
  },
  {
    id: '2',
    authorName: 'Nasheed Studio',
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
  const [following, setFollowing] = useState(false);

  return (
    <View style={styles.reelContainer}>
      <LinearGradient
        colors={[item.color, '#000000']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.centerContent}>
        <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.2)" />
        <Text style={styles.videoPlaceholder}>Video Content</Text>
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.reelsTitle}>Reels</Text>
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Right Side TikTok-style Vertical Actions */}
      <View style={styles.rightActions}>
        {/* Profile */}
        <View style={styles.profileAction}>
          <Avatar name={item.authorName} size={44} />
          {!following && (
            <TouchableOpacity
              style={styles.followBadge}
              onPress={() => setFollowing(true)}
            >
              <Ionicons name="add" size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Like */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setLiked(!liked)}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={30}
            color={liked ? '#FF1744' : '#FFF'}
          />
          <Text style={styles.actionCount}>{formatCount(item.likes + (liked ? 1 : 0))}</Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#FFF" />
          <Text style={styles.actionCount}>{formatCount(item.comments)}</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="arrow-redo" size={28} color="#FFF" />
          <Text style={styles.actionCount}>{formatCount(item.shares)}</Text>
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={26} color="#FFF" />
        </TouchableOpacity>

        {/* More */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Music Disc */}
        <View style={styles.musicDisc}>
          <LinearGradient
            colors={['#D4AF37', '#1B5E20']}
            style={styles.musicDiscInner}
          >
            <Ionicons name="musical-notes" size={14} color="#FFF" />
          </LinearGradient>
        </View>
      </View>

      {/* Bottom Info */}
      <View style={styles.bottomInfo}>
        <View style={styles.authorRow}>
          <Text style={styles.reelAuthor}>@{item.authorName.replace(/\s+/g, '').toLowerCase()}</Text>
          {!following && (
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => setFollowing(true)}
            >
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          )}
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
          <Ionicons name="musical-notes" size={13} color="#FFF" />
          <Text style={styles.musicText} numberOfLines={1}>
            Original Audio - {item.authorName}
          </Text>
        </View>
      </View>

      {/* Comments Overlay */}
      {showComments && (
        <View style={styles.commentsOverlay}>
          <View style={styles.commentsHandle}>
            <View style={styles.handleBar} />
          </View>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              {formatCount(item.comments)} comments
            </Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.commentsList}>
            <View style={styles.commentItem}>
              <Avatar name="Abdullah" size={34} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>Abdullah <Text style={styles.commentTime}>2h</Text></Text>
                <Text style={styles.commentText}>MashaAllah, beautiful content!</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity><Text style={styles.commentActionText}>Reply</Text></TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.commentLike}>
                <Ionicons name="heart-outline" size={14} color="#999" />
                <Text style={styles.commentLikeCount}>24</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.commentItem}>
              <Avatar name="Maryam" size={34} />
              <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>Maryam <Text style={styles.commentTime}>5h</Text></Text>
                <Text style={styles.commentText}>JazakAllah Khair for sharing this</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity><Text style={styles.commentActionText}>Reply</Text></TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.commentLike}>
                <Ionicons name="heart-outline" size={14} color="#999" />
                <Text style={styles.commentLikeCount}>8</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.commentInputRow}>
            <Avatar name="You" size={30} />
            <TextInput
              style={styles.commentTextInput}
              placeholder="Add comment..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity>
              <Ionicons name="send" size={22} color="#1B5E20" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const ReelsScreen = () => {
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {}, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <FlatList
        ref={flatListRef}
        data={DEMO_REELS}
        renderItem={({ item }) => <ReelItem item={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
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
    height,
    position: 'relative',
  },
  centerContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 14,
    marginTop: 8,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  reelsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFF',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 140,
    alignItems: 'center',
    gap: 18,
  },
  profileAction: {
    alignItems: 'center',
    marginBottom: 6,
  },
  followBadge: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF1744',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  actionButton: {
    alignItems: 'center',
    gap: 3,
  },
  actionCount: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  musicDisc: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  musicDiscInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 14,
    right: 80,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  reelAuthor: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  followButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  followText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reelDescription: {
    color: '#FFF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  hashtag: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  musicText: {
    color: '#FFF',
    fontSize: 12,
    flex: 1,
  },
  commentsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  commentsHandle: {
    alignItems: 'center',
    paddingTop: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
  },
  commentsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 18,
    gap: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222',
  },
  commentTime: {
    fontWeight: '400',
    color: '#999',
  },
  commentText: {
    fontSize: 13,
    color: '#444',
    marginTop: 3,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  commentLike: {
    alignItems: 'center',
    paddingTop: 4,
  },
  commentLikeCount: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#EEE',
    gap: 10,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
});

export default ReelsScreen;
