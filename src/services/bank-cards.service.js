import bankCardRepo from '../repositories/bank-cards.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import CardInitRequest from '../services/pay/requests/card-init.request.js';

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
    console.log('response: ', response.getResponse());
    
    if (response.isOk()) {
      console.log('response keldi');
      return response.getResult();
    }

    console.log('response kelmadi');
    return response.getError();
  } catch (error) {
    throw error;
  }
};

const cardConfirm = async (data) => {
  return await bankCardRepo.createBankCard(data);
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
