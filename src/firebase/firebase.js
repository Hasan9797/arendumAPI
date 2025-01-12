// import { initializeApp, cert } from 'firebase-admin/app';
// import { getMessaging } from 'firebase-admin/messaging';
// import { readFileSync } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const jsonFilePath = path.join(__dirname, '../../firebase.json');

// const serviceAccount = JSON.parse(readFileSync(jsonFilePath, 'utf-8'));

// initializeApp({
//   credential: cert(serviceAccount),
// });

// export const messaging = getMessaging();



import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { readFileSync } from 'fs';
import path from 'path';

// __dirname'ni olish uchun
const __dirname = path.resolve();

// firebase.json faylini o‘qish
const jsonFilePath = path.join(__dirname, 'firebase.json');

// serviceAccount.json faylini o‘qish
const serviceAccount = JSON.parse(readFileSync(jsonFilePath, 'utf-8'));

// Firebase Appni inicializatsiya qilish
initializeApp({
  credential: cert(serviceAccount),
});

// Firebase Messagingni olish
export const messaging = getMessaging();
