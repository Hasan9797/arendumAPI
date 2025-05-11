import prisma from '../../config/prisma.js';
import EskizSmsService from '../../services/sms/eskizSms.service.js';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../helpers/jwtTokenHelper.js';

import userRoleEnum from '../../enums/user/userRoleEnum.js';
import driverService from '../../services/driver.service.js';

import { updateOrCreateUserToken } from '../../repositories/userToken.repo.js';

import {
  DriverStatus,
  getDriverStatusText,
} from '../../enums/driver/driverStatusEnum.js';

import machineService from '../../services/machines.service.js';
import regionService from '../../services/regiosn.service.js';
import structureService from '../../services/structure.service.js';
import userBalanceService from '../../services/userBalance.service.js';
import { normalizePhoneNumber } from '../../helpers/phoneHelper.js';

const expiresAt = 5 * 60; // 5 daqiqa = 300 soniya

const register = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .json({ message: 'Driver not found for Register', success: false });
    }

    const machine = await machineService.getMachineById(
      parseInt(req.body.machineId)
    );

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

    const driver = await driverService.updateById(req.user.id, {
      status: DriverStatus.INACTIVE,
      ...req.body,
    });

    if (driver) {
      await userBalanceService.createBalance({
        driverId: driver.id,
        balance: '0',
      });
    }

    res
      .status(201)
      .json({ success: true, message: 'Driver registered', data: driver });
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
    if (!normalizePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        message: 'Invalid phone number',
        success: false,
      });
    }

    const user = await prisma.driver.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      await driverService.create({
        phone: phoneNumber,
      });
    }
    // SMS code generation
    const smsCode = Math.floor(100000 + Math.random() * 900000);

    // Save the SMS code temporarily
    await EskizSmsService.saveSmsCode(phoneNumber, smsCode, expiresAt);

    // Send SMS code
    await EskizSmsService.sendSms(phoneNumber, `Your login code is: ${smsCode}`);

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
    const savedCode = await EskizSmsService.getSmsCode(phoneNumber);

    if (!savedCode) {
      throw new Error('SMS code not found or expired');
    }

    if (savedCode != code) {
      throw new Error('Invalid SMS code');
    }

    // Delete the SMS code temporarily
    await EskizSmsService.deleteSmsCode(phoneNumber);

    const user = await prisma.driver.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      throw new Error('User not found', 400);
    }

    await filtersFcmToken(fcmToken);

    const updatedUser = await prisma.driver.update({
      where: { id: user.id },
      data: { fcmToken },
    });

    if (!updatedUser) {
      throw new Error('User update failed', 401);
    }

    const payload = {
      id: updatedUser.id,
      phone: updatedUser.phone,
      role: userRoleEnum.DRIVER,
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
      saccess: true,
      accessToken,
      refreshToken,
      status: { key: user?.status, value: getDriverStatusText(user.status) },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

async function filtersFcmToken(token) {
  const matchedDrivers = await prisma.driver.findMany({
    where: {
      fcmToken: token.trim(),
    },
  });

  if (matchedDrivers.length > 0) {
    const driverIds = matchedDrivers.map((driver) => driver.id);

    await prisma.driver.updateMany({
      where: {
        id: { in: driverIds },
      },
      data: {
        fcmToken: 'remove',
      },
    });
  }
}

export default { login, verifySmsCode, register };
