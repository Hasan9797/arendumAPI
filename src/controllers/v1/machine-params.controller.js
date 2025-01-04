import machinParamsService from '../../services/machin-params.service.js';

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
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch category',
    });
  }
};

const getById = async (req, res) => {
  try {
    const machineParams = await machinParamsService.getCategoryById(
      parseInt(req.params.id)
    );
    res.status(200).json(machineParams);
  } catch (error) {
    console.error('Error fetching machine params:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch machine params',
    });
  }
};

const create = async (req, res) => {
  try {
    const params = await machinParamsService.createCategory(req.body);
    res.status(201).json(params);
  } catch (error) {
    console.error('Error fetching machin params:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch machin params',
    });
  }
};

const update = async (req, res) => {
  try {
    const updateMachineParams = await machinParamsService.updateCategory(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(updateMachineParams);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch update machine params',
    });
  }
};

const distroy = async (req, res) => {
  try {
    const machineParams = await machinParamsService.deleteCategory(
      parseInt(req.params.id)
    );
    res.status(200).json(machineParams);
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch machine params',
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
