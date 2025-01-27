import driverRepository from '../repositories/driver.repo.js';
import { sendNotification } from '../helpers/send-notification.helper.js';
import clientRepository from '../repositories/client.repo.js';

const getAll = async (lang, query) => {
  try {
    return await driverRepository.findAll(lang, query);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getById = async (id) => {
  return await driverRepository.getById(id);
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
  return await driverRepository.deleteById(id);
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
