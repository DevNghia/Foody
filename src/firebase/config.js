import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB7p4CSZazmvwKyHYSz929vUerwz-Pjs5Y',
  authDomain: 'foody-638ec.firebaseapp.com',
  projectId: 'foody-638ec',
  storageBucket: 'foody-638ec.appspot.com',
  messagingSenderId: '929499893649',
  appId: '1:929499893649:web:b2e1db7189a0267172d430',
  measurementId: 'G-PZPNERBDQY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage();

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}

export { db, auth, storage };
