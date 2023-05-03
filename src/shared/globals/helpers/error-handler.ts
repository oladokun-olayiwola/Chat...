import StatusCodes  from "http-status-codes";

export interface IErrorResponse {
    message: string,
    statusCode: number,
    status: string,
    serializeErrors(): IError,
}

export interface IError {
    message: string,
    statusCode: number,
    status: string,
}


class CustomError extends Error {
    status!: string;
    statusCode!: number;

    constructor (message: string) {
        super(message);
    }

    serializeErrors(): IError {
        return {
            message: this.message,
            statusCode: this.statusCode,
            status: this.status
        }
    }
}

export class BadRequestError extends CustomError {
    status = "Error"
    statusCode = StatusCodes.BAD_REQUEST

    constructor(message: string) {
        super(message)
    }
}

export class UnAuthorizedError extends CustomError {
  status = "Error";
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLarge extends CustomError {
  status = "Error";
  statusCode = StatusCodes.REQUEST_TOO_LONG;

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError{
    status = "Error";
    statusCode = StatusCodes.SERVICE_UNAVAILABLE;

    constructor( message: string ) {
        super( message );
    }
}

export class NotFoundError extends CustomError {
    status = "Error";
    statusCode = StatusCodes.NOT_FOUND;

    constructor(message: string) {
        super(message);
    }
}

