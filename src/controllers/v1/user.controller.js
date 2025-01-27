import userService from '../../services/user.service.js';

const getUsers = async (req, res) => {
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
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
    });
  }
};

const updateUser = async (req, res) => {
  try {
    await userService.updateUser(parseInt(req.params.id), req.body);
    res.status(200).json({
      success: true,
      error: false,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 500,
      },
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
