import regionRepo from '../repositories/region.repo.js';
import { formatResponseDates } from '../helpers/format-date.helper.js';

const getRegions = async (lang, query) => {
  const regions = await regionRepo.getAll(lang, query);
  return {
    data: formatResponseDates(regions.data),
    pagination: regions.pagination,
  };
};

const getById = async (id, lang = 'ru') => {
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

const getRegionStatic = async (lang) => {
  try {
    return await regionRepo.getRegionStatic(lang);
  } catch (error) {
    throw error;
  }
};

export default {
  getRegions,
  getById,
  createRegion,
  updateRegion,
  deleteRegion,
  getRegionStatic,
};
