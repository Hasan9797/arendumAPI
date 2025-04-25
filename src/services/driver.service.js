import driverRepository from '../repositories/driver.repo.js';
import { formatResponseDates } from '../helpers/formatDateHelper.js';
import { PAYMENT_TYPE } from '../enums/pay/paymentTypeEnum.js';

const getAll = async (lang, query) => {
  try {
    const result = await driverRepository.findAll(lang, query);
    return {
      data: formatResponseDates(result.data),
      pagination: result.pagination,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const driver = await driverRepository.getById(id);
    return formatResponseDates(driver);
  } catch (error) {
    throw error;
  }
};

const getProfile = async (lang, id) => {
  const driver = await driverRepository.getDriverProfile(id);

  if (!driver) return {};

  const formattedDriver = formatResponseDates(driver);

  const adjustName = (obj) => {
    if (!obj) return null;
    const { nameRu, nameUz, ...relationRest } = obj;
    return {
      ...relationRest,
      name: lang === 'ru' ? nameRu : nameUz,
    };
  };

  const serializedDriver = ({ regionId, structureId, machineId, ...rest }) => {
    return {
      ...rest,
      region: adjustName(rest.region),
      structure: adjustName(rest.structure),
      machine: adjustName(rest.machine),
      balance: rest.balance?.balance ?? '0',
    };
  };

  return serializedDriver(formattedDriver);
};

const create = async (data) => {
  try {
    return await driverRepository.create(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const updateById = async (id, data) => {
  try {
    return await driverRepository.updateById(id, data);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    return await driverRepository.deleteById(id);
  } catch (error) {
    throw error;
  }
};

const getDriversForNewOrder = async (
  machineId,
  region,
  structureId,
  orderParams,
  paymentType
) => {
  try {
    if (!region) throw new Error('Region is required');
    const legal = paymentType === PAYMENT_TYPE.ACCOUNT ? true : false;

    const drivers = await driverRepository.getDriversForNotification(
      machineId,
      region,
      structureId,
      legal
    );

    return filterDriversByOrderParams(drivers, orderParams);
  } catch (error) {
    throw error;
  }
};

function filterDriversByOrderParams(drivers, orderParams) {
  if (!orderParams || orderParams.length === 0) return [];

  return drivers.filter((driver) => {
    if (!driver.params || !Array.isArray(driver.params)) return false;

    // orderParams dagi har bir itemni tekshiradi
    return orderParams.every(({ key, param }) => {
      const match = driver.params.find((p) => p.key === key);

      // driver da shu key bo'lishi va uning params arrayida param bo'lishi kerak
      return match && Array.isArray(match.params) && match.params.includes(param);
    });
  });
}


export default {
  getAll,
  getById,
  getProfile,
  create,
  updateById,
  deleteById,
  getDriversForNewOrder,
};
