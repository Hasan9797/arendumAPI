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
  const driver = await driverRepository.getById(id);
  return formatResponseDates(driver);
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

const getDriversInClientStructure = async (
  structureId,
  machineId,
  orderParams,
  paymentType
) => {
  try {
    if (!structureId) throw new Error('Structure id is required');
    const legal = paymentType === PAYMENT_TYPE.ACCOUNT ? true : false;

    return await driverRepository.getDriversByStructureIdForNotification(
      structureId,
      machineId,
      legal
    );
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  getProfile,
  create,
  updateById,
  deleteById,
  getDriversInClientStructure,
};
