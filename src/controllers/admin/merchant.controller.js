import merchantService from '../../services/merchant.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await merchantService.getMachines(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch machines',
    });
  }
};

const getById = async (req, res) => {
  try {
    const machine = await merchantService.getMachineById(
      parseInt(req.params.id)
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

const create = async (req, res) => {
  try {
    const machine = await merchantService.createMachine(req.body);
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
    const machine = await merchantService.updateMachine(
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
    const machine = await merchantService.deleteMachine(
      parseInt(req.params.id)
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

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
};
