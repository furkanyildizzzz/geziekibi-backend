export type ErrorResponse = {
  errorType: ErrorType;
  errorMessage: string;
  errors: string[] | null;
  errorRaw: any;
  errorsValidation: ErrorValidation[] | null;
  stack?: string;
};

export type ErrorType =
  | 'General'
  | 'Raw'
  | 'Validation'
  | 'Unauthorized'
  | 'BAD REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INTERNAL SERVER ERROR'
  | 'METHOD NOT ALLOWED'
  | 'NOT FOUND'
  | 'REQUEST TIMEOUT';

export type ErrorValidation = { [key: string]: string };
