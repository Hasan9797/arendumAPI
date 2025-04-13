import CardInitRequest from '../../services/pay/requests/cardInitRequest.js';
import CardConfirmRequest from '../../services/pay/requests/cardConfirmRequest.js';
import AtmosTokenService from '../../services/pay/atmosToken.service.js';
import PayCreateRequest from '../../services/pay/requests/payCreateRequest.js';
import PayPreConfirmRequest from '../../services/pay/requests/payPreConfirmRequest.js';
import PayConfirmRequest from '../../services/pay/requests/payConfirmRequest.js';

export const createPay = async (req, res) => {
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

export const preConfirmPay = async (req, res) => {
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

export const confirmPay = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;

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

export const getToken = async (req, res) => {
  try {
    const instance = new AtmosTokenService();
    res.status(200).json(await instance.getPayToken());
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};
