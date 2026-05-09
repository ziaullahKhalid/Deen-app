import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const POSTS_COLLECTION = 'posts';

export const createPost = async (postData) => {
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...postData,
    likes: [],
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getPosts = async (limitCount = 20) => {
  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const likePost = async (postId, userId) => {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
    likesCount: increment(1),
  });
};

export const unlikePost = async (postId, userId) => {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
    likesCount: increment(-1),
  });
};

export const addComment = async (postId, commentData) => {
  const commentsRef = collection(db, POSTS_COLLECTION, postId, 'comments');
  await addDoc(commentsRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, { commentsCount: increment(1) });
};

export const getComments = async (postId) => {
  const q = query(
    collection(db, POSTS_COLLECTION, postId, 'comments'),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
};

export const sharePost = async (postId) => {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  await updateDoc(postRef, { sharesCount: increment(1) });
};
