# Islamic Qadeem

A Multi-Functional Social Media Ecosystem blending traditional Islamic values with cutting-edge, high-end UI/UX. This app integrates the core functionalities of Facebook (Posting), TikTok (Short Videos), and WhatsApp (Real-time Chat).

## Features

### Feed System (Facebook-style)
- Share posts, images, and long-form updates
- Like, comment, and share capabilities
- Create post modal with media attachment options
- Pull-to-refresh functionality

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

### Admin Dashboard
- User management
- Content moderation
- Platform analytics (users, posts, videos, messages)
- Announcements system
- Storage management
- Recent activity feed

### Authentication
- Firebase-powered login and registration
- Social login options (Google, Apple, Facebook)
- Secure session management

## UI/UX Design

- **Theme**: Subtle Islamic aesthetic (Ancient/Qadeem touch) integrated into a high-tech modern layout
- **Colors**: Deep emerald green primary with gold accents
- **Style**: Modern, sleek, and intuitive "Best-in-Class" UI
- **Patterns**: Decorative Islamic geometric patterns in headers

## Tech Stack

- **Frontend**: React Native (Expo)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Backend**: Firebase (Auth, Firestore, Realtime Database)
- **Storage**: Firebase Storage + Google Drive API (planned)
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: React Native StyleSheet with custom theme system

## Project Structure

```
src/
  config/          # Firebase and app configuration
  components/
    common/        # Reusable UI components (Header, Avatar, Button, Input)
    feed/          # Feed-specific components (PostCard, CreatePostCard)
    reels/         # Reels-specific components
    chat/          # Chat-specific components
  screens/
    auth/          # Login and Registration screens
    feed/          # Feed/Home screen
    reels/         # Short video/Reels screen
    chat/          # Chat list and Chat room screens
    admin/         # Admin dashboard
  navigation/      # App navigation configuration
  services/        # Firebase service functions
  theme/           # Colors, typography, spacing constants
  utils/           # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on web
npx expo start --web

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Set up Realtime Database
5. Update `src/config/firebase.js` with your Firebase credentials

## Roadmap

- [ ] Google Drive API integration for media storage
- [ ] AI-powered search assistant
- [ ] Live streaming functionality
- [ ] Push notifications
- [ ] End-to-end encryption for chat
- [ ] Video recording and upload
- [ ] User profile customization
- [ ] Content recommendation engine
