import bankCardsService from '../../services/bankCards.service.js';
import userRoleEnum from '../../enums/user/userRoleEnum.js';

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

const getByUserId = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  try {
    if (userRole !== userRoleEnum.CLIENT && userRole !== userRoleEnum.DRIVER) {
      throw new Error('Invalid user role', 400);
    }
    const result = await bankCardsService.getByClientIdOrDriverId(
      userId,
      userRole
    );
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

    const result = await bankCardsService.cardInit(cardNumber, cardExpiry);
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

const cardConfirm = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const smsCode = req.body.smsCode;
    const user = req.user;

    const result = await bankCardsService.cardConfirm(
      user,
      transactionId,
      smsCode
    );
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

const cancelCard = async (req, res) => {
  try {
    const cardId = req.body.cardId;
    const cardToken = req.body.token;

    const result = await bankCardsService.removeCard(cardId, cardToken);
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

const getCardList = async (req, res) => {
  try {
    const result = await bankCardsService.getCardList(
      parseInt(req.query.page),
      parseInt(req.query.limit)
    );

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

const update = async (req, res) => {
  try {
    const user = await bankCardsService.update(
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
    const bankCard = await bankCardsService.getById(parseInt(req.params.id));

    if (!bankCard) {
      throw new Error('Bank card not found', 404);
    }

    const result = await bankCardsService.distroy(bankCard);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

export default {
  getAll,
  getById,
  getByUserId,
  cardInit,
  cardConfirm,
  cancelCard,
  getCardList,
  update,
  distroy,
};
