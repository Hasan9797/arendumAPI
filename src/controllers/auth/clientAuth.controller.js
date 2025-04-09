import prisma from '../../config/prisma.js';
import {
  sendSms,
  saveSmsCode,
  getSmsCode,
  deleteSmsCode,
} from '../../services/sms.service.js';

import {
  generateAccessToken,
  generateRefreshToken,
} from '../../helpers/jwtTokenHelper.js';

import userRoleEnum from '../../enums/user/userRoleEnum.js';
import { updateOrCreateUserToken } from '../../repositories/userToken.repo.js';
import clientService from '../../services/client.service.js';

import {
  ClientStatus,
  getClientStatusText,
} from '../../enums/client/clientStatusEnum.js';

import {
  responseSuccess,
  responseError,
} from '../../helpers/responseHelper.js';

const SMS_CODE_EXPIRATION = 5 * 60 * 1000; // 5 daqiqa

const register = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: 'Client not found for Register', success: false });
    }

    await clientService.updateClient(req.user.id, {
      status: ClientStatus.ACTIVE,
      ...req.body,
    });
    res.status(201).json(responseSuccess());
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ message: 'phoneNumber is required', success: false });
    }

    const user = await prisma.client.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      await clientService.createClient({
        phone: phoneNumber,
        status: ClientStatus.INACTIVE,
      });
    }

    // SMS code generation
    const smsCode = 777777; // Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + SMS_CODE_EXPIRATION;

    // Save the SMS code temporarily
    await saveSmsCode(phoneNumber, smsCode, expiresAt);

    // Send SMS code
    await sendSms(phoneNumber, `Your login code is: ${smsCode}`);

    return res.status(200).json(responseSuccess({}, 'SMS code sent'));
  } catch (error) {
    res.status(500).json(responseError(error.message, 500));
  }
};

const verifySmsCode = async (req, res) => {
  try {
    const { phoneNumber, code, fcmToken } = req.body;
    const savedCode = await getSmsCode(phoneNumber);

    if (!savedCode) {
      throw new Error('SMS code not found or expired', 400);
    }

    if (savedCode != code) {
      throw new Error('Invalid SMS code', 400);
    }

    // Delete the SMS code temporarily
    await deleteSmsCode(phoneNumber);

    const user = await prisma.client.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      throw new Error('User not found', 400);
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
      token: refreshToken,
      userId: user.id,
      expire: '7d',
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

export default { login, verifySmsCode, register };
