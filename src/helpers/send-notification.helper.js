import { messaging } from '../firebase/firebase.js';

// Notifikatsiya jo'natish
export const sendNotification = async (token, title, body) => {
  try {
    const message = {
      notification: {
        title,
        body,
      },
      token, // Qurilma tokeni
    };

    const response = await messaging.send(message);
    console.log('Notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
