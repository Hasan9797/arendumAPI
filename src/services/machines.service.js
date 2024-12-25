import categoryRepo from '../repositories/machines.repo.js';

const getMachines = async (query) => {
  return await categoryRepo.getMachines(query);
};

const getMachineById = async (id) => {
  return await categoryRepo.getMachineById(id);
};

const createMachine = async (data) => {
  return await categoryRepo.createMachine(data);
};

const updateMachine = async (id, data) => {
  return await categoryRepo.updateMachineById(id, data);
};

const deleteMachine = async (id) => {
  return await categoryRepo.deleteMachineById(id);
};

export default {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
