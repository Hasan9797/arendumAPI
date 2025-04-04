import axios from 'axios';
import AtmosTokenService from '../../services/pay/atmos-token.service.js';

const test = async (req, res) => {
  try {
    const token = await AtmosTokenService.getDepositToken();
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error: error.code,
    });
  }
};

const payAtmosAPI = async (req, res) => { };

export default {
  test,
  payAtmosAPI
};