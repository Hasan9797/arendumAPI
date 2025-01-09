import machinePriceRepo from '../repositories/machine-price.repo.js';

const getPrices = async (query) => {
  return await machinePriceRepo.getMachinesPrice(query);
};

const getPriceById = async (id) => {
  return await machinePriceRepo.getMachinePriceById(id);
};

const createPrice = async (data) => {
  try {
    const { additionalParameters, ...rest } = data;
    for (const param of additionalParameters) {
      await machinePriceRepo.createMachinePrice({
        parameter: param.parameter,
        parameterName: param.parameterName,
        unit: param.unit,
        type: param.type,
        ...rest,
      });
    }
    return true;
  } catch (error) {
    throw error;
  }
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
