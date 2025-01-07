import driverRepository from '../repositories/driver.repo.js';
import { sendNotification } from '../helpers/send-notification.helper.js';
import clientRepository from '../repositories/client.repo.js';

const getAll = async (query) => {
  return await driverRepository.findAll(query);
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
  return await driverRepository.updateById(id, data);
};

const deleteById = async (id) => {
  return await driverRepository.deleteById(id);
};

const getDriversInClientStructure = async (clientId) => {
  try {
    const client = await clientRepository.getById(clientId);

    if (!client) throw new Error('Client not found');

    return await driverRepository.getDriversByStructureIdForNotification(
      client.structureId
    );
  } catch (error) {
    console.error('Error sending notification:', error);
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
