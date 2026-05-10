import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const registerUser = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: user.email,
    displayName,
    photoURL: null,
    bio: '',
    createdAt: serverTimestamp(),
    isAdmin: email === 'ziakhalid1045@gmail.com',
    isOnline: true,
    lastSeen: serverTimestamp(),
  });

  return user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  try {
    const userRef = doc(db, 'users', userCredential.user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, { isOnline: true, lastSeen: serverTimestamp() });
    } else {
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0],
        photoURL: null,
        bio: '',
        createdAt: serverTimestamp(),
        isAdmin: email === 'ziakhalid1045@gmail.com',
        isOnline: true,
        lastSeen: serverTimestamp(),
      });
    }
  } catch (dbErr) {
    console.log('Firestore update skipped:', dbErr.message);
  }
  return userCredential.user;
};

export const logoutUser = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, { isOnline: false, lastSeen: serverTimestamp() });
      }
    } catch (err) {
      console.log('Firestore update skipped:', err.message);
    }
  }
  await signOut(auth);
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (err) {
    console.log('getUserProfile error:', err.message);
    return null;
  }
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { ...data, lastSeen: serverTimestamp() });
};
