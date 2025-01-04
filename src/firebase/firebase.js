import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

import serviceAccount from '../../firebase.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
});

export const messaging = getMessaging();
