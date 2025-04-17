import userRoleEnum from '../enums/user/userRoleEnum.js';
import payGateService from './pay/payGate.service.js';
import userBalanceService from './userBalance.service.js';

const depositReplenishment = async (requestDTO) => {
  try {
    const result = await payGateService.payCreate(requestDTO);

    if (!result) {
      throw new Error('Deposit replinshment error');
    }

    if (requestDTO.role == userRoleEnum.DRIVER) {
      const driverBalance = await userBalanceService.getByUserId(requestDTO.driverId, userRoleEnum.DRIVER);

      if (!driverBalance) {
        await userBalanceService.createBalance({ balance: String(requestDTO.amount), driverId: requestDTO.driverId });
      }

      await userBalanceService.updateById(driverBalance.id, { balance: String(parseInt(driverBalance.balance) + requestDTO.amount) });
    } else {
      const clientBalance = await userBalanceService.getByUserId(requestDTO.clientId, userRoleEnum.CLIENT);

      if (!clientBalance) {
        await userBalanceService.createBalance({ balance: String(requestDTO.amount), clientId: requestDTO.driverId });
      }
      await userBalanceService.updateById(clientBalance.id, { balance: String(parseInt(clientBalance.balance) + requestDTO.amount) });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  depositReplenishment,
};
