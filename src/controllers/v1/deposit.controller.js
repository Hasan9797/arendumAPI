import PayCreateRequest from '../../services/pay/requests/payCreateRequest.js';
import PayPreConfirmRequest from '../../services/pay/requests/payPreConfirmRequest.js';
import PayConfirmRequest from '../../services/pay/requests/payConfirmRequest.js';

export const createDeposit = async (req, res) => {
  try {
    const amount = req.body.amount;
    const account = req.body.account;

    const request = new PayCreateRequest(amount, account);
    const response = await request.send();

    res.status(200).json(response.getResponse());
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const preConfirmDeposit = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const cardToken = req.body.cardToken;

    const request = new PayPreConfirmRequest(transactionId, cardToken);
    const response = await request.send();

    res.status(200).json(response.getResponse());
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

export const confirmDeposit = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    // const otp = req.body.otp;
    // const storeId = req.body.storeId;

    const request = new PayConfirmRequest(transactionId);
    const response = await request.send();

    res.status(200).json(response.getResponse());
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};
