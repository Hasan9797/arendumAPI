import machineParamsRepo from '../repositories/machine-params.repo.js';
import machinePriceService from './machine-price.service.js';
import paramsFiltersService from './params-filters.service.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getMachineParams = async (lang, query) => {
  try {
    const result = await machineParamsRepo.getAll(lang, query);
    return {
      data: formatResponseDates(result.data),
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getMachineParamById = async (lang, id) => {
  try {
    const result = await machineParamsRepo.getById(lang, id);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const getParamsByMachineId = async (lang, machineId) => {
  try {
    const result = await machineParamsRepo.getByMachineId(lang, machineId);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const createMachineParam = async (data) => {
  try {
    return await machineParamsRepo.create(data);
  } catch (error) {
    throw error;
  }
};

const updateMachineParam = async (id, data) => {
  return await machineParamsRepo.updateById(id, data);
};

const deleteMachineParam = async (id) => {
  return await machineParamsRepo.distroy(id);
};

const optionSelectParams = async (lang, machinId) => {
  try {
    const params = await machineParamsRepo.getParamsOption(machinId);

    const result = params.reduce((acc, { nameRu, nameUz, nameEn, params }) => {
      const parsedParams = params ? params : [];

      acc.push({
        title: lang === 'ru' ? nameRu : nameUz,
        params: parsedParams.map((p) => p.name),
        key: nameEn,
      });

      return acc;
    }, []);

    return result;
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
    const machinePrice =
      await machinePriceService.getPriceByMachineId(machineId);

    const selectParamsOptions = await optionSelectParams(lang, machineId);

    const paramsFilters = await paramsFiltersService.getByMachineId(machineId);

    const amount = await optionAmount(machineId);

    return {
      fullAmount: machinePrice?.minAmount ?? 0,
      paramsOptions: selectParamsOptions,
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
  getParamsByMachineId,
  getParamsOptions,
  optionSelectParams,
};
