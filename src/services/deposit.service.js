import userRoleEnum from '../enums/user/userRoleEnum.js';
import payGateService from './pay/payGate.service.js';
import userBalanceService from './userBalance.service.js';

const depositReplenishment = async (requestDTO) => {
  try {
    const transaction = await payGateService.payCreate(requestDTO);

    if (!transaction) {
      throw new Error('Deposit replinshment error');
    }

    if (requestDTO.payerRole == userRoleEnum.DRIVER) {
      const driverBalance = await userBalanceService.getByUserId(
        transaction.driverId,
        userRoleEnum.DRIVER
      );

      if (!driverBalance) {
        await userBalanceService.createBalance({
          balance: String(transaction.amount),
          driverId: transaction.driverId,
        });
      }

      await userBalanceService.updateById(driverBalance.id, {
        balance: String(parseInt(driverBalance.balance) + transaction.amount),
      });
    } else if (requestDTO.payerRole == userRoleEnum.CLIENT) {
      const clientBalance = await userBalanceService.getByUserId(
        transaction.clientId,
        userRoleEnum.CLIENT
      );

      if (!clientBalance) {
        await userBalanceService.createBalance({
          balance: String(transaction.amount),
          clientId: transaction.clientId,
        });
      }
      await userBalanceService.updateById(clientBalance.id, {
        balance: String(parseInt(clientBalance.balance) + transaction.amount),
      });
    }

    return transaction;
  } catch (error) {
    throw error;
  }
};

export default {
  depositReplenishment,
};
