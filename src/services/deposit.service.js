import userRoleEnum from '../enums/user/userRoleEnum.js';
import payGateService from './pay/payGate.service.js';
import userBalanceService from './userBalance.service.js';

const depositReplenishment = async (requestDTO) => {
  try {
    // PayGate xizmatidan natijani olish
    const result = await payGateService.payCreate(requestDTO);
    if (!result) {
      throw new Error('Deposit replenishment failed');
    }

    // Foydalanuvchi turiga qarab userId va role ni aniqlash
    const isDriver = requestDTO.role === userRoleEnum.DRIVER;
    const userId = isDriver ? requestDTO.driverId : requestDTO.clientId;

    // Balansni olish yoki yangi balans yaratish
    let userBalance = await userBalanceService.getByIdUserId(userId);
    const newBalance = userBalance
      ? parseInt(userBalance.balance) + requestDTO.amount
      : requestDTO.amount;

    if (!userBalance) {
      userBalance = await userBalanceService.createBalance({
        balance: String(newBalance),
        userId,
      });
    } else {
      await userBalanceService.updateById(userId, {
        balance: String(newBalance),
      });
    }

    return result;
  } catch (error) {
    // Xatolarni qayta ishlash uchun log yoki qo'shimcha context qo'shish mumkin
    throw new Error(`Deposit replenishment error: ${error.message}`);
  }
};

export default {
  depositReplenishment,
};
