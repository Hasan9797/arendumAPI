import AtmosApiService from '../atmos-api.service.js';

class CardInitRequest extends AtmosApiService {
  
  constructor(cardNumber, expiryDate) {
    super();
    console.log('CardInitRequest');
    this.setRoute('partner/bind-card/init').setParams({
      card_number: cardNumber,
      expiry: expiryDate,
    });
  }
}

export default CardInitRequest;
