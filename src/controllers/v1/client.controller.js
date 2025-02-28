import clientService from '../../services/client.service.js';
import {
  responseSuccess,
  responseError,
} from '../../helpers/response.helper.js';
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
    console.error('Error fetching users:', error);
    res.status(500).json(responseError(error.message, 500));
  }
};

const getById = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const client = await clientService.getClientById(
      lang,
      parseInt(req.params.id)
    );
    res.status(200).json(responseSuccess(client));
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json(responseError(error.message, 500));
  }
};

const getMe = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const client = await clientService.getClientById(
      lang,
      parseInt(req.user.id)
    );
    res.status(200).json(responseSuccess(client));
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  try {
    await clientService.createClient(req.body);
    res.status(201).json(responseSuccess());
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json(responseError(error.message, 500));
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
    console.error('Error fetching users:', error);
    res.status(500).json(responseError(error.message, 500));
  }
};

const distroy = async (req, res) => { };

const getProcessOrder = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const order = await orderService.getOrderByClientId(lang, req.user.id);
    res.status(200).json(responseSuccess(order));
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
  getProcessOrder,
};
