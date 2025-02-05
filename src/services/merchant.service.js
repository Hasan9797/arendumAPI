import machinesRepo from '../repositories/machines.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getMachines = async (lang, query) => {
  const result = await machinesRepo.getMachines(lang, query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getMachineById = async (id) => {
  const result = await machinesRepo.getMachineById(id);
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

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
