import orderService from '../../services/order.service.js';
import userRoleEnum from '../../enums/user/user-role.enum.js';
import { userStatus } from '../../enums/user/user-status.enum.js';

const getAll = async (req, res) => {
  let query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.body.filters || [],
    sort: req.body.sort || { column: 'id', value: 'desc' },
    role: {},
  };

  const user = req.user;

  if (user.role == userRoleEnum.CLIENT) {
    query.role = { clientId: user.id };
  } else if (user.role == userRoleEnum.DRIVER) {
    query.role = { driverId: user.id };
  }

  try {
    const result = await orderService.getOrders(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch orders',
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const result = await orderService.getOrders(query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch orders',
    });
  }
};

const getById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(parseInt(req.params.id));
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order',
    });
  }
};

const create = async (req, res) => {
  try {
    if (!req.user.status) {
      throw new Error('User is inactive');
    }

    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order',
    });
  }
};

const update = async (req, res) => {
  try {
    const order = await orderService.updateOrder(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order',
    });
  }
};

const distroy = async (req, res) => {
  try {
    const order = await orderService.deleteOrder(parseInt(req.params.id));
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order',
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
