import machinesRepo from '../repositories/machines.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

const getMachines = async (lang, query) => {
  try {
    const result = await machinesRepo.getMachines(lang, query);
    return {
      data: formatResponseDates(result.data),
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getMachineById = async (id, lang = 'ru') => {
  const result = await machinesRepo.getMachineById(lang, id);
  return formatResponseDates(result);
};

const createMachine = async (data) => {
  return await machinesRepo.createMachine(data);
};

const updateMachine = async (id, data) => {
  return await machinesRepo.updateMachineById(id, data);
};

const deleteMachine = async (id) => {
  return await machinesRepo.deleteMachineById(id);
};

const getOptions = async () => {
  return await machinesRepo.getMachinesIdAnName();
};

const getOne = async (id) => {
  return await machinesRepo.getOne(id);
};


export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getOptions,
};
