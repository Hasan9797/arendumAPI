import {
  responseError,
  responseSuccess,
} from '../../helpers/response.helper.js';
import paramsSettingsService from '../../services/params-filters.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
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
    res.status(200).json(responseSuccess(machineParams));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getByMachineId = async (req, res) => {
  try {
    const machineParams = await paramsSettingsService.getByMachineId(
      parseInt(req.params.id)
    );
    res.status(200).json(machineParams);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  try {
    const params = req.body.params;
    const machineId = req.body.machineId;
    
    if(!Array.isArray(params) || !machineId) throw new Error('params is not array or machineId not found');

    await paramsSettingsService.createParamsFilter({
      filterParams: params,
      machineId: machineId,
    });
    
    res.status(201).json(responseSuccess());
  } catch (error) {
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
    await paramsSettingsService.deleteParamsFilter(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

export default {
  getAll,
  getById,
  getByMachineId,
  create,
  update,
  distroy,
};
