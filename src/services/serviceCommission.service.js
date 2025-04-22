import serviceCommissionRepo from '../repositories/serviceCommission.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

const getAll = async (query) => {
  const result = await serviceCommissionRepo.getAll(query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (id) => {
  const structure = await serviceCommissionRepo.getById(id);
  return formatResponseDates(structure);
};

const create = async (data) => {
  return await serviceCommissionRepo.create(data);
};

const updateById = async (id, data) => {
  return await serviceCommissionRepo.updateById(id, data);
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
};
