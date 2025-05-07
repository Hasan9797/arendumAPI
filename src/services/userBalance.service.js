import userBalanceRepo from '../repositories/userBalance.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import userRoleEnum from '../enums/user/userRoleEnum.js';
import SocketService from '../socket/index.js';

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

const withdrawDriverBalance = async (driverId, driverBalance, serviceCommission, orderId) => {
  try {
    const DriverSocket = SocketService.getSocket('driver');

    const updateBalance = String(driverBalance - serviceCommission.arendumAmount);

    DriverSocket.to(`order_room_${orderId}`).emit('updateBalance', {
      success: true,
      balance: updateBalance,
    });

    const updateDriverBalance = await userBalanceRepo.updateByDriverId(driverId, {
      balance: updateBalance,
    });

    return updateDriverBalance;
  } catch (error) {
    throw error;
  }
};

const updateByUserId = async (userId, role, amount) => {
  try {
    const updateData = { balance: String(amount) };
    if (role == userRoleEnum.CLIENT) {
      return await userBalanceRepo.updateByClientId(userId, updateData);
    } else if (role == userRoleEnum.DRIVER) {
      return await userBalanceRepo.updateByDriverId(userId, updateData);
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
  updateByUserId,
};
