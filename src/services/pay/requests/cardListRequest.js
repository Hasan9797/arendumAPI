import AtmosApiService from '../atmosApi.service.js';

class CardListRequest extends AtmosApiService {
  constructor(page, pageSize) {
    super();
    this.setRoute('partner/list-cards').setParams({
      page,
      page_size: pageSize,
    });
  }
}

export default CardListRequest;
