import userBalanceRepo from '../repositories/userBalance.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

const getAll = async (query) => {
  const result = await userBalanceRepo.getAll(query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (id) => {
  try {
    const balance = await userBalanceRepo.getById(id);
    return formatResponseDates(balance);
  } catch (error) {
    throw error;
  }
};

const getByDriverId = async (driverId) => {
  try {
    const driverBalance = await userBalanceRepo.getByDriverId(driverId);
    return formatResponseDates(driverBalance);
  } catch (error) {
    throw error;
  }
};

const getByClientId = async (clientId) => {
  try {
    const clietnBalance = await userBalanceRepo.getByClientId(clientId);
    return formatResponseDates(clietnBalance);
  } catch (error) {
    throw error;
  }
};

const createBalance = async (body) => {
  try {
    return await userBalanceRepo.create(body);
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    return await userBalanceRepo.updateById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  return await userBalanceRepo.deleteById(id);
};

const withdrawDriverBalance = async (driverId, driverBalance, serviceCommission) => {
  try {
    const updateData = { balance: String(driverBalance - serviceCommission.arendumAmount) };

    const updateDriverBalance = await userBalanceRepo.updateByDriverId(driverId, updateData);

    return updateDriverBalance;
  } catch (error) {
    throw error;
  }
};

const updateByUserId = async (userId, role, amount) => {
  try {
    const updateData = { balance: String(amount) };
    if (role == userRoleEnum.CLIENT) {
      return await userBalanceRepo.updateByDriverId(userId, updateData);
    } else if (role == userRoleEnum.DRIVER) {
      return await userBalanceRepo.updateByClientId(userId, updateData);
    }
    return false;
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  getByClientId,
  getByDriverId,
  createBalance,
  updateById,
  deleteById,
  withdrawDriverBalance,
};
