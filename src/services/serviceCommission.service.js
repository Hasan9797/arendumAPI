import serviceCommissionRepo from '../repositories/serviceCommission.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import { CustomError } from '../Errors/customError.js';

const getAll = async (query) => {
  const result = await serviceCommissionRepo.getAll(query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (id) => {
  const serviceCommission = await serviceCommissionRepo.getById(id);
  return formatResponseDates(serviceCommission);
};

const getLastActive = async () => {
  try {
    return await serviceCommissionRepo.getLastActive();
  } catch (error) {
    throw error;
  }
};

const create = async (data) => {
  return await serviceCommissionRepo.create(data);
};

const updateById = async (id, data) => {
  try {
    const record = await serviceCommissionRepo.getById(id);

    if (!record) {
      throw CustomError.notFoundError('Service Commission not found', 404);
    }

    return await serviceCommissionRepo.updateById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  return await serviceCommissionRepo.deleteById(id);
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getLastActive,
};
