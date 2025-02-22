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
} from '../../helpers/jwt-token.helper.js';

import userRoleEnum from '../../enums/user/user-role.enum.js';
import driverService from '../../services/driver.service.js';
import { updateOrCreateUserToken } from '../../repositories/user-token.repo.js';
import {
  DriverStatus,
  getDriverStatusText,
} from '../../enums/driver/driver-status.enum.js';

import machineService from '../../services/machines.service.js';
import regionService from '../../services/regiosn.service.js';
import structureService from '../../services/structure.service.js';

const SMS_CODE_EXPIRATION = 5 * 60 * 1000; // 5 daqiqa

const register = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: 'Driver not found for Register', success: false });
    }

    const machine = await machineService.getOne(parseInt(req.body.machineId));

    if (!machine) {
      throw new Error('Machine not found');
    }

    const region = await regionService.getOne(parseInt(req.body.regionId));

    if (!region) {
      throw new Error('Region not found');
    }

    const structure = await structureService.getById(
      parseInt(req.body.structureId)
    );

    if (!structure) {
      throw new Error('Structure not found');
    }

    await driverService.updateById(req.user.id, {
      status: DriverStatus.INACTIVE,
      ...req.body,
    });

    res.status(201).json({ success: true, message: 'Driver registered' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ message: 'phoneNumber is required', success: false });
  }

  try {
    const user = await prisma.driver.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      await driverService.create({
        phone: phoneNumber,
      });
    }
    // SMS code generation
    const smsCode = 777777; // Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + SMS_CODE_EXPIRATION;

    // Save the SMS code temporarily
    await saveSmsCode(phoneNumber, smsCode, expiresAt);

    // Send SMS code
    await sendSms(phoneNumber, `Your login code is: ${smsCode}`);

    return res
      .status(200)
      .json({ message: 'SMS code sent successfully', success: true });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// SMS code verification and response token
const verifySmsCode = async (req, res) => {
  try {
    const { phoneNumber, code, fcmToken } = req.body;
    const savedCode = await getSmsCode(phoneNumber);

    if (!savedCode) {
      throw new Error('SMS code not found or expired');
    }

    if (savedCode != code) {
      throw new Error('Invalid SMS code');
    }

    // Delete the SMS code temporarily
    await deleteSmsCode(phoneNumber);

    const user = await prisma.driver.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      throw new Error('User not found', 400);
    }

    await prisma.driver.update({
      where: { id: user.id },
      data: { fcmToken },
    });

    const payload = {
      id: user.id,
      phone: user.phone,
      role: userRoleEnum.DRIVER,
      status: user?.status,
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
      saccess: true,
      accessToken,
      refreshToken,
      status: { key: user?.status, value: getDriverStatusText(user.status) },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { login, verifySmsCode, register };
