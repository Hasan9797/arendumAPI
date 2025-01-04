import userService from '../../services/user.service.js';

const getUsers = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
  };

  try {
    const result = await userService.getUsers(query);
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

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch users',
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(
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

const deleteUser = async (req, res) => {};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
