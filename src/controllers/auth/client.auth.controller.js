import prisma from '../../config/prisma.js';
import {
  sendSms,
  saveSmsCode,
  getSmsCode,
  deleteSmsCode,
} from '../../services/sms.service.js';

import {
  generateAccessToken,
  generateRefreshAccessToken,
} from '../../helpers/jwt-token.helper.js';

const SMS_CODE_EXPIRATION = 5 * 60 * 1000; // 5 daqiqa

const login = async (req, res) => {
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
    return res.status(401).json({ message: 'User not found', success: false });
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
};

const verifySmsCode = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    const savedCode = await getSmsCode(phoneNumber);

    if (!savedCode) {
      throw new Error('SMS code not found or expired');
    }

    if (savedCode != code) {
      throw new Error('Invalid SMS code');
    }

    // Delete the SMS code temporarily
    await deleteSmsCode(phoneNumber);

    const user = await prisma.client.findUnique({
      where: { phone: phoneNumber },
    });

    const payload = {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      role: user?.role || 10,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshAccessToken(payload);

    const userToken = {
      token: refreshToken,
      userId: user.id,
      expire: '7d',
    };

    await updateOrCreateUserToken(userToken);

    return res
      .status(200)
      .json({ message: 'Verification successful', accessToken, refreshToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default { login, verifySmsCode };
