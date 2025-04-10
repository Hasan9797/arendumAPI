import bankCardRepo from '../repositories/bankCards.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import CardInitRequest from './pay/requests/cardInitRequest.js';
import CardConfirmRequest from './pay/requests/cardConfirmRequest.js';
import userRoleEnum from '../enums/user/userRoleEnum.js';
import CardRemoveRequest from './pay/requests/cardRemoveRequest.js';

const getAll = async (query) => {
  const bankCards = await bankCardRepo.getAll(query);
  return {
    data: formatResponseDates(bankCards.data),
    pagination: bankCards.pagination,
  };
};

const getById = async (id) => {
  try {
    const bankCard = await bankCardRepo.getById(id);
    if (!bankCard) {
      throw new Error('Bank card not found', 404);
    }
    return formatResponseDates(bankCard);
  } catch (error) {
    throw error;
  }
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
      return response.getResponse();
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

const distroy = async (bankCard) => {
  try {
    const request = new CardRemoveRequest(bankCard.cardId, bankCard.cardToken);
    const response = await request.send();

    if (response.isOk()) {
      await bankCardRepo.deleteById(bankCard.id);
      return response.getResult();
    }
    return response.getError();
  } catch (error) {
    throw error;
  }
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
