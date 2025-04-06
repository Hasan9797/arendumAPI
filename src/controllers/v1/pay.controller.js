import BindCardRequest from '../../services/pay/requests/bind-card.request.js';

const accessToken = '';

const addCardClient = async (req, res) => {
  try {
    const cardNumber = req.body.cardNumber;
    const cardExpiry = req.body.expiry;

    const request = new BindCardRequest(cardNumber, cardExpiry);
    const response = await request.send();

    res.status(200).json(response.getResponse());
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const payAtmosAPI = async (req, res) => {};

export default {
  test,
  payAtmosAPI,
};
