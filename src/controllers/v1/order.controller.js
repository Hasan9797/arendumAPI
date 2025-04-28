import orderService from '../../services/order.service.js';
import userRoleEnum from '../../enums/user/userRoleEnum.js';
import { userStatus } from '../../enums/user/userStatusEnum.js';
import clientService from '../../services/client.service.js';
import driverService from '../../services/driver.service.js';

import {
  responseSuccess,
  responseError,
} from '../../helpers/responseHelper.js';

const getAll = async (req, res) => {
  let query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
  };

  const user = req.user;

  if (user.role == userRoleEnum.CLIENT) {
    query.filters.push({
      column: 'clientId',
      operator: 'equals',
      value: user.id,
    });
  } else if (user.role == userRoleEnum.DRIVER) {
    query.filters.push({
      column: 'driverId',
      operator: 'equals',
      value: user.id,
    });
  }

  try {
    const result = await orderService.getOrders(query);
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
        stack: error.stack,
      },
    });
  }
};

const getById = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const order = await orderService.getOrderById(
      parseInt(req.params.id),
      lang
    );
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        file: error.file,
        line: error.line,
        code: 500,
      },
    });
  }
};

const create = async (req, res) => {
  const timestampSeconds = req.body?.startAt
    ? Math.floor(new Date(req.body?.startAt).getTime() / 1000)
    : null;

  try {
    if (req.user.role != userRoleEnum.CLIENT) {
      throw new Error('User is not Client');
    }

    const client = await clientService.getById(req.user.id);

    if (client === null || client.status !== userStatus.ACTIVE) {
      throw new Error('User is inactive or User is not Client');
    }

    if (!client.regionId || client.regionId === 0) {
      throw new Error('User has no region');
    }

    const data = {
      ...req.body,
      clientId: client?.id,
      regionId: client?.regionId,
      structureId: client?.structureId,
      startAt: timestampSeconds,
    };

    const order = await orderService.createOrder(data);
    res.status(201).json({
      success: true,
      data: order,
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

const update = async (req, res) => {
  try {
    await orderService.updateOrder(parseInt(req.params.id), req.body);
    res.status(200).json({
      success: true,
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

const distroy = async (req, res) => {
  try {
    await orderService.deleteOrder(parseInt(req.params.id));
    res.status(200).json({
      success: true,
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

const orderStartWork = async (req, res) => {
  const orderId = Number(req.query.id);
  try {
    await orderService.startOrder(orderId);
    res.status(200).json({
      success: true,
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

const orderEndWork = async (req, res) => {
  const orderId = Number(req.query.id);
  try {
    const result = await orderService.endOrder(orderId);
    res.status(200).json(result);
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

// Driver lar uchun yangi (status driver SEARCHING) qo'shilgan orderlarni chiqarish,
// driver params ga moslarini
const getNewOrderByDriverParams = async (req, res) => {
  try {
    const driver = await driverService.getById(req.user.id);
    if (!driver) throw new Error('Driver not found');

    if (driver.status !== userStatus.ACTIVE) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const orders = await orderService.getNewOrderByDriverParams(
      driver?.params,
      driver?.region,
      driver?.structureId
    );
    res.status(200).json({
      success: true,
      data: orders,
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

const orderCancel = async (req, res) => {
  const orderId = Number(req.query.id);
  try {
    const result = await orderService.cancelOrder(orderId);
    res.status(200).json(responseSuccess());
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

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
  orderStartWork,
  orderEndWork,
  getNewOrderByDriverParams,
  orderCancel,
};
