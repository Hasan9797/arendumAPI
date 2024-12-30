import regionRepo from '../repositories/region.repo.js';

const getRegions = async (query) => {
  return await regionRepo.getAll(query);
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
