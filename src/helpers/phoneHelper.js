import { CustomError } from '../Errors/customError.js';

const validatePhoneNumber = (input) => {
  const allowedCountryCodes = ['998', '7'];

  if (typeof input !== 'string') {
    throw CustomError.validationError('📛 Telefon raqami matn (string) bo‘lishi kerak');
  }

  const digitsOnly = input.replace(/\D/g, '');

  const matchedCode = allowedCountryCodes.find((code) => digitsOnly.startsWith(code));
  if (!matchedCode) {
    throw CustomError.validationError('📛 Telefon raqami faqat +998 yoki +7 bilan boshlanishi kerak');
  }

  const requiredLengthByCode = {
    998: 12, // 998 + 9 ta raqam
    7: 11, // 7 + 10 ta raqam
  };

  if (digitsOnly.length !== requiredLengthByCode[matchedCode]) {
    throw CustomError.validationError(
      `📛 Telefon raqami uzunligi noto‘g‘ri. ${matchedCode} uchun ${requiredLengthByCode[matchedCode]} ta raqam bo‘lishi kerak`
    );
  }

  return true;
};

export const formatPhoneNumberWithPlus = (input) => {
  const cleaned = input.trim();
  try {
    validatePhoneNumber(cleaned);

    if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    return cleaned;
  } catch (error) {
    throw error;
  }
};
