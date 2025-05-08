import axios from 'axios';
const baseUrl = process.env.SMS_API_BASE_URL;

class AxiosApiService {
  #request = {};

  #response = {};

  setRequest(request) {
    this.#request = request;
    return this;
  }

  async send() {
    try {
      const response = await axios(this.#request);

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
    return this.#request;
  }
}

export default AxiosApiService;
