import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(
  readFileSync(new URL('../../firebase.json', import.meta.url))
);

// Firebase Admin SDK sozlamasi
initializeApp({
  credential: cert(serviceAccount),
});

export const messaging = getMessaging();
