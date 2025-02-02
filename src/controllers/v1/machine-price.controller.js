import { responseError } from '../../helpers/response.helper.js';
import machinePriceService from '../../services/machine-price.service.js';

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
    const result = await machinePriceService.getPrices(lang, query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to fetch prices',
    });
  }
};

const getById = async (req, res) => {
  const lang = req.headers['accept-language'] || 'ru';
  try {
    const price = await machinePriceService.getPriceById(
      lang,
      parseInt(req.params.id)
    );
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const getByMachineId = async (req, res) => {
  try {
    const price = await machinePriceService.getPriceByMachineId(
      parseInt(req.params.id)
    );
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const create = async (req, res) => {
  try {
    await machinePriceService.createPrice(req.body);
    res.status(201).json({ saccess: true, data: true });
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const update = async (req, res) => {
  try {
    const price = await machinePriceService.updatePrice(
      parseInt(req.params.id),
      req.body
    );
    res.status(200).json(price);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const distroy = async (req, res) => {
  try {
    const price = await machinePriceService.deletePrice(
      parseInt(req.params.id)
    );
    res.status(200).json(price);
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
  getByMachineId,
};
