"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiRequestValidationError = exports.NotFoundError = exports.ServerError = exports.FileTooLarge = exports.UnAuthorizedError = exports.BadRequestError = exports.CustomError = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class CustomError extends Error {
    constructor(message) {
        super(message);
    }
    serializeErrors() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status
        };
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
class UnAuthorizedError extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.UNAUTHORIZED;
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class FileTooLarge extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.REQUEST_TOO_LONG;
    }
}
exports.FileTooLarge = FileTooLarge;
class ServerError extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.SERVICE_UNAVAILABLE;
    }
}
exports.ServerError = ServerError;
class NotFoundError extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
class JoiRequestValidationError extends CustomError {
    constructor(message) {
        super(message);
        this.status = "Error";
        this.statusCode = http_status_codes_1.default.BAD_REQUEST;
    }
}
exports.JoiRequestValidationError = JoiRequestValidationError;
