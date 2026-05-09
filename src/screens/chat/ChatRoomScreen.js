import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Typography, Spacing, BorderRadius } from '../../theme';
import Avatar from '../../components/common/Avatar';

const DEMO_MESSAGES = [
  { id: '1', text: 'Assalamu Alaikum!', senderId: 'other', timestamp: '10:00 AM' },
  { id: '2', text: 'Wa Alaikum Assalam! How are you?', senderId: 'me', timestamp: '10:01 AM' },
  { id: '3', text: 'Alhamdulillah, I am doing well. Have you prepared for the Friday lecture?', senderId: 'other', timestamp: '10:02 AM' },
  { id: '4', text: 'Yes, I have been reviewing the notes. The topic on Islamic history is fascinating SubhanAllah', senderId: 'me', timestamp: '10:03 AM' },
  { id: '5', text: 'Indeed! The early Islamic civilization made incredible contributions to science and mathematics', senderId: 'other', timestamp: '10:05 AM' },
  { id: '6', text: 'JazakAllah Khair for reminding me. See you at the mosque!', senderId: 'me', timestamp: '10:06 AM' },
  { id: '7', text: 'InshaaAllah! May Allah bless your day', senderId: 'other', timestamp: '10:07 AM' },
];

const MessageBubble = ({ message, isMe }) => (
  <View style={[styles.messageBubbleContainer, isMe ? styles.myMessage : styles.otherMessage]}>
    <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
      <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
        {message.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
          {message.timestamp}
        </Text>
        {isMe && (
          <Ionicons name="checkmark-done" size={14} color={Colors.info} style={styles.readIcon} />
        )}
      </View>
    </View>
  </View>
);

const ChatRoomScreen = ({ route, navigation }) => {
  const chatName = route?.params?.chatName || 'Chat';
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={Gradients.header} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Avatar name={chatName} size={38} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName}</Text>
          <Text style={styles.headerStatus}>Online</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="videocam" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="call" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="ellipsis-vertical" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.chatArea}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>Today</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <MessageBubble message={item} isMe={item.senderId === 'me'} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="happy-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          {inputText.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={20} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="mic" size={22} color={Colors.textOnPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECE5DD',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 35,
    paddingBottom: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 4,
  },
  headerName: {
    ...Typography.label,
    color: '#FFF',
    fontWeight: '600',
  },
  headerStatus: {
    ...Typography.caption,
    color: Colors.goldLight,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerAction: {
    padding: 4,
  },
  chatArea: {
    flex: 1,
  },
  dateHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  messagesList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  messageBubbleContainer: {
    marginBottom: Spacing.xs,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.md,
  },
  myBubble: {
    backgroundColor: Colors.chatBubbleSent,
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.chatBubbleReceived,
    borderTopLeftRadius: 4,
  },
  messageText: {
    ...Typography.body,
    fontSize: 15,
  },
  myMessageText: {
    color: Colors.text,
  },
  otherMessageText: {
    color: Colors.text,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    ...Typography.caption,
    color: Colors.textLight,
    fontSize: 11,
  },
  myMessageTime: {
    color: Colors.textSecondary,
  },
  readIcon: {
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  attachButton: {
    padding: Spacing.sm,
    alignSelf: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
    color: Colors.text,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export default ChatRoomScreen;
