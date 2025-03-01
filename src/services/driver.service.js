import driverRepository from '../repositories/driver.repo.js';
import { sendNotification } from '../helpers/send-notification.helper.js';
import clientRepository from '../repositories/client.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

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

  if (!driver) throw new Error('Driver not found');

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

const getDriversInClientStructure = async (structureId, orderParams, orderType, amountType) => {
  try {
    // const structureId = await clientRepository.getClientStructureId(clientId);

    if (!structureId) throw new Error('Structure id is required');

    return await driverRepository.getDriversByStructureIdForNotification(
      structureId,
      orderParams,
      orderType,
      amountType,
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
