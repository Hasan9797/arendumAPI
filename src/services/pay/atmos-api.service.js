import axios from 'axios';
import AtmosTokenService from './atmos-token.service.js';

class AtmosApiService extends AtmosTokenService {
  #methodUrl = '';

  #token = '';

  #params = {};

  constructor() {
    super();
    this.#initToken();
  }

  setMethodUrl(url) {
    this.#methodUrl = url;
  }

  async #initToken() {
    this.#token = await this.getAtmosToken();
  }

  setParams(params) {
    this.#params = params;
  }

  getMethodUrl() {}

  getParams() {}

  async send() {
    try {
    } catch (error) {}
  }
}
