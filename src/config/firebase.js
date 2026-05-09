import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA9Ta5t3xBirlqj6_fZlj_E_dcdpNomLSg',
  authDomain: 'islamic-qadeem.firebaseapp.com',
  projectId: 'islamic-qadeem',
  storageBucket: 'islamic-qadeem.firebasestorage.app',
  messagingSenderId: '1077933191799',
  appId: '1:1077933191799:web:cde4c2abb824d2fd194c72',
  measurementId: 'G-ZNYBMR11EM',
  databaseURL: 'https://islamic-qadeem-default-rtdb.firebaseio.com',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export default app;
