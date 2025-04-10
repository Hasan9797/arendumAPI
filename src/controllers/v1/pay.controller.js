import CardInitRequest from '../../services/pay/requests/cardInitRequest.js';
import CardConfirmRequest from '../../services/pay/requests/cardConfirmRequest.js';
import AtmosTokenService from '../../services/pay/atmosToken.service.js';

export const createPay = async (req, res) => {
  try {
    const cardNumber = req.body.cardNumber;
    const cardExpiry = req.body.expiry;

    const request = new CardInitRequest(cardNumber, cardExpiry);
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
    const smsCode = req.body.smsCode;

    const request = new CardConfirmRequest(transactionId, smsCode);
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
    const smsCode = req.body.smsCode;

    const request = new CardConfirmRequest(transactionId, smsCode);
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
