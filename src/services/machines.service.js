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
  const machine = await machinesRepo.getMachineById(id);

  const adjustName = (obj) => {
    return {
      ...obj,
      name: lang === 'ru' ? obj.nameRu : obj.nameUz,
    };
  };

  return formatResponseDates(adjustName(machine));
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

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
  getOptions,
};
