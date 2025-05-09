import axios from 'axios';
import redisClient from '../../config/redis.js';
import FormData from 'form-data';

import { createEskizToken, getEskizToken, updateEskizToken } from '../../repositories/eskizToken.repo.js';

const daysToAdd = 25 * 86400;

const now = Math.floor(Date.now() / 1000);
const newTimestamp = now + daysToAdd;

// console.log('25 kun keyingi UNIX:', newTimestamp);
// console.log('Sana:', new Date(newTimestamp * 1000).toISOString());

class EskisTokenService {
  #eskizBaseUrl = process.env.ESKIZ_BASE_URL;
  #login = process.env.ESKIZ_LOGIN;
  #password = process.env.ESKIZ_PASSWORD;

  async getToken() {
    try {
      const eskizToken = await getEskizToken();
      console.log(eskizToken);

      if (eskizToken && eskizToken.expire) {
        if (Number(eskizToken.expire) >= now) {
          console.log('Using cached token');
          return eskizToken.token;
        }
        return this.getRefreshToken(eskizToken);
      }

      return this.getAuthToken();
    } catch (error) {
      throw error;
    }
  }

  async #axiosHandler({ route, ...params }) {
    try {
      const baseUrl = `${this.#eskizBaseUrl}/${route}`;
      console.log(baseUrl);

      const axiosResponse = await axios({
        ...params,
        url: baseUrl,
      });
      console.log(axiosResponse.data.data);

      if (!axiosResponse || !axiosResponse.data) {
        throw new Error('Response is empty or no response');
      }

      return axiosResponse.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getAuthToken() {
    const formData = new FormData();
    formData.append('email', this.#login);
    formData.append('password', this.#password);

    const headers = {
      ...formData.getHeaders(),
    };

    try {
      const data = await this.#axiosHandler({
        route: 'auth/login',
        method: 'post',
        data: formData,
        headers,
      });

      const newEskizToken = await createEskizToken({
        token: data.token,
        expire: String(newTimestamp),
      });
      console.log('new token');

      return newEskizToken.token;
    } catch (error) {
      throw error;
    }
  }

  async getRefreshToken(eskizToken) {
    const headers = {
      Authorization: `Bearer ${eskizToken.token}`,
    };

    try {
      const data = await this.#axiosHandler({
        method: 'patch',
        route: 'auth/refresh',
        headers,
      });

      const updateData = await updateEskizToken(eskizToken.id, {
        token: data.token,
        expire: String(newTimestamp),
      });
      console.log('refresh token');

      return updateData.token;
    } catch (error) {
      throw error;
    }
  }
}

export default EskisTokenService;
