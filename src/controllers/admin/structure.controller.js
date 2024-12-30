import structureService from '../../services/structure.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await structureService.getStructures(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching structure:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch structure',
    });
  }
};

const getById = async (req, res) => {
  try {
    const machine = await structureService.getById(parseInt(req.params.id));
    res.status(200).json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch machine',
    });
  }
};

const create = async (req, res) => {
  try {
    const machine = await structureService.createStructure(req.body);
    res.status(201).json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch machine',
    });
  }
};

const update = async (req, res) => {
  try {
    const machine = await structureService.updateById(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch machine',
    });
  }
};

const distroy = async (req, res) => {
  try {
    const machine = await structureService.deleteById(parseInt(req.params.id));
    res.status(200).json(machine);
  } catch (error) {
    console.error('Error fetching machine:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch machine',
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
