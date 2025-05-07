import { FormData } from 'formdata-node';
import AxiosApiService from '../sendRequestSmsApi.service.js';

export class AuthTokenRequest extends AxiosApiService {
  constructor() {
    this.setRoute('auth/login')
      .setRequest({
        method: 'post',
        maxBodyLength: Infinity,
        route: 'auth/login',
        headers: {
          ...data.getHeaders(),
        },
        data: data,
      })
      .send();

    return this;
  }
}
