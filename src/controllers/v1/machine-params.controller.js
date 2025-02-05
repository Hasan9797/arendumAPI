import machinParamsService from '../../services/machin-params.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/response.helper.js';

const getAll = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';

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
    const result = await machinParamsService.getMachineParams(lang, query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getById = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const machineParams = await machinParamsService.getMachineParamById(
      lang,
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
    const params = await machinParamsService.createMachineParam(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const update = async (req, res) => {
  try {
    await machinParamsService.updateMachineParam(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const distroy = async (req, res) => {
  try {
    await machinParamsService.deleteMachineParam(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getSelectParamsOptions = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const params = await machinParamsService.optionSelectParams(
      lang,
      parseInt(req.query.id)
    );
    res.status(200).json(responseSuccess(params));
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getMachineParamsByMachineId = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const params = await machinParamsService.getParamsByMachineId(
      lang,
      parseInt(req.body.machineId)
    );
    res.status(200).json(responseSuccess(params));
  } catch (error) {
    res.status(500).json(responseError(error.message, error?.code));
  }
};

const getMachineParamsOptions = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const params = await machinParamsService.getParamsOptions(
      lang,
      parseInt(req.query.id)
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
  getSelectParamsOptions,
  getMachineParamsByMachineId,
  getMachineParamsOptions,
};
