import bankCardRepo from '../repositories/bank-cards.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import CardInitRequest from '../services/pay/requests/card-init.request.js';
import CardConfirmRequest from '../services/pay/requests/card-confirm.request.js';
import userRoleEnum from '../enums/user/user-role.enum.js';

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

const getByClientIdOrDriverId = async (userId, role) => {
  let bankCards = null;

  try {
    if (role == userRoleEnum.CLIENT) {
      bankCards = await bankCardRepo.getByClientId(userId);
    } else {
      bankCards = await bankCardRepo.getByDriverId(userId);
    }

    return formatResponseDates(bankCards);
  } catch (error) {
    throw error;
  }
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

const cardConfirm = async (user, transactionId, smsCode) => {
  try {
    const request = new CardConfirmRequest(transactionId, smsCode);
    const response = await request.send();

    const clientId = user.role == userRoleEnum.CLIENT ? user.id : null;
    const driverId = user.role == userRoleEnum.DRIVER ? user.id : null;

    if (response.isOk()) {
      const result = await bankCardRepo.createBankCard(driverId, clientId, response.getData());

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
  getByClientIdOrDriverId,
  cardInit,
  cardConfirm,
  update,
  distroy,
};
