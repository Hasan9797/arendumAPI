import AtmosApiService from '../atmosApi.service.js';

class PayCreateRequest extends AtmosApiService {

    constructor(amount, account, terminalId) {
        super();
        this.setRoute('partner/remove-card').setParams({
            amount: amount * 100, // Tiynlarda to'lov miqdori
            account,
            terminal_id: terminalId,
            store_id: process.env.STORE_ID,
            lang: 'ru'
        });
    }
}

export default PayCreateRequest;