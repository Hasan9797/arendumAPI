import machineParamsRepo from '../repositories/machine-params.repo.js';

const getCategories = async (query) => {
  return await machineParamsRepo.getAll(query);
};

const getCategoryById = async (id) => {
  return await machineParamsRepo.getById(id);
};

const createCategory = async (data) => {
  return await machineParamsRepo.create(data);
};

const updateCategory = async (id, data) => {
  return await machineParamsRepo.updateById(id, data);
};

const deleteCategory = async (id) => {
  return await machineParamsRepo.distroy(id);
};

const selectMachineParams = async (machinId) => {
  try {
    return await machineParamsRepo.getSelectList(machinId);
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  selectMachineParams,
};
