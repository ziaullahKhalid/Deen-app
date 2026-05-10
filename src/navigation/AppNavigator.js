import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';
import { onAuthChange } from '../services/authService';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import FeedScreen from '../screens/feed/FeedScreen';
import ReelsScreen from '../screens/reels/ReelsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import ProfileScreen from '../screens/ProfileScreen';
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

const UploadButton = ({ onPress }) => (
  <TouchableOpacity style={styles.uploadButtonOuter} onPress={onPress} activeOpacity={0.75}>
    <LinearGradient
      colors={['#D4AF37', '#F0D878', '#D4AF37']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.uploadButton}
    >
      <Ionicons name="add" size={32} color="#0A1628" />
    </LinearGradient>
  </TouchableOpacity>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        let iconName;
        let iconSize = 24;
        if (route.name === 'Feed') { iconName = focused ? 'home' : 'home-outline'; iconSize = 25; }
        else if (route.name === 'Reels') { iconName = focused ? 'play-circle' : 'play-circle-outline'; iconSize = 25; }
        else if (route.name === 'Upload') return null;
        else if (route.name === 'Inbox') { iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; iconSize = 24; }
        else if (route.name === 'Profile') { iconName = focused ? 'person-circle' : 'person-circle-outline'; iconSize = 26; }

        return (
          <View style={styles.tabIconWrap}>
            <Ionicons name={iconName} size={iconSize} color={color} />
            {focused && <View style={styles.tabDot} />}
          </View>
        );
      },
      tabBarActiveTintColor: '#1B5E20',
      tabBarInactiveTintColor: '#AAAAAA',
      tabBarShowLabel: true,
      tabBarStyle: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 20 : 12,
        left: 16,
        right: 16,
        height: 68,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 28,
        borderTopWidth: 0,
        paddingTop: 8,
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 25,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
      },
      tabBarButton: route.name === 'Upload' ? (props) => (
        <UploadButton onPress={props.onPress} />
      ) : undefined,
    })}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Reels" component={ReelsScreen} />
    <Tab.Screen
      name="Upload"
      component={View}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('CreatePost');
        },
      })}
    />
    <Tab.Screen name="Inbox" component={ChatStackNavigator} />
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
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1B5E20',
    marginTop: 3,
  },
  uploadButtonOuter: {
    top: -22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
});

export default AppNavigator;
