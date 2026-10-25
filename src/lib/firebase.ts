import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const configAny = firebaseConfig as Record<string, any>;

export const db = configAny.firestoreDatabaseId
  ? getFirestore(app, configAny.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export default app;
