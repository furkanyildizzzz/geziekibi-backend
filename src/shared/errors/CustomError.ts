import { asyncLocalStorage } from 'orm/subscribers/auditSubscriber';
import { ErrorType, ErrorValidation, ErrorResponse } from './types';
import i18next from '../../i18/i18next';

export class CustomError extends Error {
  private httpStatusCode: number;
  private errorType: ErrorType;
  private errors: string[] | null;
  private errorRaw: any;
  private errorsValidation: ErrorValidation[] | null;

  constructor(
    httpStatusCode: number,
    errorType: ErrorType,
    messageKey: string,
    variables: Record<string, any> = {}, // 🔥 Değişkenleri destekle
    errors: string[] | null = null,
    errorRaw: any = null,
    errorsValidation: ErrorValidation[] | null = null,
  ) {
    const user = asyncLocalStorage.getStore();
    const language = user?.language || 'en';

    if (!i18next.isInitialized) {
      console.warn('⚠️ i18next is not initialized yet');
    }
    // 🔥 Çeviriyi kullanıcının diline göre yap
    const translatedMessage = i18next.t(messageKey, { lng: language, ...variables });
    console.log({ messageKey, variables, translatedMessage, language });

    super(translatedMessage);

    this.name = this.constructor.name;

    this.httpStatusCode = httpStatusCode;
    this.errorType = errorType;
    this.errors = errors;
    this.errorRaw = errorRaw;
    this.errorsValidation = errorsValidation;
  }

  get HttpStatusCode() {
    return this.httpStatusCode;
  }

  get JSON(): ErrorResponse {
    return {
      errorType: this.errorType,
      errorMessage: this.message,
      errors: this.errors,
      errorRaw: this.errorRaw,
      errorsValidation: this.errorsValidation,
      stack: this.stack,
    };
  }
}
