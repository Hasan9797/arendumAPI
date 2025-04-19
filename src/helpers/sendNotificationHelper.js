import { messaging } from '../firebase/firebase.js';

// Notifikatsiya jo'natish
export const sendNotification = async (fcmToken, title, body, data) => {
  try {
    if (!fcmToken || typeof fcmToken !== 'string') {
      console.console.log(
        '🚨 Warning: Invalid FCM token, skipping notification.'
      );
      return;
    }

    const message = {
      notification: { title, body },
      data,
      token: fcmToken,
    };

    const result = await messaging.send(message);
    console.log('✅ Notification sent successfully. ', result);
  } catch (error) {
    if (error.code === 'messaging/invalid-argument') {
      console.log(
        `⚠️ Warning: Invalid FCM token: ${fcmToken}\n Error message: ${error.message}.`
      );
      return false; // ❌ Xatoni `throw` qilmaydi, davom etadi
    }

    if (error.code === 'messaging/registration-token-not-registered') {
      console.log(
        `❌  Warning: Invalid FCM token: ${fcmToken}\n Error message: ${error.message}.`
      );
      return false;
    }

    console.log('🚨 Error sending notification:', error);
    throw error; // ⚠️ Boshqa xatolik bo‘lsa, uni chiqaradi
  }
};
