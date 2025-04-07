import axios from 'axios';
import AtmosTokenService from './atmos-token.service.js';

class AtmosApiService extends AtmosTokenService {
  #route = '';

  #params = {};

  #response = {};

  #requestType = 'pay';

  // constructor() {
  //   super();
  // }

  setRequestType(type) {
    this.#requestType = type;
    return this;
  }

  setRoute(route) {
    this.#route = route;
    return this;
  }

  setParams(params) {
    this.#params = params;
    return this;
  }

  getResponse() {
    return this.#response;
  }

  isOk() {
    return this.#response?.result?.code == 'OK' ? true : false;
  }

  getResult() {
    return this.#response?.result;
  }

  getError() {
    return {
      code: this.#response?.result?.code,
      message: this.#response?.result?.description
    };
  }

  async send() {
    let logMessage = {
      requestType: this.#requestType,
      route: this.#route,
      params: this.#params,
      status: 'success',
    };

    try {
      const { baseUrl, token } = await this.getBaseUrlAndTokenByRequestType(this.#requestType);

      const response = await axios({
        method: 'post',
        url: `${baseUrl}/${this.#route}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: this.#params,
      });

      // Agar response bo'lmasa yoki data bo'lmasa, statusni 'error'ga o'zgartiring
      if (!response || !response.data) {
        logMessage.status = 'error';
        logMessage.error = 'No response or empty response';
        throw new Error('Response is empty or no response');
      }

      // Agar response'da error bo'lsa
      if (response.data.error) {
        logMessage.status = 'error';
        logMessage.error = response.data.error;
        throw new Error(`API Error: ${response.data.error.message}`);
      }

      this.#response = response.data;
      logMessage.response = this.#response;
      return this;
    } finally {
      // Logni har doim, xato yoki muvaffaqiyat bo'lsa ham yozing
      logger.info(logMessage);
    }
  }

}

export default AtmosApiService;
