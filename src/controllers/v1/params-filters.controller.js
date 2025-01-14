import { responseError, responseSuccess } from '../../helpers/response.helper.js';
import paramsSettingsService from '../../services/params-filters.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await paramsSettingsService.getParamsFilters(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getById = async (req, res) => {
  try {
    const machineParams = await paramsSettingsService.getById(
      parseInt(req.params.id)
    );
    res.status(200).json(machineParams);
  } catch (error) {
    console.error('Error fetching machine params:', error);
   res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  try {
    const params = await paramsSettingsService.createParamsFilter({
      filterParams: req.body.params,
      machineId: req.body.machineId,
    });
    res.status(201).json(responseSuccess());
  } catch (error) {
    console.error('Error fetching machin params:', error);
    res.status(500).json(responseError(error.message, 500));
  }
};

const update = async (req, res) => {
  try {
    const updateMachineParams = await paramsSettingsService.updateParamsFilter(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(updateMachineParams);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const distroy = async (req, res) => {
  try {
    const machineParams = await paramsSettingsService.deleteParamsFilter(
      parseInt(req.params.id)
    );
    res.status(200).json(machineParams);
  } catch (error) {
   res.status(500).json(responseError(error.message, 500));
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
};
