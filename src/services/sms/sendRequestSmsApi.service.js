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
      const response = await axios({
        method: this.#request.method,
        maxBodyLength: this.#request.maxBodyLength,
        url: `${baseUrl}/${this.#request.route}`,
        headers: this.#request.headers,
        data: this.#request.data,
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
