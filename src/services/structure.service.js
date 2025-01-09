import structureRepo from '../repositories/structure.repo.js';

const getStructures = async (lang, query) => {
  return await structureRepo.getAll(lang, query);
};

const getById = async (id) => {
  return await structureRepo.getById(id);
};

const createStructure = async (data) => {
  return await structureRepo.create(data);
};

const updateById = async (id, data) => {
  return await structureRepo.updateById(id, data);
};

const deleteById = async (id) => {
  return await structureRepo.deleteById(id);
};

export default {
  getStructures,
  getById,
  createStructure,
  updateById,
  deleteById,
};
