import structureRepo from '../repositories/structure.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getStructures = async (lang, query) => {
  const result = await structureRepo.getAll(lang, query);
  return {
    data: formatResponseDates(result.data),
    pagination: result.pagination,
  };
};

const getById = async (lang = 'ru', id) => {
  const structure = await structureRepo.getById(lang, id);
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
