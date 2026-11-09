import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ForecastItem } from './forecast-engine';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore with explicit database ID
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on Boot
export async function validateFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn('Firebase client is currently offline.');
    }
  }
}

// Auth Helpers
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (err) {
    console.error('Google Sign In Error:', err);
    throw err;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function registerWithEmail(email: string, pass: string) {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  if (res.user) {
    const userRef = doc(db, 'users', res.user.uid);
    await setDoc(userRef, {
      uid: res.user.uid,
      email: res.user.email || '',
      displayName: '',
      createdAt: new Date().toISOString(),
    });
  }
  return res.user;
}

export async function logoutFirebase() {
  await signOut(auth);
}

// Real-Time Forecast Items Listener
export function subscribeUserItems(
  userId: string,
  onUpdate: (items: ForecastItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const itemsCollectionPath = `users/${userId}/items`;
  const itemsRef = collection(db, 'users', userId, 'items');

  return onSnapshot(
    itemsRef,
    (snapshot) => {
      const itemsList: ForecastItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        itemsList.push({
          id: docSnap.id,
          name: data.name || '',
          amount: Number(data.amount) || 0,
          category: data.category || 'income',
          frequency: data.frequency || 'monthly',
          startDate: data.startDate || new Date().toISOString().slice(0, 10),
          dayOfMonth: data.dayOfMonth,
          dayOfMonth2: data.dayOfMonth2,
          active: data.active ?? true,
          notes: data.notes,
        });
      });
      onUpdate(itemsList);
    },
    (error) => {
      const errObj = error instanceof Error ? error : new Error(String(error));
      if (typeof onError === 'function') {
        onError(errObj);
      }
      handleFirestoreError(error, OperationType.LIST, itemsCollectionPath);
    }
  );
}

// Save (Add or Edit) Item in Firestore
export async function saveItemToFirestore(userId: string, item: ForecastItem) {
  const itemPath = `users/${userId}/items/${item.id}`;
  try {
    const itemRef = doc(db, 'users', userId, 'items', item.id);
    await setDoc(
      itemRef,
      {
        id: item.id,
        name: item.name,
        amount: item.amount,
        category: item.category,
        frequency: item.frequency,
        startDate: item.startDate,
        dayOfMonth: item.dayOfMonth ?? 1,
        dayOfMonth2: item.dayOfMonth2 ?? 15,
        active: item.active,
        userId: userId,
        updatedAt: new Date().toISOString(),
        createdAt: item.startDate || new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, itemPath);
  }
}

// Delete Item from Firestore
export async function deleteItemFromFirestore(userId: string, itemId: string) {
  const itemPath = `users/${userId}/items/${itemId}`;
  try {
    const itemRef = doc(db, 'users', userId, 'items', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, itemPath);
  }
}
