import transactionRepo from '../repositories/transaction.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

const getAll = async (query) => {
  const result = await transactionRepo.getAll(query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (id) => {
  try {
    const transaction = await transactionRepo.getById(id);
    return formatResponseDates(transaction);
  } catch (error) {
    throw error;
  }
};

const createTransaction = async (body) => {
  try {
    return await transactionRepo.create(body);
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, data) => {
  return await transactionRepo.updateById(id, data);
};

const deleteById = async (id) => {
  return await transactionRepo.deleteById(id);
};

export default {
  getAll,
  getById,
  createTransaction,
  updateById,
  deleteById,
};
