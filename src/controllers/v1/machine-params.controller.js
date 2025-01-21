import machinParamsService from '../../services/machin-params.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/response.helper.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };
  try {
    const result = await machinParamsService.getCategories(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getById = async (req, res) => {
  try {
    const machineParams = await machinParamsService.getCategoryById(
      parseInt(req.params.id)
    );
    res.status(200).json(responseSuccess(machineParams));
  } catch (error) {
    console.error('Error fetching machine params:', error);
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const create = async (req, res) => {
  try {
    const params = await machinParamsService.createCategory(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    console.error('Error fetching machin params:', error);
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const update = async (req, res) => {
  try {
    await machinParamsService.updateCategory(parseInt(req.params.id), req.body);
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const distroy = async (req, res) => {
  try {
    await machinParamsService.deleteCategory(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getSelectParams = async (req, res) => {
  try {
    const params = await machinParamsService.selectMachineParams(
      parseInt(req.body.machineId)
    );
    res.status(200).json(responseSuccess(params));
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
  getSelectParams,
};
