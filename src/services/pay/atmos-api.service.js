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
    return this.getResponse()?.result?.code == 'OK' ? true : false;
  }

  getResult() {
    return this.getResponse()?.result;
  }

  getData() {
    return this.getResponse()?.data;
  }

  getError() {
    return {
      code: this.getResponse()?.result?.code,
      message: this.getResponse()?.result?.description
    };
  }

  async send() {
    let logData = {
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

      if (!response || !response.data) {
        logData.status = 'error';
        logData.error = 'No response or empty response';
        throw new Error('Response is empty or no response');
      }

      if (response.data.error) {
        logData.status = 'error';
        logData.error = response.data.error;
        throw new Error(`API Error: ${response.data.error.message}`);
      }

      this.#response = response.data;
      logData.response = this.#response;

      return this;

    } catch (error) {
      // Har doim log yoziladi
      console.log(logData);
      throw error;
    }
  }


}

export default AtmosApiService;
