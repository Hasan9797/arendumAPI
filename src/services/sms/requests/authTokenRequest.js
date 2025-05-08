import { FormData } from 'formdata-node';
import AxiosApiService from '../sendRequestSmsApi.service.js';

var data = new FormData();
data.append('email', process.env.ESKIZ_LOGIN);
data.append('password', process.env.ESKIZ_PASSWORD);

export class AuthTokenRequest extends AxiosApiService {
  constructor() {
    this.setRequest({
      method: 'post',
      maxBodyLength: Infinity,
      route: 'auth/login',
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    }).send();

    return this;
  }
}
