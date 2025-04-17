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

const getByUserId = async (userId, role) => {
  try {
    const balance = await userBalanceRepo.getByUserId(userId, role);
    return formatResponseDates(balance);
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

export default {
  getAll,
  getById,
  getByUserId,
  createBalance,
  updateById,
  deleteById,
};
