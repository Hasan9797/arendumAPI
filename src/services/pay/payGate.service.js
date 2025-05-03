import PayConfirmRequest from './requests/payConfirmRequest.js';
import PayCreateRequest from './requests/payCreateRequest.js';
import PayPreConfirmRequest from './requests/payPreConfirmRequest.js';
import transactionService from '../transaction.service.js';
import transactionStatusEnum from '../../enums/transaction/transactionStatusEnum.js';
import { CustomError } from '../../Errors/customError.js';

const updateTransaction = async (transactionId, updateData) => {
  try {
    const updated = await transactionService.updateById(
      transactionId,
      updateData
    );
    if (!updated) {
      throw new Error('Transaction update failed');
    }
    return updated;
  } catch (error) {
    throw new Error(`Transaction update error: ${error.message}`);
  }
};

const payCreate = async (requestDTO) => {
  let transaction;
  try {
    // Tranzaksiya yaratish
    transaction = await transactionService.createTransaction({
      clientId: requestDTO.clientId,
      driverId: requestDTO.driverId,
      amount: requestDTO.amount,
      type: requestDTO.type,
      cardToken: requestDTO.cardToken,
      cardId: requestDTO.cardId,
      currency: requestDTO.currency || 'UZS',
      request: JSON.stringify({ pay_create: requestDTO.request }),
      status: transactionStatusEnum.STATUS_CREATED,
    });

    // PayCreateRequest jo'natish
    const request = new PayCreateRequest(requestDTO.request);
    const response = await request.send();

    if (response.isOk()) {
      // if success
      const updatedTransaction = await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_PENDING,
        response: JSON.stringify({ pay_create: response.getResponse() }),
        request: JSON.stringify({
          pay_create: requestDTO.request,
          pay_pre_confirm: response.getRequest(),
        }),
        partnerId: response.getTransactionId(),
        createdAt: new Date(),
      });

      return await payPreConfirm(updatedTransaction);
    } else {
      // if partner error
      await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_ERROR,
        response: JSON.stringify({ pay_create: response.getError() }),
      });
      throw CustomError.parnerResponseError(
        response.getError().message,
        response.getError().code
      );
    }
  } catch (error) {
    // if error
    if (transaction) {
      await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_ERROR,
        response: JSON.stringify({ pay_create: { error: error.message } }),
      });
    }
    throw error;
  }
};

const payPreConfirm = async (transaction) => {
  try {
    const request = new PayPreConfirmRequest(
      transaction.partnerId,
      transaction.cardToken
    );
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);
    const transactionResponse = JSON.parse(transaction.response);

    if (response.isOk()) {
      // Muvaffaqiyatli holat
      const updatedTransaction = await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_PRE_CONFIRMED,
        request: JSON.stringify({
          ...transactionRequest,
          pay_pre_confirm: response.getRequest(),
        }),
        response: JSON.stringify({
          ...transactionResponse,
          pay_pre_confirm: response.getResponse(),
        }),
        prepayTime: new Date().toISOString(),
      });

      return await payConfirm(updatedTransaction);
    } else {
      // if partner error
      await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_ERROR,
        response: JSON.stringify({ pay_pre_confirm: response.getError() }),
      });
      throw CustomError.parnerResponseError(
        response.getError().message,
        response.getError().code
      );
    }
  } catch (error) {
    // if error
    await updateTransaction(transaction.id, {
      status: transactionStatusEnum.STATUS_ERROR,
      response: JSON.stringify({ pay_pre_confirm: { error: error.message } }),
    });
    throw error;
  }
};

const payConfirm = async (transaction) => {
  try {
    const request = new PayConfirmRequest(transaction.partnerId);
    const response = await request.send();

    const transactionRequest = JSON.parse(transaction.request);
    const transactionResponse = JSON.parse(transaction.response);

    if (response.isOk()) {
      // Muvaffaqiyatli holat
      const updatedTransaction = await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_SUCCESS,
        request: JSON.stringify({
          ...transactionRequest,
          pay_confirm: response.getRequest(),
        }),
        response: JSON.stringify({
          ...transactionResponse,
          pay_confirm: response.getResponse(),
        }),
        // confirmTime: new Date().toISOString(),
        // confirmed: true,
      });

      return updatedTransaction;
    } else {
      // if partner error
      await updateTransaction(transaction.id, {
        status: transactionStatusEnum.STATUS_ERROR,
        response: JSON.stringify({ pay_confirm: response.getError() }),
      });
      throw CustomError.parnerResponseError(
        response.getError().message,
        response.getError().code
      );
    }
  } catch (error) {
    // if error
    await updateTransaction(transaction.id, {
      status: transactionStatusEnum.STATUS_ERROR,
      response: JSON.stringify({ pay_confirm: { error: error.message } }),
    });
    throw error;
  }
};

// -------------------------- DEPOSIT MERCHANT BLANCE WITHDRAW --------------------------

const cardInfo = async (cardNumber) => {};
const createDeposit = async (amount) => {};
const depositConfirm = async (amount) => {};

export default { payCreate, payPreConfirm, payConfirm };
