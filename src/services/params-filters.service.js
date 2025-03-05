import machineParamsFilterRepo from '../repositories/params-filter.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';
import machineParamsRepo from '../repositories/machine-params.repo.js';

function updateParamsWithTotalAmount(filterParams, machineParams) {
  // machineParams ma'lumotlarini tezkor qidiruv uchun xarita (Map) shaklida tuzish
  const paramsMap = new Map();

  machineParams.forEach(item => {
    const key = String(item.key);
    paramsMap.set(key, item.params);
  });

  // filterParamsni qayta ishlash, tegishli amountlar yig'indisini qo'shish
  return filterParams.map(param => {
    let totalAmount = 0;

    for (const key in param) {
      const mappedParams = paramsMap.get(String(key)); // Map'dan tezkor qidiruv

      if (mappedParams) {
        mappedParams.forEach(element => {
          if (Number(element.param) === Number(param[key])) {
            totalAmount += Number(element.amount);
          }
        });
      }
    }

    return { ...param, amount: totalAmount };
  });
}



const getParamsFilters = async (query) => {
  try {
    const result = await machineParamsFilterRepo.getAll(query);
    return {
      data: formatResponseDates(result.data),
      pagination: result.pagination,
    };
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    const result = await machineParamsFilterRepo.getById(id);

    if (!result) {
      return {};
    }

    return formatResponseDates(result);
  } catch (error) {
    throw error;
  }
};

const getByMachineId = async (machineId) => {
  try {
    const result = await machineParamsFilterRepo.getParamsFilterByMachineId(machineId);

    return formatResponseDates(result) ?? {};
  } catch (error) {
    throw error;
  }
};

const createParamsFilter = async (data) => {
  try {
    const machineParams = await machineParamsRepo.getByMachineId(parseInt(data.machineId));

    if (!machineParams) throw new Error('Machine params not found');

    const updatedParams = updateParamsWithTotalAmount(data.filterParams, machineParams);
    
    return await machineParamsFilterRepo.create({
      filterParams: updatedParams,
      machineId: data.machineId,
    });
    
  } catch (error) {
    throw error;
  }
};

const updateParamsFilter = async (id, data) => {
  try {
    return await machineParamsFilterRepo.updateById(id, data);
  } catch (error) {
    throw error;
  }
};

const deleteParamsFilter = async (id) => {
  return await machineParamsFilterRepo.distroy(id);
};

export default {
  getParamsFilters,
  getById,
  getByMachineId,
  createParamsFilter,
  updateParamsFilter,
  deleteParamsFilter,
};
