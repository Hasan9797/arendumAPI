import payGateService from './pay/payGate.service.js';
import userBalanceService from './userBalance.service.js';

const depositReplinshment = async (requestDTO) => {
  try {
    return await payGateService.payCreate(requestDTO);
  } catch (error) {
    throw error;
  }
};

export default {
  depositReplinshment,
};
