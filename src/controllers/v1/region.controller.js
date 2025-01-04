import regionService from '../../services/regiosn.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await regionService.getRegions(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch region',
    });
  }
};

const getById = async (req, res) => {
  try {
    const region = await regionService.getById(parseInt(req.params.id));
    res.status(200).json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch region',
    });
  }
};

const create = async (req, res) => {
  try {
    const region = await regionService.createRegion(req.body);
    res.status(201).json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch region',
    });
  }
};

const update = async (req, res) => {
  try {
    const region = await regionService.updateRegion(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch region',
    });
  }
};

const distroy = async (req, res) => {
  try {
    const region = await regionService.deleteRegion(parseInt(req.params.id));
    res.status(200).json(region);
  } catch (error) {
    console.error('Error fetching region:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch region',
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
