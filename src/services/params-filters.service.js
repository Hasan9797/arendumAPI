import machineParamsFilterRepo from '../repositories/params-filter.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getParamsFilters = async (query) => {
  try {
    const result = await machineParamsFilterRepo.getAll(query);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const result = await machineParamsFilterRepo.getById(id);

    if (!result) {
      return {};
    }

    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const getByMachineId = async (machineId) => {
  try {
    const result =
      await machineParamsFilterRepo.getParamsFilterByMachineId(machineId);

    return formatResponseDates(result) ?? {};
  } catch (error) {
    throw error;
  }
};

const createParamsFilter = async (data) => {
  try {
    return await machineParamsFilterRepo.create(data);
  } catch (error) {
    throw error;
  }
};

const updateParamsFilter = async (id, data) => {
  try {
    return await machineParamsFilterRepo.updateById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteParamsFilter = async (id) => {
  return await machineParamsFilterRepo.distroy(id);
};

export default {
  getParamsFilters,
  getById,
  getByMachineId,
  createParamsFilter,
  updateParamsFilter,
  deleteParamsFilter,
};
