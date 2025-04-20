import depositService from '../../services/deposit.service.js';
import transactionService from '../../services/transaction.service.js';
import userRoleEnum from '../../enums/user/userRoleEnum.js';
import transactionTypeEnum from '../../enums/transaction/transactionTypeEnum.js';
import { payRequestDTO } from '../../DTO/payRequestDTO.js';

const getAll = async (req, res) => {
  //   const lang = req.headers['accept-language'] || 'ru';
  const query = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    filters: req.query.filters || [],
    sort: req.query.sort || {
      column: 'id',
      value: 'desc',
    },
  };

  query.filters.push({
    column: 'type',
    operator: 'equals',
    value: transactionTypeEnum.DEPOSIT_REPLINSHMENT,
  });

  try {
    const result = await transactionService.getAll(query);
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
  //   const lang = req.headers['accept-language'] || 'ru';
  try {
    const structure = await transactionService.getById(parseInt(req.params.id));
    res.status(200).json({
      success: true,
      error: false,
      data: structure,
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
    await transactionService.updateById(parseInt(req.params.id), req.body);
    res.status(200).json({
      success: true,
      error: false,
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

// ---------------- DEPOSIT REPLINSHMENT ----------------
const depositReplenishment = async (req, res, next) => {
  try {
    const { amount, cardToken, cardId } = req.body;

    const clientId = req.user.role == userRoleEnum.CLIENT ? req.user.id : null;
    const driverId = req.user.role == userRoleEnum.DRIVER ? req.user.id : null;

    const requestDTO = payRequestDTO(
      amount,
      cardToken,
      cardId,
      clientId,
      driverId,
      transactionTypeEnum.DEPOSIT_REPLINSHMENT,
      req.user?.role
    );

    const result = await depositService.depositReplenishment(requestDTO);

    res.status(200).json(result);
  } catch (error) {
    // res.status(500).json({
    //   message: error.message,
    //   error: error,
    // });
    next(error);
  }
};

// ---------------- DEPOSIT WITHDRAW ----------------

export default {
  getAll,
  getById,
  update,
  depositReplenishment,
};
