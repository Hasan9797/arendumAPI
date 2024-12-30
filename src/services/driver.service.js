import driverRepository from '../repositories/driver.repo.js';

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

export default {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
