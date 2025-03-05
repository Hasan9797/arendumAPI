import { messaging } from '../firebase/firebase.js';

// Notifikatsiya jo'natish
export const sendNotification = async (fcmToken, title, body, data) => {
  try {
    if (!fcmToken || typeof fcmToken !== "string") {
      console.warn("🚨 Warning: Invalid FCM token, skipping notification.");
      return;
    }

    const message = {
      notification: { title, body },
      data,
      token: fcmToken,
    };

    await messaging.send(message);
    console.log("✅ Notification sent successfully.");
  } catch (error) {
    if (error.code === "messaging/invalid-argument") {
      console.warn("⚠️ Warning: Invalid FCM token, skipping notification.");
      return; // ❌ Xatoni `throw` qilmaydi, davom etadi
    }

    console.error("🚨 Error sending notification:", error);
    throw error; // ⚠️ Boshqa xatolik bo‘lsa, uni chiqaradi
  }
};
