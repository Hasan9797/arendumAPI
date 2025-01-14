import { messaging } from '../firebase/firebase.js';

// Notifikatsiya jo'natish
export const sendNotification = async (fcmToken, title, body, data) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token: fcmToken ?? 'cTM87yOhRAmi2XgWadkbbo:APA91bF1sKR9MyjebVjBzYl9823_0AJiySKWnElWgrBSHz7dOgNdqKaLujsltw5jAdXcAEzfDz4CYNBaZgjEitbdlR0jrHMPROUTwY3fj60-G_5YWmNphp4',
    };

    await messaging.send(message);
    console.log('Notification sent successfully:');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
