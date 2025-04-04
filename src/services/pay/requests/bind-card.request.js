import AtmosApiService from "../atmos-api.service.js";

class BindCardRequest extends AtmosApiService {
    constructor(cardNumber, expiryDate) {
        super();
        this.setRouteUrl('partner/bind-card/init');
        this.setParams({
            card_number: cardNumber,
            expiry: expiryDate
        });
    }
}

export default BindCardRequest;