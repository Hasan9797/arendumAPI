import machinesRepo from '../repositories/machines.repo.js';

const getMachines = async (query) => {
  return await machinesRepo.getMachines(query);
};

const getMachineById = async (id) => {
  return await machinesRepo.getMachineById(id);
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
