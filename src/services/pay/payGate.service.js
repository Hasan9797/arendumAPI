import PayConfirmRequest from './requests/payConfirmRequest.js';
import PayCreateRequest from './requests/payCreateRequest.js';
import PayPreConfirmRequest from './requests/payPreConfirmRequest.js';
import transactionService from '../transaction.service.js';
import transactionStatusEnum from '../../enums/transaction/transactionStatusEnum.js';

const payCreate = async (requestDTO) => {
  try {
    const transaction = await transactionService.createTransaction({
      clientId: requestDTO.clientId,
      driverId: requestDTO.driverId,
      amount: requestDTO.amount,
      type: requestDTO.type,
      cardToken: requestDTO.cardToken,
      cardId: requestDTO.cardId,
      request: JSON.stringify({ pay_create: requestDTO.request }),
    });

    const request = new PayCreateRequest(requestDTO.request);
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);

    if (response.isOk()) {
      console.log(response.getData());
      
      const updateTransaction = await transactionService.updateById(
        transaction.id, {
        status: transactionStatusEnum.STATUS_PENDING,
        response: JSON.stringify({ pay_create: response.getResponse() }),
        request: JSON.stringify({ pay_pre_confirm: response.getRequest(), ...transactionRequest }),
        partnerId: response.getTransactionId(),
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
    const request = new PayPreConfirmRequest(transaction.partnerId, cardToken);
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
    const request = new PayConfirmRequest(transaction.partnerId);
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);
    const transactionResponse = JSON.parse(transaction.response);

    if (!response.isOk()) {
      return response.getError();
    }
    console.log(response.getResponse());
    
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

// -------------------------- DEPOSIT MERCHANT BLANCE WITHDRAW --------------------------

const cardInfo = async (cardNumber) => { };
const createDeposit = async (amount) => { };
const depositConfirm = async (amount) => { };


export default { payCreate, payPreConfirm, payConfirm };
