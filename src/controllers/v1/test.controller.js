import { sendNotification } from '../../helpers/sendNotificationHelper.js';
import driverRepository from '../../repositories/driver.repo.js';
import axios from 'axios';
import FormData  from 'form-data';


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

export const test2 = async (req, res) => {
  try {
    const drivers = await driverRepository.getDriversForNotification(
      req.body.machineId,
      req.body.regionId,
      req.body.structureId,
      req.body.legal
    );

    res.status(200).json({ success: true, drivers });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};


const message = `для регистрации в приложении ARENDUM введите 549810 код; ARENDUM ilovasiga ro'yhatdan o'tish uchun 549810 kodni kiriting;`;

export const sendSmsRequest = async (req, res) => {
  try {
    // Har safar yangi FormData yaratish
    const data = new FormData();
    data.append('mobile_phone', '998903549810'); // Dinamik telefon raqami
    data.append('message', message);
    data.append('from', '4546');
    data.append('callback_url', 'http://0000.uz/test.php');

    const config = {
      method: 'post',
      url: 'https://notify.eskiz.uz/api/message/sms/send',
      headers: {
        Authorization: `Bearer ${process.env.ESKIZ_TOKEN}`, // Tokenni env dan olish
        ...data.getHeaders(), // FormData uchun kerakli headerlar
      },
      data,
      timeout: 15000, // Timeoutni 15 soniyaga oshirish
    };

    const response = await axios(config);

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('SMS Send Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      responseData: error.response?.data,
    });

    // Faqat kerakli xato ma'lumotlarini qaytarish
    return res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      },
    });
  }
};
