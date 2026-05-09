import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import FeedScreen from '../screens/feed/FeedScreen';
import ReelsScreen from '../screens/reels/ReelsScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatRoomScreen from '../screens/chat/ChatRoomScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

const ChatStackNavigator = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} />
    <ChatStack.Screen name="ChatRoom" component={ChatRoomScreen} />
  </ChatStack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Reels') iconName = focused ? 'play-circle' : 'play-circle-outline';
        else if (route.name === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        else if (route.name === 'Admin') iconName = focused ? 'shield' : 'shield-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        return (
          <View style={focused ? styles.activeTabIcon : null}>
            <Ionicons name={iconName} size={focused ? 26 : 24} color={color} />
          </View>
        );
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.tabBarInactive,
      tabBarStyle: {
        backgroundColor: Colors.tabBar,
        borderTopWidth: 0,
        height: Platform.OS === 'ios' ? 85 : 62,
        paddingTop: 6,
        paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 15,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
      },
    })}
  >
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Reels" component={ReelsScreen} />
    <Tab.Screen name="Chat" component={ChatStackNavigator} />
    <Tab.Screen name="Admin" component={AdminDashboard} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Login"
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="MainTabs" component={MainTabs} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  activeTabIcon: {
    backgroundColor: `${Colors.primary}12`,
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
});

export default AppNavigator;
