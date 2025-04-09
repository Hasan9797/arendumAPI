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

  async #makeAxiosPostWithCache({ url, data, headers, cacheKey, ttl = 3600 }) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const response = await axios.post(url, data, {
        headers,
        timeout: 5000,
      });

      if (response?.data) {
        await redisClient.setEx(cacheKey, ttl, JSON.stringify(response.data));
      }

      return response.data;
    } catch (error) {
      console.error('Axios Auth Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPayToken() {
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

    return this.#makeAxiosPostWithCache({
      url,
      data: formData,
      headers,
      cacheKey: 'atmos_pay_token',
    });
  }

  async getDepositToken() {
    const credentials = Buffer.from(
      `${this.#depositConsumerKey}:${this.#depositConsumerSecret}`
    ).toString('base64');

    const headers = {
      Authorization: `Basic ${credentials}`,
    };

    const url = `${this.#atmosDepositBaseUrl}/token?grant_type=client_credentials`;

    return this.#makeAxiosPostWithCache({
      url,
      data: null,
      headers,
      cacheKey: 'atmos_deposit_token',
    });
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

    return this.#makeAxiosPostWithCache({
      url,
      data: formData,
      headers,
      cacheKey: `atmos_refresh_token`,
    });
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
        return {
          baseUrl: this.#atmosPayBaseUrl,
          token: token?.access_token,
        };
      }
    }
  }
}

export default AtmosTokenService;
