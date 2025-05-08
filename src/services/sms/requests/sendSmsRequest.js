import { FormData } from 'formdata-node';
import AxiosApiService from '../sendRequestSmsApi.service.js';
import e from 'cors';

var data = new FormData();
data.append('mobile_phone', '99899012345678');
data.append('message', 'Eskiz Test');
data.append('from', '4546');
data.append('callback_url', 'http://0000.uz/test.php');

export class SendSmsRequest extends AxiosApiService {
    static sendSms() {
        return AxiosApiService.post('/send', data);
    }
}
