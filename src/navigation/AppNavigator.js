import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius } from '../theme';
import { onAuthChange } from '../services/authService';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import FeedScreen from '../screens/feed/FeedScreen';
import ReelsScreen from '../screens/reels/ReelsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} />
    <ChatStack.Screen name="ChatRoom" component={ChatRoomScreen} />
  </ChatStack.Navigator>
);

const PostButton = ({ onPress }) => (
  <TouchableOpacity style={styles.postButtonContainer} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={['#D4AF37', '#E6C65A']}
      style={styles.postButton}
    >
      <Ionicons name="add" size={30} color="#0A1628" />
    </LinearGradient>
  </TouchableOpacity>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
        else if (route.name === 'Post') iconName = 'add';
        else if (route.name === 'Reels') iconName = focused ? 'play-circle' : 'play-circle-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        if (route.name === 'Post') return null;

        return (
          <View style={focused ? styles.activeTabIcon : styles.tabIcon}>
            <Ionicons name={iconName} size={focused ? 26 : 23} color={color} />
            {focused && <View style={styles.activeIndicator} />}
          </View>
        );
      },
      tabBarActiveTintColor: '#1B5E20',
      tabBarInactiveTintColor: '#9E9E9E',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 88 : 65,
        paddingTop: 8,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 20,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
      },
      tabBarButton: route.name === 'Post' ? (props) => (
        <PostButton onPress={props.onPress} />
      ) : undefined,
    })}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen
      name="Post"
      component={View}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('CreatePost');
        },
      })}
    />
    <Tab.Screen name="Reels" component={ReelsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
    });
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={user ? 'MainTabs' : 'Login'}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1B5E20',
    marginTop: 3,
  },
  postButtonContainer: {
    top: -18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default AppNavigator;
