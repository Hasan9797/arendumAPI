import axios from 'axios';
import redisClient from '../../config/redis.js';

class AtmosTokenService {
  #atmosPayBaseUrl;
  #atmosDepositBaseUrl;
  #payConsumerKey;
  #payConsumerSecret;
  #depositConsumerKey;
  #depositConsumerSecret;

  constructor() {
    this.#atmosPayBaseUrl = process.env.ATMOS_PAY_BASE_URL;
    this.#atmosDepositBaseUrl = process.env.ATMOS_DEPOSIT_BASE_URL;

    this.#payConsumerKey = process.env.PAY_CONSUMER_KEY;
    this.#payConsumerSecret = process.env.PAY_CONSUMER_SECRET;

    this.#depositConsumerKey = process.env.DEPOSIT_CONSUMER_KEY;
    this.#depositConsumerSecret = process.env.DEPOSIT_CONSUMER_SECRET;
  }

  async #makeAxiosPost(url, data, headers) {
    try {
      const response = await axios.post(url, data, {
        headers,
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      console.error('Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPayToken() {
    const cacheKey = `atmos_pay_token`;

    // const cachedToken = await redisClient.get(cacheKey);

    // if (cachedToken) {
    //   return JSON.parse(cachedToken); // Cache'da bo‘lsa, JSON parse qilamiz
    // }

    try {
      const formData = new URLSearchParams({
        grant_type: 'client_credentials',
      });

      const credentials = Buffer.from(
        `${this.#payConsumerKey}:${this.#payConsumerSecret}`
      ).toString('base64');

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      };

      const url = `${this.#atmosPayBaseUrl}/token`;

      const response = await this.#makeAxiosPost(url, formData, headers);

      if (response) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // 3600 soniya = 1 soat
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getDepositToken() {
    const credentials = Buffer.from(
      `${this.#depositConsumerKey}:${this.#depositConsumerSecret}`
    ).toString('base64');

    const headers = {
      Authorization: `Basic ${credentials}`,
    };

    const url = `${this.#atmosDepositBaseUrl}/token?grant_type=client_credentials`;

    return this.#makeAxiosPost(url, null, headers);
  }

  async getRefreshToken(token) {
    const formData = new URLSearchParams({
      grant_type: 'client_credentials',
      refresh_token: token,
    });

    const credentials = Buffer.from(
      `${this.#payConsumerKey}:${this.#payConsumerSecret}`
    ).toString('base64');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    };

    const url = `${this.#atmosPayBaseUrl}/token`;

    try {
      return this.#makeAxiosPost(url, formData, headers);
    } catch (error) {
      throw error;
    }
  }

  async getBaseUrlAndTokenByRequestType(type) {
    switch (type) {
      case 'deposit': {
        const token = await this.getDepositToken();
        return {
          baseUrl: this.#atmosDepositBaseUrl,
          token: token?.access_token,
        };
      }
      default: {
        const token = await this.getPayToken();
        return { baseUrl: this.#atmosPayBaseUrl, token: token?.access_token };
      }
    }
  }
}

export default AtmosTokenService;
