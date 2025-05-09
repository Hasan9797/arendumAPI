import { FormData } from 'formdata-node';
import AxiosApiService from '../httpRequest.service.js';

const data = new FormData();


export class SendSmsRequest extends AxiosApiService {
    constructor(phone, message) {
        super();
        data.append('mobile_phone', phone);
        data.append('message', message);
        data.append('from', '4546');
        data.append('callback_url', 'http://0000.uz/test.php');

        this.setRequest({
            method: 'post',
            route: 'sms/send',
            headers: {
                ...data.getHeaders(),
            },
            data: data,
        }).send();
        return this;
    }
}
