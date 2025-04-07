import bankCardsService from "../../services/bank-cards.service.js";

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

  try {
    const result = await bankCardsService.getAll(query);
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
      },
    });
  }
};

const getById = async (req, res) => {
  try {
    const result = await bankCardsService.getById(parseInt(req.params.id));
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }
};

const cardInit = async (req, res) => {
  try {
    const cardNumber = req.body.cardNumber;
    const cardExpiry = req.body.expiry;

    console.log(cardNumber, cardExpiry);
    
    const result = bankCardsService.cardInit(cardNumber, cardExpiry);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }
};

const cardConfirm = async (req, res) => { };

const update = async (req, res) => { };

const distroy = async (req, res) => { };

export default {
  getAll,
  getById,
  cardInit,
  cardConfirm,
  update,
  distroy,
};
