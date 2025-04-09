import bankCardRepo from '../repositories/bank-cards.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import CardInitRequest from '../services/pay/requests/card-init.request.js';
import CardConfirmRequest from '../services/pay/requests/card-confirm.request.js';

const getAll = async (query) => {
  const bankCards = await bankCardRepo.getAll(query);
  return {
    data: formatResponseDates(bankCards.data),
    pagination: bankCards.pagination,
  };
};

const getById = async (id) => {
  const bankCard = await bankCardRepo.getById(id);
  return formatResponseDates(bankCard);
};

const cardInit = async (cardNumber, cardExpiry) => {
  try {
    const request = new CardInitRequest(cardNumber, cardExpiry);
    const response = await request.send();

    if (response.isOk()) {
      return response.getResult();
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const cardConfirm = async (userId, transactionId, smsCode) => {
  try {
    const request = new CardConfirmRequest(transactionId, smsCode);
    const response = await request.send();

    if (response.isOk()) {
      const result = await bankCardRepo.createBankCard(userId, response.getData());

      if (!result) {
        throw new Error('Bank card not created');
      }

      return response.getResult();
    }

    return response.getError();
  } catch (error) {
    throw error;
  }
};

const update = async (id, data) => {
  return await bankCardRepo.updateById(id, data);
};

const distroy = async (id) => {
  return await bankCardRepo.deleteById(id);
};

export default {
  getAll,
  getById,
  cardInit,
  cardConfirm,
  update,
  distroy,
};
