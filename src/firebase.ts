import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import configJson from '../firebase-applet-config.json';

const firebaseConfig = {
  projectId: configJson.projectId,
  appId: configJson.appId,
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Connect to the provisioned Firestore database
export const db = configJson.firestoreDatabaseId
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);
