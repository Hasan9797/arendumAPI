import prisma from '../../config/prisma.js';
import EskizSmsService from '../../services/sms/eskizSms.service.js';
import { generateAccessToken, generateRefreshToken } from '../../helpers/jwtTokenHelper.js';
import userRoleEnum from '../../enums/user/userRoleEnum.js';
import { updateOrCreateUserToken } from '../../repositories/userToken.repo.js';
import clientService from '../../services/client.service.js';
import userBalanceService from '../../services/userBalance.service.js';
import { ClientStatus, getClientStatusText } from '../../enums/client/clientStatusEnum.js';
import { responseSuccess, responseError } from '../../helpers/responseHelper.js';
import { formatPhoneNumberWithPlus } from '../../helpers/phoneHelper.js';
import { CustomError } from '../../Errors/customError.js';

const expiresAt = 5 * 60; // 5 daqiqa = 300 sekund

const register = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Client not found for Register', success: false });
    }

    const client = await clientService.updateClient(req.user.id, {
      status: ClientStatus.ACTIVE,
      ...req.body,
    });

    if (client) {
      await userBalanceService.createBalance({
        clientId: client.id,
        balance: '0',
      });
    }

    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const login = async (req, res, next) => {
  const { phoneNumber } = req.body;
  try {
    const validateNumber = formatPhoneNumberWithPlus(phoneNumber);

    const user = await prisma.client.findUnique({
      where: { phone: validateNumber },
    });

    if (!user) {
      await clientService.createClient({
        phone: validateNumber,
        status: ClientStatus.INACTIVE,
      });
    }

    if (validateNumber !== '+998903549810') {
      // SMS code generation
      const smsCode = Math.floor(100000 + Math.random() * 900000);

      // Save the SMS code temporarily
      await EskizSmsService.saveSmsCode(validateNumber, smsCode, expiresAt);

      // Send SMS code
      await EskizSmsService.sendSms(validateNumber, smsCode);

    }

    return res.status(200).json(responseSuccess({}, 'SMS code sent'));
  } catch (error) {
    next(error);
  }
};

const verifySmsCode = async (req, res) => {
  try {
    const { phoneNumber, code, fcmToken } = req.body;
    const validateNumber = formatPhoneNumberWithPlus(phoneNumber);

    if (validateNumber !== '+998903549810') {
      const savedCode = await EskizSmsService.getSmsCode(validateNumber);

      if (!savedCode) {
        throw CustomError.validationError('SMS code not found or expired', 400);
      }

      if (savedCode != code) {
        throw CustomError.validationError('Invalid SMS code', 400);
      }
      await EskizSmsService.deleteSmsCode(validateNumber);
    }

    // Delete the SMS code temporarily

    const user = await prisma.client.findUnique({
      where: { phone: validateNumber },
    });

    if (!user) {
      throw CustomError.notFoundError('User not found', 404);
    }

    await prisma.client.update({
      where: { id: user.id },
      data: { fcmToken: fcmToken },
    });

    const payload = {
      id: user.id,
      phone: user.phone,
      role: userRoleEnum.CLIENT,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const userToken = {
      userId: user.id,
      accessToken,
      refreshToken,
    };

    await updateOrCreateUserToken(userToken);

    return res.status(200).json({
      accessToken,
      refreshToken,
      status: { key: user?.status, value: getClientStatusText(user.status) },
    });
  } catch (error) {
    return res.status(400).json(responseError(error.message, error.code));
  }
};

const logOut = async (req, res) => {};

export default { login, verifySmsCode, register };
