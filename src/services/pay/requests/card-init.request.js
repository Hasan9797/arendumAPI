import AtmosApiService from '../atmos-api.service.js';

class CardInitRequest extends AtmosApiService {
  
  constructor(cardNumber, expiryDate) {
    super();
    this.setRoute('partner/bind-card/init').setParams({
      card_number: cardNumber,
      expiry: expiryDate,
    });
  }
}

export default CardInitRequest;
