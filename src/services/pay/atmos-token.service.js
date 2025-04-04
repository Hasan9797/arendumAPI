import axios from 'axios';

class AtmosTokenService {

  async getPayToken() {

    // .env faylidan username va password olish
    const consumerKey = "hWKDdQ8KNX5m_znpI4fwo2sQRS8a" //process.env.CONSUMER_KEY;
    const consumerSecret = "p9_IC549SOF0nMCt1qMqEyEBaAka" //process.env.CONSUMER_SECRET;

    // Username va password mavjudligini tekshirish
    if (!consumerKey || !consumerSecret) {
      throw new Error('Consumer key or secret not found!');
    }

    const formData = new URLSearchParams({
      grant_type: 'client_credentials'
    });

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    try {
      const response = await axios.post(
        'https://partner.atmos.uz/token',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getDepositToken() {

    const consumerKey = "T7Lv51Yp3OHUejneKDY1rL9QnBka" //process.env.CONSUMER_KEY;
    const consumerSecret = "Vh5i_MfgT3fkEOtpHwgA2qs681Qa" //process.env.CONSUMER_SECRET;

    const credentials = Buffer.from(
      `${consumerKey}:${consumerSecret}`
    ).toString('base64');

    try {
      const response = await axios.post(
        'https://partner.atmos.uz/token',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getRefreshToken(token) {
    const formData = new URLSearchParams({
      grant_type: 'client_credentials',
      refresh_token: token
    });

    try {
      const response = await axios.post(
        'https://partner.atmos.uz/token',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new AtmosTokenService();
