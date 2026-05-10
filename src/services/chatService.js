import {
  ref,
  push,
  onValue,
  set,
  serverTimestamp,
  query as rtdbQuery,
  orderByChild,
  off,
} from 'firebase/database';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp as fsTimestamp,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { rtdb, db } from '../config/firebase';

export const sendMessage = async (chatId, messageData) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    ...messageData,
    timestamp: serverTimestamp(),
    read: false,
  });

  const chatRef = ref(rtdb, `chats/${chatId}/lastMessage`);
  await set(chatRef, {
    text: messageData.text,
    senderId: messageData.senderId,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = ref(rtdb, `chats/${chatId}/messages`);
  onValue(messagesRef, (snapshot) => {
    const messages = [];
    snapshot.forEach((child) => {
      messages.push({ id: child.key, ...child.val() });
    });
    callback(messages);
  });

  return () => off(messagesRef);
};

export const createChat = async (participants) => {
  const chatData = {
    participants,
    createdAt: fsTimestamp(),
    updatedAt: fsTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'chatRooms'), chatData);
  return docRef.id;
};

export const getUserChats = (userId, callback) => {
  const q = query(
    collection(db, 'chatRooms'),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
};

export const markMessageAsRead = async (chatId, messageId) => {
  const messageRef = ref(rtdb, `chats/${chatId}/messages/${messageId}`);
  await set(messageRef, { read: true }, { merge: true });
};
