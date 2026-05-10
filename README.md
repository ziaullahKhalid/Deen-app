# Deen App

A Multi-Functional Social Media Ecosystem blending traditional Islamic values with cutting-edge, high-end UI/UX. This app integrates the core functionalities of Facebook (Posting), TikTok (Short Videos), and WhatsApp (Real-time Chat).

## Features

### Feed System (Facebook-style)
- Share posts, images, and long-form updates
- Like, comment, and share capabilities
- Dedicated Create Post screen with categories
- Pull-to-refresh functionality
- Notification bell with badge

### Short Video / Reels (TikTok-style)
- Vertical scrolling short video player
- Like, comment, and share interactions
- Live comment overlay system
- Follow creators
- Music/audio attribution
- Search functionality

### Chat System (WhatsApp-style)
- Real-time messaging interface
- Online status indicators
- Read receipts (double blue ticks)
- Voice message and media attachment UI
- Group chat support
- Search conversations

### Search / Discover
- Search people, topics, and hashtags
- Trending topics with post counts
- Category browsing (Quran, Hadith, Dua, Stories, Videos, Events)
- Suggested people to follow

### Notifications
- Like, comment, follow, and share notifications
- Filter by notification type
- Read/unread status with badges
- Mark all as read

### Authentication
- Firebase-powered login and registration (Email/Password)
- Forgot password flow
- Secure session management
- Admin access restricted to specific email only

## UI/UX Design

- **Theme**: Subtle Islamic aesthetic integrated into a high-tech modern layout
- **Colors**: Deep emerald green primary with gold accents
- **Style**: Modern, sleek, and intuitive "Best-in-Class" UI
- **Bottom Nav**: 5 tabs (Feed, Search, Post+, Reels, Profile) with elevated gold post button

## Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Backend**: Firebase (Auth, Firestore, Realtime Database)
- **Storage**: Firebase Storage + Google Drive API
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: React Native StyleSheet with custom theme system

## Project Structure

```
src/
  config/          # Firebase and app configuration
  components/
    common/        # Reusable UI components (Header, Avatar, Button, Input)
    feed/          # Feed-specific components (PostCard, CreatePostCard)
  screens/
    auth/          # Login and Registration screens
    feed/          # Feed/Home screen
    reels/         # Short video/Reels screen
    chat/          # Chat list and Chat room screens
    CreatePostScreen.js    # Dedicated post creation
    NotificationsScreen.js # Notifications feed
    SearchScreen.js        # Discover/Search page
    ProfileScreen.js       # User profile & settings
  navigation/      # App navigation configuration
  services/        # Firebase service functions
  theme/           # Colors, typography, spacing constants
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npx expo start

# Run on web
npx expo start --web

# Run on Android
npx expo start --android
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Set up Realtime Database
5. Update `src/config/firebase.js` with your Firebase credentials

## Admin Access

Admin panel is restricted to `ziakhalid1045@gmail.com` only. Other accounts do not have admin privileges.

## Version

v2.0.0 - Major UI/UX redesign with new screens (Search, Notifications, Post)
