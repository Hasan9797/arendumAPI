import axios from 'axios';
import redisClient from '../../config/redis.js';
import FormData from 'form-data';
import eskizTokenRepo from '../../repositories/eskizToken.repo.js';

class EskisTokenService {
  #eskizBaseUrl = process.env.ESKIZ_BASE_URL;
  #login = process.env.ESKIZ_LOGIN;
  #password = process.env.ESKIZ_PASSWORD;

  async getToken() {
    const eskizToken = await eskizTokenRepo.getToken();
    const now = Math.floor(Date.now() / 1000);

    if (eskizToken && eskizToken.expire) {
      if (Number(eskizToken.expire) >= now) {
        return eskizToken.token;
      }
      return this.getRefreshToken(eskizToken);
    }

    return this.getAuthToken();
  }

  async #axiosHandler({ method, route, data, headers }) {
    try {
      const baseUrl = `${this.#eskizBaseUrl}/${route}`;

      const axiosResponse = await axios({
        method,
        url: baseUrl,
        data,
        headers,
      });

      if (!axiosResponse || !axiosResponse.data) {
        throw new Error('Response is empty or no response');
      }

      return response.data;
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

    const data = await this.#axiosHandler({
      method: 'post',
      route: 'auth/login',
      data: formData,
      headers,
    });

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const twentyFiveDaysLaterTimestamp = currentUnixTimestamp + secondsInDay * daysLater;

    const newEskizToken = await eskizTokenRepo.createEskizToken({
      token: data.token,
      expire: String(twentyFiveDaysLaterTimestamp),
    });

    return newEskizToken.token;
  }

  async getRefreshToken(eskizToken) {
    const headers = {
      Authorization: `Bearer ${eskizToken.token}`,
    };

    const data = await this.#axiosHandler({
      method: 'patch',
      route: 'auth/refresh',
      data: formData,
      headers,
    });

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const twentyFiveDaysLaterTimestamp = currentUnixTimestamp + secondsInDay * daysLater;

    const updateEskizToken = await eskizTokenRepo.updateEskizToken(eskizToken.id, {
      token: data.token,
      expire: String(twentyFiveDaysLaterTimestamp),
    });

    return updateEskizToken.token;
  }
}

export default EskisTokenService;
