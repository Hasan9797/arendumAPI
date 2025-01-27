import regionService from '../../services/regiosn.service.js';

const getAll = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';

  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: (req.query.filters && JSON.parse(req.query.filters)) || [],
    sort: (req.query.sort && JSON.parse(req.query.sort)) || {
      column: 'id',
      value: 'desc',
    },
  };

  try {
    const result = await regionService.getRegions(lang, query);
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
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const region = await regionService.getById(lang, parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
      data: region,
    });
  } catch (error) {
    console.error('Error fetching region:', error);
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
    const region = await regionService.createRegion(req.body);
    res.status(201).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const update = async (req, res) => {
  try {
    const region = await regionService.updateRegion(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const distroy = async (req, res) => {
  try {
    await regionService.deleteRegion(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching region:', error);
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
