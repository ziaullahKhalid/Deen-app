import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';
import Avatar from '../components/common/Avatar';
import { createPost } from '../services/feedService';
import { getCurrentUser } from '../services/authService';

const CreatePostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const user = getCurrentUser();

  const categories = [
    { key: 'general', label: 'General', icon: 'chatbubble-ellipses' },
    { key: 'quran', label: 'Quran', icon: 'book' },
    { key: 'hadith', label: 'Hadith', icon: 'document-text' },
    { key: 'dua', label: 'Dua', icon: 'hand-left' },
    { key: 'reminder', label: 'Reminder', icon: 'bulb' },
    { key: 'question', label: 'Question', icon: 'help-circle' },
  ];

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something to share.');
      return;
    }
    setPosting(true);
    try {
      await createPost({
        authorId: user?.uid || 'anonymous',
        authorName: user?.displayName || 'User',
        authorAvatar: user?.photoURL || null,
        content: content.trim(),
        category: selectedCategory,
        imageUrl: null,
      });
      Alert.alert('Posted!', 'Your post has been shared.', [
        { text: 'OK', onPress: () => navigation && navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D3B0F', '#1B5E20']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack()}>
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={[styles.postBtn, !content.trim() && styles.postBtnDisabled]}
          onPress={handlePost}
          disabled={posting || !content.trim()}
        >
          <Text style={[styles.postBtnText, !content.trim() && styles.postBtnTextDisabled]}>
            {posting ? 'Posting...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.body}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.userRow}>
            <Avatar name={user?.displayName || 'User'} size={48} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
              <View style={styles.privacyRow}>
                <Ionicons name="globe-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.privacyText}>Public</Text>
              </View>
            </View>
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts, a verse, or a reminder..."
            placeholderTextColor={Colors.textLight}
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />

          <View style={styles.categorySection}>
            <Text style={styles.categoryLabel}>Category (optional)</Text>
            <View style={styles.categoryRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.key && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === cat.key ? null : cat.key
                  )}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={selectedCategory === cat.key ? '#FFFFFF' : Colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.key && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.charCount}>
            <Text style={styles.charCountText}>{content.length} characters</Text>
          </View>
        </ScrollView>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="image" size={24} color={Colors.success} />
            <Text style={styles.toolbarText}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="videocam" size={24} color={Colors.error} />
            <Text style={styles.toolbarText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="location" size={24} color={Colors.info} />
            <Text style={styles.toolbarText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarBtn}>
            <Ionicons name="happy" size={24} color={Colors.warning} />
            <Text style={styles.toolbarText}>Feeling</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  postBtn: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnDisabled: {
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
  },
  postBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A1628',
  },
  postBtnTextDisabled: {
    color: 'rgba(10, 22, 40, 0.4)',
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textInput: {
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  categorySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#F0F0F0',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#1B5E20',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  charCount: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  charCountText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  toolbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  toolbarBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  toolbarText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default CreatePostScreen;
