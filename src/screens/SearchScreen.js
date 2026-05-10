import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '../theme';
import Avatar from '../components/common/Avatar';

const { width } = Dimensions.get('window');

const TRENDING = [
  { id: '1', tag: '#JummahMubarak', posts: '12.5K posts' },
  { id: '2', tag: '#QuranReflections', posts: '8.2K posts' },
  { id: '3', tag: '#IslamicArt', posts: '6.8K posts' },
  { id: '4', tag: '#Sunnah', posts: '5.1K posts' },
  { id: '5', tag: '#DailyDua', posts: '4.9K posts' },
  { id: '6', tag: '#Ramadan2026', posts: '3.7K posts' },
];

const SUGGESTED_PEOPLE = [
  { id: '1', name: 'Imam Khalid', bio: 'Islamic Scholar & Teacher', followers: '45K' },
  { id: '2', name: 'Nasheed Studio', bio: 'Beautiful Islamic Nasheeds', followers: '120K' },
  { id: '3', name: 'Islamic Wisdom', bio: 'Daily Islamic reminders', followers: '89K' },
  { id: '4', name: 'Travel Umrah', bio: 'Hajj & Umrah guides', followers: '67K' },
];

const CATEGORIES = [
  { id: '1', name: 'Quran', icon: 'book', color: '#1B5E20' },
  { id: '2', name: 'Hadith', icon: 'document-text', color: '#0D47A1' },
  { id: '3', name: 'Dua', icon: 'hand-left', color: '#4A148C' },
  { id: '4', name: 'Stories', icon: 'library', color: '#BF360C' },
  { id: '5', name: 'Videos', icon: 'videocam', color: '#E65100' },
  { id: '6', name: 'Events', icon: 'calendar', color: '#1565C0' },
];

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D3B0F', '#1B5E20']} style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </LinearGradient>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people, topics, hashtags..."
          placeholderTextColor={Colors.textLight}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.categoriesSection}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity key={cat.id} style={styles.categoryCard}>
                    <LinearGradient
                      colors={[cat.color, cat.color + 'CC']}
                      style={styles.categoryGradient}
                    >
                      <Ionicons name={cat.icon} size={24} color="#FFFFFF" />
                      <Text style={styles.categoryName}>{cat.name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              {TRENDING.map((item, index) => (
                <TouchableOpacity key={item.id} style={styles.trendingItem}>
                  <Text style={styles.trendingIndex}>{index + 1}</Text>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTag}>{item.tag}</Text>
                    <Text style={styles.trendingPosts}>{item.posts}</Text>
                  </View>
                  <Ionicons name="trending-up" size={20} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested For You</Text>
              {SUGGESTED_PEOPLE.map((person) => (
                <View key={person.id} style={styles.personItem}>
                  <Avatar name={person.name} size={48} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personBio}>{person.bio}</Text>
                    <Text style={styles.personFollowers}>{person.followers} followers</Text>
                  </View>
                  <TouchableOpacity style={styles.followBtn}>
                    <Text style={styles.followBtnText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 55 : 45,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    marginLeft: 10,
  },
  categoriesSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: (width - 52) / 3,
    borderRadius: 16,
    overflow: 'hidden',
  },
  categoryGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    gap: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  trendingIndex: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textLight,
    width: 28,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingTag: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  trendingPosts: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  personInfo: {
    flex: 1,
    marginLeft: 12,
  },
  personName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  personBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  personFollowers: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SearchScreen;
