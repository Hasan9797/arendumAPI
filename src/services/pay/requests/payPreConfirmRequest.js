import AtmosApiService from '../atmosApi.service.js';

class PayPreConfirmRequest extends AtmosApiService {
  constructor(transactionId, cardToken) {
    super();
    this.setRoute('merchant/pay/pre-apply').setParams({
      card_token: cardToken,
      store_id: process.env.STORE_ID ?? 8032,
      transaction_id: transactionId,
    });
  }
}

export default PayPreConfirmRequest;
