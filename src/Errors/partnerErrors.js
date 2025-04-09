// utils/errors.js
export class ApiError extends Error {
    constructor(message, status, name = 'ApiError', code = null) {
        super(message);
        this.status = status;
        this.name = name;
        this.code = code; // PartnersAPI uchun xato kodi
    }

    static validation(message = 'Validation failed') {
        return new ApiError(message, 400, 'ValidationError');
    }

    static notFound(message = 'Resource not found') {
        return new ApiError(message, 404, 'NotFoundError');
    }

    static unauthorized(message = 'Unauthorized access') {
        return new ApiError(message, 401, 'UnauthorizedError');
    }

    static serverError(message = 'Internal server error') {
        return new ApiError(message, 500, 'ServerError');
    }

    // PartnersAPI xatolarni qo‘shish
    static partnerNotFound(message = 'Partner not found') {
        return new ApiError(message, 404, 'PartnerNotFoundError', 'PARTNER_NOT_FOUND');
    }

    static partnerAuthFailed(message = 'Partner authentication failed') {
        return new ApiError(message, 401, 'PartnerAuthFailedError', 'PARTNER_AUTH_FAILED');
    }
}