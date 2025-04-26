import machineParamsRepo from '../repositories/machineParams.repo.js';
import machinePriceService from './machinePrice.service.js';
import paramsFiltersService from './paramsFilters.service.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';

function convertToUnderscoreFormat(str) {
  let trimmedStr = str.trim();
  return trimmedStr.includes(' ')
    ? trimmedStr.replace(/\s+/g, '_')
    : trimmedStr;
}

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

const getParamsByMachineId = async (machineId, lang) => {
  try {
    const result = await machineParamsRepo.getByMachineId(machineId, lang);
    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const createMachineParam = async (data) => {
  const { nameEn, ...rest } = data;
  try {
    const convertData = {
      ...rest,
      nameEn,
      key: convertToUnderscoreFormat(nameEn),
    };
    return await machineParamsRepo.create(convertData);
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

    const result = params.reduce((acc, { nameRu, nameUz, key, params }) => {
      const parsedParams = params ? params : [];

      acc.push({
        title: lang === 'ru' ? nameRu : nameUz,
        nameUz,
        nameRu,
        params: parsedParams.map((p) => p.param),
        key,
      });

      return acc;
    }, []);

    return result;
  } catch (error) {
    throw error;
  }
};

// const optionAmount = async (machineId) => {
//   try {
//     const data = await machineParamsRepo.getParamsOption(machineId);

//     if (!data) return [];

//     return data.flatMap(({ key, params }) =>
//       params.map((item) => ({
//         [key]: item.param,
//         amount: item.amount,
//       }))
//     );
//   } catch (error) {
//     throw error;
//   }
// };

const getParamsOptions = async (lang, machineId) => {
  try {
    const machinePrice =
      await machinePriceService.getPriceByMachineId(machineId);

    const selectParamsOptions = await optionSelectParams(lang, machineId);

    const paramsFilters =
      await paramsFiltersService.getParamsAmountsFiltersByMachineId(machineId);

    // const amount = await optionAmount(machineId);

    return {
      fullAmount: machinePrice?.minAmount ?? 0,
      paramsOptions: selectParamsOptions,
      filters: paramsFilters,
      // amount,
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
