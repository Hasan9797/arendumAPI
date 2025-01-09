import regionRepo from '../repositories/region.repo.js';

const getRegions = async (lang, query) => {
  return await regionRepo.getAll(lang, query);
};

const getById = async (id) => {
  return await regionRepo.getById(id);
};

const createRegion = async (data) => {
  return await regionRepo.createRegion(data);
};

const updateRegion = async (id, data) => {
  return await regionRepo.updateById(id, data);
};

const deleteRegion = async (id) => {
  return await regionRepo.deleteById(id);
};

export default {
  getRegions,
  getById,
  createRegion,
  updateRegion,
  deleteRegion,
};
