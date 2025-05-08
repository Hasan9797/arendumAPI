import redisClient from '../../config/redis.js';
import { formatResponseDates } from '../../helpers/formatDateHelper.js';

export const saveSmsCode = async (phoneNumber, code, expiresIn) => {
  const key = `sms:${phoneNumber}`;
  await redisClient.set(key, code, { EX: expiresIn }); // EX: TTL sekundlarda
};

export const sendSms = async (phoneNumber, code, mobileHash) => {
  // Send SMS code to the provided phone number
};

export const getSmsCode = async (phoneNumber) => {
  const key = `sms:${phoneNumber}`;
  return await redisClient.get(key); // SMS kodni qaytaradi yoki null
};

export const deleteSmsCode = async (phoneNumber) => {
  const key = `sms:${phoneNumber}`;
  await redisClient.del(key); // Redis'dan SMS kodni o'chirish
};

export const verifySmsCode = async (phoneNumber, code) => {
  const savedCode = await getSmsCode(phoneNumber);
  if (!savedCode) {
    throw new Error('SMS code not found or expired');
  }
  if (savedCode !== code) {
    throw new Error('Invalid SMS code');
  }
  await deleteSmsCode(phoneNumber);
};