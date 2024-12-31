import machinesService from '../../services/machines.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await machinesService.getMachines(query);
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
    const machine = await machinesService.getMachineById(
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
    const machine = await machinesService.createMachine(req.body);
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
    const machine = await machinesService.updateMachine(
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
    const machine = await machinesService.deleteMachine(
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

const getMachineOptions = async (req, res) => {
  try {
    const options = await machinesService.getOptions();
    res.status(200).json({ success: true, options });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch options',
    });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
  getMachineOptions,
};
