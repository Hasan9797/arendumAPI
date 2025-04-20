// utils/errors.js
export class PartnerError extends Error {
  constructor(message, status, code = null) {
    super(message);
    this.status = status;
    this.name = 'PartnerError';
    this.code = code; // PartnersAPI uchun xato kodi
  }

  static validation(message = 'Validation failed') {
    return new PartnerError(message, 400);
  }

  static notFound(message = 'Resource not found') {
    return new PartnerError(message, 404);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new PartnerError(message, 401);
  }

  static parnerResponseError(message = 'Partner response error', code = null) {
    return new PartnerError(message, 502, code);
  }

  // PartnersAPI xatolarni qo‘shish
  static partnerNotFound(message = 'Partner not found') {
    return new PartnerError(message, 404);
  }

  static partnerAuthFailed(message = 'Partner authentication failed') {
    return new PartnerError(
      message,
      401,
      'PartnerAuthFailedError',
      'PARTNER_AUTH_FAILED'
    );
  }
}
