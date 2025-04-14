import depositReplinshmentService from '../../services/deposit/depositReplinshment.service.js';
import transactionService from '../../services/transaction.service.js';
import transactionTypeEnum from '../../enums/transaction/transactionTypeEnum.js';

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
const createDepositReplinshment = async (req, res) => {
  try {
    const amount = req.body.amount;
    const account = req.body.account;

    const result = await depositReplinshmentService.createDeposit(
      amount,
      account
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const preConfirmDepositReplinshment = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const cardToken = req.body.cardToken;

    const result = new PayPreConfirmRequest(transactionId, cardToken);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const confirmDepositReplinshment = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const amount = req.body.amount;
    const userId = req.user.id;

    const result = await depositReplinshmentService.confirmDeposit(
      userId,
      amount,
      transactionId
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

// ---------------- DEPOSIT WITHDRAW ----------------

export default {
  getAll,
  getById,
  update,
  createDepositReplinshment,
  preConfirmDepositReplinshment,
  confirmDepositReplinshment,
};
