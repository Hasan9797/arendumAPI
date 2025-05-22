import clientService from '../../services/client.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/responseHelper.js';
import orderService from '../../services/order.service.js';

const getAll = async (req, res) => {
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
  };

  const lang = req.headers['accept-language'] || 'ru';

  try {
    const result = await clientService.getClients(lang, query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getById = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const client = await clientService.getClientById(
      parseInt(req.params.id),
      lang
    );
    res.status(200).json(responseSuccess(client));
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMe = async (req, res, next) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const client = await clientService.getClientById(
      parseInt(req.user.id),
      lang
    );
    res.status(200).json(responseSuccess(client));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res) => {
  try {
    await clientService.createClient(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(error);
  }
};

const update = async (req, res) => {
  try {
    const user = await clientService.updateClient(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(error);
  }
};

const distroy = async (req, res) => {
  try {
    await clientService.deleteClient(parseInt(req.params.id));
    res.status(200).json(responseSuccess());
  } catch (error) {
    res.status(500).json(error);
  }
};

const getProcessOrder = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const order = await orderService.getProcessOrderByClientId(lang, req.user.id);
    res.status(200).json(responseSuccess(order));
  } catch (error) {
    res.status(500).json(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  distroy,
  getMe,
  getProcessOrder,
};
