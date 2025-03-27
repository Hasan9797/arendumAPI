import axios from 'axios';
import AtmosTokenService from './atmos-token.service.js';

class AtmosApiService extends AtmosTokenService {
  #routeUrl = '';

  #token = '';

  #params = {};

  #response = {};

  constructor() {
    super();
    this.#initToken();
  }

  setRouteUrl(route) {
    this.#routeUrl = route;
  }

  async #initToken() {
    this.#token = await this.getAtmosToken();
  }

  setParams(params) {
    this.#params = params;
  }

  getResponse() {
    return this.#response;
  }

  async send() {
    try {
      const response = await axios({
        method: 'post',
        url: this.#routeUrl,
        headers: {
          Authorization: `Bearer ${this.#token}`,
        },
        data: this.#params,
      });
      this.response = response.data;
    } catch (error) {
      throw error;
     }
  }
}

export default AtmosApiService;
