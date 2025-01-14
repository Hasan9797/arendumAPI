import machineParamsFilterRepo from '../repositories/params-filter.repo.js';

const getParamsFilters = async (query) => {
  return await machineParamsFilterRepo.getAll(query);
};

const getById = async (id) => {
  return await machineParamsFilterRepo.getById(id);
};

const createParamsFilter = async (data) => {
  return await machineParamsFilterRepo.create(data);
};

const updateParamsFilter = async (id, data) => {
  return await machineParamsFilterRepo.updateById(id, data);
};

const deleteParamsFilter = async (id) => {
  return await machineParamsFilterRepo.deleteParamsFilter(id);
};

export default {
  getParamsFilters,
  getById,
  createParamsFilter,
  updateParamsFilter,
  deleteParamsFilter,
};
