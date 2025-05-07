import driverService from '../../services/driver.service.js';
import { responseSuccess, responseError } from '../../helpers/responseHelper.js';
import orderService from '../../services/order.service.js';
import { DriverStatus } from '../../enums/driver/driverStatusEnum.js';
import { CustomError } from '../../Errors/customError.js';
import serviceCommissionService from '../../services/serviceCommission.service.js';
import userBalanceService from '../../services/userBalance.service.js';

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

const getMe = async (req, res, next) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const driver = await driverService.getProfile(lang, parseInt(req.user.id));
    res.status(201).json(responseSuccess(driver));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res) => {
  try {
    await driverService.create(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const update = async (req, res) => {
  try {
    const user = await driverService.updateById(parseInt(req.params.id), req.body);
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
    const order = await orderService.getOrderByDriverId(parseInt(req.user.id), lang);
    res.status(200).json(responseSuccess(order));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const acceptOrder = async (req, res, next) => {
  const orderId = parseInt(req.query.id) ?? 0;
  const driverId = parseInt(req.user.id) ?? 0;

  try {
    const driver = await driverService.getById(driverId);

    if (!driver) {
      throw CustomError.authFailedError('Вы не зарегистрированы или указан неверный ID водителя!');
    }

    const serviceCommission = await serviceCommissionService.getLastActive();

    if (serviceCommission) {
      if (!driver.balance || Number(driver.balance) < serviceCommission?.driverBalance) {
        throw CustomError.validationError(
          `Недостаточно средств на вашем счёте, пожалуйста, пополните счёт на ${serviceCommission.driverBalance} сум!`
        );
      }
    }

    const result = await driverService.acceptOrder(orderId, driver);

    if (result == null) {
      return res.status(200).json({ message: 'Заказ не найден', data: null });
    }

    await userBalanceService.withdrawDriverBalance(driverId, Number(driver.balance), serviceCommission);

    res.status(200).json(
      responseSuccess({
        message: 'Заказ принят',
        saccess: true,
        data: result,
      })
    );
  } catch (error) {
    next(error);
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
