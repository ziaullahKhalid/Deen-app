import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Gradients, Typography, Spacing, BorderRadius } from '../theme';
import Avatar from '../components/common/Avatar';
import { getCurrentUser, getUserProfile, logoutUser, updateUserProfile } from '../services/authService';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 4) / 3;

const DEMO_POSTS = [
  { id: '1', type: 'post', color: '#1B5E20' },
  { id: '2', type: 'post', color: '#0D47A1' },
  { id: '3', type: 'post', color: '#4A148C' },
  { id: '4', type: 'post', color: '#BF360C' },
  { id: '5', type: 'post', color: '#33691E' },
  { id: '6', type: 'post', color: '#1A237E' },
];

const DEMO_REELS = [
  { id: 'r1', color: '#E53935', views: '12.5K' },
  { id: 'r2', color: '#1B5E20', views: '8.3K' },
  { id: 'r3', color: '#0D47A1', views: '45.1K' },
];

const ProfileScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    setMenuVisible(false);
    try {
      await logoutUser();
      if (navigation && navigation.replace) {
        navigation.replace('Login');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleChangePhoto = async () => {
    try {
      const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permResult.granted) {
        Alert.alert('Permission Required', 'Please grant photo access to change your profile picture.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        if (user) {
          await updateUserProfile(user.uid, { photoURL: result.assets[0].uri });
        }
      }
    } catch (err) {
      console.log('Error picking image:', err);
    }
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'posts': return DEMO_POSTS;
      case 'reels': return DEMO_REELS;
      case 'saved': return DEMO_POSTS.slice(0, 4);
      case 'liked': return DEMO_REELS.concat(DEMO_POSTS.slice(0, 2));
      default: return [];
    }
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <View style={[styles.gridItemInner, { backgroundColor: item.color }]}>
        {item.views && (
          <View style={styles.reelOverlay}>
            <Ionicons name="play" size={14} color="#FFF" />
            <Text style={styles.reelViews}>{item.views}</Text>
          </View>
        )}
        <Ionicons
          name={item.views ? 'videocam' : 'image'}
          size={28}
          color="rgba(255,255,255,0.5)"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Ionicons name="lock-closed" size={14} color="#333" />
          <Text style={styles.headerUsername}>
            {user?.displayName?.replace(/\s+/g, '').toLowerCase() || 'user'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#333" />
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="add-outline" size={26} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarArea}>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Avatar name={user?.displayName || 'User'} size={90} />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>142</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>1.2K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>580</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Name & Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{user?.displayName || 'Your Name'}</Text>
          <Text style={styles.bioText}>{profile?.bio || 'Seeking knowledge, sharing light'}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editProfileBtn} onPress={handleEditProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareProfileBtn}>
            <Text style={styles.shareProfileText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.discoverBtn}>
            <Ionicons name="person-add-outline" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.contentTabs}>
          <TouchableOpacity
            style={[styles.contentTab, activeTab === 'posts' && styles.activeContentTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons name="grid-outline" size={22} color={activeTab === 'posts' ? '#333' : '#CCC'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTab, activeTab === 'reels' && styles.activeContentTab]}
            onPress={() => setActiveTab('reels')}
          >
            <Ionicons name="play-circle-outline" size={22} color={activeTab === 'reels' ? '#333' : '#CCC'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTab, activeTab === 'saved' && styles.activeContentTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons name="bookmark-outline" size={22} color={activeTab === 'saved' ? '#333' : '#CCC'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.contentTab, activeTab === 'liked' && styles.activeContentTab]}
            onPress={() => setActiveTab('liked')}
          >
            <Ionicons name="heart-outline" size={22} color={activeTab === 'liked' ? '#333' : '#CCC'} />
          </TouchableOpacity>
        </View>

        {/* Grid */}
        <View style={styles.gridContainer}>
          {getTabData().map((item) => (
            <TouchableOpacity key={item.id} style={styles.gridItem}>
              <View style={[styles.gridItemInner, { backgroundColor: item.color }]}>
                {item.views && (
                  <View style={styles.reelOverlay}>
                    <Ionicons name="play" size={14} color="#FFF" />
                    <Text style={styles.reelViews}>{item.views}</Text>
                  </View>
                )}
                <Ionicons
                  name={item.views ? 'videocam' : 'image'}
                  size={28}
                  color="rgba(255,255,255,0.5)"
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.menuOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHandle}>
              <View style={styles.menuHandleBar} />
            </View>

            <MenuItem icon="settings-outline" label="Settings" />
            <MenuItem icon="time-outline" label="Your Activity" />
            <MenuItem icon="archive-outline" label="Archive" />
            <MenuItem icon="qr-code-outline" label="QR Code" />
            <MenuItem icon="bookmark-outline" label="Saved" />
            <MenuItem icon="shield-checkmark-outline" label="Privacy" />
            <MenuItem icon="key-outline" label="Security" />
            <MenuItem icon="people-outline" label="Close Friends" />
            <MenuItem icon="star-outline" label="Favorites" />
            <MenuItem icon="language-outline" label="Language" />
            <MenuItem icon="help-circle-outline" label="Help" />

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#E53935" />
              <Text style={[styles.menuItemText, { color: '#E53935' }]}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuCloseBtn}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#333" />
    <Text style={styles.menuItemText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 55 : 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 6,
  },
  headerUsername: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatarArea: {
    marginRight: 28,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1B5E20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#222',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  editProfileBtn: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  shareProfileBtn: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  shareProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  discoverBtn: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentTabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  contentTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeContentTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    padding: 1,
  },
  gridItemInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reelOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reelViews: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 30,
  },
  menuHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
    marginVertical: 8,
  },
  menuCloseBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    marginHorizontal: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  menuCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileScreen;
