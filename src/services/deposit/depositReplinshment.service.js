import payGateService from '../pay/payGate.service.js';
import transactionService from '../transaction.service.js';
import userBalanceService from '../userBalance.service.js';
import transactionTypeEnum from '../../enums/transaction/transactionTypeEnum.js';
import transactionStatusEnum from '../../enums/transaction/transactionStatusEnum.js';

const createDeposit = async (user, amount, account) => {
  try {
    const transaction = await transactionService.createTransaction({
      userId: user.id,
      userName: user.fullName,
      userPhone: user.phone,
      userRole: user.role,
      regionId: user.regionId,
      structureId: user.structureId,
      amount,
      type: transactionTypeEnum.DEPOSIT_REPLINSHMENT,
    });

    const result = await payGateService.payCreate(amount, account);
    return result;
  } catch (error) {
    throw error;
  }
};

const preConfirmDeposit = async (transactionId, cardToken) => {
  try {
    const result = await payGateService.payPreConfirm(transactionId, cardToken);
    return result;
  } catch (error) {
    throw error;
  }
};

const confirmDeposit = async (userId, amount, transactionId) => {
  try {
    const result = await payGateService.payConfirm(transactionId);
    await userBalanceService.updateById(userId, { amount });
    return result;
  } catch (error) {
    throw error;
  }
};

export default { createDeposit, preConfirmDeposit, confirmDeposit };
