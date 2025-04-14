import AtmosApiService from '../atmosApi.service.js';

class PayConfirmRequest extends AtmosApiService {
  constructor(transactionId) {
    super();
    this.setRoute('merchant/pay/apply').setParams({
      transaction_id: transactionId,
      otp: 111111,
      store_id: process.env.STORE_ID ?? 8032,
    });
  }
}

export default PayConfirmRequest;
