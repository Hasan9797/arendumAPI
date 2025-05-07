import { FormData } from "formdata-node";
import AxiosApiService from "../sendRequestSmsApi.service.js";

export class AuthTokenRequest extends AxiosApiService {
    constructor(phone) {
        this.setRoute('auth/token').setParams(
            {
                method: 'post',
                maxBodyLength: Infinity,
                route: 'auth/login',
                headers: {
                    ...data.getHeaders()
                },
                data: data
            }
        );
    }
}