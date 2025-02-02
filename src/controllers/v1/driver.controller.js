import driverService from '../../services/driver.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/response.helper.js';

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

  const lang = req.headers['accept-language'] || 'ru';

  try {
    const result = await driverService.getAll(lang, query);
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
    const driver = await driverService.getById(parseInt(req.params.id));
    res.status(201).json(responseSuccess(driver));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};


const getMe = async (req, res) => {
  try {
    const driver = await driverService.getById(parseInt(req.user.id));
    res.status(201).json(responseSuccess(driver));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  try {
    await driverService.create(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const update = async (req, res) => {
  try {
    const user = await driverService.updateById(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const distroy = async (req, res) => {
  try {
    await driverService.deleteById(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
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
  getMe
};
