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

const sendNotificationToDriver = async (token, title, body, clientId) => {
  try {
    const client = await clientRepository.getById(clientId);

    if (!client) throw new Error('Client not found');

    const drivers =
      await driverRepository.getDriversByStructureIdForNotification(
        client.structureId
      );

    for (const driver of drivers) {
      await sendNotification(driver.fcmToken, title, body);
    }
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
  sendNotificationToDriver,
};
