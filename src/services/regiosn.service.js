import regionRepo from '../repositories/region.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getRegions = async (lang, query) => {
  const regions = await regionRepo.getAll(lang, query);
  return formatResponseDates(regions);
};

const getById = async (lang, id) => {
  const region = await regionRepo.getById(lang, id);
  return formatResponseDates(region);
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
