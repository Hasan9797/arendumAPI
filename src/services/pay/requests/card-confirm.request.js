import AtmosApiService from '../atmos-api.service.js';

class CardConfirmRequest extends AtmosApiService {
  constructor(transactionId, otpCode) {
    super.setRoute('partner/bind-card/confirm').setParams({
      transaction_id: transactionId,
      otp: otpCode,
    });
  }
}

export default CardConfirmRequest;
