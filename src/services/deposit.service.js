import userRoleEnum from '../enums/user/userRoleEnum.js';
import payGateService from './pay/payGate.service.js';
import userBalanceService from './userBalance.service.js';

const depositReplinshment = async (requestDTO) => {
  try {
    const result = await payGateService.payCreate(requestDTO);

    if (!result) {
      throw new Error('Deposit replinshment error');
    }

    if (requestDTO.role == userRoleEnum.DRIVER) {
      const driverBalance = await userBalanceService.getByIdUserId(requestDTO.driverId);

      if (!driverBalance) {
        await userBalanceService.createBalance({ balance: String(parseInt(driverBalance.balance) + requestDTO.amount), userId: requestDTO.driverId });
      }

      await userBalanceService.updateById(requestDTO.driverId, { balance: String(parseInt(driverBalance.balance) + requestDTO.amount) });
    } else {
      const clientBalance = await userBalanceService.getByIdUserId(requestDTO.clientId);

      if (!clientBalance) {
        await userBalanceService.createBalance({ balance: String(parseInt(clientBalance.balance) + requestDTO.amount), userId: requestDTO.driverId });
      }
      await userBalanceService.updateById(requestDTO.clientId, { balance: String(parseInt(clientBalance.balance) + requestDTO.amount) });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  depositReplinshment,
};
