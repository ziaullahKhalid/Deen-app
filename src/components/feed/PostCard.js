import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';
import Avatar from '../common/Avatar';

const { width } = Dimensions.get('window');

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) onLike(post.id);
  };

  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const postDate = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((now - postDate) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar name={post.authorName} uri={post.authorAvatar} size={44} />
        <View style={styles.headerInfo}>
          <Text style={styles.authorName}>{post.authorName}</Text>
          <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {post.content ? (
        <View style={styles.contentSection}>
          <Text
            style={styles.contentText}
            numberOfLines={showFullText ? undefined : 3}
          >
            {post.content}
          </Text>
          {post.content.length > 150 && !showFullText && (
            <TouchableOpacity onPress={() => setShowFullText(true)}>
              <Text style={styles.readMore}>Read more</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      {post.imageUrl ? (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      ) : null}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="heart" size={14} color={Colors.error} />
          <Text style={styles.statText}>{post.likesCount || 0}</Text>
        </View>
        <View style={styles.statRight}>
          <Text style={styles.statText}>{post.commentsCount || 0} comments</Text>
          <Text style={styles.statDot}> . </Text>
          <Text style={styles.statText}>{post.sharesCount || 0} shares</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? Colors.error : Colors.textSecondary}
          />
          <Text style={[styles.actionText, liked && styles.likedText]}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment && onComment(post.id)}
        >
          <Ionicons name="chatbubble-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare && onShare(post.id)}
        >
          <Ionicons name="share-outline" size={22} color={Colors.textSecondary} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  authorName: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
  },
  timestamp: {
    ...Typography.caption,
    color: Colors.textLight,
    marginTop: 2,
  },
  moreButton: {
    padding: Spacing.xs,
  },
  contentSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  contentText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 22,
  },
  readMore: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  postImage: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'cover',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  statDot: {
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    gap: 6,
  },
  actionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  likedText: {
    color: Colors.error,
  },
});

export default PostCard;
