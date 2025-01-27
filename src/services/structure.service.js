import structureRepo from '../repositories/structure.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getStructures = async (lang, query) => {
  const result = await structureRepo.getAll(lang, query);
  return formatResponseDates(result);
};

const getById = async (id) => {
  const structure = await structureRepo.getById(id);
  return formatResponseDates(structure);
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
