import {
  serverTimestamp,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from './config';

export const addDocument = async (collectionName, data) => {
  await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: null,
  });
};

export const getCollection = async (collectionName, condition) => {
  try {
    let collectionRef = collection(db, collectionName);
    collectionRef = query(collectionRef, orderBy('createdAt'));
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return [];
      }

      collectionRef = query(
        collectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    }

    let result = [];
    const querySnapshot = await getDocs(collectionRef);
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const uploadAvatar = async (file) => {
  const currentUser = auth.currentUser;
  const storageRef = ref(
    storage,
    `user-avatars/${currentUser.uid}.${
      file.type === 'image/png' ? 'png' : 'jpg'
    }`
  );
  await uploadBytes(storageRef, file);
  const photoURL = await getDownloadURL(storageRef);
  updateProfile(currentUser, { photoURL });
};

export const uploadImage = async (file, rootPath, name) => {
  const storageRef = ref(
    storage,
    `${rootPath}/${name}.${file.type === 'image/png' ? 'png' : 'jpg'}`
  );
  await uploadBytes(storageRef, file);
};

export const updateDocument = async (collectionName, docId, payload) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, payload);
};

export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};
