// utils/errors.js
export class CustomError extends Error {
  constructor(message, code = null) {
    super(message);
    this.name = 'CustomError';
    this.code = code; // PartnersAPI uchun xato kodi
  }

  static partnerValidationError(message = 'Validation failed') {
    return new CustomError(message, 400);
  }

  static notFoundError(message = 'Resource not found') {
    return new CustomError(message, 404);
  }

  static authFailedError(message = 'Unauthorized access') {
    return new CustomError(message, 401);
  }

  static parnerResponseError(message = 'Partner response error', code = null) {
    return new CustomError(message, 502, code);
  }

  // PartnersAPI xatolarni qo‘shish
  static partnerNotFoundError(message = 'Partner not found') {
    return new CustomError(message, 404);
  }

  static partnerServerError(message = 'Internal server error') {
    return new CustomError(message, 500);
  }
}
