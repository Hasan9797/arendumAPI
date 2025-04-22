import serviceCommissionService from '../../services/serviceCommission.service.js';

const getAll = async (req, res) => {
  // const lang = req.headers['accept-language'] || 'ru';

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
    const result = await serviceCommissionService.getAll(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const getById = async (req, res) => {
  try {
    const serviceCommission = await serviceCommissionService.getById(
      parseInt(req.params.id)
    );
    res.status(200).json({
      success: true,
      error: false,
      data: serviceCommission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const create = async (req, res) => {
  try {
    await serviceCommissionService.create(req.body);
    res.status(201).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const update = async (req, res, next) => {
  try {
    await serviceCommissionService.updateById(parseInt(req.params.id), req.body);
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

const distroy = async (req, res) => {
  try {
    await serviceCommissionService.deleteById(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
};
