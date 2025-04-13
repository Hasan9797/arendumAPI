import AtmosApiService from '../atmosApi.service.js';

class PayConfirmRequest extends AtmosApiService {
  constructor(transactionId, otp, storeId) {
    super();
    this.setRoute('merchant/pay/pre-apply').setParams({
      transaction_id: transactionId,
      otp: otp, //111111,
      store_id: storeId, // process.env.STORE_ID ?? 8032,
    });
  }
}

export default PayConfirmRequest;
