import PayConfirmRequest from './requests/payConfirmRequest.js';
import PayCreateRequest from './requests/payCreateRequest.js';
import PayPreConfirmRequest from './requests/payPreConfirmRequest.js';

const payCreate = async (amount, account) => {
  try {
    const request = new PayCreateRequest(amount, account);
    const response = await request.send();

    if (response.isOk()) {
      return response.getResponse();
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const payPreConfirm = async (transactionId, cardToken) => {
  try {
    const request = new PayPreConfirmRequest(transactionId, cardToken);
    const response = await request.send();

    if (response.isOk()) {
      return response.getResponse();
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const payConfirm = async (transactionId) => {
  try {
    const request = new PayConfirmRequest(transactionId);
    const response = await request.send();

    if (response.isOk()) {
      return response.getResponse();
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

export default { payCreate, payPreConfirm, payConfirm };
