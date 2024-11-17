import { CustomError } from 'shared/errors/CustomError';
import { HttpStatusCode } from '../utils/enum';
import { ErrorValidation } from 'shared/errors/types';

export class BadRequestException extends CustomError {
  constructor(description = 'Bad Request', validationErrors?: ErrorValidation[]) {
    super(HttpStatusCode.BAD_REQUEST, 'BAD REQUEST', description, null, null, validationErrors);
  }
}

export class UnauthorizedException extends CustomError {
  constructor(description = 'Unauthorized') {
    super(HttpStatusCode.UNAUTHORIZED, 'UNAUTHORIZED', description);
  }
}

export class ForbiddenException extends CustomError {
  constructor(description = 'Forbidden') {
    super(HttpStatusCode.FORBIDDEN, 'FORBIDDEN', description);
  }
}

export class ConflictException extends CustomError {
  constructor(description = 'Conflict') {
    super(HttpStatusCode.CONFLICT, 'CONFLICT', description);
  }
}

export class InternalServerErrorException extends CustomError {
  constructor(description = 'Internal Server Error') {
    super(HttpStatusCode.INTERNAL_SERVER, 'INTERNAL SERVER ERROR', description);
  }
}

export class MethodNotAllowedException extends CustomError {
  constructor(description = 'Method Not Allowed') {
    super(HttpStatusCode.METHOD_NOT_ALLOWED, 'METHOD NOT ALLOWED', description);
  }
}

export class NotFoundException extends CustomError {
  constructor(description = 'Not Found') {
    super(HttpStatusCode.NOT_FOUND, 'NOT FOUND', description);
  }
}

export class RequestTimeoutException extends CustomError {
  constructor(description = 'Request Timeout') {
    super(HttpStatusCode.REQUEST_TIMEOUT, 'REQUEST TIMEOUT', description);
  }
}
