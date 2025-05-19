import axios from 'axios';
import FormData from 'form-data';
import redisClient from '../../config/redis.js';
import EskisTokenService from './eskizToken.service.js';

class EskizSmsService extends EskisTokenService {
  constructor() {
    super();
  }

  async saveSmsCode(phoneNumber, code, expiresIn) {
    const key = `sms:${phoneNumber}`;
    await redisClient.set(key, code, { EX: expiresIn }); // EX: TTL sekundlarda
  }

  async sendSms(phone, code, autoCompleteHashCode) {
    const message = `ARENDUM mobile ilovasiga kirish uchun kod ${code} \n\n ${autoCompleteHashCode}`;
    try {
      const token = await this.getToken();

      const data = new FormData();
      data.append('mobile_phone', phone);
      data.append('message', message);
      data.append('from', '4546');
      data.append('callback_url', '');

      const config = {
        method: 'post',
        route: `message/sms/send`,
        headers: {
          Authorization: `Bearer ${token}`,
          ...data.getHeaders(),
        },
        data,
      };

      const response = await this.axiosHandler(config);

      if (!response) {
        throw new Error('Response is empty or no response');
      }

      if (response.status === 'error') {
        throw new Error(`API Error: ${response.status}`);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSmsCode(phoneNumber) {
    const key = `sms:${phoneNumber}`;
    return await redisClient.get(key); // SMS kodni qaytaradi yoki null
  }

  async deleteSmsCode(phoneNumber) {
    const key = `sms:${phoneNumber}`;
    await redisClient.del(key); // Redis'dan SMS kodni o'chirish
  }

  async verifySmsCode(phoneNumber, code) {
    const savedCode = await getSmsCode(phoneNumber);
    if (!savedCode) {
      throw new Error('SMS code not found or expired');
    }
    if (savedCode !== code) {
      throw new Error('Invalid SMS code');
    }
    await deleteSmsCode(phoneNumber);
  }
}

export default new EskizSmsService();
