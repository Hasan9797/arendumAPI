import AtmosApiService from '../atmosApi.service.js';

class PayCreateRequest extends AtmosApiService {
  constructor(requestParams) {
    super();
    this.setRoute('merchant/pay/create').setParams(requestParams);
  }
}

export default PayCreateRequest;
