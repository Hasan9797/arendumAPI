import driverService from '../../services/driver.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/responseHelper.js';
import orderService from '../../services/order.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
  };

  const lang = req.headers['accept-language'] || 'ru';

  try {
    const result = await driverService.getAll(lang, query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getById = async (req, res) => {
  try {
    const driver = await driverService.getById(parseInt(req.params.id));
    res.status(201).json(responseSuccess(driver));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getMe = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const driver = await driverService.getProfile(lang, parseInt(req.user.id));
    res.status(201).json(responseSuccess(driver));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  const timestampSeconds = req.body?.startAt
    ? Math.floor(new Date(req.body?.startAt).getTime() / 1000)
    : null;

  const newData = {
    ...req.body,
    startAt: timestampSeconds,
  };

  try {
    await driverService.create(newData);
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const update = async (req, res) => {
  try {
    const user = await driverService.updateById(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const distroy = async (req, res) => {
  try {
    await driverService.deleteById(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getProcessOrder = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const order = await orderService.getOrderByDriverId(
      parseInt(req.user.id),
      lang
    );
    res.status(200).json(responseSuccess(order));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const acceptOrder = async (req, res) => {
  try {
    const driver = await driverService.getById(req.user.id);

    const result = await driverService.acceptOrder(
      Number(req.query.id),
      driver
    );

    if (result == null) {
      return res.status(200).json({ message: 'Order not found', data: null });
    }

    if (result == false) {
      return res
        .status(400)
        .json({ message: 'Order already accepted', data: null });
    }

    res.status(200).json(responseSuccess(result));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const driverCame = async (req, res) => {
  try {
    const result = await driverService.driverArrived(Number(req.query.id));
    res.status(200).json(responseSuccess(result));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const setOnline = async (req, res) => {
  try {
    await driverService.updateById(req.user.id, {
      isOnline: req.body.isOnline,
    });

    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
  getMe,
  acceptOrder,
  setOnline,
  driverCame,
  getProcessOrder,
};
