import FormData from 'form-data';
import AxiosApiService from '../httpRequest.service.js';
const data = new FormData();
class SendSmsRequest extends AxiosApiService {
    constructor(phone, message) {
        super();
        data.append('mobile_phone', phone);
        data.append('message', message);
        data.append('from', '4546');
        data.append('callback_url', '');
        
        this.setRequest({
            method: 'post',
            url: 'message/sms/send',
            headers: {
                ...data.getHeaders(),
            },
            data: data,
        });

        return this;
    }
}

export default SendSmsRequest;