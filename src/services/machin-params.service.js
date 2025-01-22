import machineParamsRepo from '../repositories/machine-params.repo.js';
import machinePriceService from './machine-price.service.js';
import paramsFiltersService from './params-filters.service.js';

const getMachineParams = async (query) => {
  return await machineParamsRepo.getAll(query);
};

const getMachineParamById = async (id) => {
  return await machineParamsRepo.getById(id);
};

const getParamsByMachineId = async (lang, machineId) => {
  return await machineParamsRepo.getByMachineId(lang, machineId);
};

const createMachineParam = async (data) => {
  return await machineParamsRepo.create(data);
};

const updateMachineParam = async (id, data) => {
  return await machineParamsRepo.updateById(id, data);
};

const deleteMachineParam = async (id) => {
  return await machineParamsRepo.distroy(id);
};

const selectMachineParams = async (machinId) => {
  try {
    const params = await machineParamsRepo.getSelectList(machinId);

    const result = params.reduce((acc, { nameEn, params }) => {
      const parsedParams = params ? params : [];

      acc[nameEn ?? 'unknown'] = Array.isArray(parsedParams)
        ? parsedParams.map((param) => param.name)
        : [];
      return acc;
    }, {});

    return result;
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

const optionSelect = async (lang, machineId) => {
  try {
    const data = await machineParamsRepo.getParamsOption(machineId);

    if (!data) return [];

    return data.map(({ nameRu, nameUz, nameEn, params }) => ({
      [nameEn]: params.map((p) => p.name),
      title: lang === 'ru' ? nameRu : nameUz,
    }));
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

const optionAmount = async (machineId) => {
  try {
    const data = await machineParamsRepo.getParamsOption(machineId);

    if (!data) return [];

    return data.flatMap(({ nameEn, params }) =>
      params.map((param) => ({
        [nameEn]: param.name,
        amount: param.amount,
      }))
    );
  } catch (error) {
    console.error('Error fetching machine params:', error);
    throw error;
  }
};

const getParamsOptions = async (lang, machineId) => {
  try {
    const machinePrice = await machinePriceService.getPriceByMachineId(machineId);
    
    const params = await optionSelect(lang, machineId);

    const paramsFilters = await paramsFiltersService.getByMachineId(machineId);

    const amount = await optionAmount(machineId);

    return {
      fullAmount: machinePrice.minAmount ?? 0,
      params,
      filters: paramsFilters.filterParams,
      amount,
    };
  } catch (error) {
    throw error;
  }
};

export default {
  getMachineParams,
  getMachineParamById,
  createMachineParam,
  updateMachineParam,
  deleteMachineParam,
  selectMachineParams,
  getParamsByMachineId,
  getParamsOptions,
};
