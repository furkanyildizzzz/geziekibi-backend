import { CustomError } from 'shared/errors/CustomError';
import { HttpStatusCode } from '../utils/enum';
import { ErrorValidation } from 'shared/errors/types';

export class BadRequestException extends CustomError {
  constructor(messageKey = 'bad_request', variables?: Record<string, any>, validationErrors?: ErrorValidation[]) {
    super(HttpStatusCode.BAD_REQUEST, 'BAD REQUEST', messageKey, variables, null, null, validationErrors);
  }
}

export class UnauthorizedException extends CustomError {
  constructor(description = 'unauthorized', variables?: Record<string, any>) {
    super(HttpStatusCode.UNAUTHORIZED, 'UNAUTHORIZED', description);
  }
}

export class ForbiddenException extends CustomError {
  constructor(description = 'forbidden', variables?: Record<string, any>) {
    super(HttpStatusCode.FORBIDDEN, 'FORBIDDEN', description);
  }
}

export class ConflictException extends CustomError {
  constructor(description = 'conflict', variables?: Record<string, any>) {
    super(HttpStatusCode.CONFLICT, 'CONFLICT', description);
  }
}

export class InternalServerErrorException extends CustomError {
  constructor(description = 'internal_server_error', variables?: Record<string, any>) {
    super(HttpStatusCode.INTERNAL_SERVER, 'INTERNAL SERVER ERROR', description);
  }
}

export class MethodNotAllowedException extends CustomError {
  constructor(description = 'method_not_allowed', variables?: Record<string, any>) {
    super(HttpStatusCode.METHOD_NOT_ALLOWED, 'METHOD NOT ALLOWED', description);
  }
}

export class NotFoundException extends CustomError {
  constructor(description = 'not_found', variables?: Record<string, any>) {
    super(HttpStatusCode.NOT_FOUND, 'NOT FOUND', description);
  }
}

export class RequestTimeoutException extends CustomError {
  constructor(description = 'request_timeout', variables?: Record<string, any>) {
    super(HttpStatusCode.REQUEST_TIMEOUT, 'REQUEST TIMEOUT', description);
  }
}
