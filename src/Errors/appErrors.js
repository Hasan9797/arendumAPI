// errors/AppError.js
// utils/errors.js
export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }

    // Validation Error
    static validation(message = 'Validation failed') {
        return new ApiError(message, 400);
    }

    // Not Found Error
    static notFound(message = 'Resource not found') {
        return new ApiError(message, 404);
    }

    // Unauthorized Error
    static unauthorized(message = 'Unauthorized access') {
        return new ApiError(message, 401);
    }

    // Server Error (qo‘shimcha misol)
    static serverError(message = 'Internal server error') {
        return new ApiError(message, 500);
    }
}