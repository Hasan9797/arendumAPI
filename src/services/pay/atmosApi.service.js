import axios from 'axios';
import AtmosTokenService from './atmosToken.service.js';

class AtmosApiService extends AtmosTokenService {
  #route = '';

  #params = {};

  #response = {};

  #requestType = 'pay';

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

  async send() {
    const { baseUrl, token } = await this.getBaseUrlAndTokenByRequestType(
      this.#requestType
    );
    let logData = {
      requestType: this.#requestType,
      baseUrl: baseUrl,
      route: this.#route,
      params: this.#params,
      status: 'success',
    };

    try {
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
      // console.log(logData);

      return this;
    } catch (error) {
      // Har doim log yoziladi
      // console.log(logData);
      throw error;
    }
  }

  getResponse() {
    return this.#response;
  }

  isOk() {
    return this.getResponse()?.result?.code == 'OK' ? true : false;
  }

  getTransactionId() {
    return this.getResponse()?.transaction_id;
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
      message: this.getResponse()?.result?.description,
    };
  }

  getRequest() {
    return this.#params;
  }
}

export default AtmosApiService;
