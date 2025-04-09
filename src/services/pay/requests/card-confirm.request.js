import AtmosApiService from '../atmos-api.service.js';

class CardConfirmRequest extends AtmosApiService {
  constructor(transactionId, smsCode) {
    super();
    this.setRoute('partner/bind-card/confirm').setParams({
      transaction_id: transactionId,
      otp: smsCode,
    });
  }
}

export default CardConfirmRequest;
