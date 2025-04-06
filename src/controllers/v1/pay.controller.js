import CardInitRequest from '../../services/pay/requests/card-init.request.js';
import CardConfirmRequest from '../../services/pay/requests/card-confirm.request.js';

const accessToken = '';

const cardInit = async (req, res) => {
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

const cardConfirm = async (req, res) => {
  try {
    const transactionId = req.body.transactionId;
    const smsCode = req.body.smsCode;

    const request = new CardConfirmRequest(transactionId, smsCode);
    const response = await request.send();

    res.status(200).json(response.getResponse());
  } catch (error) {}
};

const payAtmosAPI = async (req, res) => {};

export default {
  cardInit,
  cardConfirm,
};
