import driverService from '../../services/driver.service.js';
import { driverStatusOptions } from '../../enums/driver/driver-status.enum.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await driverService.getAll(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const getById = async (req, res) => {
  try {
    const driver = await driverService.getById(parseInt(req.params.id));
    res.status(200).json(driver);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const create = async (req, res) => {
  try {
    const user = await driverService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const update = async (req, res) => {
  try {
    const user = await driverService.updateById(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const distroy = async (req, res) => {};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
};