import machinesRepo from '../repositories/machines.repo.js';

const getParamsFilters = async (query) => {
  return await machinesRepo.getMachines(query);
};

const getById = async (id) => {
  return await machinesRepo.getMachineById(id);
};

const createParamsFilter = async (data) => {
  return await machinesRepo.createMachine(data);
};

const updateParamsFilter = async (id, data) => {
  return await machinesRepo.updateMachineById(id, data);
};

const deleteParamsFilter = async (id) => {
  return await machinesRepo.deleteMachineById(id);
};

export default {
  getParamsFilters,
  getById,
  createParamsFilter,
  updateParamsFilter,
  deleteParamsFilter,
};
