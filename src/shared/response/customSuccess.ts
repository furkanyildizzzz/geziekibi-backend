import { response, Response } from 'express';
import i18next from 'i18/i18next';
import { asyncLocalStorage } from 'orm/subscribers/auditSubscriber';

response.customSuccess = function (httpStatusCode: number, message: string, data: any = null): Response {
  const user = asyncLocalStorage.getStore();
  const language = user?.language || 'en';

  if (!i18next.isInitialized) {
    console.warn('⚠️ i18next is not initialized yet');
  }
  // 🔥 Çeviriyi kullanıcının diline göre yap
  const translatedMessage = i18next.t(message, { lng: language });

  return this.status(httpStatusCode).json({ message: translatedMessage, data });
};
