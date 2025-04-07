// errors/AppError.js
export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'APP-ERR') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

// errors/ValidationError.js
export class ValidationError extends AppError {

}