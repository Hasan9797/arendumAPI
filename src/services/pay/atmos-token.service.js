import axios from 'axios';

const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
  'base64'
);

class AtmosTokenService {
  async getAtmosToken() {
    try {
      const response = await axios.post(
        'https://partner.atmos.uz/token',
        'grant_type=8032',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${credentials}`,
          },
          timeout: 15000, // Timeoutni oshiramiz
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
