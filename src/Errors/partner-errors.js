import { AppError } from "./app-errors";

// errors/PartnerError.js
export class PartnerError extends AppError {
    constructor(message, partnerCode, statusCode = 400) {
        super(message, statusCode, partnerCode);
        this.name = 'PartnerError';
    }
}