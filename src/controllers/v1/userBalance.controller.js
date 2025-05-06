import userBalanceService from '../../services/userBalance.service.js';

const getAll = async (req, res) => {
  //   const lang = req.headers['accept-language'] || 'ru';

  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
  };

  try {
    const result = await userBalanceService.getAll(query);
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
  //   const lang = req.headers['accept-language'] || 'ru';
  try {
    const structure = await userBalanceService.getById(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
      data: structure,
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

const getByIdDriverId = async (req, res) => {
  try {
    const balance = await userBalanceService.getByIdDriverId(req.user.id);
    res.status(200).json({
      success: true,
      data: balance,
    });
  } catch (error) {
    throw error;
  }
};

const update = async (req, res) => {
  try {
    await userBalanceService.updateById(parseInt(req.params.id), req.body);
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
  getByIdUserId,
  update,
};
