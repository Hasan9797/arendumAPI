import driverRepository from '../repositories/driver.repo.js';
import { sendNotification } from '../helpers/send-notification.helper.js';
import clientRepository from '../repositories/client.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getAll = async (lang, query) => {
  try {
    const drivers = await driverRepository.findAll(lang, query);
    return formatResponseDates(drivers);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getById = async (id) => {
  const driver = await driverRepository.getById(id);
  return formatResponseDates(driver);
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

const getDriversInClientStructure = async (clientId, orderParams) => {
  try {
    const structureId = await clientRepository.getClientStructureId(clientId);

    if (!structureId) throw new Error('Client not found');

    return await driverRepository.getDriversByStructureIdForNotification(
      structureId,
      orderParams
    );
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getDriversInClientStructure,
};
