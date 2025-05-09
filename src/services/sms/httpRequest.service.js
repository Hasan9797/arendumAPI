import axios from 'axios';
import EskisTokenService from './eskizToken.service.js';

const baseUrl = process.env.SMS_API_BASE_URL;

class AxiosApiService extends EskisTokenService {
  #request = {};

  #response = {};

  setRequest(request) {
    this.#request = request;
    return this;
  }

  async send() {
    try {
      const response = await axios(this.getRequest());

      if (!response || !response.data) {
        throw new Error('Response is empty or no response');
      }

      if (response.data.error) {
        throw new Error(`API Error: ${response.data.error.message}`);
      }

      this.#response = response.data;

      return this;
    } catch (error) {
      throw error;
    }
  }

  getResponse() {
    return this.#response;
  }

  isOk() {
    return this.getResponse()?.status == 'error' ? false : true;
  }

  getData() {
    return this.getResponse()?.data;
  }

  getErrorMessage() {
    return this.getResponse()?.data?.message;
  }

  getRequest() {
    return this.#request;
  }
}

export default AxiosApiService;
