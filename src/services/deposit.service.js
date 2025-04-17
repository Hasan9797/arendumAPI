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
      const driverBalance = await userBalanceService.getById(requestDTO.driverId);

      if(!driverBalance){
        await userBalanceService.createBalance({ amount: requestDTO.amount, userId: requestDTO.driverId });
      }

      await userBalanceService.updateById(requestDTO.driverId, { amount: driverBalance.amount + requestDTO.amount });
    } else {
      const clientBalance = await userBalanceService.getById(requestDTO.clientId);

      if(!clientBalance){
        await userBalanceService.createBalance({ amount: requestDTO.amount, userId: requestDTO.driverId });
      }
      await userBalanceService.updateById(requestDTO.clientId, { amount: requestDTO.amount });
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export default {
  depositReplinshment,
};
