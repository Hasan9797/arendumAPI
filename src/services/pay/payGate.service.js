import PayConfirmRequest from './requests/payConfirmRequest.js';
import PayCreateRequest from './requests/payCreateRequest.js';
import PayPreConfirmRequest from './requests/payPreConfirmRequest.js';
import transactionService from '../transaction.service.js';
import transactionStatusEnum from '../../enums/transaction/transactionStatusEnum.js';

const payCreate = async (requestDTO) => {
  try {
    const transaction = await transactionService.createTransaction({
      ...requestDTO,
      request: JSON.stringify({ pay_create: requestDTO.request }),
    });

    const request = new PayCreateRequest(requestDTO.request);
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);

    if (response.isOk()) {

      const updateTransaction = await transactionService.updateById(
        transaction.id, {
        status: transactionStatusEnum.STATUS_PENDING,
        response: JSON.stringify({ pay_create: response.response() }),
        request: JSON.stringify({ pay_pre_confirm: response.getRequest(), ...transactionRequest }),
        partnerTransactionId: response.getData().transaction_id,
      });

      return await payPreConfirm(updateTransaction);
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const payPreConfirm = async (transaction, cardToken) => {
  try {
    const request = new PayPreConfirmRequest(transaction.partnerTransactionId, cardToken);
    const response = await request.send();

    if (response.isOk()) {
      return await payConfirm(updateTransaction);
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const payConfirm = async (transaction) => {
  try {
    const request = new PayConfirmRequest(transaction.partnerTransactionId);
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);
    const transactionResponse = JSON.parse(transaction.response);

    if (!response.isOk()) {
      return response.getError();
    }

    const updateTransaction = await transactionService.updateById(
      transaction.id, {
      request: JSON.stringify({ pay_confirm: response.getRequest(), ...transactionRequest }),
      response: JSON.stringify({ pay_confirm: response.getResponse(), ...transactionResponse }),
    });

    if (!updateTransaction) {
      throw new Error('Transaction not updated');
    }

    return response.getResponse();
  } catch (error) {
    throw error;
  }
};

export default { payCreate, payPreConfirm, payConfirm };
