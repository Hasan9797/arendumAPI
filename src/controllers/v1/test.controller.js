import { sendNotification } from '../../helpers/sendNotificationHelper';

export const test = async (req, res) => {
  try {
    await sendNotification(driver?.fcmToken, title, body, data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
