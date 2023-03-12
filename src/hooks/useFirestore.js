import React, { useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const useFirestore = (collectionName, condition) => {
  const [documents, setDocuments] = useState([]);

  React.useEffect(() => {
    let collectionRef = collection(db, collectionName);
    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        // reset documents data
        setDocuments([]);
        return;
      }

      collectionRef = query(
        collectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    }

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setDocuments(documents);
    });

    return unsubscribe;
  }, [collectionName, condition]);

  return documents;
};

export default useFirestore;
