import { sendNotification } from '../../helpers/sendNotificationHelper.js';
import driverRepository from '../../repositories/driver.repo.js';
import axios from 'axios';
import FormData from 'form-data';
const data = new FormData();

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

const message = `для регистрации в приложении ARENDUM введите 979797 код; 
  ARENDUM ilovasiga ro'yhatdan o'tish uchun 979797 kodni kiriting;`;

export const sendSmsRequest = async (req, res) => {
  data.append('mobile_phone', "998999893328");
  data.append('message', message);
  data.append('from', '4546');
  data.append('callback_url', '');

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://notify.eskiz.uz/api/message/sms/send',
    headers: {
      ...data.getHeaders(),
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDk0MDM5NDksImlhdCI6MTc0NjgxMTk0OSwicm9sZSI6InVzZXIiLCJzaWduIjoiYmE3OTNhM2ZkYThjMmE0NmEyNjcwZGM0ZDMxM2M4MTcwYjc4N2ExMjA1NzdiZmE2YWQ3OWUyNTlhZjUyODBjYyIsInN1YiI6IjEwNjcwIn0.Ho_Fpn3egdVisaBcv8EUQMItAtugTFafBb2UBB-8YrM`,
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      res.status(200).json({ success: true, request: config, response: response });
    })
    .catch(function (error) {
      res.status(500).json({ success: false, error: error });
    });
}


