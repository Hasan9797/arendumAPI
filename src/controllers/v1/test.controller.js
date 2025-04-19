import { sendNotification } from '../../helpers/sendNotificationHelper.js';

export const test = async (req, res) => {
  try {
    const title = 'New Order';
    const body = 'You have a new order';
    const data = {
      key: 'new_order',
      order: JSON.stringify(req.body),
    };

    await sendNotification(req.body.fcmToken, title, body, data);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
