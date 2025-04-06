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

  async send() {
    try {
      const { baseUrl, token } = await super.getBaseUrlAndTokenByRequestType(
        this.#requestType
      );

      const response = await axios({
        method: 'post',
        url: `${baseUrl}/${this.#route}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: this.#params,
      });
      this.#response = response.data;
      return this;
    } catch (error) {
      throw error;
    }
  }
}

export default AtmosApiService;
