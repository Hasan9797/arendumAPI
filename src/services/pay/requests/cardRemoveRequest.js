import AtmosApiService from '../atmosApi.service.js';

class CardRemoveRequest extends AtmosApiService {

    constructor(cardId, cardToken) {
        super();
        this.setRoute('partner/remove-card').setParams({
            id: cardId,
            token: cardToken,
        });
    }
}

export default CardRemoveRequest;
