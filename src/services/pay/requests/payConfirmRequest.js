import AtmosApiService from '../atmosApi.service.js';

class PayConfirmRequest extends AtmosApiService {
  constructor(transactionId) {
    super();
    this.setRoute('merchant/pay/pre-apply').setParams({
      store_id: process.env.STORE_ID ?? '8032',
      otp: 111111,
      transaction_id: transactionId,
    });
  }
}

export default PayConfirmRequest;
