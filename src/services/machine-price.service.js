import machinePriceRepo from '../repositories/machine-price.repo.js';

const getPrices = async (query) => {
  return await machinePriceRepo.getMachinesPrice(query);
};

const getPriceById = async (id) => {
  return await machinePriceRepo.getMachinePriceById(id);
};

const createPrice = async (data) => {
  return await machinePriceRepo.createMachinePrice(data);
};

const updatePrice = async (id, data) => {
  return await machinePriceRepo.updateMachinePriceById(id, data);
};

const deletePrice = async (id) => {
  return await machinePriceRepo.deleteMachinePriceById(id);
};

export default {
  getPrices,
  getPriceById,
  createPrice,
  updatePrice,
  deletePrice,
};
